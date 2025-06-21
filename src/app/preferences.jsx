import { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, Alert, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_PLACES_API_KEY } from '../utils/config'
import { auth, db } from '../utils/firebaseConfig'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"

const Preferences = () => {
  const router = useRouter()
  const [skillLevel, setSkillLevel] = useState('intermediate')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [locationCoords, setLocationCoords] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserPreferences()
    requestLocationPermission()
  }, [])

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Please enable location services to find tennis courts near you.',
        [{ text: 'OK' }]
      )
    } else {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        })
        setCurrentLocation(location.coords)
      } catch (error) {
        console.error('Error getting initial location:', error)
      }
    }
  }

  const loadUserPreferences = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        router.replace('/login')
        return
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setSkillLevel(data.skillLevel || 'intermediate')
        setPreferredLocation(data.preferredLocation || '')
        if (data.locationCoords) {
          setLocationCoords(data.locationCoords)
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true)
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      })
      setLocationCoords(location.coords)
      
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
      
      if (address) {
        const locationString = [
          address.name,
          address.street,
          address.city,
          address.region
        ].filter(Boolean).join(', ')
        setPreferredLocation(locationString)
      }
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Could not get your current location. Please try again.',
        [{ text: 'OK' }]
      )
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleSavePreferences = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        router.replace('/login')
        return
      }

      await setDoc(doc(db, 'users', user.uid), {
        skillLevel,
        preferredLocation,
        locationCoords,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      Alert.alert('Success', 'Preferences saved successfully')
      router.back()
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences')
    }
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading preferences...</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Preferences</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {/* Skill Level */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Skill Level</ThemedText>
            <ThemedView style={styles.skillLevelContainer}>
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.skillLevelButton,
                    skillLevel === level && styles.skillLevelButtonActive
                  ]}
                  onPress={() => setSkillLevel(level)}
                >
                  <ThemedText style={[
                    styles.skillLevelText,
                    skillLevel === level && styles.skillLevelTextActive
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          {/* Preferred Location */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Preferred Location</ThemedText>
            <View style={styles.locationContainer}>
              <TouchableOpacity 
                style={styles.currentLocationButton}
                onPress={getCurrentLocation}
                disabled={isLoadingLocation}
              >
                <Ionicons 
                  name={isLoadingLocation ? "sync" : "location"} 
                  size={24} 
                  color="#007AFF" 
                />
                <ThemedText style={styles.currentLocationText}>
                  {isLoadingLocation ? 'Getting location...' : 'Use Current Location'}
                </ThemedText>
              </TouchableOpacity>
              
              <ThemedText style={styles.orText}>or</ThemedText>
              
              <GooglePlacesAutocomplete
                placeholder='Search for your preferred location...'
                onPress={(data, details = null) => {
                  setPreferredLocation(data.description)
                  setLocationCoords({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng
                  })
                }}
                query={{
                  key: GOOGLE_PLACES_API_KEY,
                  language: 'en',
                  types: 'establishment',
                  keyword: 'tennis court'
                }}
                styles={{
                  container: styles.searchContainer,
                  textInput: styles.searchInput,
                  listView: styles.searchResults,
                  row: styles.searchRow,
                  description: styles.searchDescription
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                minLength={2}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={200}
                predefinedPlaces={[]}
                textInputProps={{}}
              />
            </View>
          </ThemedView>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSavePreferences}
          >
            <ThemedText style={styles.saveButtonText}>Save Preferences</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  )
}

export default Preferences

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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  skillLevelContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  skillLevelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  skillLevelButtonActive: {
    backgroundColor: '#007AFF',
  },
  skillLevelText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  skillLevelTextActive: {
    color: 'white',
  },
  locationContainer: {
    gap: 10,
    position: 'relative',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  currentLocationText: {
    fontSize: 14,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 5,
    opacity: 0.5,
  },
  searchContainer: {
    flex: 0,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  searchResults: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  searchRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchDescription: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
