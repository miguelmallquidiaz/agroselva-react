import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import GenericTable from '../components/GenericTable';
import config from '../utils/config';

const ReservationProducts = () => {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Obtener los detalles de la reserva
                const response = await axios.get(`${config.API_BASE_URL}reservations/items/${reservationId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                const reservationProducts = response.data;

                // Verifica que `reservationProducts.items` sea un array
                const reservationItems = Array.isArray(reservationProducts.items) ? reservationProducts.items : [];

                // Obtener todos los productos para mapear sus nombres
                const productsResponse = await axios.get(`${config.API_BASE_URL}products`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                const allProducts = productsResponse.data;
                console.log('All Products:', allProducts);

                // Crear un mapa de ID de producto a su nombre
                const productsMap = {};
                allProducts.forEach(product => {
                    productsMap[product.id] = product.name;
                });

                // Mapeo de productos de reserva con nombres
                const productsWithNames = reservationItems.map(item => ({
                    ...item,
                    product_name: productsMap[item.product_code] || 'Nombre no encontrado', // Usar 'product_code' para buscar el nombre
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
        { label: 'ID', field: 'id' },
        { label: 'ID de Reserva', field: 'reservation_id' },
        { label: 'Código de Producto', field: 'product_code' },
        { label: 'Nombre de Producto', field: 'product_name' },
        { label: 'Cantidad', field: 'quantity' },
    ];

    const handleBack = () => {
        navigate('/listreservation');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
        
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
        </div>
    );
};

export default ReservationProducts;
