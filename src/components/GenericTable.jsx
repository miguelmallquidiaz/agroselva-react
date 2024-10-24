import React from 'react';

const GenericTable = ({ items, columns, handleAddClick, handleEditClick, handleDisableClick, handleEnableClick }) => {
    return (
        <>
            <button onClick={handleAddClick} className="mb-4 p-2 bg-blue-500 text-white rounded">Agregar</button>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 text-white">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className="py-2 px-4 border-b border-gray-600 text-center">{column.label}</th>
                            ))}
                            <th className="py-2 px-4 border-b border-gray-600 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="py-4 text-center text-gray-400">No hay datos disponibles</td>
                            </tr>
                        ) : (
                            items.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-700">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="border-b border-gray-600 px-4 py-2 text-center">
                                            {column.field === 'is_active' ? (item[column.field] ? 'Activo' : 'Inactivo') : item[column.field]}
                                        </td>
                                    ))}
                                    <td className="border-b border-gray-600 px-4 py-2 text-center">
                                        <div className="flex justify-center space-x-4">
                                            <button onClick={() => handleEditClick(item)} className="text-blue-400 hover:text-blue-600">
                                                <svg className="w-6 h-6 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDisableClick(item.id)} className="text-red-400 hover:text-red-600">
                                                <svg className="w-6 h-6 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleEnableClick(item.id)} className="text-green-400 hover:text-green-600">
                                                <svg className="w-6 h-6 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default GenericTable;
