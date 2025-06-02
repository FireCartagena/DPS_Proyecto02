import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';

function EventCard({ event, onPress, onRSVP, isUserAttending }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.details}>Fecha: {event.date} - Hora: {event.time}</Text>
      <Text style={styles.details}>Ubicación: {event.location}</Text>
      <Text style={styles.attendees}>Asistentes: {event.attendees.length}</Text>
      <Button
        title={isUserAttending ? "Desapuntarse" : "Confirmar Asistencia (RSVP)"}
        onPress={onRSVP}
        color={isUserAttending ? "#dc3545" : "#28a745"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  attendees: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 5,
    marginBottom: 10,
  },
});

export default EventCard;