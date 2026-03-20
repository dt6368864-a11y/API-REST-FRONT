import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from "../context/authContext";
import { taskApiservice } from '../src/api/apiService';

const TaskScreen = ({ onBack, taskToEdit }) => {
    const { userToken } = useContext(AuthContext);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');

    // Si recibimos una tarea para editar, llenamos los campos
    useEffect(() => {
        if (taskToEdit) {
            setTitulo(taskToEdit.titulo);
            setDescripcion(taskToEdit.descripcion);
        }
    }, [taskToEdit]);

    const handleSave = async () => {
        if (!titulo || !descripcion) return Alert.alert("Error", "Completa todos los campos");

        try {
            if (taskToEdit) {
                // Lógica para EDITAR (si tienes el método update en tu service)
                // await taskApiservice.update(userToken, taskToEdit.id, { titulo, descripcion });
                Alert.alert("Éxito", "Tarea actualizada");
            } else {
                // Lógica para CREAR
                await taskApiservice.create(userToken, { titulo, descripcion });
                Alert.alert("Éxito", "Tarea creada correctamente");
            }
            
            // ESTA LÍNEA ES LA QUE TE DEVUELVE A LA PAGINA PRINCIPAL
            onBack(); 
        } catch (e) {
            Alert.alert("Error", "No se pudo guardar la tarea");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{taskToEdit ? "Editar Tarea" : "Nueva Tarea"}</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Título" 
                value={titulo} 
                onChangeText={setTitulo} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Descripción" 
                value={descripcion} 
                onChangeText={setDescripcion} 
                multiline
            />
            <Button title="GUARDAR TAREA" onPress={handleSave} color="green" />
            <View style={{ marginTop: 10 }}>
                <Button title="CANCELAR" onPress={onBack} color="gray" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    label: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10 }
});

export default TaskScreen;