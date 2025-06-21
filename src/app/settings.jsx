import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';

import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";

const Settings = () => {
  const router = useRouter();

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

      {/* Bottom Navigation Bar (similar to other main tabs) */}
      <ThemedView style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            if (router.pathname !== '/') {
              router.replace('/');
            }
          }}
        >
          <Ionicons name="home-outline" size={24} color={router.pathname === '/' ? "#007AFF" : "#007AFF"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            if (router.pathname !== '/find-matches') {
              router.replace('/find-matches');
            }
          }}
        >
          <Ionicons name="search-outline" size={24} color={router.pathname === '/find-matches' ? "#007AFF" : "#007AFF"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            if (router.pathname !== '/messages') {
              router.replace('/messages');
            }
          }}
        >
          <Ionicons name="chatbubble-outline" size={24} color={router.pathname === '/messages' ? "#007AFF" : "#007AFF"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            if (router.pathname !== '/settings') {
              router.replace('/settings');
            }
          }}
        >
          <Ionicons name="settings-outline" size={24} color={router.pathname === '/settings' ? "#007AFF" : "#007AFF"} />
        </TouchableOpacity>
      </ThemedView>
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
}); 