import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { AuthProvider, AuthContext } from './context/authContext';
import { taskApiservice } from './src/api/apiService';
import LoginScreen from './screens/LoginScreen';
import TaskScreen from './screens/TaskScreen'; // Asegúrate que el archivo exista

const NavigationWrapper = () => {
    const { userToken, userData, logout, isLoading } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState('list'); // 'list' o 'create'

    const cargarTareas = () => {
        if (userToken) {
            taskApiservice.getAll(userToken)
                .then(res => setTasks(res.datos || []))
                .catch(err => console.log(err));
        }
    };

    useEffect(() => { cargarTareas(); }, [userToken]);

    const confirmarEliminar = (id) => {
        Alert.alert("Eliminar", "¿Borrar esta tarea?", [
            { text: "No" },
            { text: "Sí", onPress: () => {
                taskApiservice.delete(userToken, id).then(() => cargarTareas());
            }}
        ]);
    };

    if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
    if (!userToken) return <LoginScreen />;
    if (view === 'create') return <TaskScreen onBack={() => { setView('list'); cargarTareas(); }} />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* FOTO DEL USUARIO */}
                    <Image 
                        source={{ uri: userData?.foto_url || 'https://via.placeholder.com/50' }} 
                        style={styles.avatar} 
                    />
                    <Text style={styles.welcome}>Hola, {userData?.nombre || 'Usuario'}</Text>
                </View>
                <Button title="Salir" onPress={logout} color="red" />
            </View>

            <TouchableOpacity style={styles.btnNueva} onPress={() => setView('create')}>
                <Text style={styles.btnText}>+ NUEVA TAREA</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
                            <Text>{item.descripcion}</Text>
                        </View>
                        <TouchableOpacity onPress={() => confirmarEliminar(item.id)}>
                            <Text style={{ color: 'red' }}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, alignItems: 'center' },
    avatar: { width: 45, height: 45, borderRadius: 22, marginRight: 10 },
    welcome: { fontSize: 18, fontWeight: 'bold' },
    btnNueva: { backgroundColor: 'green', padding: 15, borderRadius: 10, marginVertical: 20, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' },
    card: { padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }
});

export default function App() {
    return (
        <AuthProvider>
            <NavigationWrapper />
        </AuthProvider>
    );
}