// migrations/1728603280_init_drivstoffapp_collections.go
//
// This migration automatically parses schema.sql and creates PocketBase collections
// for the Drivstoffapp fuel and transportation management system.
//
// Adapted from Sortify's migration pattern to work with Drivstoffapp's schema.
package migrations

import (
	"bufio"
	"os"
	"regexp"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

// SQLTable represents a parsed SQL table
type SQLTable struct {
	Name        string
	Columns     []SQLColumn
	ForeignKeys []ForeignKey
	Indexes     []string
}

// SQLColumn represents a column in SQL table
type SQLColumn struct {
	Name       string
	Type       string
	Required   bool
	Unique     bool
	Default    string
	References string
}

// ForeignKey represents a foreign key constraint
type ForeignKey struct {
	Column           string
	ReferencedTable  string
	ReferencedColumn string
}

func init() {
	m.Register(func(app core.App) error {
		// Read and parse SQL file
		tables, err := parseSQLFile("schema.sql")
		if err != nil {
			return err
		}

		// First pass: Create all collections without relation fields
		for _, table := range tables {
			if err := createCollectionWithoutRelations(app, table); err != nil {
				return err
			}
		}

		// Second pass: Add relation fields
		for _, table := range tables {
			if err := addRelationFields(app, table); err != nil {
				return err
			}
		}

		// Third pass: Update rules for user-specific collections after user_id fields are created
		if err := updateUserSpecificCollectionRules(app); err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		// Revert - delete all collections
		return nil
	})
}

func parseSQLFile(filename string) ([]SQLTable, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var tables []SQLTable
	var currentTable *SQLTable

	scanner := bufio.NewScanner(file)

	// Regular expressions for parsing
	createTableRegex := regexp.MustCompile(`CREATE TABLE\s+(\w+)`)
	columnRegex := regexp.MustCompile(`^\s*(\w+)\s+(\w+)(?:\((\d+)\))?\s*(.*?),?\s*$`)
	foreignKeyRegex := regexp.MustCompile(`FOREIGN KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)`)

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Skip comments and empty lines
		if strings.HasPrefix(line, "--") || line == "" {
			continue
		}

		// Parse CREATE TABLE
		if matches := createTableRegex.FindStringSubmatch(line); matches != nil {
			if currentTable != nil {
				tables = append(tables, *currentTable)
			}
			currentTable = &SQLTable{
				Name:    strings.ToLower(matches[1]),
				Columns: []SQLColumn{},
			}
			continue
		}

		// Parse table end
		if strings.Contains(line, ");") && currentTable != nil {
			tables = append(tables, *currentTable)
			currentTable = nil
			continue
		}

		if currentTable == nil {
			continue
		}

		// Parse foreign key constraints
		if matches := foreignKeyRegex.FindStringSubmatch(line); matches != nil {
			currentTable.ForeignKeys = append(currentTable.ForeignKeys, ForeignKey{
				Column:           matches[1],
				ReferencedTable:  strings.ToLower(matches[2]),
				ReferencedColumn: matches[3],
			})
			continue
		}

		// Parse columns
		if matches := columnRegex.FindStringSubmatch(line); matches != nil {
			columnName := strings.ToLower(matches[1])
			columnType := strings.ToUpper(matches[2])

			// Skip malformed lines or empty column names
			if columnName == "" || columnName == "null" {
				continue
			}

			column := SQLColumn{
				Name: columnName,
				Type: columnType,
			}

			// Parse constraints
			constraints := strings.ToUpper(matches[4])

			// Split at comment to avoid parsing comments as constraints
			constraintParts := strings.Split(constraints, "--")
			actualConstraints := strings.TrimSpace(constraintParts[0])

			column.Required = strings.Contains(actualConstraints, "NOT NULL")
			column.Unique = strings.Contains(actualConstraints, "UNIQUE")

			// Skip system columns that PocketBase handles automatically
			if column.Name == "id" {
				continue
			}

			currentTable.Columns = append(currentTable.Columns, column)
		}
	}

	return tables, scanner.Err()
}

func createCollectionWithoutRelations(app core.App, table SQLTable) error {
	// Skip users table since it already exists as auth collection
	if table.Name == "users" {
		return nil
	}

	// Check if collection already exists
	if _, err := app.FindCollectionByNameOrId(table.Name); err == nil {
		// Collection already exists, skip creation
		return nil
	}

	var collection *core.Collection

	// Determine collection type
	collection = core.NewBaseCollection(table.Name)

	// Add only non-relation fields
	for _, column := range table.Columns {
		// Skip foreign key columns in first pass
		isForeignKey := false
		for _, fk := range table.ForeignKeys {
			if fk.Column == column.Name {
				isForeignKey = true
				break
			}
		}

		if !isForeignKey {
			field := createNonRelationField(column)
			if field != nil {
				collection.Fields.Add(field)
			}
		}
	}

	// Set API rules for the collection
	setCollectionAPIRules(collection, table.Name)

	return app.Save(collection)
}

func addRelationFields(app core.App, table SQLTable) error {
	// Skip users table since it already exists as auth collection
	if table.Name == "users" {
		return nil
	}

	collection, err := app.FindCollectionByNameOrId(table.Name)
	if err != nil {
		return err
	}

	// Add relation fields
	for _, column := range table.Columns {
		for _, fk := range table.ForeignKeys {
			if fk.Column == column.Name {
				// Find the referenced collection
				referencedCollection, err := app.FindCollectionByNameOrId(fk.ReferencedTable)
				if err != nil {
					// Skip if referenced collection doesn't exist
					continue
				}

				// Check if a field with this name already exists
				existingField := collection.Fields.GetByName(column.Name)
				if existingField != nil {
					// Field already exists, skip
					continue
				}

				relationField := &core.RelationField{
					Name:         column.Name,
					Required:     column.Required,
					CollectionId: referencedCollection.Id,
					MaxSelect:    1,
				}

				collection.Fields.Add(relationField)
				break
			}
		}
	}

	return app.Save(collection)
}

func createNonRelationField(column SQLColumn) core.Field {
	// Map SQL types to PocketBase field types
	switch column.Type {
	case "CHAR", "VARCHAR", "TEXT":
		if strings.Contains(strings.ToLower(column.Name), "email") {
			return &core.EmailField{
				Name:     column.Name,
				Required: column.Required,
			}
		}
		if strings.Contains(strings.ToLower(column.Name), "url") {
			return &core.URLField{
				Name:     column.Name,
				Required: column.Required,
			}
		}
		return &core.TextField{
			Name:     column.Name,
			Required: column.Required,
		}

	case "INT", "INTEGER":
		return &core.NumberField{
			Name:     column.Name,
			Required: column.Required,
		}

	case "FLOAT", "REAL", "DOUBLE":
		return &core.NumberField{
			Name:     column.Name,
			Required: column.Required,
		}

	case "BOOL", "BOOLEAN":
		return &core.BoolField{
			Name:     column.Name,
			Required: column.Required,
		}

	case "DATETIME", "TIMESTAMP":
		return &core.DateField{
			Name:     column.Name,
			Required: column.Required,
		}

	case "JSON":
		return &core.JSONField{
			Name:     column.Name,
			Required: column.Required,
		}

	case "SELECT":
		// For SELECT fields, define default options
		return &core.SelectField{
			Name:     column.Name,
			Required: column.Required,
			Values:   []string{"option1"}, // Default value
		}

	default:
		// Default to text field
		return &core.TextField{
			Name:     column.Name,
			Required: column.Required,
		}
	}
}

func setCollectionAPIRules(collection *core.Collection, tableName string) {
	// Helper function to create string pointers
	stringPtr := func(s string) *string {
		if s == "" {
			return nil
		}
		return &s
	}

	switch tableName {
	case "users":
		// Skip - users collection rules are handled separately
		return
	case "fuel_stations", "charging_stations", "tolls", "traffic_data":
		// Public read-only data collections
		collection.ListRule = stringPtr("")
		collection.ViewRule = stringPtr("")
		collection.CreateRule = nil
		collection.UpdateRule = nil
		collection.DeleteRule = nil

	default:
		// For all other collections, require authentication but don't reference fields yet
		collection.ListRule = stringPtr("@request.auth.id != \"\"")
		collection.ViewRule = stringPtr("@request.auth.id != \"\"")
		collection.CreateRule = stringPtr("@request.auth.id != \"\"")
		collection.UpdateRule = stringPtr("@request.auth.id != \"\"")
		collection.DeleteRule = stringPtr("@request.auth.id != \"\"")
	}
}

func updateUserSpecificCollectionRules(app core.App) error {
	// Helper function to create string pointers
	stringPtr := func(s string) *string {
		if s == "" {
			return nil
		}
		return &s
	}

	// List of user-specific collections that should have user_id based rules
	userCollections := []string{"user_preferences", "user_workspaces", "trips", "saved_routes", "fuel_logs", "ride_shares", "ride_requests"}

	for _, collectionName := range userCollections {
		collection, err := app.FindCollectionByNameOrId(collectionName)
		if err != nil {
			// Collection doesn't exist, skip
			continue
		}

		// Check if the collection has a user_id field
		userIdField := collection.Fields.GetByName("user_id")
		if userIdField == nil {
			// No user_id field, skip
			continue
		}

		// Update rules to use user_id for access control
		collection.ListRule = stringPtr("@request.auth.id = user_id")
		collection.ViewRule = stringPtr("@request.auth.id = user_id")
		collection.CreateRule = stringPtr("@request.auth.id != \"\"")
		collection.UpdateRule = stringPtr("@request.auth.id = user_id")
		collection.DeleteRule = stringPtr("@request.auth.id = user_id")

		if err := app.Save(collection); err != nil {
			return err
		}
	}

	return nil
}