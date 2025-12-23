# Drivstoffapp V2 PocketBase Service

Real-time database and authentication service for Drivstoffapp V2, built on PocketBase with custom business logic.

## Features

- **SQLite Database**: Fast, reliable database with real-time subscriptions
- **Built-in Authentication**: User registration, login, OAuth2 support
- **REST API**: Automatic REST endpoints for all collections
- **Admin Dashboard**: Web-based admin panel at `/admin`
- **Real-time Updates**: WebSocket subscriptions for live data
- **File Storage**: Built-in file upload and management
- **Email System**: User verification and notifications

## Drivstoffapp-Specific Enhancements

### Database Schema
- **24 Core Tables**: Complete fuel, trip planning, and rideshare platform
- **User Preferences**: Vehicle types, fuel preferences, notification settings
- **Station Management**: Fuel stations, EV charging, toll stations with real-time data
- **Trip Planning**: Route optimization, cost calculation, sharing features
- **Rideshare Platform**: Driver/passenger matching, booking system, ratings
- **Payment Integration**: Support for Vipps, Stripe, PayPal
- **Notification System**: Push, email, SMS delivery methods

### Custom Business Logic
- Auto-create user preferences on registration
- Rideshare booking confirmation handling
- Charging station availability management
- Station reservation system
- Real-time price updates
- Trip cost calculations

### API Endpoints
- `/api/routes/optimize` - Route optimization
- `/api/fuel/prices/realtime` - Live fuel prices
- `/api/charging/availability` - EV charging status
- `/api/trips/calculate-cost` - Trip cost calculator

## Installation

### Prerequisites
- Go 1.21 or higher
- SQLite3

### Setup
```bash
# Initialize Go module
go mod init drivstoffapp-backend

# Install dependencies
go mod tidy

# Run database migrations
go run main.go migrate up

# Start the server
go run main.go serve --http=0.0.0.0:8090
```

### Environment Variables
```bash
# Data directory
export PB_DATA_DIR="./pb_data"

# Environment (development/production)
export GO_ENV="development"

# Email settings
export SMTP_HOST="smtp.gmail.com"
export SMTP_USERNAME="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"

# OAuth2 providers
export GOOGLE_CLIENT_ID="your-google-client-id"
export GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Development

### Database Schema
The complete database schema is defined in `schema.sql` with:
- User management and preferences
- Station data (fuel, charging, toll)
- Trip planning and route sharing
- Rideshare platform
- Payment and subscription system
- Notification management
- Analytics and search history

### Custom Hooks
Business logic is implemented via PocketBase hooks:
- User registration triggers
- Booking confirmation handling
- Station availability updates
- Notification sending

### Frontend Integration
CORS is configured for multiple frontends:
- Svelte/SvelteKit web app (port 5173)
- Flutter mobile app (port 8080)
- React/Next.js alternatives (port 3000)

## Production Deployment

### Docker Setup
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o pocketbase main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/pocketbase .
EXPOSE 8090
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
```

### Environment Configuration
- Set `GO_ENV=production` for production settings
- Configure SMTP for email notifications
- Set up OAuth2 providers for social login
- Use environment variables for API keys

## API Documentation

### Authentication
- `POST /api/collections/users/auth-with-password` - Login
- `POST /api/collections/users/records` - Register
- `POST /api/collections/users/auth-refresh` - Refresh token
- `POST /api/collections/users/request-verification` - Email verification

### Collections
All database tables are automatically exposed as REST endpoints:
- `/api/collections/fuel_stations/records` - Fuel station data
- `/api/collections/trips/records` - Trip planning
- `/api/collections/rides/records` - Rideshare listings
- `/api/collections/notifications/records` - User notifications

### Real-time Subscriptions
WebSocket connections for live updates:
```javascript
// Subscribe to fuel price changes
pb.collection('fuel_stations').subscribe('*', function (e) {
    console.log('Station updated:', e.record);
});

// Subscribe to rideshare bookings
pb.collection('ride_bookings').subscribe('*', function (e) {
    console.log('Booking update:', e.record);
});
```

## Monitoring

### Health Check
- `GET /api/health` - Service health status

### Admin Panel
- Access at `http://localhost:8090/_/` (development)
- Manage collections, users, and settings
- View logs and analytics
- Configure authentication providers

### Logs
- Development: 2 days retention
- Production: 7 days retention
- Structured logging for debugging

## External Integrations

### Fuel Price APIs
- YR (Norwegian weather and fuel data)
- Circle K API
- Shell Station Locator
- Esso/Exxon pricing data

### EV Charging Networks
- Tesla Supercharger network
- Fortum charging stations
- Circle K EV charging
- Ionity network data

### Mapping Services
- OpenStreetMap for routing
- Google Maps for enhanced features
- Norwegian mapping authority (Kartverket)

### Payment Gateways
- Vipps (Norwegian mobile payments)
- Stripe (international cards)
- PayPal (alternative payment method)

## Security

### Authentication
- JWT tokens with refresh mechanism
- OAuth2 social login support
- Email verification required
- Password strength requirements

### Data Protection
- SQLite encryption at rest
- HTTPS/TLS in production
- CORS protection
- Rate limiting on API endpoints

### Privacy
- GDPR compliant data handling
- User data export/deletion
- Anonymization options
- Location data protection

## Support

### Documentation
- PocketBase official docs: https://pocketbase.io/docs/
- API reference available at `/api/docs`
- Admin panel help sections

### Troubleshooting
- Check logs in `pb_data/logs/`
- Verify environment variables
- Test database connectivity
- Validate CORS settings for frontend

### Development Contact
- GitHub Issues for bug reports
- Feature requests via discussions
- Emergency contact for production issues

---

**Drivstoffapp V2** - Complete fuel, trip planning, and transportation platform for the Norwegian market.