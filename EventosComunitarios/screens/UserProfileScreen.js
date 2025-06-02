import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getEvents, getUsers } from '../utils/storage';
import EventCard from '../components/EventCard'; // Reutilizamos el componente EventCard

function UserProfileScreen({ route }) {
  const { currentUser } = route.params; // El usuario actualmente logueado
  const navigation = useNavigation();

  const [attendedEvents, setAttendedEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [totalComments, setTotalComments] = useState(0);

  const fetchUserData = async () => {
    const allEvents = await getEvents();
    const allUsers = await getUsers(); // Por si necesitamos buscar detalles adicionales de usuarios

    // Eventos a los que el usuario asistió (pasados o futuros)
    const userAttendedEvents = allEvents.filter(event => event.attendees.includes(currentUser.id));
    setAttendedEvents(userAttendedEvents.sort((a, b) => new Date(b.date) - new Date(a.date))); // Ordenar por fecha descendente

    // Eventos que el usuario organizó
    const userOrganizedEvents = allEvents.filter(event => event.organizerId === currentUser.id);
    setOrganizedEvents(userOrganizedEvents.sort((a, b) => new Date(b.date) - new Date(a.date))); // Ordenar por fecha descendente

    // Contar el total de comentarios del usuario
    let commentsCount = 0;
    allEvents.forEach(event => {
      event.comments.forEach(comment => {
        if (comment.userId === currentUser.id) {
          commentsCount++;
        }
      });
    });
    setTotalComments(commentsCount);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [currentUser.id]) // Vuelve a cargar si el usuario cambia (aunque en este caso no debería)
  );

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí",
          onPress: () => {
            // Aquí deberías limpiar cualquier token de sesión o estado de usuario
            // Por ahora, simplemente navegamos a la pantalla de autenticación
            navigation.replace('Auth');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.username}>{currentUser.username}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas</Text>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Eventos Asistidos:</Text>
          <Text style={styles.statValue}>{attendedEvents.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Eventos Organizados:</Text>
          <Text style={styles.statValue}>{organizedEvents.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Comentarios Publicados:</Text>
          <Text style={styles.statValue}>{totalComments}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus Eventos Organizados</Text>
        {organizedEvents.length > 0 ? (
          <FlatList
            data={organizedEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => navigation.navigate('EventDetail', { event: item, currentUser })}
                // No hay RSVP aquí, ya que el usuario es el organizador
                isUserAttending={item.attendees.includes(currentUser.id)}
              />
            )}
            scrollEnabled={false} // Para que la ScrollView principal maneje el desplazamiento
            ListEmptyComponent={<Text style={styles.noEventsText}>No has organizado ningún evento.</Text>}
          />
        ) : (
          <Text style={styles.noEventsText}>No has organizado ningún evento.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos a los que Asististe (o Asistirás)</Text>
        {attendedEvents.length > 0 ? (
          <FlatList
            data={attendedEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => navigation.navigate('EventDetail', { event: item, currentUser })}
                // No hay RSVP en el perfil, ya que el usuario ya ha interactuado
                isUserAttending={item.attendees.includes(currentUser.id)}
              />
            )}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.noEventsText}>Aún no has confirmado asistencia a ningún evento.</Text>}
          />
        ) : (
          <Text style={styles.noEventsText}>Aún no has confirmado asistencia a ningún evento.</Text>
        )}
      </View>

      <Button title="Cerrar Sesión" onPress={handleLogout} color="#dc3545" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#555',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default UserProfileScreen;