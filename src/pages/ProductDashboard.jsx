import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import GenericTable from '../components/GenericTable';
import UseFetchData from '../hooks/UseFetchData';
import GenericForm from '../components/GenericForm';
import config from '../utils/config';

const ProductDashboard = () => {
    const { data: initialProducts, loading, error: fetchError } = UseFetchData('product');
    const [products, setProducts] = useState(initialProducts || []);
    const [subcategories, setSubcategories] = useState([]); // Lista de subcategorías
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formType, setFormType] = useState('add');
    const [error, setError] = useState('');

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
                const response = await axios.get(config.API_BASE_URL + 'subcategory/', {
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
            await axios.patch(config.API_BASE_URL + `product/disable/${productCode}/`, {
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
            await axios.patch(config.API_BASE_URL + `product/enable/${productCode}/`, {
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
                const response = await axios.post(config.API_BASE_URL + 'product/', {
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
                const response = await axios.put(config.API_BASE_URL + `product/${id}/`, {
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
    
            if (statusCode === 400) {
                errorMessage = errorDetail || 'El producto ya existe.';
            } else if (statusCode === 422) {
                errorMessage = errorDetail[0]?.msg || 'Error de validación en los datos ingresados.';
            }
    
            setError(errorMessage);
        }
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
            options: subcategories.map(subcategory => ({ id: subcategory.id, name: subcategory.name })), 
            required: true 
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
            <main className="flex-grow p-8">
                <div>
                    <h2 className="text-xl font-bold p-2">Productos</h2>
                    <GenericTable
                        items={products}
                        columns={columns}
                        handleAddClick={handleAddClick}
                        handleEditClick={handleEditClick}
                        handleDisableClick={handleDisableClick}
                        handleEnableClick={handleEnableClick}
                    />
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
