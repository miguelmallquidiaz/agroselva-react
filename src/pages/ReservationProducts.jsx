import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import GenericTable from '../components/GenericTable';
import config from '../utils/config';

const ReservationProducts = () => {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Obtener productos de la reserva
                const response = await axios.get(`${config.API_BASE_URL}reservation/${reservationId}/items`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                const reservationProducts = response.data;

                // Verificar los productos de la reserva
                console.log('Reservation Products:', reservationProducts);

                // Obtener nombres de productos
                const productsResponse = await axios.get(`${config.API_BASE_URL}product`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                const allProducts = productsResponse.data;
                console.log('All Products:', allProducts); // Verifica la estructura de los productos

                // Mapeo de ID a nombre
                const productsMap = {};
                allProducts.forEach(product => {
                    productsMap[product.id] = product.name; // Usar 'id' para el mapeo
                });

                // Mapeo de productos de reserva con nombres
                const productsWithNames = reservationProducts.map(product => ({
                    ...product,
                    product_name: productsMap[product.product_code] || 'Nombre no encontrado', // Usar 'product_code' para buscar el nombre
                }));

                setProducts(productsWithNames);
            } catch (error) {
                setError('No se pudo cargar los productos de la reserva.');
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [reservationId]);

    const columns = [
        { label: 'Código de Producto', field: 'product_code' },
        { label: 'Nombre de Producto', field: 'product_name' },
        { label: 'Cantidad', field: 'quantity' },
        { label: 'Cantidad Pendiente', field: 'pending_quantity' },
        { label: 'ID', field: 'id' },
        { label: 'ID de Reserva', field: 'reservation_id' },
    ];

    const handleBack = () => {
        navigate('/listreservation');
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Productos de la Reserva</h2>
            <button onClick={handleBack} className="mb-4 bg-blue-500 text-white p-2 rounded">
                Regresar a buscar Reservas
            </button>
            {loading && <div>Cargando...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && products.length > 0 && (
                <GenericTable items={products} columns={columns} />
            )}
        </div>
    );
};

export default ReservationProducts;
