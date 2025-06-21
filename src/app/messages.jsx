import { useState, useCallback } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, Alert, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"

const Messages = () => {
  const router = useRouter()
  const [hasNewMessages, setHasNewMessages] = useState(false) // Placeholder for notification

  // TODO: Implement actual chat loading and display logic here

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Messages</ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          {/* Placeholder for chat list */}
          <ThemedView style={styles.messagePreviewCard}>
            <ThemedText style={styles.messageTitle}>No new messages</ThemedText>
            <ThemedText>Start a conversation to see chats here!</ThemedText>
          </ThemedView>
          {/* Example of a message preview (will be dynamically loaded later) */}
          {/*
          <ThemedView style={styles.messagePreviewCard}>
            <ThemedText style={styles.messageTitle}>John Doe</ThemedText>
            <ThemedText>Hey, are you free for a game on Friday?</ThemedText>
          </ThemedView>
          */}
        </ThemedView>
      </ScrollView>

      {/* Bottom Navigation Bar (similar to Home/Find Matches) */}
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
          {hasNewMessages && <View style={styles.notificationBadge} />}
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
  )
}

export default Messages

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
  messagePreviewCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 30,
    backgroundColor: 'red',
    borderRadius: 5,
    width: 10,
    height: 10,
  },
}); 