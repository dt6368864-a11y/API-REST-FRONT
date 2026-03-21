import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { AuthContext } from '../context/authContext'; 
import { taskApiService } from '../src/api/apiService'; 

const TaskScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [taskEditingId, setTaskEditingId] = useState(null); 
    const [procesando, setProcesando] = useState(false);

    useEffect(() => { 
        if (userToken) {
            fetchTasks(); 
        }
    }, [userToken]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await taskApiService.getAll(userToken);
           
            if (data && data.datos) {
                setTasks(data.datos);
            } else if (Array.isArray(data)) {
                setTasks(data);
            } else {
                setTasks([]); 
            }
        } catch (error) { 
            console.error("Error al cargar tareas:", error); 
            Alert.alert("Error", "No se pudieron obtener las tareas.");
        } finally { 
            setLoading(false); 
        }
    };

    const handleGuardarTarea = async () => {
        if (!titulo.trim() || !descripcion.trim()) {
            Alert.alert("Aviso", "Por favor, completa el título y la descripción.");
            return;
        }

        setProcesando(true);
        try {
            const payload = { 
                titulo: titulo.trim(), 
                descripcion: descripcion.trim() 
            };
            
            if (taskEditingId) {
                await taskApiService.update(userToken, taskEditingId, payload);
                setTasks(prev => prev.map(t => t.id === taskEditingId ? { ...t, ...payload } : t));
                Alert.alert("Éxito", "Tarea actualizada correctamente");
            } else {
                const res = await taskApiService.create(userToken, payload);
                const nuevaTareaLocal = {
                    id: res?.id || Math.random().toString(),
                    ...payload
                };
                setTasks(prev => [nuevaTareaLocal, ...prev]);
                Alert.alert("Éxito", "Tarea creada correctamente");
            }
            cerrarModal();
        } catch (error) {
            Alert.alert("Error", "No se pudo sincronizar con el servidor");
        } finally {
            setProcesando(false);
        }
    };

    const abrirEditar = (item) => {
        setTaskEditingId(item.id);
        setTitulo(item.titulo);
        setDescripcion(item.descripcion);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setTitulo('');
        setDescripcion('');
        setTaskEditingId(null);
    };

    const eliminarTarea = (id) => {
        Alert.alert("Eliminar Tarea", "¿Estás seguro de borrar esta tarea?", [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Eliminar", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await taskApiService.delete(userToken, id);
                        setTasks(prev => prev.filter(t => t.id !== id));
                    } catch (e) {
                        Alert.alert("Error", "No se pudo eliminar la tarea");
                    }
                } 
            }
        ]);
    };

    const renderTarea = ({ item }) => (
        <View style={styles.tarjetaTarea}>
            <View style={styles.ladoTexto}>
                <Text style={styles.tituloItem}>{item.titulo}</Text>
                <Text style={styles.descItem}>{item.descripcion}</Text>
            </View>
            <View style={styles.ladoBotones}>
                <TouchableOpacity onPress={() => abrirEditar(item)} style={styles.botonAccion}>
                    <Text style={styles.iconoEmoji}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarTarea(item.id)} style={styles.botonAccion}>
                    <Text style={styles.iconoEmoji}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.contenedorPrincipal}>
            <Text style={styles.tituloPantalla}>Mis Tareas</Text>
            
            {loading ? (
                <ActivityIndicator size="large" color="#39A900" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTarea}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={
                        <Text style={styles.textoVacio}>No tienes tareas pendientes actualmente.</Text>
                    }
                />
            )}

            <TouchableOpacity 
                style={styles.botonFlotante} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.textoFab}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.overlayModal}>
                    <View style={styles.cajaModal}>
                        <Text style={styles.tituloModal}>
                            {taskEditingId ? "Editar Tarea" : "Nueva Tarea"}
                        </Text>
                        
                        <TextInput 
                            style={styles.inputFormulario} 
                            placeholder="Título de la tarea" 
                            value={titulo} 
                            onChangeText={setTitulo} 
                        />
                        <TextInput 
                            style={[styles.inputFormulario, { height: 100, textAlignVertical: 'top' }]} 
                            placeholder="Descripción detallada" 
                            value={descripcion} 
                            onChangeText={setDescripcion} 
                            multiline 
                        />

                        <View style={styles.filaBotonesModal}>
                            <TouchableOpacity onPress={cerrarModal}>
                                <Text style={styles.textoCancelar}>Cancelar </Text>
                            </TouchableOpacity>

                            {procesando ? (
                                <ActivityIndicator color="#39A900" />
                            ) : (
                                <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardarTarea}>
                                    <Text style={styles.textoBotonGuardar}>
                                        {taskEditingId ? "Editar" : "Crear Tarea"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    contenedorPrincipal: { 
        flex: 1, 
        backgroundColor: '#FFFFFF', 
        paddingHorizontal: 20 
    },
    tituloPantalla: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginTop: 30, 
        marginBottom: 20, 
        color: '#333333' 
    },
    tarjetaTarea: {
        flexDirection: 'row', 
        backgroundColor: '#F9F9F9', 
        padding: 15,
        marginBottom: 15, 
        borderRadius: 12, 
        alignItems: 'center',
        justifyContent: 'space-between', 
        borderWidth: 1, 
        borderColor: '#EEEEEE',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 4,
    },
    ladoTexto: { 
        flex: 1, 
        paddingRight: 10 
    },
    tituloItem: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333333' 
    },
    descItem: { 
        fontSize: 14, 
        color: '#666666', 
        marginTop: 5 
    },
    ladoBotones: { 
        flexDirection: 'row' 
    },
    botonAccion: { 
        marginLeft: 15, 
        padding: 5 
    },
    iconoEmoji: { 
        fontSize: 24 
    },
    botonFlotante: {
        position: 'absolute', 
        right: 25, 
        bottom: 30,
        backgroundColor: '#39A900', 
        width: 65, 
        height: 65,
        borderRadius: 32.5, 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 8,
    },
    textoFab: { 
        color: '#FFFFFF', 
        fontSize: 35, 
        fontWeight: 'bold' 
    },
    overlayModal: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    cajaModal: { 
        width: '85%', 
        backgroundColor: '#FFFFFF', 
        padding: 25, 
        borderRadius: 20, 
        elevation: 15 
    },
    tituloModal: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center',
        color: '#333'
    },
    inputFormulario: { 
        borderWidth: 1, 
        borderColor: '#DDDDDD', 
        borderRadius: 10, 
        padding: 12, 
        marginBottom: 15, 
        fontSize: 16 
    },
    filaBotonesModal: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 10 
    },
    textoCancelar: { 
        color: '#E74C3C', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    botonGuardar: { 
        backgroundColor: '#39A900', 
        paddingHorizontal: 20, 
        paddingVertical: 12, 
        borderRadius: 10 
    },
    textoBotonGuardar: { 
        color: '#FFFFFF', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    textoVacio: { 
        textAlign: 'center', 
        marginTop: 60, 
        color: '#BBBBBB', 
        fontSize: 16 
    }
});

export default TaskScreen;