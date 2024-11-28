import React, { useState } from 'react';

const GenericForm = ({ onSave, fields, initialData = {}, onClose, errorMessage }) => {
    // Modificación aquí: El 'id' debe estar en initialData cuando edites
    const initialState = fields.reduce((acc, field) => {
        acc[field.name] = initialData[field.name] || ''; // Asegúrate de que se inicie con ''
        return acc;
    }, {});

    // Asegúrate de incluir el 'id' en el estado del formulario
    initialState.id = initialData.id || '';  // Asegúrate de que el id esté en el estado

    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);  // Asegúrate de que el id se incluya aquí
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <form
                className="bg-white text-black p-6 rounded-lg shadow-md max-w-sm w-full relative"
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                {errorMessage && (
                    <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black transition duration-200"
                >
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {fields.map((field) => (
                    <div key={field.name} className="mb-4">
                        <label htmlFor={field.name} className="block text-sm font-medium mb-1">
                            {field.label}
                        </label>
                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                id={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:ring focus:ring-gray-200 transition duration-200"
                            >
                                <option value="">Seleccione una opción</option>
                                {field.options.map((option, index) => (
                                    <option key={`${option.id}-${index}`} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:ring focus:ring-gray-200 transition duration-200"
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-600 transition duration-200"
                >
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default GenericForm;
