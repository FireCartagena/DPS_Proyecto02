import usersData from '../data/users.json';
import eventsData from '../data/events.json';
import * as FileSystem from 'expo-file-system'; // Solo para Expo, para escribir en archivos
import { Alert } from 'react-native';

const USERS_FILE_URI = FileSystem.documentDirectory + 'users.json';
const EVENTS_FILE_URI = FileSystem.documentDirectory + 'events.json';

// Inicializa los archivos si no existen (solo la primera vez que se ejecuta la app)
async function initializeFiles() {
  try {
    const usersInfo = await FileSystem.getInfoAsync(USERS_FILE_URI);
    if (!usersInfo.exists) {
      await FileSystem.writeAsStringAsync(USERS_FILE_URI, JSON.stringify(usersData, null, 2));
    }
    const eventsInfo = await FileSystem.getInfoAsync(EVENTS_FILE_URI);
    if (!eventsInfo.exists) {
      await FileSystem.writeAsStringAsync(EVENTS_FILE_URI, JSON.stringify(eventsData, null, 2));
    }
  } catch (error) {
    console.error('Error inicializando archivos:', error);
  }
}

// Llama a esta función al inicio de tu App.js o en un efecto de carga
initializeFiles();

export const getUsers = async () => {
  try {
    const jsonString = await FileSystem.readAsStringAsync(USERS_FILE_URI);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error al leer usuarios:', error);
    return [];
  }
};

export const saveUsers = async (users) => {
  try {
    await FileSystem.writeAsStringAsync(USERS_FILE_URI, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    Alert.alert("Error", "No se pudieron guardar los datos de usuario.");
  }
};

export const getEvents = async () => {
  try {
    const jsonString = await FileSystem.readAsStringAsync(EVENTS_FILE_URI);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error al leer eventos:', error);
    return [];
  }
};

export const saveEvents = async (events) => {
  try {
    await FileSystem.writeAsStringAsync(EVENTS_FILE_URI, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error al guardar eventos:', error);
    Alert.alert("Error", "No se pudieron guardar los datos del evento.");
  }
};