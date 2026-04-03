# Weather App

A full-stack weather application that provides real-time weather information and automated weather alerts for users.

## Features

- **User Authentication** - Register and login with JWT-based authentication
- **Real-time Weather** - Get current weather for your city
- **Weather Search** - Search weather for any city worldwide
- **Push Notifications** - Receive weather alerts via Firebase Cloud Messaging
- **Automated Alerts** - Background service monitors extreme weather conditions and sends notifications proactively

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Firebase (Cloud Messaging)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Firebase Admin SDK
- node-cron (for scheduled jobs)

### APIs
- Open-Meteo (weather forecasts)
- WeatherAPI (current weather)

## Project Structure

```
Weather_App/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Business logic
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # External services
│   ├── db.js             # Database connection
│   └── index.js          # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── config/       # Configuration
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── firebase.js   # Firebase config
    │   └── App.js        # Main app
    └── public/
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Firebase project (for push notifications)

### Installation

1. **Clone the repository**
   ```bash
   cd Weather_App
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Create `.env` file in backend/**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWTSCE=your_jwt_secret
   JWT_SECRET_KEY=your_jwt_key
   WEATHER_API_KEY=your_weatherapi_key
   
   # Firebase config
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_key_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_CERT_URL=your_cert_url
   ```

4. **Start Backend**
   ```bash
   npm start
   ```

5. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Create `.env` file in frontend/**
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
   ```

7. **Start Frontend**
   ```bash
   npm start
   ```

8. **Copy Firebase Service Worker**
   - Copy `public/firebase-messaging-sw.template.js` to `public/firebase-messaging-sw.js`
   - Replace placeholder values with your Firebase config

## Weather Alert System

The app includes an automated weather monitoring system that:

- Runs every hour via cron job
- Checks weather forecasts for all registered user locations
- Detects extreme conditions (thunderstorms, heavy rain, snow, high/low temperatures, high wind)
- Sends push notifications to users when extreme weather is predicted
- Prevents notification spam (minimum 12-hour interval between alerts)

### Alert Conditions
- Temperature > 35°C or < 5°C
- Rain probability > 70%
- Wind speed > 50 km/h
- Thunderstorms, snow, heavy rain
- Fog conditions

## API Endpoints

### Auth
- `POST /api/creatuser` - Register new user
- `POST /api/loginuser` - Login user

### Weather
- `GET /api/weather` - Get weather for user's location (requires auth)
- `GET /api/weather-by-city?city=<name>` - Search weather by city (requires auth)
- `GET /api/public-weather?city=<name>` - Public weather endpoint

### Notifications
- `POST /api/save-token` - Save FCM token
- `POST /api/send-notification` - Send test notification

### Testing
- `POST /api/test-weather-alert` - Trigger weather check manually

## License

MIT
