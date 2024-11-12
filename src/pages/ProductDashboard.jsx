import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import GenericTable from '../components/GenericTable';
import UseFetchData from '../hooks/UseFetchData';
import GenericForm from '../components/GenericForm';
import config from '../utils/config';

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

    useEffect(() => {
        if (initialProducts) {
            console.log(initialProducts);
            setProducts(initialProducts);
        }
    }, [initialProducts]);

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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleAddClick = () => {
        setCurrentProduct({ name: '', total_stock: 0, unit_price: 0, is_active: true, subcategory_id: subcategories[0]?.subcategory_id || '' });
        setFormType('add');
        setIsModalOpen(true);
        setError('');
    };

    const handleEditClick = (product) => {
        if (!product.id) { // Cambia aquí para verificar el id
            console.error('Producto sin id. No se puede editar.'); // Mensaje de error actualizado
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
            await axios.patch(config.API_BASE_URL + `products/disable/${productCode}/`, {
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
            await axios.patch(config.API_BASE_URL + `products/enable/${productCode}/`, {
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


    const QuantityForm = ({ quantity, setQuantity }) => {
        const handleChange = (e) => {
            const newQuantity = Number(e.target.value);
            // Validar que la cantidad sea al menos 1
            if (newQuantity < 1 || isNaN(newQuantity)) {
                setQuantity(1); // Establecer la cantidad a 1 si es menor a 1 o NaN
            } else {
                setQuantity(newQuantity); // De lo contrario, establecer la nueva cantidad
            }
        };

        return (
            <div className="mb-4">
                <label htmlFor="quantity" className="block mb-2 '">Cantidad:</label>
                <input
                    type="number"
                    id="quantity"
                    min="1" // Asegurarse de que el campo no permita valores menores a 1
                    value={quantity}
                    onChange={handleChange} // Usar la nueva función handleChange
                    className="w-1/4 p-2 border border-gray-300 rounded"
                />
            </div>
        );
    };


    const columns = [
        { label: 'Código', field: 'id' },
        { label: 'Nombre', field: 'name' },
        { label: 'Stock Total', field: 'total_stock' },
        { label: 'Precio Unitario', field: 'unit_price' },
        { label: 'Subcategoría', field: 'subcategory_id' },
        { label: 'Activo', field: 'is_active' }
    ];

    if (loading) return <div>Cargando...</div>;
    if (fetchError) return <div>{fetchError}</div>;

    const fields = [
        { name: 'name', label: 'Nombre del producto', type: 'text', required: true },
        { name: 'total_stock', label: 'Stock Total', type: 'number', required: true },
        { name: 'unit_price', label: 'Precio Unitario', type: 'number', required: true },
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
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
            <main className="flex-grow p-8">
                <div>
                    <h2 className="text-xl font-bold">Productos</h2>
                    {showAlert && (
                        <div
                            id="alert-border-3"
                            className="flex items-center p-4 mt-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
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
                                className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
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
                    <QuantityForm quantity={quantity} setQuantity={setQuantity} />
                    <GenericTable
                        items={products}
                        columns={columns}
                        handleAddClick={handleAddClick}
                        handleEditClick={handleEditClick}
                        handleDisableClick={handleDisableClick}
                        handleEnableClick={handleEnableClick}
                        handleAddToCartClick={handleAddToCartClick}
                    />
                    <Link to="/reservation">
                        <button className="bg-blue-500 text-white p-2 rounded mt-4">Ir a Reservas</button>
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
    );
};

export default ProductDashboard;
