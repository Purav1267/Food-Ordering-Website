import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = ({ token, stallOwner, url }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [orderFeedbacks, setOrderFeedbacks] = useState({});
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All'); // Filter by status
  const [expandedDates, setExpandedDates] = useState(new Set()); // Track expanded date sections
  const [searchQuery, setSearchQuery] = useState(''); // Search orders

  useEffect(() => {
    fetchOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [token, url]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/stall/orders`, {
        headers: { token }
      });
      if (response.data.success) {
        const sortedOrders = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Normalize orders (no acceptance logic needed)
        const normalizedOrders = sortedOrders;
        
        setOrders(normalizedOrders);
        
        // Fetch feedbacks for delivered orders
        for (const order of normalizedOrders) {
          if (order.status === 'Delivered' && order.stallItems) {
            fetchOrderFeedbacks(order._id, order.stallItems);
          }
        }
      }
    } catch (error) {
      toast.error('Error fetching orders');
    }
  };

  const fetchOrderFeedbacks = async (orderId, items) => {
    try {
      const feedbacks = {};
      for (const item of items) {
        const itemId = item.itemId || item._id;
        const response = await axios.get(`${url}/api/feedback/item/${itemId}`);
        if (response.data.success) {
          // Find feedback for this specific order
          const orderFeedback = response.data.data.find(fb => fb.orderId === orderId);
          if (orderFeedback) {
            feedbacks[itemId] = orderFeedback;
          }
        }
      }
      setOrderFeedbacks(prev => ({ ...prev, [orderId]: feedbacks }));
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        `${url}/api/stall/update-status`,
        { orderId, status },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message || 'Order status updated');
        // Immediately update the local state for instant feedback
        setOrders(prevOrders => 
          prevOrders.map(order => {
            if (order._id === orderId) {
              return {
                ...order,
                stallStatus: status,
                status: status // Also update main status for backward compatibility
              };
            }
            return order;
          })
        );
        // Then fetch fresh data from server
        setTimeout(() => {
          fetchOrders();
        }, 500);
      } else {
        toast.error(response.data.message || 'Error updating status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };


  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getDateKey = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString(); // Returns unique date string
  };

  // Group orders by date and status
  const organizeOrdersByDateAndStatus = () => {
    // First filter by status if selected
    let filteredOrders = orders;
    if (selectedStatusFilter !== 'All') {
      filteredOrders = orders.filter(order => (order.stallStatus || order.status) === selectedStatusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredOrders = filteredOrders.filter(order => {
        const orderId = order._id.toLowerCase();
        const customerName = `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.toLowerCase();
        const customerPhone = order.address?.phone || '';
        const items = order.stallItems?.map(item => item.foodDetails?.name || '').join(' ').toLowerCase();
        
        return orderId.includes(query) || 
               customerName.includes(query) || 
               customerPhone.includes(query) ||
               items.includes(query);
      });
    }

    // Group by date
    const ordersByDate = {};
    filteredOrders.forEach(order => {
      const dateKey = getDateKey(order.date);
      if (!ordersByDate[dateKey]) {
        ordersByDate[dateKey] = {
          date: order.date,
          dateFormatted: formatDateOnly(order.date),
          ordersByStatus: {
            'Food Processing': [],
            'Out for delivery': [],
            'Delivered': []
          }
        };
      }
      
      // Group by status within each date - use stallStatus if available, otherwise fall back to status
      const status = order.stallStatus || order.status || 'Food Processing';
      if (ordersByDate[dateKey].ordersByStatus[status]) {
        ordersByDate[dateKey].ordersByStatus[status].push(order);
      }
    });

    // Sort dates (newest first)
    const sortedDates = Object.keys(ordersByDate).sort((a, b) => {
      return new Date(ordersByDate[b].date) - new Date(ordersByDate[a].date);
    });

    return { ordersByDate, sortedDates };
  };

  const toggleDateExpansion = (dateKey) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  const { ordersByDate, sortedDates } = organizeOrdersByDateAndStatus();

  // Expand all dates by default when orders, filter, or search changes
  useEffect(() => {
    const { sortedDates: currentSortedDates } = organizeOrdersByDateAndStatus();
    if (currentSortedDates.length > 0) {
      setExpandedDates(new Set(currentSortedDates));
    }
  }, [orders.length, selectedStatusFilter, searchQuery]);

  // Get order counts by status
  const getStatusCounts = () => {
    return {
      'All': orders.length,
      'Food Processing': orders.filter(o => (o.stallStatus || o.status) === 'Food Processing').length,
      'Out for delivery': orders.filter(o => (o.stallStatus || o.status) === 'Out for delivery').length,
      'Delivered': orders.filter(o => (o.stallStatus || o.status) === 'Delivered').length
    };
  };

  const statusCounts = getStatusCounts();

  // Calculate statistics
  const getStatistics = () => {
    const totalRevenue = orders
      .filter(o => (o.stallStatus || o.status) === 'Delivered')
      .reduce((sum, o) => sum + (o.stallTotal || 0), 0);
    
    const todayRevenue = orders
      .filter(o => {
        const orderDate = new Date(o.date);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString() && (o.stallStatus || o.status) === 'Delivered';
      })
      .reduce((sum, o) => sum + (o.stallTotal || 0), 0);
    
    const pendingOrders = orders.filter(o => {
      const status = o.stallStatus || o.status;
      return status === 'Food Processing' || status === 'Out for delivery';
    }).length;
    
    return { totalRevenue, todayRevenue, pendingOrders };
  };

  const statistics = getStatistics();

  const calculateDeliveryTime = (orderDate, deliveryDate) => {
    if (!deliveryDate) return null;
    const order = new Date(orderDate);
    const delivery = new Date(deliveryDate);
    const diffMs = delivery - order;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ));
  };

  // Render individual order card
  const renderOrderCard = (order) => {
    // Use stallStatus if available, otherwise fall back to status
    const currentStatus = order.stallStatus || order.status || 'Food Processing';
    const isDelivered = currentStatus === 'Delivered';
    const isExpanded = expandedOrders.has(order._id);
    const feedbacks = orderFeedbacks[order._id] || {};
    const deliveryTime = calculateDeliveryTime(order.date, order.stallDeliveryTime || order.deliveryTime);
    
    // No acceptance/rejection logic needed
    const isRejected = currentStatus === 'Rejected';
    
    // Check if this order has items from this stall
    const hasStallItems = order.stallItems && order.stallItems.length > 0;
    
    return (
      <div key={order._id} className={`order-card ${isDelivered ? 'delivered' : ''}`}>
        <div className="order-header">
          <div className="order-header-left">
            <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
            <div className="order-datetime">
              <span className="order-date">🕐 {formatDate(order.date)}</span>
              {isDelivered && deliveryTime && (
                <span className="delivery-time">
                  ⏱️ Delivered in {deliveryTime}
                </span>
              )}
            </div>
          </div>
          <span className={`status-badge ${currentStatus.toLowerCase().replace(' ', '-')}`}>
            {currentStatus}
          </span>
        </div>

        <div className="order-items">
          <div className="order-items-header">
            <h4>Items ({order.stallItems?.length || 0})</h4>
            {isDelivered && (
              <button 
                className="toggle-feedback-btn"
                onClick={() => toggleOrderExpansion(order._id)}
              >
                {isExpanded ? 'Hide' : 'Show'} Feedbacks
              </button>
            )}
          </div>
          
          {order.stallItems?.map((item, idx) => {
            const itemId = item.itemId || item._id;
            const feedback = feedbacks[itemId];
            
            return (
              <div key={idx} className="order-item">
                <img 
                  src={`${url}/images/${item.foodDetails?.image}`} 
                  alt={item.foodDetails?.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80';
                  }}
                />
                <div className="item-details">
                  <p className="item-name">{item.foodDetails?.name}</p>
                  <p className="item-quantity">Qty: {item.quantity} × ₹{item.foodDetails?.price}</p>
                  {feedback && isExpanded && (
                    <div className="item-feedback">
                      <div className="feedback-rating">
                        {renderStars(feedback.rating)}
                        <span className="rating-value">{feedback.rating}/5</span>
                      </div>
                      {feedback.text && (
                        <p className="feedback-text">"{feedback.text}"</p>
                      )}
                      {feedback.photos && feedback.photos.length > 0 && (
                        <div className="feedback-photos">
                          {feedback.photos.map((photo, pIdx) => (
                            <img 
                              key={pIdx}
                              src={`${url}/feedback-images/${photo}`} 
                              alt={`Feedback ${pIdx + 1}`}
                              className="feedback-photo"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="item-total">₹{(item.quantity * item.foodDetails?.price).toFixed(2)}</p>
              </div>
            );
          })}
        </div>

        <div className="order-footer">
          <div className="order-address">
            <p><strong>Customer:</strong> {order.address?.firstName} {order.address?.lastName}</p>
            <p>{order.address?.street}, {order.address?.city}</p>
            <p>Phone: {order.address?.phone}</p>
          </div>
          <div className="order-actions">
            <p className="order-total">Total: ₹{order.stallTotal?.toFixed(2)}</p>
            {hasStallItems ? (
              <>
                {/* Status dropdown - always available for stall orders */}
                <select
                  value={currentStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  disabled={isDelivered}
                  className={isDelivered ? 'disabled-select' : ''}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                
                {isDelivered && (
                  <span className="status-locked">🔒 Status Locked</span>
                )}
              </>
            ) : (
              <span className="no-items-message">No items from your stall in this order</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="stall-orders">
      <div className="orders-header">
        <div className="header-top">
          <div>
            <h1>Orders Management</h1>
            <p className="stall-name">{stallOwner?.stallName}</p>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="statistics-cards">
          <div className="stat-card revenue-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <p className="stat-label">Total Revenue</p>
              <p className="stat-value">₹{statistics.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card today-revenue-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <p className="stat-label">Today's Revenue</p>
              <p className="stat-value">₹{statistics.todayRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card pending-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <p className="stat-label">Pending Orders</p>
              <p className="stat-value">{statistics.pendingOrders}</p>
            </div>
          </div>
          <div className="stat-card total-orders-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <p className="stat-label">Total Orders</p>
              <p className="stat-value">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by order ID, customer name, phone, or items..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Status Filter Tabs */}
          <div className="status-filter-tabs">
            {['All', 'Food Processing', 'Out for delivery', 'Delivered'].map(status => (
              <button
                key={status}
                className={`status-tab ${selectedStatusFilter === status ? 'active' : ''}`}
                onClick={() => setSelectedStatusFilter(status)}
              >
                {status}
                {statusCounts[status] > 0 && (
                  <span className="status-count">{statusCounts[status]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="no-orders">
            <p>No orders found for {selectedStatusFilter}</p>
          </div>
        ) : (
          sortedDates.map((dateKey) => {
            const dateGroup = ordersByDate[dateKey];
            const isDateExpanded = expandedDates.has(dateKey);
            
            return (
              <div key={dateKey} className="date-group">
                <div 
                  className="date-group-header"
                  onClick={() => toggleDateExpansion(dateKey)}
                >
                  <div className="date-header-left">
                    <h2 className="date-title">📅 {dateGroup.dateFormatted}</h2>
                    <div className="date-status-counts">
                      {dateGroup.ordersByStatus['Food Processing'].length > 0 && (
                        <span className="status-count-badge processing">
                          Processing: {dateGroup.ordersByStatus['Food Processing'].length}
                        </span>
                      )}
                      {dateGroup.ordersByStatus['Out for delivery'].length > 0 && (
                        <span className="status-count-badge out-for-delivery">
                          Out for delivery: {dateGroup.ordersByStatus['Out for delivery'].length}
                        </span>
                      )}
                      {dateGroup.ordersByStatus['Delivered'].length > 0 && (
                        <span className="status-count-badge delivered">
                          Delivered: {dateGroup.ordersByStatus['Delivered'].length}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="date-toggle-icon">
                    {isDateExpanded ? '▼' : '▶'}
                  </span>
                </div>

                {isDateExpanded && (
                  <div className="date-orders">
                    {/* Food Processing Orders */}
                    {dateGroup.ordersByStatus['Food Processing'].length > 0 && (
                      <div className="status-group">
                        <h3 className="status-group-title">🔄 Food Processing</h3>
                        {dateGroup.ordersByStatus['Food Processing'].map((order) => (
                          renderOrderCard(order)
                        ))}
                      </div>
                    )}

                    {/* Out for Delivery Orders */}
                    {dateGroup.ordersByStatus['Out for delivery'].length > 0 && (
                      <div className="status-group">
                        <h3 className="status-group-title">🚚 Out for Delivery</h3>
                        {dateGroup.ordersByStatus['Out for delivery'].map((order) => (
                          renderOrderCard(order)
                        ))}
                      </div>
                    )}

                    {/* Delivered Orders */}
                    {dateGroup.ordersByStatus['Delivered'].length > 0 && (
                      <div className="status-group">
                        <h3 className="status-group-title">✅ Delivered</h3>
                        {dateGroup.ordersByStatus['Delivered'].map((order) => (
                          renderOrderCard(order)
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
