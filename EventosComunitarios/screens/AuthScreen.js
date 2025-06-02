import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUsers, saveUsers } from '../utils/storage';
import 'react-native-get-random-values'; // Import for uuid
import { v4 as uuidv4 } from 'uuid';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Solo para registro
  const navigation = useNavigation();

  const handleAuth = async () => {
    const users = await getUsers();

    if (isLogin) {
      // Lógica de inicio de sesión
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        Alert.alert("Éxito", "Sesión iniciada correctamente.");
        // Aquí podrías guardar el usuario logueado en un estado global o contexto
        navigation.navigate('Home', { currentUser: user }); // Pasa el usuario logueado
      } else {
        Alert.alert("Error", "Usuario o contraseña incorrectos.");
      }
    } else {
      // Lógica de registro
      if (users.some(u => u.username === username)) {
        Alert.alert("Error", "El nombre de usuario ya existe.");
        return;
      }
      if (!username || !password || !email) {
        Alert.alert("Error", "Por favor, completa todos los campos.");
        return;
      }

      const newUser = {
        id: uuidv4(), // Genera un ID único
        username,
        password,
        email,
        socialId: null
      };
      const updatedUsers = [...users, newUser];
      await saveUsers(updatedUsers);
      Alert.alert("Éxito", "Usuario registrado correctamente. ¡Ahora inicia sesión!");
      setIsLogin(true); // Vuelve a la pantalla de inicio de sesión
      setUsername('');
      setPassword('');
      setEmail('');
    }
  };

  const handleSocialLogin = (platform) => {
    Alert.alert("Integración Social", `Simulando inicio de sesión con ${platform}. En una app real, integrarías SDKs de Facebook/Google.`);
    // Aquí iría la lógica real de integración con SDKs de redes sociales (Facebook SDK, Google Sign-In)
    // Tras el éxito, navegar a 'Home'
    navigation.navigate('Home', { currentUser: { id: 'socialUser1', username: 'SocialUser', email: 'social@example.com' } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={isLogin ? 'Iniciar Sesión' : 'Registrarse'} onPress={handleAuth} />

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>o</Text>

      <Button title="Continuar con Google" onPress={() => handleSocialLogin('Google')} />
      <Button title="Continuar con Facebook" onPress={() => handleSocialLogin('Facebook')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  toggleButton: {
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  orText: {
    marginVertical: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default AuthScreen;