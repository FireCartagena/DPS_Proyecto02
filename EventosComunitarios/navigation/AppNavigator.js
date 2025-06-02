import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa tus pantallas
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import PastEventsScreen from '../screens/PastEventsScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Eventos Próximos' }} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Crear Evento' }} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Detalles del Evento' }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Mi Perfil' }} />
        <Stack.Screen name="PastEvents" component={PastEventsScreen} options={{ title: 'Historial de Eventos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;