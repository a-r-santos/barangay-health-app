import React, { useState } from 'react';
// Import the correct Safe Area Provider
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import LookupScreen from './src/screens/LookupScreen';
import HelpDeskScreen from './src/screens/HelpDeskScreen';
import BookingScreen from './src/screens/BookingScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const navigateTo = (screenName) => {
    setCurrentScreen(screenName);
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
  };

  // State router renderer helper
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />;
      case 'lookup':
        return <LookupScreen onGoBack={navigateToHome} />;
      case 'helpdesk':
        return <HelpDeskScreen onGoBack={navigateToHome} />;
      case 'booking':
        return <BookingScreen onGoBack={navigateToHome} />;
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  return (
    // Wrap the entire application routing flow to supply safe area context down to all screens
    <SafeAreaProvider>
      {renderScreen()}
    </SafeAreaProvider>
  );
}