import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const inventoryMenuRef = useRef(null);
    const navigate = useNavigate(); // Usa el hook useNavigate

    // Maneja el clic fuera del componente para cerrar el submenú
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inventoryMenuRef.current && !inventoryMenuRef.current.contains(event.target)) {
                setIsInventoryOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleInventoryMenu = () => {
        setIsInventoryOpen(!isInventoryOpen);
    };

    const handleLogout = () => {
        // Elimina los datos del localStorage
        localStorage.removeItem('access_token');
        // Redirige al usuario a la página de inicio de sesión o a otra página
        window.location.href = '/';
    };

    const goToCategoryDashboard = () => {
        navigate('/category'); // Navega a la ruta de Categoría
    };

    const goToInventoryDashboard = () => {
        navigate('/dashboard'); // Navega a la ruta de inicio
    };

    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-25" onClick={closeSidebar}></div>
            )}
            <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out bg-white w-64 z-50`}>
                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <button onClick={closeSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    <a href="#" onClick={goToInventoryDashboard} className="flex items-center text-gray-700 space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span>Dashboard</span>
                    </a>
                    <div className="relative" ref={inventoryMenuRef}>
                        <button
                            onClick={toggleInventoryMenu}
                            className="flex items-center text-gray-700 space-x-2 w-full text-left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                            </svg>
                            <span>Inventario</span>
                        </button>
                        {isInventoryOpen && (
                            <div className="absolute left-0 top-full mt-2 bg-white text-black rounded-md shadow-lg w-48">
                                <a href="#" onClick={goToCategoryDashboard} className="block px-4 py-2 hover:bg-gray-200">Categoría</a>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Subcategoría</a>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Productos</a>
                            </div>
                        )}
                    </div>
                    <a href="#" onClick={handleLogout} className="flex items-center text-gray-700 space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                        <span>Salir</span>
                    </a>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
