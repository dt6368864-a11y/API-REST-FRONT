import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { AuthContext } from '../context/authContext';

const HomeScreen = ({ onNavigate, currentImageURI }) => {
    const { logout, userData } = useContext(AuthContext);
    const defaultImage = 'https://via.placeholder.com/150';

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Inicio - ADSO</Text>
            </View>

            <View style={styles.card}>
                <Image 
                    source={{ uri: currentImageURI || defaultImage }} 
                    style={styles.avatar} 
                />
                <View style={styles.infoUser}>
                    <Text style={styles.name}>{userData?.nombre || "Usuario ADSO"}</Text>
                    <Text style={styles.role}>
                        {userData?.rol ? userData.rol.toUpperCase() : "INSTRUCTOR"}
                    </Text>
                </View>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.btn} onPress={() => onNavigate('tasks')}>
                    <Text style={styles.iconSize}>📋</Text>
                    <Text style={styles.btnText}>Mis Tareas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => onNavigate('photo')}>
                    <Text style={styles.iconSize}>📸</Text>
                    <Text style={styles.btnText}>Cambiar Foto</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={logout} style={styles.logout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF' 
    },
    header: { 
        backgroundColor: '#39A900', 
        paddingTop: 50, 
        paddingBottom: 20, 
        paddingHorizontal: 20 
    },
    headerTitle: { 
        color: '#fff', 
        fontSize: 22, 
        fontWeight: 'bold' 
    },
    card: { 
        flexDirection: 'row', 
        padding: 25, 
        backgroundColor: '#fff', 
        marginHorizontal: 20, 
        marginTop: 40, 
        borderRadius: 20,
        alignItems: 'center',
        // Sombras
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    avatar: { 
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        marginRight: 20 
    },
    infoUser: {
        justifyContent: 'center'
    },
    name: { 
        fontWeight: 'bold', 
        fontSize: 20, 
        color: '#333' 
    },
    role: { 
        color: '#39A900', 
        fontWeight: 'bold', 
        fontSize: 14,
        marginTop: 2
    },
    menu: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20,
        marginTop: 20 
    },
    btn: { 
        backgroundColor: '#fff', 
        paddingVertical: 30, 
        borderRadius: 15, 
        width: '47%', 
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    iconSize: {
        fontSize: 40,
        marginBottom: 10
    },
    btnText: {
        fontWeight: '600',
        color: '#444',
        fontSize: 15
    },
    logout: { 
        position: 'absolute', 
        bottom: 40, 
        alignSelf: 'center' 
    },
    logoutText: {
        color: '#E74C3C', 
        fontWeight: 'bold', 
        fontSize: 16
    }
});

export default HomeScreen;