import React, { useState, useContext } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert, 
    ActivityIndicator 
} from 'react-native';
import { AuthContext } from '../context/authContext'; // Sube un nivel y entra a context
import { taskApiservice } from '../src/api/apiService'; // Sube un nivel y entra a src/api

const TaskScreen = () => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { userToken } = useContext(AuthContext);

    const handleCreateTask = async () => {
        if (!titulo.trim() || !descripcion.trim()) {
            return Alert.alert("Error", "Por favor, completa todos los campos.");
        }

        setLoading(true);
        
        try {
            const nuevaTarea = {
                titulo: titulo,
                descripcion: descripcion,
                completada: false
            };

            // Usamos tu objeto taskApiservice tal cual me lo pasaste
            const response = await taskApiservice.create(userToken, nuevaTarea);

            if (response) {
                Alert.alert("¡Éxito!", "Tarea guardada correctamente.");
                setTitulo(''); 
                setDescripcion('');
            }
        } catch (error) {
            console.error("Error al crear:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Crear Nueva Tarea</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    placeholder="¿Qué tarea tienes pendiente?"
                    value={titulo}
                    onChangeText={setTitulo}
                />

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Escribe los detalles aquí..."
                    value={descripcion}
                    onChangeText={setDescripcion}
                    multiline={true}
                    numberOfLines={4}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#00ff4c" />
                ) : (
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleCreateTask}
                    >
                        <Text style={styles.buttonText}>GUARDAR TAREA</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 20,
        textAlign: 'center',
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#00ff4c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default TaskScreen;