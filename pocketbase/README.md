# Blog-Svelte PocketBase Service

Real-time database service for Blog-Svelte platform, built on PocketBase with custom business logic.

## Features

- **SQLite Database**: Fast, reliable database with real-time subscriptions
- **Built-in Authentication**: User registration, login, OAuth2 support
- **REST API**: Automatic REST endpoints for all collections
- **Admin Dashboard**: Web-based admin panel at `/_/`
- **Real-time Updates**: WebSocket subscriptions for live data
- **File Storage**: Built-in file upload and management
- **Email System**: User verification and notifications

## Blog-Svelte Enhancements

### Database Schema
- **9 Core Tables**: Complete blog platform with users, content, and engagement
- **User Management**: Role-based access (user, editor, admin, manager)
- **Content Management**: Blogs with rich text editor, tags, and metadata
- **Project Showcase**: Portfolio projects with descriptions and links
- **Social Features**: Comments, likes, sharing capabilities
- **Site Configuration**: Analytics, ads, SEO settings
- **OAuth2 Integration**: Google, GitHub authentication support

### Custom Business Logic
- Auto-update timestamps on record changes
- User authentication with role-based permissions
- Blog engagement tracking (views, likes)
- Comment moderation system
- File upload handling for images and avatars

### Collections
- `users_valiantlynx` - Authentication and user profiles
- `blogs` - Blog posts with rich content
- `projects_valiantlynx` - Portfolio projects
- `tags` - Blog categorization and filtering
- `sites` - Site-wide configuration and analytics
- `likes` - Blog engagement tracking
- `comments` - Blog comments with nested replies
- `oauth2_accounts` - Social authentication
- `feedback` - User feedback collection
- `messages` - Internal messaging system

## Installation

### Prerequisites
- Go 1.24 or higher
- SQLite3

### Setup
```bash
# Install dependencies
go mod download

# Run database migrations
go run main.go migrate up

# Start the server
go run main.go serve --http=0.0.0.0:8090
```

### Environment Variables
```bash
# Admin credentials
export ADMIN_EMAIL="admin@valiantlynx.com"
export ADMIN_PASSWORD="your-secure-password"

# Application URL
export APP_URL="http://localhost:8090"

# Data directory
export PB_DATA_DIR="./pb_data"

# Email settings (optional)
export SMTP_HOST="smtp.gmail.com"
export SMTP_USERNAME="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"

# OAuth2 providers (optional)
export GOOGLE_CLIENT_ID="your-google-client-id"
export GOOGLE_CLIENT_SECRET="your-google-client-secret"
export GITHUB_CLIENT_ID="your-github-client-id"
export GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Development

### Database Schema
The complete database schema is defined in `schema.sql` with:
- User authentication and profiles
- Blog content management
- Project portfolio
- Tagging system
- Site configuration
- Social engagement (likes, comments)
- OAuth2 accounts
- Feedback and messaging

### Custom Migrations
Business logic is implemented via PocketBase migrations in `migrations/`:
- Auto-parsing of SQL schema into PocketBase collections
- Automatic timestamp triggers
- Seed data for default site configuration and tags

### Frontend Integration
CORS is configured for SvelteKit:
- Development: `http://localhost:5173`
- Production: Configure via environment variables

## Production Deployment

### Docker Setup
```bash
# Build image
docker build -t blog-svelte-pocketbase .

# Run container
docker run -d \
  -p 8090:8090 \
  -e ADMIN_EMAIL=admin@valiantlynx.com \
  -e ADMIN_PASSWORD=your-password \
  -e APP_URL=https://your-domain.com \
  -v $(pwd)/pb_data:/app/pb_data \
  blog-svelte-pocketbase
```

### Environment Configuration
- Set proper admin credentials
- Configure SMTP for email notifications
- Set up OAuth2 providers for social login
- Use HTTPS in production

## API Documentation

### Authentication
- `POST /api/collections/users_valiantlynx/auth-with-password` - Login
- `POST /api/collections/users_valiantlynx/records` - Register
- `POST /api/collections/users_valiantlynx/auth-refresh` - Refresh token
- `POST /api/collections/users_valiantlynx/request-verification` - Email verification
- `GET /api/collections/users_valiantlynx/auth-methods` - OAuth2 providers

### Collections
All database tables are automatically exposed as REST endpoints:
- `/api/collections/blogs/records` - Blog posts
- `/api/collections/projects_valiantlynx/records` - Projects
- `/api/collections/tags/records` - Tags
- `/api/collections/sites/records` - Site configuration
- `/api/collections/comments/records` - Comments
- `/api/collections/likes/records` - Likes

### Real-time Subscriptions
WebSocket connections for live updates:
```javascript
// Subscribe to new blog posts
pb.collection('blogs').subscribe('*', function (e) {
    console.log('Blog updated:', e.record);
});

// Subscribe to comments
pb.collection('comments').subscribe('*', function (e) {
    console.log('Comment update:', e.record);
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
- Manage file uploads

### Logs
- Development: 2 days retention
- Production: 7 days retention
- Located in `pb_data/logs/`

## External Integrations

### Analytics
- Microsoft Clarity tracking
- Google Analytics (gtag.js)
- Google AdSense integration

### OAuth2 Providers
- Google authentication
- GitHub authentication
- Extensible for Facebook, Discord, etc.

### Comment System
- Commento integration support
- Native PocketBase comments

## Security

### Authentication
- JWT tokens with refresh mechanism
- OAuth2 social login support
- Email verification optional
- Password strength requirements
- Role-based access control (RBAC)

### Data Protection
- SQLite database encryption
- HTTPS/TLS in production
- CORS protection
- Rate limiting on API endpoints

### Privacy
- User data export/deletion
- Email visibility controls
- Anonymous feedback support

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
- Check schema.sql parsing in migrations

### Development Contact
- GitHub Issues for bug reports
- Feature requests via discussions

---

**Blog-Svelte** - Modern blog platform built with SvelteKit and PocketBase.
