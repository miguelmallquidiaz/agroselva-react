import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../utils/config';

const ShoppingCart = ({ cartItems = [], setCartItems }) => {
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error
    const [showAlert, setShowAlert] = useState(false); // Estado para mostrar alertas
    const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito

    // Cargar elementos del carrito desde sessionStorage al montar
    useEffect(() => {
        const storedCart = sessionStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const handleRemove = (productId) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item => item.id !== productId);
            sessionStorage.setItem('cart', JSON.stringify(updatedItems)); // Guardar en sessionStorage
            return updatedItems;
        });
    };

    const handleChangeQuantity = (productId, newQuantity) => {
        if (newQuantity < 1 || isNaN(newQuantity)) return;

        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );

            // Guardar en sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    const handleCheckout = async () => {
        const reservationData = {
            order_status: "pendiente", // Estado del pedido
            delivery_date: new Date().toISOString().split('T')[0], // Fecha de entrega, ajustada al formato YYYY-MM-DD
            order_details: cartItems.map(item => ({
                product_code: item.id,
                quantity: item.quantity,
            }))
        };

        try {
            const response = await axios.post(config.API_BASE_URL + 'orders/', reservationData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Pedido creado:", response.data);
            setSuccessMessage("Compra realizada con éxito!"); // Mostrar mensaje de éxito

            setCartItems([]); // Limpiar el carrito
            sessionStorage.removeItem('cart');

            setTimeout(() => {
                setSuccessMessage(''); // Limpiar el mensaje de éxito después de 3 segundos
            }, 3000);

        } catch (error) {
            console.error("Error al realizar la compra:", error);

            if (error.response && error.response.status === 422) {
                setErrorMessage("Hubo un problema con los datos del pedido.");
            } else {
                setErrorMessage("Hubo un problema al realizar la compra. Por favor, intenta de nuevo.");
            }

            // Mostrar alerta de error
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    };

    return (
        <>
            <div className="p-2">
                {showAlert && (
                    <div
                        id="alert-border-3"
                        className="flex items-center p-4 mt-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
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
                        <div className="ms-3 text-sm font-medium">
                            Hubo un error al realizar la compra. Por favor, revisa los datos ingresados.
                        </div>
                        <button
                            type="button"
                            className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                            onClick={() => setShowAlert(false)}
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

                {/* Mensaje de éxito */}
                {successMessage && (
                    <div
                        className="p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50"
                        role="alert"
                    >
                        <div className="text-sm font-medium">{successMessage}</div>
                    </div>
                )}
            </div>

            <div>
                {cartItems.length === 0 ? (
                    <p>El carrito está vacío.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white text-gray-800 rounded-lg">
                            <thead>
                                <tr className="bg-white rounded-lg">
                                    <th className="py-3 px-4 border-b text-center rounded-lg cursor-pointer hover:bg-gray-200">Nombre del Producto</th>
                                    <th className="py-3 px-4 border-b text-center rounded-lg cursor-pointer hover:bg-gray-200">Cantidad</th>
                                    <th className="py-3 px-4 border-b">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="py-4 text-center text-gray-500">{item.name}</td>
                                        <td className="py-4 text-center text-gray-500">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleChangeQuantity(item.id, Number(e.target.value))}
                                                className="py-2 text-center text-gray-500"
                                            />
                                        </td>
                                        <td className="py-4 text-center text-gray-500">
                                            <button onClick={() => handleRemove(item.id)} className="bg-red-500 text-white p-2 rounded">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <button onClick={handleCheckout} className="mt-4 bg-green-500 text-white p-2 rounded">Registrar Pedido</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ShoppingCart;
