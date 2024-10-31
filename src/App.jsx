import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRouter';
import Dashboard from './pages/Dashboard';
import CategoryDashboard from './pages/CategoryDashboard';
import SubcategoryDashboard from './pages/SubcategoryDashboard';
import ProductDashboard from './pages/ProductDashboard';
import ReservationDashboard from './pages/ReservationDashboard';
import ListReservation from './pages/ListReservation';
import ReservationProducts from './pages/ReservationProducts';

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
        <Route path="/category" element={<PrivateRoute element={CategoryDashboard} />} />
        <Route path="/subcategory" element={<PrivateRoute element={SubcategoryDashboard} />} />
        <Route path="/product" element={<PrivateRoute element={ProductDashboard} cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/reservation" element={<PrivateRoute element={ReservationDashboard} cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/listreservation" element={<PrivateRoute element={ListReservation} />} />
        <Route path="/reservations/:reservationId/products" element={<ReservationProducts />} />
        </Routes>
    </Router>
  );
};

export default App;