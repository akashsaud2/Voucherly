import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CustomerDetails = ({ business, updateBusiness }) => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const customer = business.customers.find(c => c.id === customerId);
  const customerInvoices = business.invoices.filter(i => i.customer.id === customerId).sort((a, b) => new Date(b.date) - new Date(a.date));

  //create duplicate invoice
  const handleDuplicate = (invoice) => {
    const newInvoice = { 
      ...invoice, 
      id: crypto.randomUUID(), 
      number: `INV-${business.lastInvoiceNumber + 1}`, 
      date: new Date().toISOString(), 
      paid: false 
    };
    navigate('/create-invoice', { state: { invoice: newInvoice } });
  };

  //edit an invoice
  const handleEdit = (invoice) => {
    navigate('/create-invoice', { state: { invoice } });
  };

  //delete an invoice
  const handleDeleteInvoice = (id) => {
    if(window.confirm('Delete invoice?')) {
      updateBusiness({ invoices: business.invoices.filter(i => i.id !== id) });
    }
  };

  //update invoice to paid or unpaid
  const handleTogglePaid = (id) => {
    const newInvoices = business.invoices.map(i => 
      i.id === id ? { ...i, paid: !i.paid } : i
    );
    updateBusiness({ invoices: newInvoices });
  };

  return (
    <div className="customer-details">
      <h1>{customer.name} Details</h1>
      <p>Address: {customer.address}</p>
      <div className="invoices-list">
        <h2>Invoices</h2>
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerInvoices.map(i => (
              <tr key={i.id}>
                <td>{i.number}</td>
                <td>${i.total.toFixed(2)}</td>
                <td>{i.paid ? 'Paid' : 'Unpaid'}</td>
                <td>
                  <button className="view-btn" onClick={() => navigate(`/invoice/${i.id}/view`)}>View</button>
                  <button className="duplicate-btn" onClick={() => handleDuplicate(i)}>Duplicate</button>
                  <button className="edit-btn" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="toggle-paid-btn" onClick={() => handleTogglePaid(i.id)}>
                    Mark as {i.paid ? 'Unpaid' : 'Paid'}
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteInvoice(i.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDetails;