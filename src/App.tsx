
import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import MainTabNavigator from './navigation';
import { colors } from './constants/colors';

export default function App() {
  // Custom dark theme for the app
  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.surface,
      border: colors.border,
      text: colors.text,
      primary: colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <Toaster 
          theme="dark" 
          richColors 
          toastOptions={{
            style: {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }
          }}
        />
        <MainTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
