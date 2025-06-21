import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig'; // Import auth instance
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import Spacer from '../components/Spacer';
import { Link, router } from 'expo-router';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Registration Failed", "Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Registration Successful", "You have successfully registered and logged in!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Register</ThemedText>
      <Spacer height={20} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Spacer height={10} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Spacer height={10} />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Spacer height={20} />
      <Button title="Register" onPress={handleRegister} />
      <Spacer height={10} />
      <ThemedText style={styles.accountText}>
        Already have an account? <Link href="/login" style={styles.linkText}><ThemedText style={styles.linkText}>Login here</ThemedText></Link>
      </ThemedText>
    </ThemedView>
  );
};

export default RegisterScreen;

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
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: '#000', // Ensures text is visible in light mode
  },
  link: {
    marginTop: 10,
    // This style is now applied to the Link component itself, not the text
  },
  linkText: {
    color: '#007bff', // Standard link color
    textDecorationLine: 'underline',
  },
  accountText: {
    marginTop: 10,
  },
}); 