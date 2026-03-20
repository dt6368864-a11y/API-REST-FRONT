import React, { useContext, useState, useEffect } from 'react';
import { 
    StyleSheet, Text, View, Button, ActivityIndicator, 
    FlatList, SafeAreaView, Image, TouchableOpacity 
} from 'react-native';
import { AuthProvider, AuthContext } from './context/authContext';
import { taskApiservice } from './src/api/apiService';
import LoginScreen from './screens/LoginScreen';
import TaskScreen from './screens/TaskScreen';

const NavigationWrapper = () => {
    const { userToken, userData, logout, isLoading } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState('list');
    const [selectedTask, setSelectedTask] = useState(null);

    const cargarTareas = () => {
        if (userToken) {
            taskApiservice.getAll(userToken)
                .then(res => setTasks(res.datos || []))
                .catch(err => console.log(err));
        }
    };

    useEffect(() => { cargarTareas(); }, [userToken]);

    if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
    if (!userToken) return <LoginScreen />;
    
    if (view === 'create') {
        return (
            <TaskScreen 
                taskToEdit={selectedTask} 
                onBack={() => { 
                    setView('list'); 
                    cargarTareas(); 
                }} 
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: userData?.foto_url || 'https://via.placeholder.com/50' }} style={styles.avatar} />
                    <Text style={styles.welcome}>Hola, {userData?.nombre || 'Usuario'}</Text>
                </View>
                <Button title="Salir" onPress={logout} color="red" />
            </View>

            <TouchableOpacity 
                style={styles.btnNueva} 
                onPress={() => { setSelectedTask(null); setView('create'); }}
            >
                <Text style={styles.btnText}>+ NUEVA TAREA</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => { setSelectedTask(item); setView('create'); }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.taskTitle}>{item.titulo}</Text>
                            <Text style={styles.taskDesc}>{item.descripcion}</Text>
                        </View>
                        <Text style={{ color: 'blue', fontWeight: 'bold' }}>Ver/Editar</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 50, marginBottom: 10, alignItems: 'center' },
    avatar: { width: 45, height: 45, borderRadius: 22, marginRight: 10 },
    welcome: { fontSize: 18, fontWeight: 'bold' },
    btnNueva: { backgroundColor: 'green', padding: 15, borderRadius: 10, marginVertical: 20, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' },
    card: { 
        padding: 15, backgroundColor: 'white', marginBottom: 12, 
        borderRadius: 12, flexDirection: 'row', alignItems: 'center', elevation: 3 
    },
    taskTitle: { fontWeight: 'bold', fontSize: 17, marginBottom: 5 },
    taskDesc: { fontSize: 14, color: '#666' }
});

export default function App() {
    return (
        <AuthProvider>
            <NavigationWrapper />
        </AuthProvider>
    );
}