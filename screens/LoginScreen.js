import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from "../context/authContext";
import { loginService } from '../src/api/apiService';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const data = await loginService(email, password);
            login(data.token, data.user);
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MiAppTareas</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Entrar" onPress={handleLogin} color="#39A900" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 30 },
    title: { fontSize: 30, fontWeight: 'bold', color: '#39A900', textAlign: 'center', marginBottom: 30 },
    input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 }
});

export default LoginScreen;