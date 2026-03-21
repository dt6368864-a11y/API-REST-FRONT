import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/authContext';

const HomeScreen = ({ onNavigate, currentImageURI }) => {
    const { logout, userData } = useContext(AuthContext);
    const defaultImage = 'https://via.placeholder.com/150';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}><Text style={styles.headerTitle}>SENA - ADSO</Text></View>
            <View style={styles.card}>
                <Image source={{ uri: currentImageURI || defaultImage }} style={styles.avatar} />
                <View>
                    <Text style={styles.name}>{userData?.nombre || "Usuario-ADSO"}</Text>
                    {/* Muestra el rol dinámico en mayúsculas */}
                    <Text style={styles.role}>
                        {userData?.rol ? userData.rol.toUpperCase() : "APRENDIZ"}
                    </Text>
                </View>
            </View>
            <View style={styles.menu}>
                <TouchableOpacity style={styles.btn} onPress={() => onNavigate('tasks')}>
                    <Text>📋 Tareas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => onNavigate('photo')}>
                    <Text>📸 Perfil</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logout}><Text style={{color:'red'}}>Cerrar Sesión</Text></TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#39A900', padding: 40 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    card: { flexDirection: 'row', padding: 20, backgroundColor: '#fff', margin: 20, borderRadius: 10 },
    avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    name: { fontWeight: 'bold', fontSize: 18 },
    role: { color: '#39A900' },
    menu: { flexDirection: 'row', justifyContent: 'space-around' },
    btn: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '40%', alignItems: 'center' },
    logout: { position: 'absolute', bottom: 30, alignSelf: 'center' }
});

export default HomeScreen;