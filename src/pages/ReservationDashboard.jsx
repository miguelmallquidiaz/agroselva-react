import React, { useEffect, useState } from 'react';
import ShoppingCart from '../components/ShoppingCart.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';

const ReservationDashboard = () => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = sessionStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    // Cargar elementos del carrito desde sessionStorage al montar
    useEffect(() => {
        const storedCart = sessionStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
            <main className="flex-grow p-8">
            <div>
            <h2 className="text-xl font-bold p-4">Carrito de compras</h2>
            <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />
            </div>
            </main>
        </div>
    );
};

export default ReservationDashboard;
