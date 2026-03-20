import AsyncStorage from "@react-native-async-storage/async-storage";

// Dirección IP de tu PC según ipconfig
const BASE_URL = "http://192.168.1.8:8000/api"; 

export const taskApiservice = {
    getAll: (token) => fetch(`${BASE_URL}/tareas/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

    create: (token, data) => fetch(`${BASE_URL}/tareas/`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // NUEVO: Método para actualizar tareas existentes
    update: (token, id, data) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    delete: (token, id) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` },
    })
};

export const loginService = async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error en login');
    return data;
};