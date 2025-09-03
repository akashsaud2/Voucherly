import React, { useState } from 'react';

const Items = ({ business, updateBusiness }) => {
  const [search, setSearch] = useState('');
  const [newItem, setNewItem] = useState({ name: '', description: '', price: 0 });
  const [editingId, setEditingId] = useState(null);

  //filter item if searched
  const filteredItems = business.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  //add or edit an item
  const handleAddOrEdit = () => {
    let newItems;
    if(editingId) {
      newItems = business.items.map(i => i.id === editingId ? { ...i, ...newItem } : i);
    } else {
      newItems = [...business.items, { id: crypto.randomUUID(), ...newItem }];
    }
    updateBusiness({ items: newItems });
    setNewItem({ name: '', description: '', price: 0 });
    setEditingId(null);
  };

  //edit an item
  const handleEdit = (item) => {
    setNewItem(item);
    setEditingId(item.id);
  };

  //delete an item but confirm
  const handleDelete = (id) => {
    if(window.confirm('Delete item?')) {
      updateBusiness({ items: business.items.filter(i => i.id !== id) });
    }
  };

  return (
    <div className="items-page">
      <h1>Items</h1>
      <div className="search-section">
        <input 
          className="search-input"
          placeholder="Search items" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>
      <div className="add-edit-form">
        <input 
          className="form-input"
          placeholder="Name" 
          value={newItem.name} 
          onChange={e => setNewItem({ ...newItem, name: e.target.value })} 
        />
        <input 
          className="form-input"
          placeholder="Description" 
          value={newItem.description} 
          onChange={e => setNewItem({ ...newItem, description: e.target.value })} 
        />
        <input 
          className="form-input"
          type="number" 
          placeholder="Price" 
          value={newItem.price} 
          onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} 
        />
        <button className="action-btn" onClick={handleAddOrEdit}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>
      <div className="items-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.description}</td>
                <td>${i.price.toFixed(2)}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(i)}>Edit</button>
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

export default Items;