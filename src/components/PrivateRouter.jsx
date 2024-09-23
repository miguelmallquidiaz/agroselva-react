import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('access_token');
    const location = useLocation();

    if (!token) {
        // Redirige al usuario a la página de inicio de sesión, y guarda la ubicación actual
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Component {...rest} />;
};

export default PrivateRoute;
