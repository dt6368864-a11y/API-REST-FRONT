import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 

const DashboardScreen = ({ onNavigate, currentImageURI, onImageUpdate }) => {
    
    // Función para abrir la galería y seleccionar una foto
    const pickImage = async () => {
        // Pedir permisos para acceder a la galería
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert(
                'Permiso denegado',
                'Necesitamos permiso para acceder a tus fotos para cambiar la foto de perfil.'
            );
            return;
        }

        // Abrir el selector de imágenes
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Permite recortar
            aspect: [1, 1], // Proporción cuadrada
            quality: 0.7, 
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            // Actualizamos el estado en App.js mediante la prop
            onImageUpdate(result.assets[0].uri);
            Alert.alert('Éxito', 'Foto de perfil actualizada.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Barra de Navegación Superior */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backButton}>
                    <Text style={styles.backText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.navTitle}>Configuración</Text>
                <View style={styles.placeholder} /> 
            </View>

            {/* Contenido Principal */}
            <View style={styles.content}>
                <Text style={styles.title}>📸 Cambiar Foto de Perfil</Text>

                {/* Círculo de la foto */}
                <View style={styles.imageContainer}>
                    {currentImageURI ? (
                        <Image source={{ uri: currentImageURI }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.placeholderCircle}>
                            <Text style={styles.placeholderText}>Sin imagen seleccionada</Text>
                        </View>
                    )}
                </View>

                {/* Botón de Selección */}
                <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                    <Text style={styles.pickButtonText}>Elegir de la galería</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.pickButton, { marginTop: 20, borderColor: '#ccc' }]} 
                    onPress={() => onNavigate('home')}
                >
                    <Text style={{ color: '#666', fontWeight: 'bold' }}>Regresar al Inicio</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    navBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: 15, 
        height: 60, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee',
        marginTop: 35
    },
    backButton: { padding: 5 },
    backText: { fontSize: 40, color: '#39A900', lineHeight: 40 },
    navTitle: { fontSize: 18, fontWeight: '600' },
    placeholder: { width: 40 },
    content: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
    title: { fontSize: 22, fontWeight: '700', marginTop: 30, marginBottom: 40, color: '#222' },
    imageContainer: { marginBottom: 40 },
    avatarImage: { width: 180, height: 180, borderRadius: 90 },
    placeholderCircle: { 
        width: 180, 
        height: 180, 
        borderRadius: 90, 
        backgroundColor: '#F0F0F0', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },
    placeholderText: { textAlign: 'center', color: '#888', fontSize: 14 },
    pickButton: { 
        width: '100%', 
        borderWidth: 2, 
        borderColor: '#39A900', 
        borderRadius: 8, 
        paddingVertical: 12, 
        alignItems: 'center', 
        backgroundColor: '#fff'
    },
    pickButtonText: { color: '#39A900', fontWeight: 'bold', fontSize: 15 }
});

export default DashboardScreen;

//original