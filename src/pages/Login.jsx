import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../utils/config";
import fondo from "../assets/fondo-agroselva.png";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await axios.post(
                config.API_BASE_URL + "auth/",
                new URLSearchParams({
                    grant_type: "password",
                    username: username,
                    password: password,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            localStorage.setItem("access_token", response.data.access_token);
            navigate("/dashboard");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Verificar tu correo o contraseña.");
            } else {
                console.error("Login failed:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
                <div className="hidden md:flex md:w-1/2">
                    <img
                        src={fondo}
                        alt="Agro Selva"
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">
                        Agro Selva Jaén
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-4">
                            <span className="text-gray-700">Correo</span>
                            <input
                                type="text"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-200"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block mb-4">
                            <span className="text-gray-700">Contraseña</span>
                            <input
                                type="password"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        {errorMessage && (
                            <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">
                                {errorMessage}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-teal-700 text-white py-2 px-4 rounded-md hover:bg-teal-800 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
