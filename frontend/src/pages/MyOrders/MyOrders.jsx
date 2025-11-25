import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import Feedback from '../../components/Feedback/Feedback';

const MyOrders = () => {
    const { url, token, fetchFoodList } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [feedbackStates, setFeedbackStates] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
            const orders = response.data.data;
            setData(orders);
            
            // Check feedback status for each item in delivered orders
            if (token && orders.length > 0) {
                const userId = orders[0].userId; // Get userId from order
                if (userId) {
                    const feedbackChecks = {};
                    for (const order of orders) {
                        if (order.status === 'Delivered') {
                            for (const item of order.items) {
                                const key = `${order._id}_${item.itemId || item._id}`;
                                try {
                                    const feedbackResponse = await axios.get(`${url}/api/feedback/check`, {
                                        params: {
                                            userId,
                                            orderId: order._id,
                                            itemId: item.itemId || item._id
                                        }
                                    });
                                    feedbackChecks[key] = feedbackResponse.data.exists;
                                } catch (error) {
                                    feedbackChecks[key] = false;
                                }
                            }
                        }
                    }
                    setFeedbackStates(feedbackChecks);
                }
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const handleFeedbackClick = (item, orderId) => {
        setSelectedItem(item);
        setSelectedOrderId(orderId);
    };

    const handleFeedbackClose = () => {
        setSelectedItem(null);
        setSelectedOrderId(null);
    };

    const handleFeedbackSuccess = async () => {
        fetchOrders(); // Refresh orders to update feedback status
        // Refresh food list to update ratings
        if (fetchFoodList) {
            await fetchFoodList();
        }
    };

    const getUserId = () => {
        // Get userId from the first order (all orders belong to the same user)
        return data.length > 0 ? data[0].userId : null;
    };

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, orderIndex) => {
                    // Use stallGroups if available, otherwise fall back to old format
                    const stallGroups = order.stallGroups || (order.stalls && order.stalls.length > 0 
                        ? order.stalls.map(stall => ({
                            stallName: stall,
                            items: order.items.filter(item => item.stall === stall || !item.stall),
                            total: order.items
                                .filter(item => item.stall === stall || !item.stall)
                                .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
                            status: order.stallStatuses?.[stall] || order.status || "Food Processing"
                        }))
                        : [{
                            stallName: "All Items",
                            items: order.items,
                            total: order.amount,
                            status: order.status || "Food Processing"
                        }]);

                    return (
                        <div key={orderIndex} className="order-container">
                            <div className="order-header">
                                <div className="order-header-info">
                                    <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                                    <p className="order-date">Placed on: {new Date(order.date).toLocaleDateString()}</p>
                                    <p className="order-address">
                                        <strong>Delivery Address:</strong> {order.address?.street || ""}, {order.address?.city || ""}
                                    </p>
                                </div>
                                <div className="order-total-amount">
                                    <p className="total-label">Total Amount</p>
                                    <p className="total-value">₹{order.amount}.00</p>
                                </div>
                            </div>
                            
                            {stallGroups.map((stallGroup, stallIndex) => (
                                <div key={stallIndex} className='my-orders-order stall-group'>
                                    <img src={assets.parcel_icon} alt="Parcel Icon" />
                                    <div className="stall-info">
                                        <h4 className="stall-name">🏪 {stallGroup.stallName}</h4>
                                        <div className="order-items">
                                            {stallGroup.items.map((item, itemIndex) => {
                                                const feedbackKey = `${order._id}_${item.itemId || item._id}`;
                                                const hasFeedback = feedbackStates[feedbackKey];
                                                const canGiveFeedback = stallGroup.status === 'Delivered' && !hasFeedback;
                                                
                                                return (
                                                    <div key={itemIndex} className="order-item-row">
                                                        <span>
                                                            {item.name || item.foodDetails?.name} X {item.quantity}
                                                        </span>
                                                        {canGiveFeedback && (
                                                            <button
                                                                className="feedback-btn-small"
                                                                onClick={() => handleFeedbackClick(item, order._id)}
                                                            >
                                                                Rate
                                                            </button>
                                                        )}
                                                        {hasFeedback && (
                                                            <span className="feedback-given">✓ Rated</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <p className="stall-amount">₹{stallGroup.total.toFixed(2)}</p>
                                    <p className="stall-items-count">Items: {stallGroup.items.length}</p>
                                    <div className="stall-status-section">
                                        <p className="stall-status">
                                            <span className='point'>&#x25cf;</span> 
                                            <b>{stallGroup.status}</b>
                                        </p>
                                    </div>
                                    <button onClick={fetchOrders}>Track Order</button>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {selectedItem && selectedOrderId && (
                <Feedback
                    isOpen={true}
                    onClose={handleFeedbackClose}
                    item={selectedItem}
                    orderId={selectedOrderId}
                    userId={getUserId()}
                    url={url}
                    onSuccess={handleFeedbackSuccess}
                />
            )}
        </div>
    );
};

export default MyOrders;
