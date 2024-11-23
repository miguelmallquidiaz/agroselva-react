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
        <div className="flex min-h-screen">
            {/* Sidebar al lado izquierdo */}
            <aside className="flex-shrink-0">
                <Header />
            </aside>
            {/* Contenido principal */}
            <div className="flex-grow bg-gray-100">
                <main className="p-8">
                    <div>
                        <h2 className="text-xl font-bold">Regisrar Pedido</h2>
                        <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ReservationDashboard;
