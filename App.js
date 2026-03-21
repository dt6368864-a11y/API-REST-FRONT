import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importamos para guardar en disco

import { AuthProvider, AuthContext } from './context/authContext';
import LoginScreen from './screens/LoginScreen';
import TaskScreen from './screens/TaskScreen';
import HomeScreen from './screens/HomeScreen';
import PhotoScreen from './screens/DashboardScreen'; 

const NavigationWrapper = () => {
  const { userToken, isLoading, userData } = useContext(AuthContext); // Extraemos userData para el UID
  const [currentView, setCurrentView] = useState('home');
  const [profileImageURI, setProfileImageURI] = useState(null);

  // EFECTO: Carga la foto guardada cuando el usuario inicia sesión
  useEffect(() => {
    const loadSavedImage = async () => {
      const uid = userData?.uid || userData?.localId;
      if (uid) {
        const savedImage = await AsyncStorage.getItem(`profileImage_${uid}`);
        if (savedImage) {
          setProfileImageURI(savedImage);
        }
      }
    };
    loadSavedImage();
  }, [userData]); // Se dispara cuando el usuario cambia o entra

  // FUNCIÓN: Guarda la foto permanentemente al actualizarla
  const handleImageUpdate = async (uri) => {
    setProfileImageURI(uri); // Actualiza la vista
    const uid = userData?.uid || userData?.localId;
    if (uid) {
      try {
        await AsyncStorage.setItem(`profileImage_${uid}`, uri); // Guarda en el teléfono
      } catch (e) {
        console.log("Error al guardar imagen local:", e);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#39A900" />
      </View>
    );
  }

  if (!userToken) {
    return <LoginScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {currentView === 'home' && (
        <HomeScreen onNavigate={setCurrentView} currentImageURI={profileImageURI} />
      )}

      {currentView === 'tasks' && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setCurrentView('home')} style={styles.backBtn}>
            <Text style={styles.backText}>← Volver al Inicio</Text>
          </TouchableOpacity>
          <TaskScreen />
        </View>
      )}

      {currentView === 'photo' && (
        <PhotoScreen 
            onNavigate={setCurrentView} 
            currentImageURI={profileImageURI} 
            onImageUpdate={handleImageUpdate} // Usamos la nueva función de guardado
        />
      )}
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationWrapper />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { marginTop: 50, marginLeft: 20, marginBottom: 10 },
  backText: { color: '#39A900', fontWeight: 'bold', fontSize: 16 }
});