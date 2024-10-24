const baseUrl = process.env.REACT_APP_PINLET_SERVER_URL;
const apiKey = process.env.REACT_APP_PINLET_API_KEY;

let dataMarcacion = null;
let dataLugar = null;

export const obtenerDatos = async (endpoint, payload) => {
    let data = "";

    // Verificar si ya existen datos en caché
    if (endpoint === "getMarcacion_residenteLugar") {
        data = dataMarcacion;
    } else if (endpoint === "getLugar") {
        data = dataLugar;
    }

    // Si no hay datos en caché, realizar la solicitud a la API
    if (!data) {
        try {
            const response = await fetch(`${baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Error al hacer la solicitud");
            }

            // Obtener la respuesta y guardarla en la variable correspondiente
            data = await response.json();

            // Actualizar la caché según el endpoint
            if (endpoint === "getMarcacion_residenteLugar") {
                dataMarcacion = data;
            } else if (endpoint === "getLugar") {
                dataLugar = data;
            }

            return data;
        } catch (error) {
            console.error("Error al obtener los datos", error);
            throw error;
        }
    } else {
        // Si ya hay datos en caché, devolverlos
        return data;
    }
};