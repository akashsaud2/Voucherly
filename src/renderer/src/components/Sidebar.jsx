import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaFileInvoice, FaBox, FaUsers, FaFileAlt, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

//open or close sidebar
const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      <button className="toggle" onClick={onToggle} title={open ? 'Close' : 'Open'}>
        {open ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      <ul>
        <li>
          <button className="nav-item" onClick={() => navigate(-1)} title="Back">
            <FaArrowLeft className="icon" />
            {open && <span>Back</span>}
          </button>
        </li>
        <li>
          <Link to="/dashboard" className="nav-item" title="Dashboard">
            <FaHome className="icon" />
            {open && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/create-invoice" className="nav-item" title="Create Invoice">
            <FaFileInvoice className="icon" />
            {open && <span>Create Invoice</span>}
          </Link>
        </li>
        <li>
          <Link to="/items" className="nav-item" title="Items">
            <FaBox className="icon" />
            {open && <span>Items</span>}
          </Link>
        </li>
        <li>
          <Link to="/customers" className="nav-item" title="Customers">
            <FaUsers className="icon" />
            {open && <span>Customers</span>}
          </Link>
        </li>
        <li>
          <Link to="/invoices" className="nav-item" title="Invoices">
            <FaFileAlt className="icon" />
            {open && <span>Invoices</span>}
          </Link>
        </li>
        <li>
          <Link to="/settings" className="nav-item" title="Settings">
            <FaCog className="icon" />
            {open && <span>Settings</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;