import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

//get the invoice to view else error
const ViewInvoice = ({ business }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoice = business.invoices.find(i => i.id === id);

  if(!invoice) return <p className="error-message">Invoice not found</p>;

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

  //total and tax
  const subtotal = invoice.items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  //print the invoice or save it
  const handlePrint = () => window.print();

  return (
    <div className="view-invoice-page">
      <div className="actions no-print">
        <button className="edit-btn" onClick={() => navigate('/create-invoice', { state: { invoice } })}>Edit</button>
        <button className="duplicate-btn" onClick={() => handleDuplicate(invoice)}>Duplicate</button>
        <button className="print-btn" onClick={handlePrint}>Print Invoice</button>
      </div>
      <div className="invoice-preview">
        <header>
          <div className="business-info">
            {business.settings.logo && <img src={business.settings.logo} alt="Logo" width="150" />}
            <h2>{business.settings.name || 'Your Business'}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{business.settings.address || 'Business Address'}</p>
          </div>
          <div className="invoice-info">
            <h3>Invoice #{invoice.number}</h3>
            <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
          </div>
        </header>
        <div className="bill-to">
          <h4>Bill To:</h4>
          <p>{invoice.customer.name || 'Customer Name'}</p>
          <p style={{ whiteSpace: 'pre-line' }}>{invoice.customer.address || 'Customer Address'}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity || 1}</td>
                <td>${(item.price * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="totals">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax ({invoice.taxRate}%): ${tax.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;