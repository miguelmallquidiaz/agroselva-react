import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import InventorySummary from '../components/InventorySummary';
// import InventoryTable from '../components/InventoryTable';
// import Modal from '../components/Modal';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const [showModal, setShowModal] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    // const handleAddClick = () => setShowModal(true);
    // const handleCloseModal = () => setShowModal(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 relative">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={toggleSidebar} />
            <main className="flex-grow p-8">
                <div>
                    <h2 className="text-xl font-bold p-2">Panel Principal</h2>
                    <div className="grid gap-4 mb-6 lg:grid-cols-3">
                        {/* <InventorySummary title="Total Products" count="1200" /> */}
                        {/* <InventorySummary title="In Stock" count="1000" /> */}
                        {/* <InventorySummary title="Out of Stock" count="200" /> */}
                    </div>
                    {/* <InventoryTable handleAddClick={handleAddClick} /> */}
                </div>
                {/* <Modal showModal={showModal} handleCloseModal={handleCloseModal} /> */}
            </main>

        </div>
    );
};

export default Dashboard;
