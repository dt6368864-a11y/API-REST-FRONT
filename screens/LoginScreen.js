// screens/LoginScreen.js
import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from "../context/authContext";
import { loginService } from '../src/api/apiService';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "Llena los campos");
        setLoading(true);
        try {
            const data = await loginService(email, password);
            if (data.token) login(data.token);
        } catch (e) {
            Alert.alert("Error de login", e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, textAlign: 'center', color: 'green', marginBottom: 20 }}>Iniciar Sesión</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {loading ? <ActivityIndicator color="green" /> : <Button title="INICIAR SESIÓN" onPress={handleLogin} color="green" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 20, padding: 10 },
});

export default LoginScreen;