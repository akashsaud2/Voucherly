import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ business, updateBusiness }) => {
  const navigate = useNavigate();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  //calculate monthly profits
  const monthlyProfit = business.invoices
    .filter(i => i.paid && new Date(i.date).getMonth() === currentMonth && new Date(i.date).getFullYear() === currentYear)
    .reduce((sum, i) => sum + i.total, 0);

  //yearly profits
  const yearlyProfit = business.invoices
    .filter(i => i.paid && new Date(i.date).getFullYear() === now.getFullYear())
    .reduce((sum, i) => sum + i.total, 0);

  //find last month profits as well
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthlyProfit = business.invoices
    .filter(i => i.paid && new Date(i.date).getMonth() === lastMonth && new Date(i.date).getFullYear() === lastMonthYear)
    .reduce((sum, i) => sum + i.total, 0);

  //find the percent change from last month
  let percentChange = 0;
  let changeText = '';
  if(lastMonthlyProfit > 0) {
    percentChange = ((monthlyProfit - lastMonthlyProfit) / lastMonthlyProfit) * 100;
    changeText = `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}% from last month`;
  } else if(monthlyProfit > 0) {
    changeText = 'New growth! (No data last month)';
  }

  const paidInvoices = business.invoices.filter(i => i.paid);
  const unpaidInvoices = business.invoices.filter(i => !i.paid);
  const recentInvoices = [...business.invoices].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  //duplicate invoice function
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

  //update paid or unpaid for an invoice
  const handleTogglePaid = (id) => {
    const newInvoices = business.invoices.map(i => 
      i.id === id ? { ...i, paid: !i.paid } : i
    );
    updateBusiness({ invoices: newInvoices });
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Monthly Profit</h3>
          <p>${monthlyProfit.toFixed(2)}</p>
          <p className={`change ${percentChange > 0 ? 'positive' : percentChange < 0 ? 'negative' : ''}`}>
            {changeText} {percentChange > 0 ? '↑' : percentChange < 0 ? '↓' : ''}
          </p>
        </div>
        <div className="stat-card">
          <h3>Yearly Profit</h3>
          <p>${yearlyProfit.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3 className="paid-text">Paid Invoices</h3>
          <p>{paidInvoices.length} (${paidInvoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)})</p>
        </div>
        <div className="stat-card">
          <h3 className="unpaid-text">Unpaid Invoices</h3>
          <p>{unpaidInvoices.length} (${unpaidInvoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)})</p>
        </div>
      </div>
      <div className="recent-invoices">
        <h2>Recent Invoices</h2>
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map(i => (
              <tr key={i.id}>
                <td>{i.number}</td>
                <td>{i.customer.name}</td>
                <td>${i.total.toFixed(2)}</td>
                <td>{i.paid ? 'Paid' : 'Unpaid'}</td>
                <td>
                  <button className="duplicate-btn" onClick={() => handleDuplicate(i)}>Duplicate</button>
                  <button className="edit-btn" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="toggle-paid-btn" onClick={() => handleTogglePaid(i.id)}>
                    Mark as {i.paid ? 'Unpaid' : 'Paid'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;