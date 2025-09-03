import React, { useState } from 'react';

const Settings = ({ business, updateBusiness }) => {
  const [settings, setSettings] = useState(business.settings);

  //save business info
  const handleSave = () => {
    updateBusiness({ settings });
  };

  //update business logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="form-section">
        <label>Business Name</label>
        <input 
          className="form-input"
          placeholder="Business Name" 
          value={settings.name} 
          onChange={e => setSettings({ ...settings, name: e.target.value })} 
        />
      </div>
      <div className="form-section">
        <label>Address</label>
        <textarea 
          className="form-input textarea"
          placeholder="Address (multi-line)" 
          value={settings.address} 
          onChange={e => setSettings({ ...settings, address: e.target.value })} 
        />
      </div>
      <div className="form-section">
        <label>Business Logo</label>
        <input type="file" onChange={handleLogoChange} />
        {settings.logo && <img className="logo-preview" src={settings.logo} alt="Logo" />}
      </div>
      <button className="save-btn" onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;