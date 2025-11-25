import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Users.css';

const Users = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, email, orders, spent
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

  useEffect(() => {
    fetchUsers();
  }, [url]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/users`);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error('Error fetching users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        const response = await axios.post(`${url}/api/admin/users/delete`, { userId });
        if (response.data.success) {
          toast.success('User deleted successfully');
          fetchUsers();
        } else {
          toast.error(response.data.message || 'Error deleting user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user');
      }
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'orders':
          aValue = a.totalOrders;
          bValue = b.totalOrders;
          break;
        case 'spent':
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
    <div className="admin-users">
      <div className="users-header">
        <h1>Users Management</h1>
        <p className="users-subtitle">Manage all registered users</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="users-controls">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
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
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="orders">Total Orders</option>
            <option value="spent">Total Spent</option>
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
      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{users.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{users.reduce((sum, u) => sum + u.totalOrders, 0)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">{formatCurrency(users.reduce((sum, u) => sum + u.totalSpent, 0))}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {filteredAndSortedUsers.length === 0 ? (
          <div className="no-users">
            <p>{searchQuery ? 'No users found matching your search.' : 'No users found.'}</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Cart Items</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((user) => (
                <tr key={user._id}>
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-orders">{user.totalOrders}</td>
                  <td className="user-spent">{formatCurrency(user.totalSpent)}</td>
                  <td className="user-cart">{user.cartItemsCount}</td>
                  <td className="user-date">{formatDate(user.createdAt)}</td>
                  <td className="user-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id, user.name)}
                      title="Delete User"
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

export default Users;

