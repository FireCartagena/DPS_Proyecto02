import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Para Android y iOS nativo
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Opcional, para un picker más personalizable en iOS
import { getEvents, saveEvents } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from '../context/UserContext';

function CreateEventScreen({ route }) {
  const { currentUser } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const navigation = useNavigation();

  // Validación si no hay usuario logueado
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>Por favor, inicia sesión para crear eventos.</Text>
      </View>
    );
  }
  
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // En iOS, el picker se cierra solo si es modal
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleCreateEvent = async () => {
    if (!title || !description || !location) {
      Alert.alert("Error", "Por favor, completa todos los campos del evento.");
      return;
    }

    const newEvent = {
      id: uuidv4(),
      title,
      description,
      date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      time: time.toTimeString().split(' ')[0].substring(0, 5), // Formato HH:MM
      location,
      organizerId: currentUser.id,
      attendees: [],
      comments: []
    };

    const allEvents = await getEvents();
    const updatedEvents = [...allEvents, newEvent];
    await saveEvents(updatedEvents);
    Alert.alert("Éxito", "Evento creado correctamente.");
    navigation.goBack(); // Regresar a la pantalla anterior
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título del Evento:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ej: Feria de Emprendedores"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe el evento en detalle..."
        multiline
      />

      <Text style={styles.label}>Ubicación:</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ej: Parque Central"
      />

      <Text style={styles.label}>Fecha:</Text>
      <Button onPress={() => setShowDatePicker(true)} title="Seleccionar Fecha" />
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <Text style={styles.selectedDateTime}>Fecha seleccionada: {date.toLocaleDateString()}</Text>


      <Text style={styles.label}>Hora:</Text>
      <Button onPress={() => setShowTimePicker(true)} title="Seleccionar Hora" />
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <Text style={styles.selectedDateTime}>Hora seleccionada: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

      <Button title="Crear Evento" onPress={handleCreateEvent} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectedDateTime: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
    color: '#555',
  },
});

export default CreateEventScreen;
