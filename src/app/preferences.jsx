import { useState, useEffect } from 'react'
import { StyleSheet, FlatList, TouchableOpacity, Alert, View, Modal } from 'react-native'
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
  const [showLocationModal, setShowLocationModal] = useState(false)

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

  // All form sections as FlatList items
  const formSections = [
    { key: 'skill', render: () => (
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
    )},
    { key: 'save', render: () => (
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSavePreferences}
      >
        <ThemedText style={styles.saveButtonText}>Save Preferences</ThemedText>
      </TouchableOpacity>
    )},
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Preferences</ThemedText>
      </ThemedView>
      <FlatList
        data={formSections}
        keyExtractor={item => item.key}
        renderItem={({ item }) => item.render()}
        ListHeaderComponent={
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Preferred Location</ThemedText>
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => setShowLocationModal(true)}
            >
              <ThemedText style={{ color: preferredLocation ? '#201e2b' : '#999' }}>
                {preferredLocation || 'Select a location...'}
              </ThemedText>
            </TouchableOpacity>
            <Modal
              visible={showLocationModal}
              animationType="slide"
              onRequestClose={() => setShowLocationModal(false)}
            >
              <ThemedView style={{ flex: 1, paddingTop: 40, backgroundColor: '#fff' }}>
                <GooglePlacesAutocomplete
                  placeholder="Search for your preferred location..."
                  onPress={(data, details = null) => {
                    const address = details?.formatted_address || data.description;
                    setPreferredLocation(address);
                    setLocationCoords(details ? {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng
                    } : null);
                    setShowLocationModal(false);
                  }}
                  query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'en',
                    components: 'country:SG',
                    keyword: 'tennis court'
                  }}
                  fetchDetails={true}
                  enablePoweredByContainer={false}
                  minLength={2}
                  nearbyPlacesAPI="GooglePlacesSearch"
                  debounce={200}
                  predefinedPlaces={[]}
                  styles={{
                    container: { flex: 0, margin: 16 },
                    textInput: { height: 50, backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 15, fontSize: 14 },
                    listView: { backgroundColor: '#fff', borderRadius: 10, marginTop: 5, elevation: 5, zIndex: 9999 },
                    row: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
                    description: { fontSize: 14 },
                  }}
                  textInputProps={{
                    autoFocus: true,
                  }}
                />
                <TouchableOpacity onPress={() => setShowLocationModal(false)} style={{ alignItems: 'center', marginTop: 20 }}>
                  <ThemedText style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 16 }}>Cancel</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </Modal>
          </ThemedView>
        }
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  )
}

export default Preferences

const styles = StyleSheet.create({
  container: {
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
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
})
