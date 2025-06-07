import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { UserContext } from '../context/UserContext';

// Pantallas
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import PastEventsScreen from '../screens/PastEventsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { currentUser } = useContext(UserContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = 'home-outline'; break;
            case 'CreateEvent': iconName = 'add-circle-outline'; break;
            case 'UserProfile': iconName = 'person-circle-outline'; break;
            case 'PastEvents': iconName = 'time-outline'; break;
            default: iconName = 'ellipse-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CreateEvent" component={CreateEventScreen} />
      <Tab.Screen name="PastEvents" component={PastEventsScreen} />
      <Tab.Screen name="UserProfile" component={UserProfileScreen} />

    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default AppNavigator;
