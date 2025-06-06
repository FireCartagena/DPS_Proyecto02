import 'react-native-get-random-values';
import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';  
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from './context/UserContext'; 

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <SafeAreaView style={{ flex: 1 }}>                         
        <AppNavigator />
        </SafeAreaView>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
