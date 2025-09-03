import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BusinessList from './components/BusinessList';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Items from './components/Items';
import Customers from './components/Customers';
import Settings from './components/Settings';
import CreateInvoice from './components/CreateInvoice';
import ViewInvoice from './components/ViewInvoice';
import CustomerDetails from './components/CustomerDetails';
import Invoices from './components/Invoices';

const App = () => {
  const [data, setData] = useState({ businesses: [] });
  const [currentBusinessId, setCurrentBusinessId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  //fetch the user data
  useEffect(() => {
    window.electronAPI.loadData().then(setData);
  }, []);

  //save data
  const saveData = (newData) => {
    setData(newData);
    window.electronAPI.saveData(newData);
  };

  const currentBusiness = data.businesses.find(b => b.id === currentBusinessId);

  //create business
  const handleCreateBusiness = (name) => {
    const newBusiness = {
      id: crypto.randomUUID(),
      name,
      settings: { name: '', logo: '', address: '' },
      items: [],
      customers: [],
      invoices: [],
      lastInvoiceNumber: 0,
    };
    const newData = { ...data, businesses: [...data.businesses, newBusiness] };
    saveData(newData);
    setCurrentBusinessId(newBusiness.id);
  };

  //delete business but confirm with the user just in case
  const handleDeleteBusiness = (id) => {
    if(window.confirm('Are you sure you want to delete this business?')) {
      const newData = { ...data, businesses: data.businesses.filter(b => b.id !== id) };
      saveData(newData);
      setCurrentBusinessId(null);
    }
  };

  //function to update save file
  const updateCurrentBusiness = (updates) => {
    const newBusinesses = data.businesses.map(b => 
      b.id === currentBusinessId ? { ...b, ...updates } : b
    );
    saveData({ ...data, businesses: newBusinesses });
  };

  //main page if user have no selected a business
  if(!currentBusinessId) {
    return <BusinessList 
      businesses={data.businesses} 
      onCreate={handleCreateBusiness} 
      onSelect={setCurrentBusinessId} 
      onDelete={handleDeleteBusiness} 
    />;
  }

  //all the pages
  return (
    <div>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`content ${sidebarOpen ? '' : 'full'}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard business={currentBusiness} updateBusiness={updateCurrentBusiness} />} />
          <Route path="/items" element={<Items business={currentBusiness} updateBusiness={updateCurrentBusiness} />} />
          <Route path="/customers" element={<Customers business={currentBusiness} updateBusiness={updateCurrentBusiness} />} />
          <Route path="/customers/:customerId" element={<CustomerDetails business={currentBusiness} updateBusiness={updateCurrentBusiness} />} />
          <Route path="/settings" element={<Settings business={currentBusiness} updateBusiness={updateCurrentBusiness} />} />
          <Route path="/create-invoice" element={<CreateInvoice business={currentBusiness} updateBusiness={updateCurrentBusiness} />} />
          <Route path="/invoice/:id/view" element={<ViewInvoice business={currentBusiness} />} />
          <Route path="/invoices" element={<Invoices business={currentBusiness} updateBusiness={updateCurrentBusiness} />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;