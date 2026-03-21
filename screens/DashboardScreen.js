import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import * as ImagePicker from 'expo-image-picker'; 

const DashboardScreen = ({ onNavigate, currentImageURI, onImageUpdate }) => {
    
    const seleccionarImagen = async () => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert(
                'Permiso denegado',
                'Es necesario el permiso de la galería para cambiar la foto.'
            );
            return;
        }

        let resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images', 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 0.7, 
        });

        if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
            onImageUpdate(resultado.assets[0].uri);
            Alert.alert('Éxito', 'La foto de perfil ha sido actualizada.');
        }
    };

    return (
        <SafeAreaView style={styles.contenedorPantalla}>
            
            <View style={styles.barraNavegacion}>
                <TouchableOpacity 
                    onPress={() => onNavigate('home')} 
                    style={styles.botonRegresarIcono}
                >
                    <Text style={styles.iconoAtras}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>Configuración</Text>
                <View style={{ width: 40 }} /> 
            </View>

            <View style={styles.contenidoCentral}>
                <Text style={styles.tituloSeccion}>📸 Cambiar Foto de Perfil</Text>

                <View style={styles.marcoFoto}>
                    {currentImageURI ? (
                        <Image 
                            source={{ uri: currentImageURI }} 
                            style={styles.fotoRedonda} 
                        />
                    ) : (
                        <View style={styles.circuloGris}>
                            <Text style={styles.textoSinFoto}>Sin imagen seleccionada</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.botonAccionVerde} onPress={seleccionarImagen}>
                    <Text style={styles.textoBotonVerde}>Elegir de la galería</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.botonVolverGris} 
                    onPress={() => onNavigate('home')}
                >
                    <Text style={styles.textoBotonGris}>Regresar al Inicio</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    barraNavegacion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    botonRegresarIcono: {
        padding: 5,
    },
    iconoAtras: {
        fontSize: 40,
        color: '#39A900',
        lineHeight: 40,
    },
    tituloHeader: {
        fontSize: 18,
        fontWeight: '600',
    },
    contenidoCentral: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    tituloSeccion: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 30,
        marginBottom: 40,
        color: '#222222',
    },
    marcoFoto: {
        marginBottom: 40,
    },
    fotoRedonda: {
        width: 180,
        height: 180,
        borderRadius: 90,
    },
    circuloGris: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    textoSinFoto: {
        textAlign: 'center',
        color: '#888888',
        fontSize: 14,
    },
    botonAccionVerde: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#39A900',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    textoBotonVerde: {
        color: '#39A900',
        fontWeight: 'bold',
        fontSize: 15,
    },
    botonVolverGris: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    textoBotonGris: {
        color: '#666666',
        fontWeight: 'bold',
    },
});

export default DashboardScreen;