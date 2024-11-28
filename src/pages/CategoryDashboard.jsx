import React, { useState } from 'react';
import Header from '../components/Header';
import GenericTable from '../components/GenericTable';
import UseFetchData from '../hooks/UseFetchData';
import axios from 'axios';
import GenericForm from '../components/GenericForm';
import config from '../utils/config';

const CategoryDashboard = () => {
    const { data: initialCategories, loading, error: fetchError } = UseFetchData('categories');
    const [categories, setCategories] = useState(initialCategories || []); // Estado para las categorías
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formType, setFormType] = useState('add'); // 'add' or 'edit'
    const [error, setError] = useState(''); // Estado para manejar errores
    const [errorMessage, setErrorMessage] = useState('');
    // Efecto para sincronizar las categorías cuando se cargan los datos
    React.useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const handleAddClick = () => {
        setCurrentCategory({ name: '', description: '' });
        setFormType('add');
        setIsModalOpen(true);
        setError(''); // Limpiar error al abrir el modal
    };

    const handleEditClick = (category) => {
        setCurrentCategory(category);
        setFormType('edit');
        setIsModalOpen(true);
        setError(''); // Limpiar error al abrir el modal
    };

    const handleDisableClick = async (categoryId) => {
        try {
            await axios.put(config.API_BASE_URL + `categories/${categoryId}/`, {
                is_active: false // Cambiar el estado a false
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            // Actualizar el estado local para eliminar la categoría deshabilitada
            // setCategories(categories.filter(cat => cat.id !== categoryId));
            setCategories((prevCategories) =>
                prevCategories.map(cat =>
                    cat.id === categoryId ? { ...cat, is_active: false } : cat
                )
            );
        } catch (error) {
            console.error('Error disabling category:', error);
        }
    };

    const handleEnableClick = async (categoryId) => {
        try {
            await axios.put(config.API_BASE_URL + `categories/${categoryId}/`, {
                is_active: true
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            // Actualizar el estado local para eliminar la categoría deshabilitada
            // setCategories(categories.filter(cat => cat.id !== categoryId));
            setCategories((prevCategories) =>
                prevCategories.map(cat =>
                    cat.id === categoryId ? { ...cat, is_active: true } : cat
                )
            );
        } catch (error) {
            console.error('Error disabling category:', error);
        }
    };

    const handleSave = async (categoryData) => {
        if (!categoryData.name) {
            setError('El nombre de la categoría es obligatorio.');
            return;
        }

        try {
            if (formType === 'add') {
                const response = await axios.post(config.API_BASE_URL + 'categories/', categoryData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                setCategories([...categories, response.data]); // Agregar la nueva categoría al estado
                console.log('Categoría añadida.');
            } else if (formType === 'edit') {
                if (currentCategory && currentCategory.id) {
                    const updatedData = {
                        name: categoryData.name,
                        is_active: currentCategory.is_active, // Preservar el estado activo, o puedes cambiarlo según tu lógica
                    };

                    // Llamar al endpoint PUT para actualizar la categoría
                    await axios.put(config.API_BASE_URL + `categories/${currentCategory.id}/`, updatedData, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    // Actualiza el estado local
                    const updatedCategories = categories.map(cat =>
                        cat.id === currentCategory.id ? { ...cat, ...updatedData } : cat
                    );
                    setCategories(updatedCategories);
                    console.log('Categoría actualizada.');
                } else {
                    throw new Error('ID de categoría no válido.');
                }
            }

            setIsModalOpen(false);
            setError('');
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
        { label: 'Estado', field: 'is_active' }
    ];

    if (fetchError) return <div>{fetchError}</div>; // Mensaje de error al cargar categorías

    const fields = [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
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
                        <h2 className="text-xl font-bold">Categorías</h2>
                        <GenericTable
                            items={categories}
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
                            initialData={currentCategory}
                            onClose={() => setIsModalOpen(false)}
                            errorMessage={error} // Pasar mensaje de error a GenericForm
                            setErrorMessage={setErrorMessage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryDashboard;
