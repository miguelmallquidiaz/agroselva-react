import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../utils/config';
import { useNavigate } from 'react-router-dom';

const UseFetchData = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            // Si no hay token, redirigir al login
            navigate('/', { replace: true });
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(config.API_BASE_URL + `${endpoint}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            
            if (response.data.length === 0) {
                // Si no hay datos, mostrar mensaje "No hay datos"
                setData(null);  // O puedes manejarlo como un arreglo vacío
            } else {
                setData(response.data);
            }

        } catch (error) {
            // Si hay un error, lo manejamos
            if (error.response && error.response.status === 401) {
                // Token inválido o expirado
                navigate('/', { replace: true });  // Redirigir al login
            } else {
                // Muestra el error pero permite acceder a la aplicación
                setError("No hay datos disponibles.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, loading, error, refetch: fetchData }; // Devuelve la función refetch
};

export default UseFetchData;
