import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import GenericTable from '../components/GenericTable';
import axios from 'axios';
import config from '../utils/config';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate();

    const handleViewProductsClick = (id) => {
        console.log("ID recibido:", id);
        navigate(`/ItemsProduct/${id}`);
    };



    const fetchReservations = async () => {
        try {
            const response = await axios.get(config.API_BASE_URL + 'orders/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const allOrders = response.data;
            setOrders(allOrders);

            // Contar las reservas pendientes
            const pendingOrders = allOrders.filter(orders => orders.order_status === 'pendiente');
            setPendingCount(pendingOrders.length);

            // Contar las reservas completadas
            const completedOrders = allOrders.filter(orders => orders.order_status === 'completado');
            setCompletedCount(completedOrders.length);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        fetchReservations(); // Llamar a fetchReservations cuando el componente se monta
    }, []);

    const handleChangeStatusClick = async (id) => {
        try {
            await axios.patch(
                `${config.API_BASE_URL}orders/${id}/`,
                { order_status: 'completado' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setAlertMessage('Cambio de estado realizado con éxito');
            await fetchReservations();

            setTimeout(() => {
                setAlertMessage(null);
            }, 500);
        } catch (error) {
            console.error('Error changing reservation status:', error);
            setAlertMessage('Ocurrió un error al cambiar el estado');
            setTimeout(() => {
                setAlertMessage(null);
            }, 500);
        }
    };

    const columns = [
        { label: 'ID de Pedido', field: 'id' },
        { label: 'Estado', field: 'order_status' },
        { label: 'Fecha de Entrega', field: 'delivery_date' },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar al lado izquierdo */}
            <aside className="flex-shrink-0">
                <Header />
            </aside>

            {/* Contenido principal */}
            <div className="flex-grow bg-gray-100">
                <main className="p-8">
                    <div>
                        <h2 className="text-xl font-bold p-2">Panel Principal</h2>
                        <div className="grid gap-4 mb-6 lg:grid-cols-3">
                            {alertMessage && (
                                <div className="fixed top-2 left-3/4 transform -translate-x-1/2 p-4 mb-4 bg-green-500 text-white rounded shadow-lg">
                                    {alertMessage}
                                </div>
                            )}
                            {/* Tarjeta para mostrar las reservas pendientes */}
                            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                                <h3 className="text-lg font-semibold mb-2">Pendiente por Recoger</h3>
                                <p className="text-3xl font-bold text-indigo-600">{pendingCount}</p>
                            </div>

                            {/* Tarjeta para mostrar las reservas completadas */}
                            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                                <h3 className="text-lg font-semibold mb-2">Recojos Completadas</h3>
                                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
                            </div>
                        </div>
                        {/* Tabla de reservas */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Listado de Pedidos</h3>
                            <GenericTable
                                items={orders}
                                columns={columns}
                                handleViewProductsClick={handleViewProductsClick}
                                handleChangeStatusClick={handleChangeStatusClick} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;