import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from "../context/authContext";
import { taskApiservice } from '../src/api/apiService';

const TaskScreen = ({ onBack, taskToEdit }) => {
    const { userToken } = useContext(AuthContext);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setTitulo(taskToEdit.titulo);
            setDescripcion(taskToEdit.descripcion);
        }
    }, [taskToEdit]);

    const handleSave = async () => {
        if (!titulo || !descripcion) return Alert.alert("Error", "Campos vacíos");
        setLoading(true);
        try {
            if (taskToEdit) {
                await taskApiservice.update(userToken, taskToEdit.id, { titulo, descripcion });
            } else {
                await taskApiservice.create(userToken, { titulo, descripcion });
            }
            onBack(); // ESTO TE DEVUELVE A LA LISTA AUTOMÁTICAMENTE
        } catch (e) {
            Alert.alert("Error", "No se pudo conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{taskToEdit ? "Editar Tarea" : "Nueva Tarea"}</Text>
            <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
            <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline />
            
            {loading ? (
                <ActivityIndicator color="green" />
            ) : (
                <Button title={taskToEdit ? "ACTUALIZAR" : "GUARDAR"} onPress={handleSave} color="green" />
            )}
            <View style={{ marginTop: 15 }}>
                <Button title="CANCELAR" onPress={onBack} color="red" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 25, padding: 10 }
});

export default TaskScreen;