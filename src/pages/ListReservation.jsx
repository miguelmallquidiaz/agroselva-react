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
    const [showAlert, setShowAlert] = useState({ show: false, type: '', message: '' });

    const handleAlert = (type, message) => {
        setShowAlert({ show: true, type, message });
        setTimeout(() => setShowAlert({ show: false, type: '', message: '' }), 3000);
    };

    const handleViewProductsClick = (reservationId) => {
        navigate(`/reservations/${reservationId}/products`);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setReservationData([]); // Limpiar datos de reservas antes de la búsqueda

        try {
            const response = await axios.get(`${config.API_BASE_URL}reservations/${dni}`, {
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
                await axios.delete(`${config.API_BASE_URL}reservations/${reservationId}`,
                    {
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
            await axios.put(
                `${config.API_BASE_URL}reservations/${reservationId}`,
                { reservation_status: 'completed' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setError('Estado de reserva actualizado exitosamente.');
            handleAlert('success', 'Se realizo el cambio de estado exitosamente.');
            handleSearch(); // Actualiza la lista de reservas después de cambiar el estado
        } catch (error) {
            console.error('Error changing reservation status:', error);
            setError('Ocurrió un error al cambiar el estado de la reserva.');
            handleAlert('error', 'No se pudo realizar el cambio de estado.');
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
            await axios.put(
                `${config.API_BASE_URL}reservations/${currentReservation.id}`,
                { delivery_date: formData.delivery_date },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setError('Fecha de entrega actualizada exitosamente.');
            handleAlert('success', 'Se realizo el cambio de fecha correctamente.');
        } catch (error) {
            console.error('Error updating delivery date:', error);
            setError('Ocurrió un error al actualizar la fecha de entrega.');
            if (error.response?.status === 402) {
                setError('La fecha debe ser anterior a 1 semana');
            } else {
                setError('Ocurrió un error inesperado.');
            }
            handleAlert('error', 'La fecha debe ser anterior a 1 semana.');
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
                    {showAlert.show && (
                        <div
                            id="alert-border-3"
                            className={`flex items-center p-4 mt-4 border-t-4 ${showAlert.type === 'success' ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'
                                }`}
                            role="alert"
                        >
                            <svg
                                className="flex-shrink-0 w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <div className="ms-3 text-sm font-medium">{showAlert.message}</div>
                            <button
                                type="button"
                                className="ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8"
                                onClick={() => setShowAlert({ show: false, type: '', message: '' })}
                                aria-label="Close"
                            >
                                <span className="sr-only">Cerrar</span>
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}

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
