import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Importa jwt-decode

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState(null);

    useEffect(() => {
        // Obtener el token desde localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRole(decodedToken.role); // Obtener el 'role' del token
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    // Define los elementos del menú con restricciones por rol
    const menuItems = [
        {
            label: 'Inicio',
            page: '/dashboard',
            icon: (
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        fillRule="evenodd"
                        d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            rolesAllowed: ['local', 'almacen'],  // Permitir solo ciertos roles
        },
        {
            label: 'Categoría',
            page: '/category',
            icon: (
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" />
                </svg>
            ),
            rolesAllowed: ['almacen'],
        },
        {
            label: 'Subcategoría',
            page: '/subcategory',
            icon: (
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" />
                </svg>
            ),
            rolesAllowed: ['admin'],
        },
        {
            label: 'Producto',
            page: '/product',
            icon: (
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" />
                </svg>
            ),
            rolesAllowed: ['local', 'almacen'],
        },
        {
            label: 'Pedido',
            page: '/reservation',
            icon: (
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" />
                </svg>
            ),
            rolesAllowed: ['local','almacen'],
        },
        {
            label: 'Seguimiento de Pedido',
            page: '/listreservation',
            icon: (
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" />
                </svg>
            ),
            rolesAllowed: ['local', 'almacen'],
        },
    ];

    return (
        <aside className="flex flex-col bg-white text-black w-60 min-h-screen py-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">AgroSelva</h1>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-4">
                    {menuItems
                        .filter(item => item.rolesAllowed.includes(role)) // Filtrar según el rol
                        .map(({ label, page, icon }) => (
                            <li key={page}>
                                <button
                                    onClick={() => navigate(page)}
                                    className={`flex items-center space-x-3 w-full px-4 py-2 text-left rounded ${location.pathname === page
                                        ? 'bg-teal-700 text-white'
                                        : 'text-black hover:bg-teal-700 hover:text-white'
                                        }`}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </button>
                            </li>
                        ))}
                </ul>
            </nav>
            <div className="mt-auto">
                <button
                    onClick={() => {
                        localStorage.removeItem('access_token');
                        navigate('/');
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-500 hover:bg-[#FF6280] hover:text-white rounded"
                >
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                    </svg>
                    <span>Salir</span>
                </button>
            </div>
        </aside>
    );
};

export default Header;
