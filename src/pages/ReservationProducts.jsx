import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import GenericTable from '../components/GenericTable';
import config from '../utils/config';

const ReservationProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${config.API_BASE_URL}orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                setError('No se pudo cargar los productos de la reserva.');
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, [id]);

    const columns = [
        { label: 'Código del detalle pedido', field: 'id' },
        { label: 'Código de Producto', field: 'product_code' },
        { label: 'Nombre del producto', field: 'product_name' },
        { label: 'Cantidad Requerida', field: 'quantity' },
    ];

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar al lado izquierdo */}
            <aside className="flex-shrink-0">
                <Header />
            </aside>
            {/* Contenido principal */}
            <div className="flex-grow bg-gray-100">
                <main className="p-8">
                <h2 className="text-xl font-bold mb-4">Detalle del Pedido</h2>
            <button onClick={handleBack} className="mb-4 bg-teal-700 text-white p-2 rounded">
                Regresar a Listar pedidos
            </button>
            {loading && <div>Cargando...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && products.length > 0 && (
                <GenericTable items={products} columns={columns} />
            )}
                </main>
                </div>
            </div>
    );
};

export default ReservationProducts;
