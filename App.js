// App.js
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { AuthProvider, AuthContext } from './context/authContext';
import { taskApiservice } from './src/api/apiService';
import LoginScreen from './screens/LoginScreen';

const NavigationWrapper = () => {
    const { userToken, logout, isLoading } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (userToken) {
            taskApiservice.getAll(userToken)
                .then(res => setTasks(res.datos || []))
                .catch(err => console.log(err));
        }
    }, [userToken]);

    if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

    if (!userToken) return <LoginScreen />;

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mis Tareas</Text>
                <Button title="Salir" onPress={logout} color="red" />
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
                        <Text>{item.descripcion}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <NavigationWrapper />
        </AuthProvider>
    );
};