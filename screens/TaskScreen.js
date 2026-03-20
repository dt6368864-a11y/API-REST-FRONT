import React, { useState, useEffect, useContext } from 'react';
import { 
    View, TextInput, Button, StyleSheet, Text, 
    Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
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
        if (!titulo.trim() || !descripcion.trim()) {
            return Alert.alert("Error", "Por favor completa todos los campos");
        }
        
        setLoading(true);
        try {
            if (taskToEdit) {
                // LÓGICA DE EDITAR
                await taskApiservice.update(userToken, taskToEdit.id, { titulo, descripcion });
            } else {
                // LÓGICA DE CREAR
                await taskApiservice.create(userToken, { titulo, descripcion });
            }
            onBack(); 
        } catch (e) {
            Alert.alert("Error", "No se pudo guardar la tarea");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert("Eliminar", "¿Estás seguro de borrar esta tarea?", [
            { text: "Cancelar" },
            { 
                text: "Sí, eliminar", 
                onPress: async () => {
                    setLoading(true);
                    try {
                        await taskApiservice.delete(userToken, taskToEdit.id);
                        onBack();
                    } catch (e) {
                        Alert.alert("Error", "No se pudo eliminar");
                    } finally {
                        setLoading(false);
                    }
                } 
            }
        ]);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>
                    {taskToEdit ? "Detalle de Tarea" : "Nueva Tarea"}
                </Text>
                
                <TextInput 
                    style={styles.input} 
                    placeholder="Título" 
                    value={titulo} 
                    onChangeText={setTitulo} 
                />

                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Descripción" 
                    value={descripcion} 
                    onChangeText={setDescripcion} 
                    multiline
                    textAlignVertical="top"
                />
                
                <View style={styles.buttonContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="green" />
                    ) : (
                        <Button 
                            title={taskToEdit ? "ACTUALIZAR CAMBIOS" : "GUARDAR TAREA"} 
                            onPress={handleSave} 
                            color="green" 
                        />
                    )}
                </View>

                {/* Solo mostramos el botón eliminar si estamos editando */}
                {taskToEdit && !loading && (
                    <View style={{ marginTop: 10 }}>
                        <Button title="ELIMINAR TAREA" onPress={handleDelete} color="orange" />
                    </View>
                )}

                <View style={styles.cancelContainer}>
                    <Button title="VOLVER A LA LISTA" onPress={onBack} color="red" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 30, flexGrow: 1, justifyContent: 'center', backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 20, padding: 12 },
    textArea: { minHeight: 150 },
    buttonContainer: { marginTop: 10 },
    cancelContainer: { marginTop: 15 }
});

export default TaskScreen;