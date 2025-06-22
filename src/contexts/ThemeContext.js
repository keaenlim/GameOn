import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const ThemeContext = createContext();

// Create a custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // State to hold the active theme: 'light', 'dark', or 'system'
  const [themePreference, setThemePreference] = useState('system'); 
  // State to hold the actual color scheme ('light' or 'dark')
  const [colorScheme, setColorScheme] = useState('light');
  
  const systemColorScheme = useColorScheme();

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme) {
          setThemePreference(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme from storage.', error);
      }
    };
    loadTheme();
  }, []);

  // Update the color scheme when the preference or system theme changes
  useEffect(() => {
    if (themePreference === 'system') {
      setColorScheme(systemColorScheme);
    } else {
      setColorScheme(themePreference);
    }
    // Save the preference to storage
    AsyncStorage.setItem('themePreference', themePreference);
  }, [themePreference, systemColorScheme]);

  const value = {
    theme: colorScheme, // The actual 'light' or 'dark' color scheme
    themePreference, // The user's choice: 'light', 'dark', or 'system'
    setThemePreference, // Function to update the preference
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 