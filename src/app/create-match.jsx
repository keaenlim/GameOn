import { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, TextInput, View, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_PLACES_API_KEY } from '../utils/config'

import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"

// Helper to round time to the nearest 30 minutes
const roundToNearestHalfHour = (date) => {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 30) * 30;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const CreateMatch = () => {
  const router = useRouter()
  const [matchDate, setMatchDate] = useState(new Date())
  const [startTime, setStartTime] = useState(roundToNearestHalfHour(new Date()))
  const [endTime, setEndTime] = useState(roundToNearestHalfHour(new Date(Date.now() + 60 * 60 * 1000))) // Default end time 1 hour after start
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [location, setLocation] = useState('')
  const [locationCoords, setLocationCoords] = useState(null)
  const [skillLevel, setSkillLevel] = useState('intermediate')
  const [playersNeeded, setPlayersNeeded] = useState(1)
  const [courtType, setCourtType] = useState('outdoor')
  const [notes, setNotes] = useState('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location services to find tennis courts near you.',
          [{ text: 'OK' }]
        )
      } else {
        // Get initial location for the search
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          })
          setCurrentLocation(location.coords)
        } catch (error) {
          console.log('Error getting initial location:', error)
        }
      }
    })()
  }, [])

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    if (selectedDate) {
      setMatchDate(selectedDate)
    }
  }

  const handleStartTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false)
    }
    if (selectedTime) {
      const newTime = roundToNearestHalfHour(new Date(selectedTime));
      setStartTime(newTime);

      // Ensure end time is at least 30 minutes after start time
      const minEndTime = new Date(newTime.getTime() + 30 * 60 * 1000);
      if (endTime.getTime() < minEndTime.getTime()) {
        setEndTime(minEndTime);
      }
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false)
    }
    if (selectedTime) {
      const newTime = roundToNearestHalfHour(new Date(selectedTime));

      // Validate: End time must be at least 30 minutes after start time
      const minValidEndTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      if (newTime.getTime() < minValidEndTime.getTime()) {
        Alert.alert("Invalid End Time", "End time must be at least 30 minutes after start time.");
        return;
      }
      setEndTime(newTime);
    }
  };

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
        setLocation(locationString)
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

  const handleCreateMatch = () => {
    if (!location) {
      Alert.alert(
        'Location Required',
        'Please select a location for the match.',
        [{ text: 'OK' }]
      )
      return
    }

    if (matchDate < new Date()) {
      Alert.alert(
        'Invalid Date',
        'Please select a future date for the match.',
        [{ text: 'OK' }]
      )
      return
    }

    // TODO: Implement Firebase match creation
    console.log('Creating match:', {
      matchDate,
      startTime,
      endTime,
      location,
      locationCoords,
      skillLevel,
      playersNeeded,
      courtType,
      notes
    })
    router.back()
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Create New Match</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {/* Date and Time Selection */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Date & Time</ThemedText>
            <ThemedView style={styles.dateTimeContainer}>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={24} color="#007AFF" />
                <ThemedText>{formatDate(matchDate)}</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.buttonsSpacing} />
            <ThemedView style={styles.dateTimeContainer}>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Ionicons name="time" size={24} color="#007AFF" />
                <ThemedText>{formatTime(startTime)}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Ionicons name="hourglass" size={24} color="#007AFF" />
                <ThemedText>{formatTime(endTime)}</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Location */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Location</ThemedText>
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
                placeholder='Search for tennis courts...'
                onPress={(data, details = null) => {
                  setLocation(data.description)
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
                    skillLevel === level && styles.skillLevelTextActive,
                    { fontSize: 12 }
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          {/* Players Needed */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Players Needed</ThemedText>
            <ThemedView style={styles.playersContainer}>
              <TouchableOpacity
                style={styles.playersButton}
                onPress={() => setPlayersNeeded(Math.max(1, playersNeeded - 1))}
              >
                <Ionicons name="remove" size={24} color="#007AFF" />
              </TouchableOpacity>
              <ThemedText style={styles.playersCount}>{playersNeeded}</ThemedText>
              <TouchableOpacity
                style={styles.playersButton}
                onPress={() => setPlayersNeeded(Math.min(4, playersNeeded + 1))}
              >
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Court Type */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Court Type</ThemedText>
            <ThemedView style={styles.courtTypeContainer}>
              {['indoor', 'outdoor'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.courtTypeButton,
                    courtType === type && styles.courtTypeButtonActive
                  ]}
                  onPress={() => setCourtType(type)}
                >
                  <ThemedText style={[
                    styles.courtTypeText,
                    courtType === type && styles.courtTypeTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          {/* Notes */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Additional Notes</ThemedText>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any additional details about the match..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </ThemedView>

          {/* Create Button */}
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateMatch}
          >
            <ThemedText style={styles.createButtonText}>Create Match</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <ThemedView style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <DateTimePicker
              value={matchDate}
              mode="date"
              display="spinner" // Use spinner for modal display on iOS
              onChange={handleDateChange}
              minimumDate={(() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow;
              })()}
              maximumDate={(() => {
                const oneMonthLater = new Date();
                oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
                return oneMonthLater;
              })()}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDatePicker(false)}>
              <ThemedText style={styles.closeButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showStartTimePicker}
        onRequestClose={() => setShowStartTimePicker(false)}
      >
        <ThemedView style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <DateTimePicker
              value={startTime}
              mode="time"
              display="spinner" // Use spinner for modal display on iOS
              onChange={handleStartTimeChange}
              minuteInterval={30} // Allow only 30-minute intervals
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowStartTimePicker(false)}>
              <ThemedText style={styles.closeButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* End Time Picker Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showEndTimePicker}
        onRequestClose={() => setShowEndTimePicker(false)}
      >
        <ThemedView style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <DateTimePicker
              value={endTime}
              mode="time"
              display="spinner" // Use spinner for modal display on iOS
              onChange={handleEndTimeChange}
              minuteInterval={30} // Allow only 30-minute intervals
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowEndTimePicker(false)}>
              <ThemedText style={styles.closeButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  )
}

export default CreateMatch

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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
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
  },
  skillLevelTextActive: {
    color: 'white',
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  playersButton: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  playersCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  courtTypeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  courtTypeButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  courtTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  courtTypeText: {
    fontWeight: 'bold',
  },
  courtTypeTextActive: {
    color: 'white',
  },
  notesInput: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
    height: '100%', // Explicitly ensure full height
    width: '100%',  // Explicitly ensure full width
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsSpacing: {
    height: 10,
  },
}) 