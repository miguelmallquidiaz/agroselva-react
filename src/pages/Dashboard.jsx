import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import GenericTable from '../components/GenericTable';
import axios from 'axios';
import config from '../utils/config';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0); // Para contar las reservas completadas

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(config.API_BASE_URL + 'reservations/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                const allReservations = response.data;
                setReservations(allReservations);

                // Contar las reservas pendientes
                const pendingReservations = allReservations.filter(reservation => reservation.reservation_status === 'pending');
                setPendingCount(pendingReservations.length);

                // Contar las reservas completadas
                const completedReservations = allReservations.filter(reservation => reservation.reservation_status === 'completed');
                setCompletedCount(completedReservations.length);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, []);


    const columns = [
        { label: 'ID', field: 'id' },
        { label: 'Estado', field: 'reservation_status' },
        { label: 'DNI', field: 'client_dni' },
        { label: 'Fecha de Recojo', field: 'delivery_date' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
            <main className="flex-grow p-8">
                <div>
                    <h2 className="text-xl font-bold p-2">Panel Principal</h2>
                    <div className="grid gap-4 mb-6 lg:grid-cols-3">
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
                        <h3 className="text-lg font-semibold mb-2">Listado de Reservas</h3>
                        <GenericTable items={reservations} columns={columns} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
