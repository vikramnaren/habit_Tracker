# Habit Tracker

A modern web application for tracking daily habits, visualizing streaks, and monitoring progress. Built with React, TypeScript, and Firebase.

## Features

- Create and manage custom habits
- Track daily habit completion
- Visualize streaks and progress
- Weekly and monthly reports
- Push notifications
- PWA support
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and add your configuration:
   - Go to the Firebase Console
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration

4. Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm start
```

## Usage

1. Sign up or log in to your account
2. Create habits with custom names, descriptions, and target days
3. Mark habits as complete on your dashboard
4. View your progress and streaks in the reports section
5. Receive push notifications for daily reminders

## PWA Features

The application is a Progressive Web App (PWA) with the following features:
- Installable on mobile devices
- Offline support
- Push notifications
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
