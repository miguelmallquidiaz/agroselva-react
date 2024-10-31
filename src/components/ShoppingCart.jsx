import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../utils/config';
import GenericForm from '../components/GenericForm';

const ShoppingCart = ({ cartItems = [], setCartItems }) => {
    const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error
    
    // Definición de los campos del formulario, eliminando los campos de fecha
    const fields = [
        { name: 'client_dni', label: 'DNI del Cliente', type: 'text', required: true },
    ];

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

    const handleSaveForm = (formData) => {
        // Aquí obtendrás los datos ingresados en el formulario (formData)
        const reservationData = {
            client_dni: formData.client_dni,
            reservation_status: "pending", // Este campo se mantiene
            payment_date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
            delivery_date: new Date().toISOString().split('T')[0], // Fecha de entrega, ajusta según sea necesario
            items: cartItems.map(item => ({
                product_code: item.id,
                quantity: item.quantity,
                pending_quantity: 0 // Asignando 0 a la cantidad pendiente
            }))
        };
    
        handleCheckout(reservationData);
        setShowForm(false); // Cierra el formulario después de guardar
    };
    
    const handleCheckout = async (reservationData) => {
        try {
            const response = await axios.post(config.API_BASE_URL + 'reservation/', reservationData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log("Reserva creada:", response.data);
            alert("Compra realizada con éxito!");
    
            setCartItems([]); // Limpiar el carrito
            sessionStorage.removeItem('cart');
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            setErrorMessage("Hubo un problema al realizar la compra. Por favor, intenta de nuevo.");
        }
    };

    // Calcular el total general del carrito
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
    };

    return (
        <div className="p-4">
            {cartItems.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b border-gray-600 text-left">Producto</th>
                                <th className="px-4 py-2 border-b border-gray-600 text-left">Precio Unitario</th>
                                <th className="px-4 py-2 border-b border-gray-600 text-left">Cantidad</th>
                                <th className="px-4 py-2 border-b border-gray-600 text-left">Total</th>
                                <th className="px-4 py-2 border-b border-gray-600 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => {
                                const totalPrice = item.unit_price * item.quantity; // Calcular total por producto
                                return (
                                    <tr key={item.id} className="hover:bg-gray-700">
                                        <td className="border-b border-gray-600 px-4 py-2">{item.name}</td>
                                        <td className="border-b border-gray-600 px-4 py-2">S/.{item.unit_price.toFixed(2)}</td>
                                        <td className="border-b border-gray-600 px-4 py-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleChangeQuantity(item.id, Number(e.target.value))}
                                                className="border border-gray-600 bg-gray-700 text-white rounded w-full"
                                            />
                                        </td>
                                        <td className="border-b border-gray-600 px-4 py-2">S/.{totalPrice.toFixed(2)}</td>
                                        <td className="border-b border-gray-600 px-4 py-2">
                                            <button onClick={() => handleRemove(item.id)} className="bg-red-500 text-white p-2 rounded">Eliminar</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="mt-4 text-lg font-bold">
                        Total General: S/.{getTotalPrice().toFixed(2)} {/* Mostrar total general */}
                    </div>
                    <button onClick={() => setShowForm(true)} className="mt-4 bg-green-500 text-white p-2 rounded">Realizar Compra</button>
                </div>
            )}
            {/* Mostrar el formulario solo si showForm es true */}
            {showForm && (
                <GenericForm
                    onSave={handleSaveForm}
                    fields={fields}
                    onClose={() => setShowForm(false)}
                    errorMessage={errorMessage}
                />
            )}
        </div>
    );
};

export default ShoppingCart;
