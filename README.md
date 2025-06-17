# GameOn

A React Native mobile application for tennis players to find and organize matches.

## Features

- User authentication with Firebase
- Create and find tennis matches
- Filter matches by skill level, location, and timing
- Real-time messaging between players
- User preferences for skill level and location
- Modern UI with light/dark theme support

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/GameOn.git
cd GameOn
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and add your configuration:
   - Go to Firebase Console
   - Create a new project
   - Add an iOS app with bundle ID "com.gameon.app"
   - Download the configuration file
   - Enable Authentication (Email/Password)
   - Create Firestore database

4. Update Firebase configuration:
   - Copy your Firebase config to `utils/firebaseConfig.js`
   - Add your Google Places API key to `utils/config.js`

5. Start the development server:
```bash
npx expo start 
```
OR (to clear cache)
```bash
npx expo start --clear 
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

## Project Structure

```
GameOn/
├── app/                    # Main application screens
├── components/            # Reusable components
├── constants/             # Theme and other constants
├── utils/                 # Utility functions and configurations
└── assets/               # Images and other static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 