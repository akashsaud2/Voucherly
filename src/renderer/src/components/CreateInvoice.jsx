import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';

const customSelectStyles = {
  //color and css for everything
  control: (provided) => ({
    ...provided,
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-color)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'var(--accent-color)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-color)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'var(--hover-bg)' : 'var(--card-bg)',
    color: 'var(--text-color)',
    '&:hover': {
      backgroundColor: 'var(--hover-bg)',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-color)',
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--text-color)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#888888',
  }),
};

const CreateInvoice = ({ business, updateBusiness }) => {
  const location = useLocation();
  const navigate = useNavigate();

  //prefill invoice if we have any information
  let prefilled = { customer: {}, items: [], taxRate: 0, paid: false };
  if(location.state?.invoice) {
    prefilled = { ...location.state.invoice };
  } else if(location.state?.customer) {
    prefilled.customer = location.state.customer;
  }

  //invoice info
  const [invoice, setInvoice] = useState({
    ...prefilled,
    id: prefilled.id || crypto.randomUUID(),
    number: prefilled.number || `INV-${business.lastInvoiceNumber + 1}`,
    date: prefilled.date || new Date().toISOString(),
  });

  //total and tax
  const subtotal = useMemo(() => invoice.items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0), [invoice.items]);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  //add item to invoice
  const handleAddItem = (selectedItem) => {
    setInvoice({ ...invoice, items: [...invoice.items, { ...selectedItem, quantity: 1 }] });
  };

  //update an item if user changes something
  const handleUpdateItem = (index, updates) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], ...updates };
    setInvoice({ ...invoice, items: newItems });
  };

  //remove an item if user does not want it
  const handleRemoveItem = (index) => {
    setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) });
  };

  //save invoice
  const handleSave = () => {
    const updatedInvoice = { ...invoice, total };
    let newInvoices = business.invoices;
    let newLastInvoiceNumber = business.lastInvoiceNumber;

    //check if same invoice or a new invoice else create new id for it
    if(business.invoices.some(i => i.id === invoice.id)) {
      newInvoices = business.invoices.map(i => i.id === invoice.id ? updatedInvoice : i);
    } else {
      newInvoices = [...business.invoices, updatedInvoice];
      newLastInvoiceNumber += 1;
    }

    updateBusiness({ invoices: newInvoices, lastInvoiceNumber: newLastInvoiceNumber });
    navigate(`/invoice/${invoice.id}/view`);
  };

  return (
    <div className="create-invoice">
      <h1>{business.invoices.some(i => i.id === invoice.id) ? 'Edit Invoice' : 'Create Invoice'}</h1>
      <div className="form-section">
        <label>Select Customer</label>
        <Select 
          styles={customSelectStyles}
          options={business.customers.map(c => ({ value: c, label: c.name }))} 
          onChange={opt => setInvoice({ ...invoice, customer: opt.value })} 
          placeholder="Select Customer" 
          value={invoice.customer?.name ? { label: invoice.customer.name } : null}
        />
        {invoice.customer?.name && (
          <p className="customer-info">Customer: {invoice.customer.name} - {invoice.customer.address}</p>
        )}
      </div>
      <div className="form-section">
        <label>Add Item</label>
        <Select 
          styles={customSelectStyles}
          options={business.items.map(i => ({ value: i, label: `${i.name} - ${i.description} - $${i.price}` }))} 
          onChange={opt => handleAddItem(opt.value)} 
          placeholder="Search and Add Item" 
        />
      </div>
      <div className="items-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>
                  <input 
                    className="edit-input" 
                    value={item.description} 
                    onChange={e => handleUpdateItem(index, { description: e.target.value })} 
                  />
                </td>
                <td>
                  <input 
                    className="edit-input" 
                    type="number" 
                    value={item.price} 
                    onChange={e => handleUpdateItem(index, { price: parseFloat(e.target.value) })} 
                  />
                </td>
                <td>
                  <input 
                    className="edit-input" 
                    type="number" 
                    value={item.quantity || 1} 
                    onChange={e => handleUpdateItem(index, { quantity: parseInt(e.target.value) })} 
                  />
                </td>
                <td>
                  <button className="remove-btn" onClick={() => handleRemoveItem(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="totals-section">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <label>Tax (%)</label>
        <input 
          className="tax-input" 
          type="number" 
          placeholder="Tax %" 
          value={invoice.taxRate} 
          onChange={e => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) })} 
        />
        <p>Tax: ${tax.toFixed(2)}</p>
        <p className="total">Total: ${total.toFixed(2)}</p>
      </div>
      <button className="save-btn" onClick={handleSave}>Save</button>
    </div>
  );
};

export default CreateInvoice;