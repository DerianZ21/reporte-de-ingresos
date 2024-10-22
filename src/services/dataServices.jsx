const baseUrl = process.env.REACT_APP_PINLET_SERVER_URL;
const apiKey = process.env.REACT_APP_PINLET_API_KEY;

let data = null;

export const obtenerDatos = async (endpoint, payload) => {
    if(!data){
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
                throw new Error("Error al hacer la solicitud")
            };
            const data = await response.json();
            return data
        }
        catch (error) {
            console.error("Error al obtener los datos", error);
            throw error
        }
    }else{
        return data;
    }
    
}

//metodos getter y setter para para los datos de consulta
export const getData = () =>{
    return data;
}

export const setData = (newData) =>{
    data = newData;
}

export const clearData = () => {
    data = null;
}