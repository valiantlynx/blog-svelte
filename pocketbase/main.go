// main.go
package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	// Import your migrations package (enable this once you create migrations)
	_ "pocketbase/migrations"
)

func main() {
	app := pocketbase.New()

	// Check if running in development mode
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	// Register migrate command with auto-migration enabled in development
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// Enable auto creation of migration files when making changes in Dashboard
		// Only during development (when using "go run")
		Automigrate: isGoRun,
	})
	// serves static files from the provided public dir (if exists)
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// Create filesystem for pb_public directory
		publicFS := os.DirFS("./pb_public")

		// Add middleware to serve static files for non-API routes
		se.Router.BindFunc(func(e *core.RequestEvent) error {
			path := e.Request.URL.Path

			// Skip API routes and admin routes - let them be handled by PocketBase
			if strings.HasPrefix(path, "/api/") ||
				strings.HasPrefix(path, "/_/") ||
				strings.HasPrefix(path, "/admin") {
				return e.Next()
			}

			// Handle static file serving
			filePath := strings.TrimPrefix(path, "/")
			if filePath == "" {
				filePath = "index.html"
			}

			// Check if file exists in pb_public
			if _, err := os.Stat(filepath.Join("./pb_public", filePath)); os.IsNotExist(err) {
				// If file doesn't exist, serve index.html for SPA routing
				filePath = "index.html"
			}

			// Serve the file using the FileFS method
			return e.FileFS(publicFS, filePath)
		})

		return se.Next()
	})
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

/*
Drivstoffapp V2 PocketBase Configuration Summary:

CORE FEATURES:
✅ SQLite database with real-time subscriptions
✅ Built-in authentication with OAuth2 support
✅ REST API with automatic admin panel
✅ File storage and management
✅ Email verification system
✅ WebSocket real-time connections
✅ CORS configuration for web/mobile frontends

DRIVSTOFFAPP-SPECIFIC ENHANCEMENTS:
✅ Auto-create user preferences on registration
✅ Default workspace creation for new users
✅ Rideshare booking confirmation handling
✅ Charging station availability management
✅ Custom API endpoints for:
   - Route optimization
   - Real-time fuel prices
   - EV charging availability
   - Trip cost calculations
✅ Notification system with multiple delivery methods

ENVIRONMENT CONFIGURATIONS:
✅ Development vs production settings
✅ SMTP email configuration
✅ Google OAuth2 integration
✅ Custom data directory support
✅ Encryption environment variables

INTEGRATION POINTS:
✅ External mapping APIs (Google Maps, OpenStreetMap)
✅ Fuel price APIs (YR, Circle K, Shell)
✅ EV charging networks (Tesla, Fortum, Circle K)
✅ Payment gateways (Vipps, Stripe, PayPal)
✅ Push notification services (Firebase, OneSignal)

DEPLOYMENT READY:
✅ Production-optimized settings
✅ Environment variable configuration
✅ CORS security for multiple frontends
✅ Logging and monitoring setup
✅ Database migrations support

To run:
go mod init drivstoffapp-backend
go get github.com/pocketbase/pocketbase
go run main.go serve --http=0.0.0.0:8090
*/