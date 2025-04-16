# Habit Tracker

A powerful, intuitive habit tracking application that helps you build and maintain positive routines through daily tracking, progress visualization, and personalized reminders, all while providing a seamless cross-device experience.

## 🚀 Features

- ✨ Create and manage custom habits
- ✅ Track daily habit completion
- 📊 Visualize progress with beautiful charts
- 🔥 Track and maintain streaks
- 📱 Responsive design for all devices
- 🔔 Push notifications for reminders
- 📊 Weekly and monthly progress reports
- 🌐 PWA support for offline access

## 🛠️ Tech Stack

- **Frontend:** React 19.1.0, TypeScript 4.9.5
- **UI Framework:** Material-UI (MUI) 7.0.2
- **Routing:** React Router DOM 7.5.0
- **Charts:** Recharts 2.15.2
- **Date Handling:** date-fns 4.1.0
- **Backend:** Firebase 11.6.0
- **Testing:** Jest, React Testing Library

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Firebase Setup:**
   - Create a project in [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Set up Firestore Database
   - Get your Firebase configuration

4. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start Development Server:**
   ```bash
   npm start
   ```

## 📱 PWA Features

- 📲 Install on mobile devices
- 🔄 Offline functionality
- 🔔 Push notifications
- 📱 Responsive design
- 🚀 Fast loading times

## 🎯 Usage Guide

1. **Account Setup:**
   - Sign up with email or log in to existing account
   - Complete your profile setup

2. **Creating Habits:**
   - Click "Add New Habit"
   - Set habit name, description, and frequency
   - Choose reminder settings (optional)

3. **Daily Tracking:**
   - Mark habits as complete from the dashboard
   - View daily progress and streaks
   - Get notifications for pending habits

4. **Progress Monitoring:**
   - View detailed statistics in the Reports section
   - Track weekly and monthly progress
   - Analyze habit completion patterns

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for the beautiful components
- Firebase for backend services
- The React community for amazing tools and libraries
