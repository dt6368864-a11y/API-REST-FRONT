// App.js
import React, { useContext, useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Button, 
    ActivityIndicator, 
    FlatList, 
    SafeAreaView, 
    Image, 
    TouchableOpacity, 
    Alert 
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
                .catch(err => console.log("Error al cargar:", err));
        }
    };

    useEffect(() => {
        cargarTareas();
    }, [userToken]);

    const handleEdit = (tarea) => {
        setSelectedTask(tarea);
        setView('create');
    };

    const handleNew = () => {
        setSelectedTask(null);
        setView('create');
    };

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
                    <Image 
                        source={{ uri: userData?.foto_url || 'https://via.placeholder.com/50' }} 
                        style={styles.avatar} 
                    />
                    <Text style={styles.welcome}>Hola, {userData?.nombre || 'Usuario'}</Text>
                </View>
                <Button title="Salir" onPress={logout} color="red" />
            </View>

            <TouchableOpacity style={styles.btnNueva} onPress={handleNew}>
                <Text style={styles.btnText}>+ NUEVA TAREA</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* Se eliminó numberOfLines para que el texto salga completo */}
                        <View style={{ flex: 1 }}>
                            <Text style={styles.taskTitle}>{item.titulo}</Text>
                            <Text style={styles.taskDesc}>{item.descripcion}</Text>
                        </View>
                        
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => handleEdit(item)}>
                                <Text style={styles.btnEdit}>Editar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => {
                                Alert.alert("Eliminar", "¿Borrar esta tarea?", [
                                    { text: "No" },
                                    { text: "Si", onPress: () => {
                                        taskApiservice.delete(userToken, item.id).then(cargarTareas);
                                    }}
                                ]);
                            }}>
                                <Text style={styles.btnDelete}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, alignItems: 'center' },
    avatar: { width: 45, height: 45, borderRadius: 22, marginRight: 10, backgroundColor: '#ddd' },
    welcome: { fontSize: 18, fontWeight: 'bold' },
    btnNueva: { backgroundColor: 'green', padding: 15, borderRadius: 10, marginVertical: 20, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' },
    card: { 
        padding: 15, 
        backgroundColor: 'white', 
        marginBottom: 10, 
        borderRadius: 8, 
        flexDirection: 'row', 
        // Cambiado a flex-start para que los botones queden arriba si el texto es largo
        alignItems: 'flex-start', 
        elevation: 2 
    },
    taskTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    taskDesc: { fontSize: 14, color: '#444' }, // Estilo para la descripción
    actionsContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginLeft: 10,
        marginTop: 5 // Pequeño margen superior para alinear con el título
    },
    btnEdit: { 
        color: 'blue', 
        fontWeight: 'bold', 
        marginRight: 15 
    },
    btnDelete: { 
        color: 'red', 
        fontWeight: 'bold' 
    }
});

export default function App() {
    return (
        <AuthProvider>
            <NavigationWrapper />
        </AuthProvider>
    );
}