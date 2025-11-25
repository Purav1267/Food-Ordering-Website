import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Orders from './components/Orders/Orders';
import Menu from './components/Menu/Menu';
import Navbar from './components/Navbar/Navbar';
import './App.css';

const App = () => {
  const [token, setToken] = useState('');
  const [stallOwner, setStallOwner] = useState(null);
  const navigate = useNavigate();
  const url = "http://localhost:4000";

  useEffect(() => {
    const storedToken = localStorage.getItem('stallOwnerToken');
    const storedStallOwner = localStorage.getItem('stallOwner');
    if (storedToken && storedStallOwner) {
      setToken(storedToken);
      setStallOwner(JSON.parse(storedStallOwner));
      
      // Refresh stall owner info from backend to get latest stallName
      const refreshStallOwnerInfo = async () => {
        try {
          const response = await axios.get(`${url}/api/stall-owner/info`, {
            headers: { token: storedToken }
          });
          if (response.data.success) {
            const updatedStallOwner = {
              id: JSON.parse(storedStallOwner).id,
              name: response.data.data.name,
              stallName: response.data.data.stallName
            };
            localStorage.setItem('stallOwner', JSON.stringify(updatedStallOwner));
            setStallOwner(updatedStallOwner);
          }
        } catch (error) {
          console.error('Error refreshing stall owner info:', error);
        }
      };
      refreshStallOwnerInfo();
    } else {
      navigate('/login');
    }
  }, [navigate, url]);

  const handleLogout = () => {
    localStorage.removeItem('stallOwnerToken');
    localStorage.removeItem('stallOwner');
    setToken('');
    setStallOwner(null);
    navigate('/login');
  };

  return (
    <div className="stall-admin-app">
      {token && <Navbar stallOwner={stallOwner} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setStallOwner={setStallOwner} url={url} />} />
        <Route path="/dashboard" element={<Dashboard token={token} stallOwner={stallOwner} url={url} />} />
        <Route path="/orders" element={<Orders token={token} stallOwner={stallOwner} url={url} />} />
        <Route path="/menu" element={<Menu token={token} stallOwner={stallOwner} url={url} />} />
        <Route path="/" element={token ? <Dashboard token={token} stallOwner={stallOwner} url={url} /> : <Login setToken={setToken} setStallOwner={setStallOwner} url={url} />} />
      </Routes>
    </div>
  );
};

export default App;

