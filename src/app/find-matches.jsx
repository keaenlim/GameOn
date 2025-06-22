import { useState, useCallback } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, Alert, View, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import DateTimePicker from '@react-native-community/datetimepicker'

import { GOOGLE_PLACES_API_KEY } from '../utils/config'

import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"

const FindMatches = () => {
  const router = useRouter()
  const [searchLocation, setSearchLocation] = useState('')
  const [searchLocationCoords, setSearchLocationCoords] = useState(null)
  const [searchSkillLevel, setSearchSkillLevel] = useState(null) // null for all skills
  const [searchDate, setSearchDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [searchTimeSlot, setSearchTimeSlot] = useState(null); // null for 'All'

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || searchDate;
    setShowDatePicker(false);
    setSearchDate(currentDate);
  };

  const handleSearchMatches = () => {
    // TODO: Implement actual search logic using searchLocation, searchSkillLevel, searchDate
    Alert.alert(
      'Search Matches',
      `Searching for:
      Location: ${searchLocation || 'Any'}
      Skill Level: ${searchSkillLevel || 'Any'}
      Date: ${searchDate.toDateString()}
      Time: ${searchTimeSlot || 'Any'}`
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Find Matches</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {/* Location Filter */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Location</ThemedText>
            <View style={styles.locationContainer}>
              <GooglePlacesAutocomplete
                placeholder='Search for a location...'
                onPress={(data, details = null) => {
                  setSearchLocation(data.description)
                  setSearchLocationCoords({
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

          {/* Skill Level Filter */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Skill Level</ThemedText>
            <ThemedView style={styles.skillLevelContainer}>
              {[null, 'beginner', 'intermediate', 'advanced'].map((level) => (
                <TouchableOpacity
                  key={level === null ? 'all' : level}
                  style={[
                    styles.skillLevelButton,
                    searchSkillLevel === level && styles.skillLevelButtonActive
                  ]}
                  onPress={() => setSearchSkillLevel(level)}
                >
                  <ThemedText style={[
                    styles.skillLevelText,
                    searchSkillLevel === level && styles.skillLevelTextActive
                  ]}>
                    {level === null ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          {/* Date Filter */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Date</ThemedText>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <ThemedText>{searchDate.toDateString()}</ThemedText>
            </TouchableOpacity>
            <Modal
              transparent={true}
              animationType="fade"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DateTimePicker
                    value={searchDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                  <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.closeButton}>
                    <ThemedText style={styles.closeButtonText}>Done</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ThemedView>

          {/* Time Slot Filter */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Time Slot</ThemedText>
            <ThemedView style={styles.skillLevelContainer}>
              {[null, 'morning', 'afternoon', 'evening', 'late night'].map((slot) => (
                <TouchableOpacity
                  key={slot === null ? 'all' : slot}
                  style={[
                    styles.skillLevelButton,
                    searchTimeSlot === slot && styles.skillLevelButtonActive
                  ]}
                  onPress={() => setSearchTimeSlot(slot)}
                >
                  <ThemedText style={[
                    styles.skillLevelText,
                    searchTimeSlot === slot && styles.skillLevelTextActive
                  ]}>
                    {slot === null ? 'All' : slot.charAt(0).toUpperCase() + slot.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchMatches}
          >
            <ThemedText style={styles.searchButtonText}>Search Matches</ThemedText>
          </TouchableOpacity>
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
          {/* TODO: Add notification badge logic here (similar to messages.jsx if applicable) */}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

export default FindMatches

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
  locationContainer: {
    position: 'relative',
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
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  skillLevelButton: {
    width: '45%',
    marginVertical: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
  datePickerButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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