import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import GenericTable from '../components/GenericTable';
import UseFetchData from '../hooks/UseFetchData';
import GenericForm from '../components/GenericForm';

const SubcategoryDashboard = () => {
    const { data: initialSubcategories, loading, error: fetchError } = UseFetchData('subcategory');
    const [subcategories, setSubcategories] = useState(initialSubcategories || []);
    const [categories, setCategories] = useState([]); // Lista de categorías
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubcategory, setCurrentSubcategory] = useState(null);
    const [formType, setFormType] = useState('add');
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (initialSubcategories) {
            setSubcategories(initialSubcategories);
        }
    }, [initialSubcategories]);

    // Obtener categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/category/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleAddClick = () => {
        setCurrentSubcategory({ name: '', measures: '', is_active: true, category_id: categories[0]?.category_id || '' }); // Inicializa con la primera categoría
        setFormType('add');
        setIsModalOpen(true);
        setError('');
    };

    const handleEditClick = (subcategory) => {
        if (!subcategory.id) {
            console.error('Subcategoría sin ID. No se puede editar.');
            return;
        }
        setCurrentSubcategory({ ...subcategory, category_id: subcategory.category_id || '' }); // Asegúrate de incluir el category_id
        setFormType('edit');
        setIsModalOpen(true);
        setError('');
    };

    const handleDisableClick = async (subcategoryId) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/v1/subcategory/disable/${subcategoryId}/`, {
                is_active: false // Cambiar el estado a false
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setSubcategories((prevSubcategories) => 
                prevSubcategories.map(subcat => 
                    subcat.id === subcategoryId ? { ...subcat, is_active: false } : subcat
                )
            );
        } catch (error) {
            console.error('Error disabling subcategory:', error);
        }
    };

    const handleEnableClick = async (subcategoryId) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/v1/subcategory/enable/${subcategoryId}/`, {
                is_active: true
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setSubcategories((prevSubcategories) => 
                prevSubcategories.map(subcat => 
                    subcat.id === subcategoryId ? { ...subcat, is_active: true } : subcat
                )
            );
        } catch (error) {
            console.error('Error enabling subcategory:', error);
        }
    };
    
    const handleSave = async (subcategoryData) => {
        try {
            // Asegúrate de que el category_id se esté configurando correctamente
            const { name, measures, category_id } = subcategoryData; // Desestructuración para obtener solo los campos necesarios
    
            if (formType === 'add') {
                // Crear una nueva subcategoría
                const response = await axios.post('http://127.0.0.1:8000/api/v1/subcategory/', {
                    name,
                    measures,
                    category_id, // Asegúrate de enviar el category_id
                    is_active: true // Asumimos que está activo por defecto
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSubcategories([...subcategories, response.data]);
            } else if (formType === 'edit') {
                if (!subcategoryData.id) {
                    throw new Error('ID de la subcategoría no está definido.'); 
                }
                // Actualizar subcategoría existente
                const response = await axios.put(`http://127.0.0.1:8000/api/v1/subcategory/${subcategoryData.id}/`, {
                    name,
                    measures,
                    category_id, // Asegúrate de enviar el category_id
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const updatedSubcategories = subcategories.map(subcategory =>
                    subcategory.id === subcategoryData.id ? response.data : subcategory
                );
                setSubcategories(updatedSubcategories);
            }
    
            setIsModalOpen(false);
        } catch (error) {
            let errorMessage = 'Ocurrió un error al guardar la categoría.';
            const statusCode = error.response?.status;
            const errorDetail = error.response?.data?.detail;
    
            if (statusCode === 400) {
                errorMessage = errorDetail || 'La categoría ya existe.';
            } else if (statusCode === 422) {
                errorMessage = errorDetail[0]?.msg || 'Error de validación en los datos ingresados.';
            }
    
            setError(errorMessage);
        }
    };        

    const columns = [
        { label: 'ID', field: 'id' },
        { label: 'Nombre', field: 'name' },
        { label: 'Medidas', field: 'measures' },
        { label: 'Categoría', field: 'category_id' },
        { label: 'Activo', field: 'is_active' }
    ];

    if (loading) return <div>Cargando...</div>;
    if (fetchError) return <div>{fetchError}</div>;

    const fields = [
    { name: 'name', label: 'Nombre de la subcategoría', type: 'text', required: true },
    { name: 'measures', label: 'Medida de subcategoría', type: 'text', required: false },
    { 
        name: 'category_id', 
        label: 'Categoría', 
        type: 'select', 
        options: categories.map(category => ({ id: category.id, name: category.name })), 
        required: true 
    }
];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
            <main className="flex-grow p-8">
                <div>
                    <h2 className="text-xl font-bold p-2">Subcategorías</h2>
                    <GenericTable
                        items={subcategories}
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
                        initialData={currentSubcategory}
                        onClose={() => setIsModalOpen(false)}
                        errorMessage={error}
                    />
                </div>
            )}
        </div>
    );
};

export default SubcategoryDashboard;
