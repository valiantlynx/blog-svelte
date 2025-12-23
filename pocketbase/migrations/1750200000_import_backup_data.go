// migrations/1750200000_import_backup_data.go
//
// This migration imports data from PocketBase backup files located in pb_data/backups/
// It extracts backup ZIP files, identifies matching tables between old and new schemas,
// and migrates the data while preserving relationships.
package migrations

import (
	"archive/zip"
	"database/sql"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	_ "modernc.org/sqlite" // SQLite driver
)

func init() {
	m.Register(func(app core.App) error {
		backupsDir := filepath.Join(app.DataDir(), "backups")

		// Check if backups directory exists
		if _, err := os.Stat(backupsDir); os.IsNotExist(err) {
			log.Println("No backups directory found, skipping data import")
			return nil
		}

		// Find all backup ZIP files
		backupFiles, err := filepath.Glob(filepath.Join(backupsDir, "*.zip"))
		if err != nil {
			return fmt.Errorf("failed to list backup files: %w", err)
		}

		if len(backupFiles) == 0 {
			log.Println("No backup files found, skipping data import")
			return nil
		}

		// Use the most recent backup file (last in sorted list)
		backupFile := backupFiles[len(backupFiles)-1]
		log.Printf("Found backup file: %s", backupFile)

		// Extract backup to temporary directory
		tempDir, err := os.MkdirTemp("", "pb_backup_import_*")
		if err != nil {
			return fmt.Errorf("failed to create temp directory: %w", err)
		}
		defer os.RemoveAll(tempDir)

		if err := extractBackup(backupFile, tempDir); err != nil {
			return fmt.Errorf("failed to extract backup: %w", err)
		}

		// Find the data.db file in the extracted backup
		oldDBPath := filepath.Join(tempDir, "pb_data", "data.db")
		if _, err := os.Stat(oldDBPath); os.IsNotExist(err) {
			// Try alternative path
			oldDBPath = filepath.Join(tempDir, "data.db")
			if _, err := os.Stat(oldDBPath); os.IsNotExist(err) {
				return fmt.Errorf("could not find data.db in backup")
			}
		}

		log.Printf("Found old database: %s", oldDBPath)

		// Open the old database
		oldDB, err := sql.Open("sqlite", oldDBPath)
		if err != nil {
			return fmt.Errorf("failed to open old database: %w", err)
		}
		defer oldDB.Close()

		// Get list of tables from old database
		oldTables, err := getTableList(oldDB)
		if err != nil {
			return fmt.Errorf("failed to get old tables: %w", err)
		}

		log.Printf("Found %d tables in old database", len(oldTables))

		// Get current collections
		collections, err := app.FindAllCollections()
		if err != nil {
			return fmt.Errorf("failed to get current collections: %w", err)
		}

		// Map collection names for easier lookup
		collectionMap := make(map[string]*core.Collection)
		for _, col := range collections {
			collectionMap[col.Name] = col
		}

		// Import data for matching tables
		for _, oldTable := range oldTables {
			// Skip system tables
			if strings.HasPrefix(oldTable, "_") || strings.HasPrefix(oldTable, "sqlite_") {
				continue
			}

			// Check if we have a matching collection
			collection, exists := collectionMap[oldTable]
			if !exists {
				log.Printf("Skipping table '%s' - no matching collection in new schema", oldTable)
				continue
			}

			log.Printf("Importing data for table: %s", oldTable)

			// Get old table structure
			oldColumns, err := getTableColumns(oldDB, oldTable)
			if err != nil {
				log.Printf("Warning: failed to get columns for %s: %v", oldTable, err)
				continue
			}

			// Get new collection fields
			newFields := make(map[string]bool)
			for _, field := range collection.Fields {
				newFields[field.GetName()] = true
			}

			// Find matching columns
			var matchingColumns []string
			for _, oldCol := range oldColumns {
				if newFields[oldCol] {
					matchingColumns = append(matchingColumns, oldCol)
				}
			}

			if len(matchingColumns) == 0 {
				log.Printf("Warning: no matching columns found for table %s", oldTable)
				continue
			}

			// Import the data
			if err := importTableData(app, oldDB, oldTable, collection, matchingColumns); err != nil {
				log.Printf("Warning: failed to import data for %s: %v", oldTable, err)
				continue
			}

			log.Printf("Successfully imported data for: %s", oldTable)
		}

		log.Println("Data import completed")
		return nil
	}, func(app core.App) error {
		// Revert operation - we don't delete imported data as it could be destructive
		log.Println("Data import revert - no action taken (manual cleanup required)")
		return nil
	})
}

// extractBackup extracts a ZIP backup file to the specified directory
func extractBackup(zipFile, destDir string) error {
	r, err := zip.OpenReader(zipFile)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		fpath := filepath.Join(destDir, f.Name)

		// Check for ZipSlip vulnerability
		if !strings.HasPrefix(fpath, filepath.Clean(destDir)+string(os.PathSeparator)) {
			return fmt.Errorf("invalid file path: %s", fpath)
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, os.ModePerm)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
			return err
		}

		outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return err
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return err
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()

		if err != nil {
			return err
		}
	}

	return nil
}

// getTableList returns a list of all tables in the database
func getTableList(db *sql.DB) ([]string, error) {
	rows, err := db.Query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tables []string
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			return nil, err
		}
		tables = append(tables, tableName)
	}

	return tables, rows.Err()
}

// getTableColumns returns a list of column names for a given table
func getTableColumns(db *sql.DB, tableName string) ([]string, error) {
	rows, err := db.Query(fmt.Sprintf("PRAGMA table_info(%s)", tableName))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var columns []string
	for rows.Next() {
		var cid int
		var name, colType string
		var notNull, pk int
		var dfltValue sql.NullString

		if err := rows.Scan(&cid, &name, &colType, &notNull, &dfltValue, &pk); err != nil {
			return nil, err
		}
		columns = append(columns, name)
	}

	return columns, rows.Err()
}

// importTableData imports data from old table to new collection
func importTableData(app core.App, oldDB *sql.DB, tableName string, collection *core.Collection, columns []string) error {
	// Build SELECT query
	columnList := strings.Join(columns, ", ")
	query := fmt.Sprintf("SELECT %s FROM %s", columnList, tableName)

	rows, err := oldDB.Query(query)
	if err != nil {
		return fmt.Errorf("failed to query old data: %w", err)
	}
	defer rows.Close()

	// Prepare scan destinations
	columnValues := make([]interface{}, len(columns))
	columnPointers := make([]interface{}, len(columns))
	for i := range columnValues {
		columnPointers[i] = &columnValues[i]
	}

	importCount := 0
	for rows.Next() {
		if err := rows.Scan(columnPointers...); err != nil {
			return fmt.Errorf("failed to scan row: %w", err)
		}

		// Create a new record
		record := core.NewRecord(collection)

		// Set field values
		for i, colName := range columns {
			val := columnValues[i]

			// Handle NULL values
			if val == nil {
				continue
			}

			// Convert byte slices to strings for text fields
			if b, ok := val.([]byte); ok {
				val = string(b)
			}

			// Set the field value
			record.Set(colName, val)
		}

		// Save the record (this will validate and apply defaults)
		if err := app.Save(record); err != nil {
			// Log error but continue with other records
			log.Printf("Warning: failed to import record in %s: %v", tableName, err)
			continue
		}

		importCount++
	}

	log.Printf("Imported %d records into %s", importCount, tableName)
	return rows.Err()
}
