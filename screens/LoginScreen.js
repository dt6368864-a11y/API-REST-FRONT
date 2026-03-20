import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from "../context/authContext";
import { loginService } from '../src/api/apiService'; // Nombre corregido aquí

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Completa todos los campos");
        }

        setLoading(true);
        try {
            // Llamada a la función correcta
            const data = await loginService(email, password);
            
            if (data && data.token) {
                login(data.token); 
            } else {
                Alert.alert("Error", "El servidor no devolvió un token.");
            }
        } catch (e) {
            // Muestra el mensaje de error que viene del backend o del throw
            Alert.alert("Error de login", e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.tittle}>Iniciar Sesión</Text>
            
            <TextInput
                style={styles.input} 
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input} 
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#00ff4c" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} color="#00ff4c" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        padding: 20,
        backgroundColor: '#f5f5f5' 
    },
    tittle: { 
        fontSize: 28, 
        fontWeight: "bold", 
        marginBottom: 30, 
        textAlign: "center", 
        color: "#00ff4c" 
    },
    input: { 
        borderBottomWidth: 1, 
        borderColor: "#ccc", 
        marginBottom: 20, 
        padding: 10,
        backgroundColor: 'white'
    },
});

export default LoginScreen;