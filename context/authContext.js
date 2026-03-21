import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null); // Para guardar nombre/rol

    const login = async (token, user = null) => {
        setUserToken(token);
        setUserData(user);
        await AsyncStorage.setItem("userToken", token);
    };

    const logout = async () => {
        setUserToken(null);
        setUserData(null);
        await AsyncStorage.removeItem('userToken');
    };

    const isLoggedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) setUserToken(token);
        } catch (e) {
            console.log('Error en persistencia:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { isLoggedIn(); }, []);

    return (
        <AuthContext.Provider value={{ login, logout, userToken, isLoading, userData }}>
            {children}
        </AuthContext.Provider>
    );
};