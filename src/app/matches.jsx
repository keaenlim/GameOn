import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import Spacer from '../components/Spacer';
import { Link } from 'expo-router';

const MatchesScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Available Matches</ThemedText>
      <Spacer height={20} />
      <ThemedText>No matches found yet. Be the first to create one!</ThemedText>
      <Spacer height={20} />
      <Link href="/create-match" style={styles.link}>
        <ThemedText>Create a New Match</ThemedText>
      </Link>
    </ThemedView>
  );
};

export default MatchesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  link: {
    marginTop: 20,
    color: '#007bff',
  },
}); 