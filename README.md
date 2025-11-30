# Shop App - Frontend

A React Native mobile application built with Expo for sharing shopping lists between couples.

## Project Structure

```
shop-app/
├── src/
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── components/       # Reusable components
│   ├── store/           # Redux store & slices
│   ├── services/        # API & notification services
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Constants & utilities
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── .env.example         # Environment variables template
```

## Technologies

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation library
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Expo Notifications** - Push notifications

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL

### Running the App

**For Android:**
```bash
npm run android
```

**For iOS (macOS only):**
```bash
npm run ios
```

**For Web:**
```bash
npm run web
```

**Using Expo Go (recommended for development):**
```bash
npx expo start
```

Then scan the QR code with Expo Go app on your phone.

## Development Notes

- All screens and services are scaffolded but not yet implemented
- Redux store is configured and ready for slices
- Navigation structure is set up with Bottom Tab Navigator
- API client is ready with interceptors for future auth

## Environment Variables

Create a `.env` file with:
```
EXPO_PUBLIC_API_URL=http://your-backend-url/api
```

## Next Steps

1. Implement screens (Categories, Cart, Profile)
2. Create Redux slices for state management
3. Build UI components
4. Integrate with backend API
5. Test notifications

## License

MIT
