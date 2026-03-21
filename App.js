import React, { useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';

import { AuthProvider, AuthContext } from './context/authContext';
import LoginScreen from './screens/LoginScreen';
import TaskScreen from './screens/TaskScreen';
import HomeScreen from './screens/HomeScreen';
import PhotoScreen from './screens/DashboardScreen'; // dashboard.js en tu imagen se llama DashboardScreen.js

const NavigationWrapper = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('home');
  const [profileImageURI, setProfileImageURI] = useState(null);

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
            onImageUpdate={setProfileImageURI} 
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
//original