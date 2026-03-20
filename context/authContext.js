import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null); // Para guardar la foto y nombre
    const [isLoading, setIsLoading] = useState(true);

    const login = async (token, user) => {
        setUserToken(token);
        setUserData(user);
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userData", JSON.stringify(user));
    };

    const logout = async () => {
        setUserToken(null);
        setUserData(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
    };

    const isLoggedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const user = await AsyncStorage.getItem('userData');
            if (token) {
                setUserToken(token);
                setUserData(JSON.parse(user));
            }
        } catch (e) {
            console.log('Error en persistencia: ', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { isLoggedIn(); }, []);

    return (
        <AuthContext.Provider value={{ login, logout, userToken, userData, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};