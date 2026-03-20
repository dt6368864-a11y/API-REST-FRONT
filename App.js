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
import TaskScreen from './screens/TaskScreen'; // Asegúrate que el archivo exista

const NavigationWrapper = () => {
    const { userToken, userData, logout, isLoading } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState('list'); // 'list' o 'create'
    const [selectedTask, setSelectedTask] = useState(null); // Para editar

    // Función para cargar tareas desde Django
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

    // Función para abrir el formulario de edición
    const handleEdit = (tarea) => {
        setSelectedTask(tarea);
        setView('create'); // Cambiamos a la vista de creación/edición
    };

    // Función para abrir el formulario de nueva tarea
    const handleNew = () => {
        setSelectedTask(null);
        setView('create');
    };

    if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
    if (!userToken) return <LoginScreen />;
    
    // Mostramos TaskScreen si la vista es 'create'
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
                    {/* FOTO DEL USUARIO (desde Django/Cloudinary) */}
                    <Image 
                        source={{ uri: userData?.foto_url || 'https://via.placeholder.com/50' }} 
                        style={styles.avatar} 
                    />
                    <Text style={styles.welcome}>Hola, {userData?.nombre || 'Usuario'}</Text>
                </View>
                <Button title="Salir" onPress={logout} color="red" />
            </View>

            {/* BOTÓN PARA NUEVA TAREA */}
            <TouchableOpacity style={styles.btnNueva} onPress={handleNew}>
                <Text style={styles.btnText}>+ NUEVA TAREA</Text>
            </TouchableOpacity>

            {/* LISTA DE TAREAS CORREGIDA */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.taskTitle}>{item.titulo}</Text>
                            <Text numberOfLines={1}>{item.descripcion}</Text>
                        </View>
                        
                        {/* CONTENEDOR DE ACCIONES (LADO DERECHO) */}
                        <View style={styles.actionsContainer}>
                            {/* BOTÓN EDITAR */}
                            <TouchableOpacity onPress={() => handleEdit(item)}>
                                <Text style={styles.btnEdit}>Editar</Text>
                            </TouchableOpacity>
                            
                            {/* BOTÓN ELIMINAR */}
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
    // Tarjeta de tarea
    card: { 
        padding: 15, 
        backgroundColor: 'white', 
        marginBottom: 10, 
        borderRadius: 8, 
        flexDirection: 'row', 
        alignItems: 'center', 
        elevation: 2 
    },
    taskTitle: { fontWeight: 'bold', fontSize: 16 },
    // Acciones de la tarjeta
    actionsContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginLeft: 10 
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