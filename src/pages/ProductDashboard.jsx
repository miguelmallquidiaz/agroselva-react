import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import GenericTable from '../components/GenericTable';
import UseFetchData from '../hooks/UseFetchData';
import GenericForm from '../components/GenericForm';
import config from '../utils/config';
import { jwtDecode } from "jwt-decode";

const ProductDashboard = () => {
    const { data: initialProducts, loading, error: fetchError } = UseFetchData('products');
    const [products, setProducts] = useState(initialProducts || []);
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = sessionStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : []; // Carga del sessionStorage
    });
    const [subcategories, setSubcategories] = useState([]); // Lista de subcategorías
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formType, setFormType] = useState('add');
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (initialProducts) {
            console.log(initialProducts);
            setProducts(initialProducts);
        }
    }, [initialProducts]);

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

    // Obtener subcategorías
    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axios.get(config.API_BASE_URL + 'subcategories/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                console.log(response.data);
                setSubcategories(response.data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        };

        fetchSubcategories();
    }, []);

    const handleAddClick = () => {
        setCurrentProduct({ name: '', total_stock: 0, is_active: true, subcategory_id: subcategories[0]?.subcategory_id || '' });
        setFormType('add');
        setIsModalOpen(true);
        setError('');
    };

    const handleEditClick = (product) => {
        if (!product.id) {
            console.error('Producto sin id. No se puede editar.');
            return;
        }
        setCurrentProduct({ ...product, subcategory_id: product.subcategory_id || '', id: product.id });
        console.log(product);
        setFormType('edit');
        setIsModalOpen(true);
        setError('');
    };

    const handleDisableClick = async (productCode) => {
        try {
            await axios.put(config.API_BASE_URL + `products/${productCode}/`, {
                is_active: false
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setProducts((prevProducts) =>
                prevProducts.map(prod =>
                    prod.id === productCode ? { ...prod, is_active: false } : prod
                )
            );
        } catch (error) {
            console.error('Error disabling product:', error);
        }
    };

    const handleEnableClick = async (productCode) => {
        try {
            await axios.put(config.API_BASE_URL + `products/${productCode}/`, {
                is_active: true
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setProducts((prevProducts) =>
                prevProducts.map(prod =>
                    prod.id === productCode ? { ...prod, is_active: true } : prod
                )
            );
        } catch (error) {
            console.error('Error enabling product:', error);
        }
    };

    const handleSave = async (productData) => {
        console.log("Datos del producto al guardar:", productData);
        try {
            const { name, total_stock, unit_price, subcategory_id, id } = productData;

            if (formType === 'add') {
                // Lógica para agregar un nuevo producto
                const response = await axios.post(config.API_BASE_URL + 'products/', {
                    name,
                    total_stock,
                    unit_price,
                    subcategory_id,
                    is_active: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                setProducts([...products, response.data]);
            } else if (formType === 'edit') {
                if (!id) {
                    throw new Error('El código del producto no está definido.');
                }
                // Lógica para editar un producto existente
                const response = await axios.put(config.API_BASE_URL + `products/${id}/`, {
                    name,
                    total_stock,
                    unit_price,
                    subcategory_id,
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const updatedProducts = products.map(product =>
                    product.id === id ? response.data : product
                );
                setProducts(updatedProducts);
            }

            setIsModalOpen(false);
        } catch (error) {
            let errorMessage = 'Ocurrió un error al guardar el producto.';
            const statusCode = error.response?.status;
            const errorDetail = error.response?.data?.detail;

            if (statusCode === 401) {
                errorMessage = errorDetail || 'El producto ya existe.';
            } else if (statusCode === 422) {
                errorMessage = errorDetail[0]?.msg || 'Error de validación en los datos ingresados.';
            }

            setError(errorMessage);
        }
    };


    const handleAddToCart = () => {
        // Muestra la alerta
        setShowAlert(true);

        // Oculta la alerta después de 3 segundos
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const handleAddToCartClick = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                const updatedItems = prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                sessionStorage.setItem('cart', JSON.stringify(updatedItems)); // Actualiza sessionStorage
                return updatedItems;
            } else {
                const newItem = { ...product, quantity };
                const updatedItems = [...prevItems, newItem];
                sessionStorage.setItem('cart', JSON.stringify(updatedItems)); // Actualiza sessionStorage
                return updatedItems;
            }
        });
        handleAddToCart();
    };

    const columns = [
        { label: 'Código', field: 'id' },
        { label: 'Nombre', field: 'name' },
        { label: 'Stock Total', field: 'total_stock' },
        { label: 'Subcategoría', field: 'subcategory_id' },
        { label: 'Activo', field: 'is_active' },
    ];

    if (fetchError) return <div>{fetchError}</div>;

    const fields = [
        { name: 'name', label: 'Nombre del producto', type: 'text', required: true },
        { name: 'total_stock', label: 'Stock Total', type: 'number', required: true },
        {
            name: 'subcategory_id',
            label: 'Subcategoría',
            type: 'select',
            options: subcategories
                .filter(subcategory => subcategory.is_active) // Filtrar subcategorías activas
                .map(subcategory => ({ id: subcategory.id, name: subcategory.name })),
            required: true
        }
    ];

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
                        <h2 className="text-xl font-bold">Productos</h2>
                        {showAlert && (
    <div
        id="alert-border-3"
        className="flex items-center p-4 mt-4 text-green-800 border-t-4 border-green-300 bg-green-50"
        role="alert"
    >
        <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <div className="ms-3 text-sm font-medium">
            Producto agregado al carrito con éxito.
        </div>
        <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8"
            onClick={() => setShowAlert(false)}
            aria-label="Close"
        >
            <span className="sr-only">Cerrar</span>
            <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
            </svg>
        </button>
    </div>
)}

                        <GenericTable
                            items={products}
                            columns={columns}
                            handleAddClick={role === 'almacen' ? handleAddClick : null}
                            handleEditClick={role === 'almacen' ? handleEditClick : null}
                            handleDisableClick={role === 'almacen' ? handleDisableClick : null}
                            handleEnableClick={role === 'almacen' ? handleEnableClick : null}
                            handleAddToCartClick={handleAddToCartClick}
                        />
                        <Link to="/reservation">
                            <button className="bg-blue-500 text-white p-2 rounded mt-4">Registrar pedido</button>
                        </Link>
                    </div>
                </main>
                {isModalOpen && (
                    <div className="modal">
                        <GenericForm
                            onSave={handleSave}
                            fields={fields}
                            initialData={currentProduct}
                            onClose={() => setIsModalOpen(false)}
                            errorMessage={error}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDashboard;
