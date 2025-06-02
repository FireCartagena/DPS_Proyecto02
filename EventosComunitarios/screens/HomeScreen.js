import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getEvents, saveEvents } from '../utils/storage';
import EventCard from '../components/EventCard'; // Componente para mostrar cada evento

function HomeScreen({ route }) {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { currentUser } = route.params; // Recibe el usuario logueado

  const fetchEvents = async () => {
    setRefreshing(true);
    const allEvents = await getEvents();
    // Filtra eventos próximos (asumiendo formato 'YYYY-MM-DD')
    const now = new Date();
    const upcoming = allEvents.filter(event => new Date(event.date) >= now);
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordenar por fecha
    setEvents(upcoming);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const handleRSVP = async (eventId) => {
    const allEvents = await getEvents();
    const updatedEvents = allEvents.map(event => {
      if (event.id === eventId) {
        if (event.attendees.includes(currentUser.id)) {
          // Ya está apuntado, se desapunta
          Alert.alert("Información", "Ya estás apuntado a este evento. ¿Deseas desapuntarte?");
          return { ...event, attendees: event.attendees.filter(id => id !== currentUser.id) };
        } else {
          // Se apunta
          return { ...event, attendees: [...event.attendees, currentUser.id] };
        }
      }
      return event;
    });
    await saveEvents(updatedEvents);
    fetchEvents(); // Actualiza la lista
    Alert.alert("Éxito", "Tu asistencia ha sido actualizada.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Hola, {currentUser?.username || 'Invitado'}!</Text>
      <Button
        title="Crear Nuevo Evento"
        onPress={() => navigation.navigate('CreateEvent', { currentUser })}
      />
      <Button
        title="Ver Historial de Eventos"
        onPress={() => navigation.navigate('PastEvents', { currentUser })}
      />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('EventDetail', { event: item, currentUser })}
            onRSVP={() => handleRSVP(item.id)}
            isUserAttending={item.attendees.includes(currentUser.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.noEventsText}>No hay eventos próximos.</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f2f5',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;