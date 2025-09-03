import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Customers = ({ business, updateBusiness }) => {
  const [search, setSearch] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  //filter customer by search
  const filteredCustomers = business.customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  //add or edit a customer
  const handleAddOrEdit = () => {
    let newCustomers;
    if(editingId) {
      newCustomers = business.customers.map(c => c.id === editingId ? { ...c, ...newCustomer } : c);
    } else {
      newCustomers = [...business.customers, { id: crypto.randomUUID(), ...newCustomer }];
    }
    updateBusiness({ customers: newCustomers });
    setNewCustomer({ name: '', address: '' });
    setEditingId(null);
  };

  //if edit set to edit mode
  const handleEdit = (customer) => {
    setNewCustomer(customer);
    setEditingId(customer.id);
  };

  //delete customer but confirm first
  const handleDelete = (id) => {
    if(window.confirm('Delete customer?')) {
      updateBusiness({ customers: business.customers.filter(c => c.id !== id) });
    }
  };

  //create invoice for customer with information pre filled
  const handleCreateInvoice = (customer) => {
    navigate('/create-invoice', { state: { customer } });
  };

  return (
    <div className="customers-page">
      <h1>Customers</h1>
      <div className="search-section">
        <input 
          className="search-input"
          placeholder="Search customers" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>
      <div className="add-edit-form">
        <input 
          className="form-input"
          placeholder="Name" 
          value={newCustomer.name} 
          onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} 
        />
        <textarea 
          className="form-input textarea"
          placeholder="Address" 
          value={newCustomer.address} 
          onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} 
        />
        <button className="action-btn" onClick={handleAddOrEdit}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>
      <div className="customers-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td style={{ whiteSpace: 'pre-line' }}>{c.address}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(c)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(c.id)}>Delete</button>
                  <button className="create-invoice-btn" onClick={() => handleCreateInvoice(c)}>Create Invoice</button>
                  <Link className="view-details-link" to={`/customers/${c.id}`}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;