import AsyncStorage from "@react-native-async-storage/async-storage";

// Actualizado con tu IPv4 de ipconfig
const BASE_URL = "http://192.168.1.8:8000/api";

export const loginService = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");
        return data;
    } catch (error) {
        console.error("Error en loginService:", error);
        throw error;
    }
};

export const taskApiService = {
    getAll: async (token) => {
        const response = await fetch(`${BASE_URL}/tareas/`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    },
    create: async (token, data) => {
        const response = await fetch(`${BASE_URL}/tareas/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    update: async (token, id, data) => {
        const response = await fetch(`${BASE_URL}/tareas/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    },
    delete: async (token, id) => {
        const response = await fetch(`${BASE_URL}/tareas/${id}/`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return await response.json();
    }
};