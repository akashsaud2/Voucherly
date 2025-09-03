import React, { useState } from 'react';

const BusinessList = ({ businesses, onCreate, onSelect, onDelete }) => {
  const [newName, setNewName] = useState('');

  return (
    <div className="business-list-page">
      <h1>Businesses</h1>
      <div className="add-form">
        <input 
          className="form-input"
          placeholder="New business name" 
          value={newName} 
          onChange={e => setNewName(e.target.value)} 
        />
        <button className="action-btn" onClick={() => { onCreate(newName); setNewName(''); }}>Create</button>
      </div>
      <div className="businesses-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map(b => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>
                  <button className="enter-btn" onClick={() => onSelect(b.id)}>Enter</button>
                  <button className="delete-btn" onClick={() => onDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessList;