import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ token, stallOwner, url }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalMenuItems: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          axios.get(`${url}/api/stall/orders`, { headers: { token } }),
          axios.get(`${url}/api/food/list?stall=${stallOwner?.stallName}`)
        ]);

        if (ordersRes.data.success) {
          const orders = ordersRes.data.data;
          setStats({
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status !== 'Delivered').length,
            totalMenuItems: menuRes.data.success ? menuRes.data.data.length : 0,
            totalRevenue: orders.reduce((sum, o) => sum + (o.stallTotal || 0), 0)
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (token && stallOwner) {
      fetchStats();
    }
  }, [token, stallOwner, url]);

  return (
    <div className="stall-dashboard">
      <h1>Welcome, {stallOwner?.name}</h1>
      <p className="stall-name">{stallOwner?.stallName}</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value">{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Menu Items</h3>
          <p className="stat-value">{stats.totalMenuItems}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

