import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { scheduleDailyMedicineNotification } from '../Services/Notification';

export default function AddMedicineScreen() {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async function onSave() {
    const timeHHMM = formatTime(date);

    if (
      !name.trim() ||
      !dose.trim() ||
      !/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeHHMM)
    ) {
      Alert.alert('Error', 'Please fill name, dose and time (HH:MM) correctly');
      return;
    }

    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add medicines.');
      return;
    }

    const med = {
      id: Date.now().toString(),
      name: name.trim(),
      dose: dose.trim(),
      timeHHMM,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('medicines')
        .doc(med.id)
        .set(med);

      scheduleDailyMedicineNotification(med);

      setName('');
      setDose('');
      setDate(new Date());

      Alert.alert(
        'Saved',
        `Medicine "${med.name}" added. Daily reminder scheduled!`
      );

      console.log('saved medicine to firestore:', med);
    } catch (error) {
      console.error('Error saving medicine to firestore:', error);
      Alert.alert(
        'Error',
        'There was an error saving your medicine. Please try again later.'
      );
    }
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Add Medicine</Text>

      {/* Medicine name */}
      <TextInput
        style={styles.input}
        placeholder="Medicine-Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={'#999'}
      />

      {/* Dose + Time row */}
       <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Dose"
          value={dose}
          onChangeText={setDose}
          placeholderTextColor={'#999'}
        />

        
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.timeButtonText}>
            {date ? formatTime(date) : 'Select Time'}
          </Text>
        </TouchableOpacity> 
      </View>

      {/* Show time picker when button clicked */}
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}  

    

      {/* Save button */}
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>💾 Save & Schedule</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: '#FFEFD5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4d4e50ff',
    borderRadius: 10,
    padding: 12,
    fontWeight: 'normal',
    marginBottom: 0, // handled by row spacing
  },
  button: {
    backgroundColor: '#073391ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeButton: {
    backgroundColor: '#073391ff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  timeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});