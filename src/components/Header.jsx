import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const inventoryRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Elimina los datos del localStorage
        localStorage.removeItem('access_token');
        // Redirige al usuario a la página de inicio de sesión o a otra página
        window.location.href = '/';
    };

    const toggleInventoryMenu = () => {
        setIsInventoryOpen(!isInventoryOpen);
    };

    const handleClickOutside = (event) => {
        if (inventoryRef.current && !inventoryRef.current.contains(event.target)) {
            setIsInventoryOpen(false);
        }
    };

    const goToCategoryDashboard = () => {
        navigate('/category'); // Navega a la ruta de Categoría
    };

    const goToIventoryDashboard = () => {
        navigate('/dashboard'); // Navega a la ruta de Inicio
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-customDarkMode text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                <h1 className="text-xl font-bold">Panel de Agro Selva</h1>
            </div>
            <nav className="hidden md:flex space-x-4">
                <a href="#" onClick={goToIventoryDashboard} className="flex items-center text-white space-x-2 hover:text-customTextHeader transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span>Inicio</span>
                </a>
                <div className="relative" ref={inventoryRef}>
                    <a href="#" className="flex items-center text-white space-x-2 hover:text-customTextHeader transition-colors duration-300" onClick={toggleInventoryMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                        </svg>
                        <span>Inventario</span>
                    </a>
                    {isInventoryOpen && (
                        <div className="absolute mt-2 bg-white text-black rounded-md shadow-lg">
                            <a href="#" className="block px-4 py-2 hover:bg-gray-200" onClick={goToCategoryDashboard}>Categoría</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Subcategoría</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Productos</a>
                        </div>
                    )}
                </div>
                <a href="#" className="flex items-center text-white space-x-2 hover:text-customTextHeader transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                    <span>Reserva</span>
                </a>
                <a href="#" onClick={handleLogout} className="flex items-center text-white space-x-2 hover:text-red-700 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                    </svg>
                    <span>Salir</span>
                </a>
            </nav>
            <button className="md:hidden" onClick={toggleSidebar}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6h15M4.5 12h15m-15 6h15" />
                </svg>
            </button>
        </header>
    );
};

export default Header;
