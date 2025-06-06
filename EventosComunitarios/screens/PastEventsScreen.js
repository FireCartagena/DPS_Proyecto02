import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getEvents } from '../utils/storage';
import EventCard from '../components/EventCard'; // Reutilizamos el componente EventCard
import { UserContext } from '../context/UserContext';

function PastEventsScreen() {
  const { currentUser } = useContext(UserContext);
  const [pastEvents, setPastEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          Por favor, inicia sesión para ver los eventos pasados.
        </Text>
      </View>
    );
  }

  const fetchPastEvents = async () => {
    setRefreshing(true);
    const allEvents = await getEvents();
    const now = new Date();
    // Filtra eventos pasados y aquellos a los que el usuario asistió
    const past = allEvents.filter(event => new Date(event.date) < now);
    past.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por fecha descendente
    setPastEvents(past);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPastEvents();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Eventos Pasados</Text>
      <FlatList
        data={pastEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('EventDetail', { event: item, currentUser })}
            // No hay RSVP para eventos pasados, así que no se pasa onRSVP
            isUserAttending={item.attendees.includes(currentUser.id)} // Mostrar si asistió
          />
        )}
        ListEmptyComponent={<Text style={styles.noEventsText}>No hay eventos pasados registrados.</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchPastEvents} />
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default PastEventsScreen;
