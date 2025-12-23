// migrations/1750182400_create_initial_superuser.go
package migrations

import (
    "os"
    "github.com/pocketbase/pocketbase/core"
    m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
    m.Register(func(app core.App) error {
        // Create initial superuser
        superusersCollection, err := app.FindCollectionByNameOrId("_superusers")
        if err != nil {
            return err
        }

        // Get admin credentials from environment variables or use defaults
        adminEmail := os.Getenv("ADMIN_EMAIL")
        if adminEmail == "" {
            adminEmail = "admin@drivstoffapp.com"
        }

        adminPassword := os.Getenv("ADMIN_PASSWORD") 
        if adminPassword == "" {
            adminPassword = "drivstoffapp_admin_2025"
        }

        // Check if superuser already exists
        if _, err := app.FindAuthRecordByEmail("_superusers", adminEmail); err == nil {
            // Superuser already exists, skip creation
            return nil
        }

        // Create new superuser record
        record := core.NewRecord(superusersCollection)
        record.Set("email", adminEmail)
        record.Set("password", adminPassword)
        record.Set("emailVisibility", true)
        record.Set("verified", true)

        if err := app.Save(record); err != nil {
            return err
        }

        // Initialize application settings
        settings := app.Settings()
        settings.Meta.AppName = "Drivstoffapp"
        settings.Meta.AppURL = os.Getenv("APP_URL")
        if settings.Meta.AppURL == "" {
            settings.Meta.AppURL = "http://localhost:8090"
        }
        settings.Meta.SenderName = "Drivstoffapp Support"
        settings.Meta.SenderAddress = "support@drivstoffapp.com"

        // Configure logs
        settings.Logs.MaxDays = 7
        settings.Logs.LogAuthId = true
        settings.Logs.LogIP = true
        
        if err := app.Save(settings); err != nil {
            return err
        }

        return nil
    }, func(app core.App) error {
        // Revert operation - remove the created superuser
        adminEmail := os.Getenv("ADMIN_EMAIL")
        if adminEmail == "" {
            adminEmail = "admin@drivstoffapp.com"
        }

        if record, err := app.FindAuthRecordByEmail("_superusers", adminEmail); err == nil {
            app.Delete(record)
        }
        return nil
    })
}
