import AsyncStorage from "@react-native-async-storage/async-storage";

// Asegúrate de que esta IP sea la de tu PC (ipconfig en CMD)
const BASE_URL = "http://192.168.1.12:8000/api";

export const taskApiservice = {

    getAll: (token) => fetch(`${BASE_URL}/tareas/`, {
        headers:{
            'Authorization': `Bearer ${token}`,
        }
    }).then(res => res.json()),

    // crear
    create: (token, data) =>fetch(`${BASE_URL}/tareas/`, {
        method: "POST",
         headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // editar
    update: (token, id, data) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method: "PUT",
         headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),


    // eliminar
    delete: (token, id) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method: "DELETE",
         headers:{
            'Authorization': `Bearer ${token}`
        },
    })
}

// export const loginService = async (email, password) => {
//     try {
//         const response = await fetch(`${BASE_URL}/auth/login/`, {
//             method: "POST",
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             // Esto captura errores 400, 401 o 500 de Django
//             throw new Error(data.error || 'Error al iniciar sesión');
//         }

//         return data; 
//     } catch (error) {
//         console.error("Error en loginService:", error);
//         throw error;
//     }
// };

// export const getTasks = async (token) => {
//     try {
//         const response = await fetch(`${BASE_URL}/tareas/`, { 
//             method: "GET",
//             headers: {
//                 'Authorization': `Bearer ${token}`, 
//                 'Content-Type': 'application/json'
//             }
//         });

//         const text = await response.text();
        
//         if (!response.ok) {
//             console.log("--- ERROR DE DJANGO ---");
//             console.log("Status:", response.status);
//             console.log("Cuerpo:", text);
//             throw new Error(`Error ${response.status}: No se pudo obtener datos`);
//         }

//         return JSON.parse(text);
//     } catch (error) {
//         console.error("Error en getTasks:", error);
//         throw error;
//     }
// };

