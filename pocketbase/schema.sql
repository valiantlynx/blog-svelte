/*
Drivstoffapp V2 Database Schema
Complete fuel, trip planning, and transportation platform

This schema supports:
1. User authentication and preferences
2. Trip planning and route management
3. Fuel station and charging station data
4. Rideshare functionality
5. Payment and subscription system
6. Notification management
7. Admin and analytics
*/

-- ============================================================================
-- CORE USER MANAGEMENT
-- ============================================================================

-- Users table (PocketBase auth collection) - enhanced with drivstoffapp fields
-- This extends the default PocketBase users table with vehicle/fuel preferences

-- User preferences and settings - separate table for detailed preferences
CREATE TABLE user_preferences (
    id TEXT PRIMARY KEY DEFAULT ('pref_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL UNIQUE,
    -- Vehicle preferences
    vehicle_type TEXT DEFAULT 'car' CHECK (vehicle_type IN ('car', 'truck', 'electric', 'motorcycle')),
    fuel_type TEXT DEFAULT 'gasoline' CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
    vehicle_consumption REAL DEFAULT 0.8, -- L/10km or kWh/100km
    -- Location preferences  
    home_location TEXT DEFAULT '',
    work_location TEXT DEFAULT '',
    favorite_locations JSON DEFAULT '[]',
    -- Notification preferences
    notification_preferences JSON DEFAULT '{"price_alerts": true, "trip_updates": true, "rideshare_notifications": true, "email_notifications": true, "push_notifications": true}',
    -- Privacy settings
    privacy_settings JSON DEFAULT '{"share_location": true, "show_in_rideshare": true, "anonymous_mode": false}',
    -- UI preferences
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language TEXT DEFAULT 'nb' CHECK (language IN ('en', 'nb', 'da', 'sv', 'nn')),
    -- ISO 8601
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- User favorites - bookmarked locations, routes, stations
CREATE TABLE user_favorites (
    id TEXT PRIMARY KEY DEFAULT ('fav_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL,
    favorite_type TEXT NOT NULL CHECK (favorite_type IN ('location', 'route', 'fuel_station', 'charging_station', 'trip')),
    name TEXT NOT NULL,
    data JSON NOT NULL, -- Store location coords, route details, etc.
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- User teams/workspaces for dashboard organization
CREATE TABLE user_workspaces (
    id TEXT PRIMARY KEY DEFAULT ('workspace_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    emoji TEXT DEFAULT '🏠',
    type TEXT DEFAULT 'personal' CHECK (type IN ('personal', 'work', 'family', 'travel')),
    pages JSON DEFAULT '[]',
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================================================
-- FUEL & CHARGING STATIONS
-- ============================================================================

-- Fuel stations with real-time pricing
CREATE TABLE fuel_stations (
    id TEXT PRIMARY KEY DEFAULT ('fuel_' || lower(hex(randomblob(7)))),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    -- Fuel prices (NOK per liter)
    gasoline_price REAL DEFAULT 0,
    diesel_price REAL DEFAULT 0,
    -- Station details
    services JSON DEFAULT '[]', -- ["carwash", "shop", "atm", "restaurant"]
    amenities JSON DEFAULT '[]',
    opening_hours JSON DEFAULT '{}',
    phone TEXT DEFAULT '',
    rating REAL DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    -- Pricing trends
    price_history JSON DEFAULT '[]',
    last_price_update DATETIME DEFAULT (datetime('now')),
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    verified BOOLEAN DEFAULT FALSE,
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now'))
);

-- Electric vehicle charging stations
CREATE TABLE charging_stations (
    id TEXT PRIMARY KEY DEFAULT ('charge_' || lower(hex(randomblob(7)))),
    name TEXT NOT NULL,
    network TEXT NOT NULL, -- Tesla, Fortum, Circle K, etc.
    address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    -- Charging details
    connector_types JSON DEFAULT '[]', -- ["Tesla", "CCS", "CHAdeMO", "Type2"]
    max_power INTEGER DEFAULT 0, -- kW
    total_charging_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    -- Pricing (NOK per kWh)
    fast_charging_price REAL DEFAULT 0,
    slow_charging_price REAL DEFAULT 0,
    -- Station details
    amenities JSON DEFAULT '[]',
    opening_hours JSON DEFAULT '{}',
    rating REAL DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    real_time_availability BOOLEAN DEFAULT FALSE,
    last_availability_update DATETIME DEFAULT (datetime('now')),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now'))
);

-- Toll stations for route cost calculations
CREATE TABLE toll_stations (
    id TEXT PRIMARY KEY DEFAULT ('toll_' || lower(hex(randomblob(7)))),
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    -- Pricing for different vehicle types (NOK)
    small_vehicle_price REAL DEFAULT 0,
    large_vehicle_price REAL DEFAULT 0,
    -- Station details
    direction TEXT DEFAULT '', -- northbound, southbound, etc.
    road_name TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now'))
);

-- Station ratings and reviews
CREATE TABLE station_ratings (
    id TEXT PRIMARY KEY DEFAULT ('rating_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL,
    station_id TEXT NOT NULL,
    station_type TEXT NOT NULL CHECK (station_type IN ('fuel', 'charging')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT DEFAULT '',
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, station_id, station_type),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================================================
-- TRIP PLANNING & ROUTES
-- ============================================================================

-- User trips and saved routes
CREATE TABLE trips (
    id TEXT PRIMARY KEY DEFAULT ('trip_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    -- Route details
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    from_coordinates TEXT NOT NULL, -- "lat,lng"
    to_coordinates TEXT NOT NULL,   -- "lat,lng" 
    waypoints JSON DEFAULT '[]',
    -- Trip preferences
    route_type TEXT DEFAULT 'fastest' CHECK (route_type IN ('fastest', 'scenic', 'cheapest')),
    vehicle_type TEXT DEFAULT 'car',
    fuel_type TEXT DEFAULT 'gasoline',
    departure_time TEXT DEFAULT 'now',
    return_trip BOOLEAN DEFAULT FALSE,
    -- Calculated costs and details
    distance_km REAL DEFAULT 0,
    duration_minutes INTEGER DEFAULT 0,
    fuel_cost REAL DEFAULT 0,
    toll_cost REAL DEFAULT 0,
    total_cost REAL DEFAULT 0,
    co2_emissions REAL DEFAULT 0,
    route_data JSON DEFAULT '{}', -- Full route calculation results
    -- Status
    is_shared BOOLEAN DEFAULT FALSE,
    share_token TEXT DEFAULT '',
    is_favorite BOOLEAN DEFAULT FALSE,
    trip_status TEXT DEFAULT 'planning' CHECK (trip_status IN ('planning', 'active', 'completed', 'cancelled')),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Route share tokens for sharing trips
CREATE TABLE route_shares (
    id TEXT PRIMARY KEY DEFAULT ('share_' || lower(hex(randomblob(7)))),
    trip_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    share_token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    view_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================================================
-- RIDESHARE FUNCTIONALITY
-- ============================================================================

-- Rideshare listings
CREATE TABLE rides (
    id TEXT PRIMARY KEY DEFAULT ('ride_' || lower(hex(randomblob(7)))),
    driver_id TEXT NOT NULL,
    -- Trip details
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    from_coordinates TEXT NOT NULL,
    to_coordinates TEXT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME,
    -- Capacity and pricing
    total_seats INTEGER NOT NULL DEFAULT 4,
    available_seats INTEGER NOT NULL DEFAULT 4,
    price_per_seat REAL NOT NULL,
    currency TEXT DEFAULT 'NOK',
    -- Vehicle and driver info
    vehicle_info JSON DEFAULT '{}', -- make, model, color, license_plate
    driver_rating REAL DEFAULT 0.0,
    amenities JSON DEFAULT '[]', -- ["wifi", "phone_charger", "music", "snacks"]
    -- Trip preferences
    smoking_allowed BOOLEAN DEFAULT FALSE,
    pets_allowed BOOLEAN DEFAULT FALSE,
    music_preferences TEXT DEFAULT '',
    conversation_level TEXT DEFAULT 'moderate' CHECK (conversation_level IN ('quiet', 'moderate', 'chatty')),
    -- Environmental impact
    co2_saved_per_passenger REAL DEFAULT 0,
    -- Status
    ride_status TEXT DEFAULT 'active' CHECK (ride_status IN ('active', 'full', 'completed', 'cancelled')),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT DEFAULT '', -- daily, weekly, weekdays, etc.
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (driver_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Rideshare bookings
CREATE TABLE ride_bookings (
    id TEXT PRIMARY KEY DEFAULT ('booking_' || lower(hex(randomblob(7)))),
    ride_id TEXT NOT NULL,
    passenger_id TEXT NOT NULL,
    seats_booked INTEGER DEFAULT 1,
    total_amount REAL NOT NULL,
    currency TEXT DEFAULT 'NOK',
    -- Contact details
    passenger_phone TEXT DEFAULT '',
    pickup_location TEXT DEFAULT '',
    special_requests TEXT DEFAULT '',
    -- Status
    booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    -- Timestamps
    booked_at DATETIME NOT NULL DEFAULT (datetime('now')),
    confirmed_at DATETIME,
    completed_at DATETIME,
    cancelled_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides (id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Rideshare ratings (separate from station ratings)
CREATE TABLE rideshare_ratings (
    id TEXT PRIMARY KEY DEFAULT ('ride_rating_' || lower(hex(randomblob(7)))),
    booking_id TEXT NOT NULL,
    rater_id TEXT NOT NULL, -- who is giving the rating
    rated_id TEXT NOT NULL, -- who is being rated
    role TEXT NOT NULL CHECK (role IN ('driver', 'passenger')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT DEFAULT '',
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    UNIQUE(booking_id, rater_id, rated_id),
    FOREIGN KEY (booking_id) REFERENCES ride_bookings (id) ON DELETE CASCADE,
    FOREIGN KEY (rater_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (rated_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================================================
-- PAYMENTS & SUBSCRIPTIONS
-- ============================================================================

-- Payment transactions
CREATE TABLE payments (
    id TEXT PRIMARY KEY DEFAULT ('payment_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL,
    -- Payment details
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'NOK',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('vipps', 'stripe', 'paypal')),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('rideshare', 'reservation', 'subscription', 'premium')),
    -- Related entities
    related_entity_type TEXT DEFAULT '', -- ride_booking, station_reservation, subscription
    related_entity_id TEXT DEFAULT '',
    -- Payment provider data
    external_payment_id TEXT DEFAULT '',
    payment_provider_data JSON DEFAULT '{}',
    -- Status
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    processed_at DATETIME,
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- User subscriptions
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY DEFAULT ('sub_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    plan_type TEXT DEFAULT 'basic' CHECK (plan_type IN ('basic', 'premium', 'pro')),
    -- Pricing
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'NOK',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    -- Status
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'suspended')),
    -- Dates
    started_at DATETIME NOT NULL DEFAULT (datetime('now')),
    expires_at DATETIME,
    cancelled_at DATETIME,
    last_payment_at DATETIME,
    next_payment_at DATETIME,
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Station reservations (fuel stops, charging slots)
CREATE TABLE station_reservations (
    id TEXT PRIMARY KEY DEFAULT ('reservation_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL,
    station_id TEXT NOT NULL,
    station_type TEXT NOT NULL CHECK (station_type IN ('fuel', 'charging')),
    -- Reservation details
    reserved_time DATETIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    service_type TEXT DEFAULT '', -- fuel_type or charging_type
    estimated_amount REAL DEFAULT 0, -- liters or kWh
    -- Payment
    reservation_fee REAL DEFAULT 0,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    -- Status
    reservation_status TEXT DEFAULT 'active' CHECK (reservation_status IN ('active', 'completed', 'cancelled', 'no_show')),
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================================================
-- NOTIFICATIONS & MESSAGING
-- ============================================================================

-- Notification history
CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT ('notification_' || lower(hex(randomblob(7)))),
    user_id TEXT NOT NULL,
    -- Notification content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('price_alert', 'trip_update', 'rideshare', 'booking', 'system', 'promotional')),
    -- Delivery details
    delivery_method JSON DEFAULT '["push"]', -- ["push", "email", "sms"]
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    -- Related data
    related_entity_type TEXT DEFAULT '',
    related_entity_id TEXT DEFAULT '',
    action_url TEXT DEFAULT '',
    metadata JSON DEFAULT '{}',
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    delivery_status JSON DEFAULT '{}', -- track delivery success per method
    scheduled_for DATETIME DEFAULT (datetime('now')),
    sent_at DATETIME,
    read_at DATETIME,
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- User feedback and support
CREATE TABLE feedback (
    id TEXT PRIMARY KEY DEFAULT ('feedback_' || lower(hex(randomblob(7)))),
    user_id TEXT,
    -- Feedback details
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug_report', 'feature_request', 'complaint', 'compliment', 'general')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    -- System info
    user_agent TEXT DEFAULT '',
    page_url TEXT DEFAULT '',
    device_info JSON DEFAULT '{}',
    -- Status
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to TEXT DEFAULT '',
    admin_notes TEXT DEFAULT '',
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    updated DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- ============================================================================
-- SEARCH & ANALYTICS
-- ============================================================================

-- Search history for better suggestions
CREATE TABLE search_history (
    id TEXT PRIMARY KEY DEFAULT ('search_' || lower(hex(randomblob(7)))),
    user_id TEXT,
    search_type TEXT NOT NULL CHECK (search_type IN ('location', 'station', 'route', 'ride')),
    search_query TEXT NOT NULL,
    search_results_count INTEGER DEFAULT 0,
    clicked_result_id TEXT DEFAULT '',
    created DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Analytics data for admin dashboard
CREATE TABLE analytics (
    id TEXT PRIMARY KEY DEFAULT ('analytics_' || lower(hex(randomblob(7)))),
    metric_type TEXT NOT NULL CHECK (metric_type IN ('user_activity', 'trip_created', 'ride_booked', 'station_viewed', 'payment_completed')),
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    dimensions JSON DEFAULT '{}', -- additional metadata
    user_id TEXT,
    session_id TEXT DEFAULT '',
    timestamp DATETIME NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- ============================================================================
-- TRIGGERS & AUTOMATION
-- ============================================================================

-- Auto-create user preferences when user is created
CREATE TRIGGER create_user_preferences_on_signup
AFTER INSERT ON users
BEGIN
    INSERT INTO user_preferences (user_id, vehicle_type, fuel_type, theme, language)
    VALUES (NEW.id, 'car', 'gasoline', 'system', 'nb');
    
    -- Create default workspace
    INSERT INTO user_workspaces (user_id, name, emoji, type)
    VALUES (NEW.id, 'Personal', '🏠', 'personal');
END;

-- Update timestamps
CREATE TRIGGER update_user_preferences_timestamp
AFTER UPDATE ON user_preferences
BEGIN
    UPDATE user_preferences SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER update_trips_timestamp
AFTER UPDATE ON trips
BEGIN
    UPDATE trips SET updated = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER update_rides_timestamp
AFTER UPDATE ON rides
BEGIN
    UPDATE rides SET updated = datetime('now') WHERE id = NEW.id;
END;

-- Update station availability when booking is created/cancelled
CREATE TRIGGER update_charging_availability_on_booking
AFTER INSERT ON station_reservations
WHEN NEW.station_type = 'charging' AND NEW.reservation_status = 'active'
BEGIN
    UPDATE charging_stations 
    SET available_points = available_points - 1,
        last_availability_update = datetime('now')
    WHERE id = NEW.station_id AND available_points > 0;
END;

CREATE TRIGGER restore_charging_availability_on_cancellation
AFTER UPDATE ON station_reservations
WHEN NEW.station_type = 'charging' 
    AND OLD.reservation_status = 'active' 
    AND NEW.reservation_status IN ('cancelled', 'completed')
BEGIN
    UPDATE charging_stations 
    SET available_points = available_points + 1,
        last_availability_update = datetime('now')
    WHERE id = NEW.station_id;
END;

-- Update ride availability when bookings change
CREATE TRIGGER update_ride_seats_on_booking
AFTER INSERT ON ride_bookings
WHEN NEW.booking_status = 'confirmed'
BEGIN
    UPDATE rides 
    SET available_seats = available_seats - NEW.seats_booked,
        updated = datetime('now')
    WHERE id = NEW.ride_id;
    
    -- Mark ride as full if no seats left
    UPDATE rides 
    SET ride_status = 'full'
    WHERE id = NEW.ride_id AND available_seats <= 0;
END;

CREATE TRIGGER restore_ride_seats_on_cancellation
AFTER UPDATE ON ride_bookings
WHEN OLD.booking_status = 'confirmed' AND NEW.booking_status = 'cancelled'
BEGIN
    UPDATE rides 
    SET available_seats = available_seats + NEW.seats_booked,
        ride_status = CASE 
            WHEN available_seats + NEW.seats_booked > 0 THEN 'active'
            ELSE ride_status
        END,
        updated = datetime('now')
    WHERE id = NEW.ride_id;
END;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User and preferences indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_type ON user_favorites(favorite_type);
CREATE INDEX idx_user_workspaces_user_id ON user_workspaces(user_id);

-- Station indexes
CREATE INDEX idx_fuel_stations_location ON fuel_stations(latitude, longitude);
CREATE INDEX idx_fuel_stations_brand ON fuel_stations(brand);
CREATE INDEX idx_fuel_stations_active ON fuel_stations(is_active);
CREATE INDEX idx_charging_stations_location ON charging_stations(latitude, longitude);
CREATE INDEX idx_charging_stations_network ON charging_stations(network);
CREATE INDEX idx_charging_stations_active ON charging_stations(is_active);
CREATE INDEX idx_toll_stations_location ON toll_stations(latitude, longitude);
CREATE INDEX idx_station_ratings_station ON station_ratings(station_id, station_type);
CREATE INDEX idx_station_ratings_user ON station_ratings(user_id);

-- Trip and route indexes
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(trip_status);
CREATE INDEX idx_trips_shared ON trips(is_shared);
CREATE INDEX idx_route_shares_token ON route_shares(share_token);
CREATE INDEX idx_route_shares_trip ON route_shares(trip_id);

-- Rideshare indexes
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_location ON rides(from_coordinates, to_coordinates);
CREATE INDEX idx_rides_departure ON rides(departure_time);
CREATE INDEX idx_rides_status ON rides(ride_status);
CREATE INDEX idx_ride_bookings_ride ON ride_bookings(ride_id);
CREATE INDEX idx_ride_bookings_passenger ON ride_bookings(passenger_id);
CREATE INDEX idx_ride_bookings_status ON ride_bookings(booking_status);
CREATE INDEX idx_rideshare_ratings_booking ON rideshare_ratings(booking_id);

-- Payment indexes
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(subscription_status);
CREATE INDEX idx_station_reservations_user ON station_reservations(user_id);
CREATE INDEX idx_station_reservations_station ON station_reservations(station_id, station_type);
CREATE INDEX idx_station_reservations_time ON station_reservations(reserved_time);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_type ON feedback(feedback_type);

-- Analytics indexes
CREATE INDEX idx_search_history_user ON search_history(user_id);
CREATE INDEX idx_search_history_type ON search_history(search_type);
CREATE INDEX idx_analytics_metric ON analytics(metric_type, metric_name);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX idx_analytics_user ON analytics(user_id);

/*
Summary of Drivstoffapp V2 Database Schema:

CORE TABLES (24):
✅ user_preferences - Vehicle and app preferences
✅ user_favorites - Bookmarked locations and routes
✅ user_workspaces - Dashboard organization
✅ fuel_stations - Gas stations with real-time pricing
✅ charging_stations - EV charging network data
✅ toll_stations - Toll road pricing data
✅ station_ratings - User ratings for stations
✅ trips - Saved routes and trip planning
✅ route_shares - Share trips with others
✅ rides - Rideshare listings
✅ ride_bookings - Rideshare reservations
✅ rideshare_ratings - Driver/passenger ratings
✅ payments - Payment transactions
✅ subscriptions - User subscription management
✅ station_reservations - Fuel/charging reservations
✅ notifications - Push/email notifications
✅ feedback - User feedback and support
✅ search_history - Search suggestions
✅ analytics - Usage analytics

KEY FEATURES:
- Complete authentication with PocketBase users table
- Multi-modal trip planning (car, truck, electric)
- Real-time fuel and charging station data
- Comprehensive rideshare platform
- Integrated payment system (Vipps, Stripe, PayPal)
- Advanced notification system
- User preferences and favorites
- Route sharing and collaboration
- Station reservations and ratings
- Analytics and admin dashboard support
- Search history for better UX
- Automatic triggers for data consistency
- Performance indexes for fast queries

EXTERNAL INTEGRATIONS SUPPORTED:
- PocketBase authentication
- Real-time fuel price APIs
- EV charging network APIs
- Payment gateways (Vipps, Stripe, PayPal)
- Mapping services (OpenStreetMap, Google Maps)
- Notification services (Firebase, OneSignal)
- Traffic data APIs
*/