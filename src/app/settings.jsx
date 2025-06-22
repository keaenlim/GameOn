import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { useTheme } from '../contexts/ThemeContext';

import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";

const Settings = () => {
  const router = useRouter();
  const { themePreference, setThemePreference } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          {/* Theme Settings */}
          <ThemedView style={styles.settingSection}>
            <ThemedText style={styles.settingSectionTitle}>Theme</ThemedText>
            <ThemedView style={styles.themeSelector}>
              <TouchableOpacity
                style={[styles.themeButton, themePreference === 'light' && styles.themeButtonActive]}
                onPress={() => setThemePreference('light')}
              >
                <ThemedText style={[styles.themeButtonText, themePreference === 'light' && styles.themeButtonTextActive]}>Light</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeButton, themePreference === 'dark' && styles.themeButtonActive]}
                onPress={() => setThemePreference('dark')}
              >
                <ThemedText style={[styles.themeButtonText, themePreference === 'dark' && styles.themeButtonTextActive]}>Dark</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeButton, themePreference === 'system' && styles.themeButtonActive]}
                onPress={() => setThemePreference('system')}
              >
                <ThemedText style={[styles.themeButtonText, themePreference === 'system' && styles.themeButtonTextActive]}>System</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          
          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          </TouchableOpacity>
          
          {/* TODO: Add other settings options here later */}
          <ThemedView style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Account Settings</ThemedText>
            <Ionicons name="chevron-forward-outline" size={24} color="gray" />
          </ThemedView>
          <ThemedView style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Notifications</ThemedText>
            <Ionicons name="chevron-forward-outline" size={24} color="gray" />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30', // Red color for logout
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingItemText: {
    fontSize: 16,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingBottom: 20, // Adjust for iPhone X safe area
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    position: 'relative',
  },
  settingSection: {
    marginBottom: 20,
  },
  settingSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
  },
  themeButtonText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  themeButtonTextActive: {
    color: 'white',
  },
}); 