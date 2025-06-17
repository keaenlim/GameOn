import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Link, useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useState, useCallback } from 'react'
import { auth, db } from '../utils/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { Alert } from 'react-native'

import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"
import ThemedLogo from "../components/ThemedLogo"
import Spacer from "../components/Spacer"

const Home = () => {
  const router = useRouter()
  const [userSkillLevel, setUserSkillLevel] = useState('Not Set')
  const [userPreferredLocation, setUserPreferredLocation] = useState('Not Set')
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true)

  const loadUserPreferences = useCallback(async () => {
    try {
      setIsLoadingPreferences(true)
      const user = auth.currentUser
      if (!user) {
        // Handle case where user is not logged in (e.g., redirect to login)
        setUserSkillLevel('Not Set')
        setUserPreferredLocation('Not Set')
        return
      }

      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        const data = userDocSnap.data()
        setUserSkillLevel(data.skillLevel || 'Not Set')
        setUserPreferredLocation(data.preferredLocation || 'Not Set')
      } else {
        setUserSkillLevel('Not Set')
        setUserPreferredLocation('Not Set')
      }
    } catch (error) {
      console.error('Error loading user preferences:', error)
      setUserSkillLevel('Not Set')
      setUserPreferredLocation('Not Set')
    } finally {
      setIsLoadingPreferences(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadUserPreferences()
    }, [loadUserPreferences])
  )

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
        {/* Header Section */}
        <ThemedView style={styles.header}>
            {/* To add logo here */}
          <ThemedText style={styles.welcomeText}>Welcome to GameOn</ThemedText>
          <ThemedText style={styles.subtitle}>Find your next match</ThemedText>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.createMatchButton}
            onPress={() => router.push('/create-match')}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <ThemedText style={styles.buttonText}>Create Match</ThemedText>
          </TouchableOpacity>
          
          {/* Logout Button */}
          {/* REMOVED:
          <TouchableOpacity 
            style={[styles.createMatchButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <ThemedText style={styles.buttonText}>Logout</ThemedText>
          </TouchableOpacity>
          */}

        </ThemedView>

        {/* Upcoming Matches */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Upcoming Matches</ThemedText>
          <ThemedView style={styles.matchCard}>
            <ThemedText style={styles.matchTitle}>No upcoming matches</ThemedText>
            <ThemedText>Create or join a match to get started!</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Your Preferences */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Your Preferences</ThemedText>
          <ThemedView style={styles.preferencesCard}>
            {isLoadingPreferences ? (
              <ThemedText>Loading preferences...</ThemedText>
            ) : (
              <>
                <ThemedText>Skill Level: {userSkillLevel.charAt(0).toUpperCase() + userSkillLevel.slice(1)}</ThemedText>
                <ThemedText>Location: {userPreferredLocation}</ThemedText>
              </>
            )}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/preferences')}
            >
              <ThemedText style={styles.editButtonText}>Edit Preferences</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <ThemedView style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            if (router.pathname !== '/') {
              router.replace('/')
            }
          }}
        >
          <Ionicons name="home-outline" size={24} color={router.pathname === '/' ? "#007AFF" : "#007AFF"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            if (router.pathname !== '/find-matches') {
              router.replace('/find-matches')
            }
          }}
        >
          <Ionicons name="search-outline" size={24} color={router.pathname === '/find-matches' ? "#007AFF" : "#007AFF"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            if (router.pathname !== '/messages') {
              router.replace('/messages')
            }
          }}
        >
          <Ionicons name="chatbubble-outline" size={24} color={router.pathname === '/messages' ? "#007AFF" : "#007AFF"} />
          {/* TODO: Add notification badge logic here */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            if (router.pathname !== '/settings') {
              router.replace('/settings')
            }
          }}
        >
          <Ionicons name="settings-outline" size={24} color={router.pathname === '/settings' ? "#007AFF" : "#007AFF"} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  quickActions: {
    padding: 20,
  },
  createMatchButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  matchCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  preferencesCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
  },
  tabButtonText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
  },
  activeTabButtonText: {
    fontWeight: 'bold',
  },
})