import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import GenericTable from '../components/GenericTable';
import config from '../utils/config';
import GenericForm from '../components/GenericForm';
import { useNavigate } from 'react-router-dom';

const ListReservation = () => {
    const [dni, setDni] = useState('');
    const [reservationData, setReservationData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReservation, setCurrentReservation] = useState(null);
    const navigate = useNavigate();

    const handleViewProductsClick = (reservationId) => {
        navigate(`/reservations/${reservationId}/products`);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setReservationData([]); // Limpiar datos de reservas antes de la búsqueda

        try {
            const response = await axios.get(`${config.API_BASE_URL}reservation/${dni}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            // Asegúrate de que reservationData se establece correctamente
            if (response.data.length === 0) {
                setReservationData([]); // Asegúrate de que esto esté vacío si no hay datos
            } else {
                setReservationData(response.data);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setError('No se encontró la reserva. Verifica el DNI ingresado.');
            } else {
                setError('Ocurrió un error al buscar la reserva.');
            }
            console.error('Error fetching reservation:', error);
            setReservationData([]); // Limpia los datos de la tabla
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleEditClick = (reservation) => {
        setCurrentReservation(reservation);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (reservationId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
            try {
                await axios.delete(`${config.API_BASE_URL}reservation/${reservationId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                // Actualiza la lista de reservas después de eliminar
                await handleSearch();

                // Limpia el error si la eliminación fue exitosa
                setError('');
            } catch (error) {
                console.error('Error deleting reservation:', error.response || error);
                setError(error.response?.data?.message || 'Ocurrió un error al eliminar la reserva.');
            }
        }
    };

    const handleChangeStatusClick = async (reservationId) => {
        try {
            await axios.patch(
                `${config.API_BASE_URL}reservation/${reservationId}`, 
                { status: 'completada' }, 
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setError('Estado de reserva actualizado exitosamente.');
            handleSearch(); // Actualiza la lista de reservas después de cambiar el estado
        } catch (error) {
            console.error('Error changing reservation status:', error);
            setError('Ocurrió un error al cambiar el estado de la reserva.');
        }
    };

    const columns = [
        { label: 'ID de Reserva', field: 'id' },
        { label: 'DNI del Cliente', field: 'client_dni' },
        { label: 'Estado', field: 'reservation_status' },
        { label: 'Fecha de Pago', field: 'payment_date' },
        { label: 'Fecha de Entrega', field: 'delivery_date' },
    ];

    const fields = [
        { name: 'delivery_date', label: 'Fecha de Entrega', type: 'date', required: true },
    ];

    const handleSave = async (formData) => {
        if (!currentReservation) return;

        try {
            await axios.patch(
                `${config.API_BASE_URL}reservation/${currentReservation.id}/delivery_date`,
                { delivery_date: formData.delivery_date },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setError('Fecha de entrega actualizada exitosamente.');
        } catch (error) {
            console.error('Error updating delivery date:', error);
            setError('Ocurrió un error al actualizar la fecha de entrega.');
        } finally {
            setIsModalOpen(false);
            handleSearch(); // Actualiza la lista de reservas
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
            <main className="flex-grow p-8">
                <div>
                    <h2 className="text-xl font-bold p-2">Buscar Reserva</h2>
                    <div className="flex mb-4">
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            placeholder="Ingresa el DNI del cliente"
                            className="p-2 border border-gray-300 rounded mr-2"
                        />
                        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
                            Buscar
                        </button>
                    </div>

                    {loading && <div>Cargando...</div>}
                    {error && <div className="text-red-500">{error}</div>}

                    {reservationData.length === 0 && !loading && (
                        <div className="text-gray-500">No hay datos</div>
                    )}

                    {reservationData.length > 0 && (
                        <GenericTable
                            items={reservationData}
                            columns={columns}
                            handleEditClick={handleEditClick}
                            handleViewProductsClick={handleViewProductsClick}
                            handleChangeStatusClick={handleChangeStatusClick}
                            handleDeleteClick={handleDeleteClick}
                        />
                    )}
                </div>
            </main>
            {isModalOpen && (
                <GenericForm
                    onSave={handleSave}
                    fields={fields}
                    initialData={currentReservation}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ListReservation;
