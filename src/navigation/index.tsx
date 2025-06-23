
import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CheckSquare, List, User } from 'lucide-react-native';
import { useAuthStore } from '../stores/authStore';
import AuthScreen from '../screens/AuthScreen';
import TodoListScreen from '../screens/TodoListScreen';
import { colors } from '../constants/colors';

// Define types for navigation
export type MainTabsParamList = {
  Todos: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Main tab navigator
export const MainTabNavigator = () => {
  const { user } = useAuthStore();

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          const color = focused ? colors.primary : colors.textSecondary;
          
          if (route.name === 'Todos') {
            return <CheckSquare size={20} color={color} />;
          } else if (route.name === 'Profile') {
            return <User size={20} color={color} />;
          }
          
          return <CheckSquare size={20} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 72 : 60,
          paddingBottom: Platform.OS === 'ios' ? 8 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      })}
    >
      <Tab.Screen 
        name="Todos" 
        component={TodoListScreen}
        options={{ tabBarLabel: 'My Todos' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={() => null}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
