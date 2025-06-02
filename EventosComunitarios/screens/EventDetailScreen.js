import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TextInput, Alert, Share } from 'react-native';
import { getEvents, saveEvents, getUsers } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

function EventDetailScreen({ route }) {
  const { event, currentUser } = route.params;
  const [currentEvent, setCurrentEvent] = useState(event);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0); // Para calificaciones (1-5 estrellas)
  const [organizerName, setOrganizerName] = useState('Cargando...');

  const isUserAttending = currentEvent.attendees.includes(currentUser.id);

  const fetchEventDetails = async () => {
    const allEvents = await getEvents();
    const foundEvent = allEvents.find(e => e.id === event.id);
    if (foundEvent) {
      setCurrentEvent(foundEvent);
    }
    const allUsers = await getUsers();
    const organizer = allUsers.find(u => u.id === foundEvent.organizerId);
    if (organizer) {
      setOrganizerName(organizer.username);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEventDetails();
    }, [event.id])
  );

  const handleRSVP = async () => {
    const allEvents = await getEvents();
    const updatedEvents = allEvents.map(e => {
      if (e.id === currentEvent.id) {
        if (e.attendees.includes(currentUser.id)) {
          // Desapuntar
          return { ...e, attendees: e.attendees.filter(id => id !== currentUser.id) };
        } else {
          // Apuntar
          return { ...e, attendees: [...e.attendees, currentUser.id] };
        }
      }
      return e;
    });
    await saveEvents(updatedEvents);
    fetchEventDetails(); // Refrescar los detalles del evento
    Alert.alert("Éxito", "Tu asistencia ha sido actualizada.");
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Error", "El comentario no puede estar vacío.");
      return;
    }
    if (rating === 0) {
        Alert.alert("Error", "Por favor, selecciona una calificación.");
        return;
    }

    const newComment = {
      userId: currentUser.id,
      username: currentUser.username, // Para mostrar el nombre en el comentario
      comment: commentText.trim(),
      rating: rating,
      timestamp: new Date().toISOString()
    };

    const allEvents = await getEvents();
    const updatedEvents = allEvents.map(e => {
      if (e.id === currentEvent.id) {
        return { ...e, comments: [...e.comments, newComment] };
      }
      return e;
    });
    await saveEvents(updatedEvents);
    setCommentText('');
    setRating(0);
    fetchEventDetails(); // Refrescar los comentarios
    Alert.alert("Éxito", "Comentario añadido y calificación registrada.");
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `¡Únete a este evento comunitario! ${currentEvent.title} el ${currentEvent.date} en ${currentEvent.location}. Descubre más en nuestra app.`,
        url: 'https://example.com/event/' + currentEvent.id // URL ficticia, en una app real sería un deep link
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con actividad específica
        } else {
          // Compartido
        }
      } else if (result.action === Share.dismissedAction) {
        // Descartado
      }
    } catch (error) {
      Alert.alert('Error al compartir', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{currentEvent.title}</Text>
      <Text style={styles.organizer}>Organizado por: {organizerName}</Text>
      <Text style={styles.details}>Fecha: {currentEvent.date}</Text>
      <Text style={styles.details}>Hora: {currentEvent.time}</Text>
      <Text style={styles.details}>Ubicación: {currentEvent.location}</Text>
      <Text style={styles.description}>{currentEvent.description}</Text>

      <Text style={styles.attendeesCount}>Asistentes confirmados: {currentEvent.attendees.length}</Text>
      <Button
        title={isUserAttending ? "Desapuntarse del Evento" : "Confirmar Asistencia (RSVP)"}
        onPress={handleRSVP}
        color={isUserAttending ? "#dc3545" : "#28a745"}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compartir Evento</Text>
        <Button title="Compartir en Redes Sociales" onPress={onShare} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comentarios y Calificaciones</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Añade tu comentario..."
          multiline
          value={commentText}
          onChangeText={setCommentText}
        />
        <View style={styles.ratingContainer}>
          <Text>Calificación:</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.star, rating >= star && styles.filledStar]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Enviar Comentario y Calificación" onPress={handleSubmitComment} />

        <View style={styles.commentsList}>
          {currentEvent.comments.length > 0 ? (
            currentEvent.comments.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <Text style={styles.commentUser}>{comment.username} ({'★'.repeat(comment.rating)}):</Text>
                <Text style={styles.commentText}>{comment.comment}</Text>
                <Text style={styles.commentTimestamp}>{new Date(comment.timestamp).toLocaleString()}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>Aún no hay comentarios.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  organizer: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  description: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 20,
    lineHeight: 24,
    color: '#444',
  },
  attendeesCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  section: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  star: {
    fontSize: 24,
    color: '#ccc',
    marginHorizontal: 2,
  },
  filledStar: {
    color: '#ffc107', // Color de estrella llena (dorado)
  },
  commentsList: {
    marginTop: 15,
  },
  commentItem: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
  },
  commentText: {
    fontSize: 15,
    color: '#444',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'right',
  },
  noCommentsText: {
    fontStyle: 'italic',
    color: '#666',
  },
});

export default EventDetailScreen;