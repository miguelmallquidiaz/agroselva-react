import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../utils/config';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(config.API_BASE_URL+'api/v1/auth/token', new URLSearchParams({
                grant_type: 'password',
                username: username,
                password: password,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            localStorage.setItem('access_token', response.data.access_token);

            Swal.fire({
                title: 'Inicio de sesión exitoso',
                text: 'Bienvenido!',
                icon: 'success',
                confirmButtonText: 'Ir al Dashboard',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/dashboard');
                }
            });

        } catch (error) {
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    title: 'Error',
                    text: 'No autorizado. Verifica tu correo y contraseña.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                console.error('Login failed:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200 px-6">
            <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
                <div className="flex items-center space-x-2 justify-center">
                    <h1 className="text-xl font-bold">Agro Selva</h1>
                </div>

                <form className="mt-4" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="text-gray-700 text-sm">Correo</span>
                        <input
                            type="text"
                            className="form-input mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>

                    <label className="block mt-3">
                        <span className="text-gray-700 text-sm">Contraseña</span>
                        <input
                            type="password"
                            className="form-input mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <div className="mt-6">
                        <button 
                            className="py-2 px-4 text-center bg-black rounded-md w-full text-white text-sm hover:bg-green-600"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
