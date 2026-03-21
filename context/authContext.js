import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const login = async (token, user = null) => {
        setUserToken(token);
        setUserData(user);
        await AsyncStorage.setItem("userToken", token);
        // Guardamos el objeto user (que incluye el rol) en el disco
        if (user) {
            await AsyncStorage.setItem("userData", JSON.stringify(user));
        }
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
            const savedUser = await AsyncStorage.getItem('userData');
            
            if (token) setUserToken(token);
            if (savedUser) setUserData(JSON.parse(savedUser));
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