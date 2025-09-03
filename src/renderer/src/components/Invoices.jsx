import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Invoices = ({ business, updateBusiness }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  //filter the invoices and also sort by number or customers or paid or date
  const filteredInvoices = business.invoices
    .filter(i => 
      i.number.toLowerCase().includes(search.toLowerCase()) || 
      i.customer.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'number':
          valA = a.number;
          valB = b.number;
          break;
        case 'customer':
          valA = a.customer.name.toLowerCase();
          valB = b.customer.name.toLowerCase();
          break;
        case 'total':
          valA = a.total;
          valB = b.total;
          break;
        case 'paid':
          valA = a.paid ? 1 : 0;
          valB = b.paid ? 1 : 0;
          break;
        case 'date':
        default:
          valA = new Date(a.date);
          valB = new Date(b.date);
          break;
      }
      if(valA < valB) return sortDir === 'asc' ? -1 : 1;
      if(valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (column) => {
    if(sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  //duplicate invoice
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

  //edit invoice
  const handleEdit = (invoice) => {
    navigate('/create-invoice', { state: { invoice } });
  };

  //delete invoice
  const handleDelete = (id) => {
    if (window.confirm('Delete invoice?')) {
      updateBusiness({ invoices: business.invoices.filter(i => i.id !== id) });
    }
  };

  //update paid or unpaid invoice
  const handleTogglePaid = (id) => {
    const newInvoices = business.invoices.map(i => 
      i.id === id ? { ...i, paid: !i.paid } : i
    );
    updateBusiness({ invoices: newInvoices });
  };

  return (
    <div className="invoices-page">
      <h1>Invoices</h1>
      <div className="search-section">
        <input 
          className="search-input"
          placeholder="Search by number or customer" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>
      <div className="invoices-table">
        <table>
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('number')}>
                Number {sortBy === 'number' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="sortable" onClick={() => toggleSort('customer')}>
                Customer {sortBy === 'customer' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="sortable" onClick={() => toggleSort('total')}>
                Total {sortBy === 'total' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="sortable" onClick={() => toggleSort('paid')}>
                Status {sortBy === 'paid' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(i => (
              <tr key={i.id}>
                <td>{i.number}</td>
                <td>{i.customer.name}</td>
                <td>${i.total.toFixed(2)}</td>
                <td>{i.paid ? 'Paid' : 'Unpaid'}</td>
                <td>
                  <button className="view-btn" onClick={() => navigate(`/invoice/${i.id}/view`)}>View</button>
                  <button className="duplicate-btn" onClick={() => handleDuplicate(i)}>Duplicate</button>
                  <button className="edit-btn" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="toggle-paid-btn" onClick={() => handleTogglePaid(i.id)}>
                    Mark as {i.paid ? 'Unpaid' : 'Paid'}
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(i.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;