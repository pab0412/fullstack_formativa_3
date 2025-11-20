import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

console.log('🔧 Variable de entorno:', import.meta.env.VITE_API_BASE_URL);
console.log('🔧 API_URL final:', API_URL);

export const encomiendaService = {
    crearEncomienda: async (data: any) => {
        const fullURL = `${API_URL}/api/encomiendas`;
        console.log('📡 POST a:', fullURL);

        const response = await axios.post(fullURL, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    },

    // Listar todas las encomiendas
    listarTodas: async () => {
        const response = await axios.get(`${API_URL}/api/encomiendas`);
        return response.data;
    },

    // Buscar por código de seguimiento
    buscarPorCodigo: async (codigoSeguimiento: string) => {
        const response = await axios.get(
            `${API_URL}/api/encomiendas/codigo/${codigoSeguimiento}`
        );
        return response.data;
    },

    // Listar por estado
    listarPorEstado: async (estado: string) => {
        const response = await axios.get(
            `${API_URL}/api/encomiendas/estado/${estado}`
        );
        return response.data;
    },

    // Actualizar estado
    actualizarEstado: async (codigoSeguimiento: string, data: any) => {
        const response = await axios.put(
            `${API_URL}/api/encomiendas/codigo/${codigoSeguimiento}/estado`,
            data,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data;
    },

    // Eliminar encomienda
    eliminarEncomienda: async (id: number) => {
        const response = await axios.delete(`${API_URL}/api/encomiendas/${id}`);
        return response.data;
    },
};