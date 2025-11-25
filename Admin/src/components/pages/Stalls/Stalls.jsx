import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Stalls.css';

const Stalls = ({ url }) => {
  const [stalls, setStalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('stallName'); // stallName, orders, revenue, menuItems
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchStalls();
  }, [url]);

  const fetchStalls = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/stalls`);
      if (response.data.success) {
        setStalls(response.data.data);
      } else {
        toast.error('Error fetching stalls');
      }
    } catch (error) {
      console.error('Error fetching stalls:', error);
      toast.error('Error fetching stalls');
    }
  };

  const handleDelete = async (stallId, stallName) => {
    if (window.confirm(`Are you sure you want to delete stall "${stallName}"? This will also delete all menu items associated with this stall. This action cannot be undone.`)) {
      try {
        const response = await axios.post(`${url}/api/admin/stalls/delete`, { stallId });
        if (response.data.success) {
          toast.success('Stall deleted successfully');
          fetchStalls();
        } else {
          toast.error(response.data.message || 'Error deleting stall');
        }
      } catch (error) {
        console.error('Error deleting stall:', error);
        toast.error('Error deleting stall');
      }
    }
  };

  // Filter and sort stalls
  const filteredAndSortedStalls = stalls
    .filter(stall => {
      const query = searchQuery.toLowerCase();
      return (
        stall.stallName.toLowerCase().includes(query) ||
        stall.name.toLowerCase().includes(query) ||
        stall.email.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'stallName':
          aValue = a.stallName.toLowerCase();
          bValue = b.stallName.toLowerCase();
          break;
        case 'orders':
          aValue = a.totalOrders;
          bValue = b.totalOrders;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'menuItems':
          aValue = a.menuItemsCount;
          bValue = b.menuItemsCount;
          break;
        default:
          aValue = a.stallName.toLowerCase();
          bValue = b.stallName.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="admin-stalls">
      <div className="stalls-header">
        <h1>Stalls Management</h1>
        <p className="stalls-subtitle">Manage all registered stalls and stall owners</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="stalls-controls">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search by stall name, owner name, or email..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>
        
        <div className="sort-container">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="stallName">Stall Name</option>
            <option value="orders">Total Orders</option>
            <option value="revenue">Revenue</option>
            <option value="menuItems">Menu Items</option>
          </select>
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stalls-stats">
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <p className="stat-label">Total Stalls</p>
            <p className="stat-value">{stalls.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-info">
            <p className="stat-label">Total Menu Items</p>
            <p className="stat-value">{stalls.reduce((sum, s) => sum + s.menuItemsCount, 0)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{stalls.reduce((sum, s) => sum + s.totalOrders, 0)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">{formatCurrency(stalls.reduce((sum, s) => sum + s.revenue, 0))}</p>
          </div>
        </div>
      </div>

      {/* Stalls Table */}
      <div className="stalls-table-container">
        {filteredAndSortedStalls.length === 0 ? (
          <div className="no-stalls">
            <p>{searchQuery ? 'No stalls found matching your search.' : 'No stalls found.'}</p>
          </div>
        ) : (
          <table className="stalls-table">
            <thead>
              <tr>
                <th>Stall Name</th>
                <th>Owner Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Menu Items</th>
                <th>Total Orders</th>
                <th>Revenue</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStalls.map((stall) => (
                <tr key={stall._id}>
                  <td className="stall-name">{stall.stallName}</td>
                  <td className="owner-name">{stall.name}</td>
                  <td className="stall-email">{stall.email}</td>
                  <td className="stall-phone">{stall.phone}</td>
                  <td className="stall-menu-items">{stall.menuItemsCount}</td>
                  <td className="stall-orders">{stall.totalOrders}</td>
                  <td className="stall-revenue">{formatCurrency(stall.revenue)}</td>
                  <td className="stall-date">{formatDate(stall.createdAt)}</td>
                  <td className="stall-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(stall._id, stall.stallName)}
                      title="Delete Stall"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Stalls;

