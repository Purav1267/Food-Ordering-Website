import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Menu.css';

const Menu = ({ token, stallOwner, url }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '', // Must match homepage categories: Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles
    image: null
  });

  useEffect(() => {
    fetchMenu();
    // Refresh menu every 30 seconds to update ratings
    const interval = setInterval(fetchMenu, 30000);
    return () => clearInterval(interval);
  }, [stallOwner, url]);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list?stall=${stallOwner?.stallName}`);
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      toast.error('Error fetching menu');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    
    if (editingItem) {
      // Update existing item
      formDataToSend.append('id', editingItem._id);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      try {
        const response = await axios.put(`${url}/api/food/update`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          toast.success('Item updated successfully');
          resetForm();
          fetchMenu();
        } else {
          toast.error('Error updating item');
        }
      } catch (error) {
        toast.error('Error updating item');
      }
    } else {
      // Add new item
      formDataToSend.append('stall', stallOwner?.stallName);
      formDataToSend.append('image', formData.image);

      try {
        const response = await axios.post(`${url}/api/food/add`, formDataToSend);
        if (response.data.success) {
          toast.success('Item added successfully');
          resetForm();
          fetchMenu();
        } else {
          toast.error('Error adding item');
        }
      } catch (error) {
        toast.error('Error adding item');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', image: null });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: null
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  const removeItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        const response = await axios.post(`${url}/api/food/remove`, { id: itemId });
        if (response.data.success) {
          toast.success('Item removed');
          fetchMenu();
        }
      } catch (error) {
        toast.error('Error removing item');
      }
    }
  };

  const togglePauseItem = async (itemId, currentPauseStatus) => {
    try {
      const response = await axios.post(
        `${url}/api/food/toggle-pause`,
        { id: itemId, isPaused: !currentPauseStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // Update local state immediately
        setMenuItems(prevItems =>
          prevItems.map(item =>
            item._id === itemId
              ? { ...item, isPaused: !currentPauseStatus }
              : item
          )
        );
        // Fetch fresh data
        setTimeout(() => {
          fetchMenu();
        }, 300);
      } else {
        toast.error('Error updating item status');
      }
    } catch (error) {
      console.error('Error toggling pause:', error);
      toast.error('Error updating item status');
    }
  };

  // Smart categorization based on item name, description, and category (same as StallDashboard)
  const getItemCategory = useCallback((item) => {
    const name = item.name.toLowerCase();
    const description = (item.description || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const combined = `${name} ${description} ${category}`;

    // Salads
    if (name.includes('salad') || category.includes('salad')) return 'Salads';

    // Rolls
    if (category.includes('roll') || name.includes('roll')) return 'Rolls';

    // Cake - Check for cake items BEFORE beverages (to catch "vanilla cake" etc.)
    // For Smoothie Zone, show Cake items as "Cake" instead of "Snacks"
    if (stallOwner?.stallName && stallOwner.stallName.toLowerCase().includes('smoothie')) {
      if (category.includes('cake') || name.includes('cake')) {
        return 'Cake';
      }
    }

    // Beverages - Hot and Cold drinks (but NOT cakes)
    // Exclude items that have "cake" in the name to prevent misclassification
    if (
      !name.includes('cake') && (
        name.includes('tea') || name.includes('chai') || name.includes('coffee') || 
        name.includes('latte') || name.includes('espresso') || name.includes('americano') || 
        name.includes('mocha') || name.includes('caramel') || name.includes('hazelnut') || 
        name.includes('vanilla') || name.includes('lassi') || name.includes('frappe') || 
        name.includes('chocolate') || combined.includes('beverage') || combined.includes('drink') ||
        category.includes('deserts') || category.includes('desserts')
      )
    ) {
      return 'Beverages';
    }

    // Breads - Paranthas, Roti, Naan, Bhature, Poori, etc.
    if (
      name.includes('parantha') || name.includes('paratha') || name.includes('roti') || 
      name.includes('naan') || name.includes('kulcha') || name.includes('bhature') || 
      name.includes('poori') || category.includes('breads')
    ) {
      return 'Breads';
    }

    // Curries - Choley, Curry dishes (but not combo items with bread)
    if (
      ((name.includes('curry') || name.includes('choley') || name.includes('chole') || name.includes('subji')) &&
      !name.includes('bhature') && !name.includes('poori') && !name.includes('parantha')) ||
      category.includes('curries')
    ) {
      return 'Curries';
    }
    
    // Bhaji (vegetable curry) - but not Pav Bhaji (which is a snack)
    if (name.includes('bhaji') && !name.includes('pav') && !name.includes('poori')) {
      return 'Curries';
    }

    // Pure Veg - For Muskan Hotel, show Pure Veg items as "Pure veg" instead of "Snacks"
    if (stallOwner?.stallName && stallOwner.stallName.toLowerCase().includes('muskan')) {
      if (category.includes('pure veg') || category.includes('pureveg')) {
        return 'Pure veg';
      }
    }

    // Snacks - Samosa, Pakora, Tikki, Pav Bhaji, Sandwich, etc.
    // Note: Pure Veg items from other stalls still go to Snacks
    // Note: Cake items from other stalls still go to Snacks (but not for Smoothie Zone - handled above)
    if (
      name.includes('samosa') || name.includes('pakora') || name.includes('tikki') || 
      name.includes('pav') || name.includes('snack') || name.includes('sandwich') ||
      category.includes('sandwich') ||
      (category.includes('cake') && !(stallOwner?.stallName && stallOwner.stallName.toLowerCase().includes('smoothie'))) ||
      (category.includes('pure veg') || category.includes('pureveg'))
    ) {
      return 'Snacks';
    }
    
    // Pasta and Noodles
    if (name.includes('pasta') || category.includes('pasta')) return 'Pasta';
    if (name.includes('noodles') || category.includes('noodles')) return 'Noodles';

    // Default to Other if nothing matches
    return 'Other';
  }, [stallOwner]);

  const categoryOrder = ['Salads', 'Rolls', 'Breads', 'Curries', 'Beverages', 'Snacks', 'Pure veg', 'Cake', 'Pasta', 'Noodles', 'Other'];

  // Group menu items by category
  const groupedMenu = useCallback(() => {
    const groups = {};
    let filteredItems = menuItems;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query))
      );
    }

    // Group by smart category
    filteredItems.forEach(item => {
      const category = getItemCategory(item);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    // Sort categories according to predefined order
    const sortedGroups = {};
    categoryOrder.forEach(cat => {
      if (groups[cat] && groups[cat].length > 0) {
        sortedGroups[cat] = groups[cat];
      }
    });
    
    // Add any remaining categories not in the predefined order
    Object.keys(groups).forEach(cat => {
      if (!categoryOrder.includes(cat) && groups[cat].length > 0) {
        sortedGroups[cat] = groups[cat];
      }
    });

    return sortedGroups;
  }, [menuItems, searchQuery, getItemCategory]);

  const menuGroups = groupedMenu();

  // Expand all categories when search is active
  useEffect(() => {
    if (searchQuery) {
      const currentGroups = groupedMenu();
      setExpandedCategories(new Set(Object.keys(currentGroups)));
    } else {
      // Collapse all when search is cleared
      setExpandedCategories(new Set());
    }
  }, [searchQuery, menuItems, groupedMenu]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <div className="stall-menu">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <button onClick={() => {
          if (showAddForm) {
            resetForm();
          } else {
            setShowAddForm(true);
          }
        }} className="add-item-btn">
          {showAddForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-item-form">
          <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <div className="form-row">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <input 
            type="file" 
            name="image" 
            onChange={handleChange} 
            accept="image/*" 
            required={!editingItem}
          />
          {editingItem && (
            <p className="image-note">Leave empty to keep current image</p>
          )}
          <div className="form-buttons">
            <button type="submit">{editingItem ? 'Update Item' : 'Add Item'}</button>
            <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      {!showAddForm && menuItems.length > 0 && (
        <div className="menu-search-container">
          <div className="search-bar-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search menu items..."
              className="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Categorized Menu Items */}
      {!showAddForm && (
        <div className="menu-categories-container">
          {menuItems.length === 0 ? (
            <div className="no-menu-items">
              <p>No menu items. Add your first item!</p>
            </div>
          ) : Object.keys(menuGroups).length === 0 ? (
            <div className="no-menu-items">
              <p>No items found matching your search.</p>
            </div>
          ) : (
            <div className="menu-categories">
              {Object.entries(menuGroups).map(([category, items]) => {
                const isExpanded = expandedCategories.has(category);
                return (
                  <div key={category} className="menu-category-section">
                    <div className="category-header" onClick={() => toggleCategory(category)}>
                      <h3 className="category-title">{category} ({items.length})</h3>
                      <svg 
                        className={`category-toggle-icon ${isExpanded ? 'expanded' : ''}`}
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    <div className={`menu-list-container ${isExpanded ? 'expanded' : ''}`}>
                      <div className="menu-items-grid">
                        {items.map((item) => (
                          <div key={item._id} className={`menu-item-card ${item.isPaused ? 'paused' : ''}`}>
                            {item.isPaused && (
                              <div className="paused-badge">⏸ Paused</div>
                            )}
                            <img src={`${url}/images/${item.image}`} alt={item.name} />
                            <div className="menu-item-info">
                              <div className="menu-item-header">
                                <h3>{item.name}</h3>
                                {item.averageRating > 0 && (
                                  <div className="item-rating">
                                    <span className="rating-stars">
                                      {Array.from({ length: 5 }, (_, i) => (
                                        <span key={i} className={i < Math.round(item.averageRating) ? 'star filled' : 'star'}>★</span>
                                      ))}
                                    </span>
                                    <span className="rating-value">{item.averageRating.toFixed(1)}</span>
                                    <span className="rating-count">({item.totalRatings || 0})</span>
                                  </div>
                                )}
                              </div>
                              <p className="category">{item.category}</p>
                              <p className="description">{item.description}</p>
                              <div className="menu-item-footer">
                                <p className="price">₹{item.price}</p>
                                <div className="item-actions">
                                  <button 
                                    onClick={() => togglePauseItem(item._id, item.isPaused || false)}
                                    className={item.isPaused ? 'unpause-btn' : 'pause-btn'}
                                    title={item.isPaused ? 'Unpause item (make available)' : 'Pause item (temporarily unavailable)'}
                                  >
                                    {item.isPaused ? '▶ Resume' : '⏸ Pause'}
                                  </button>
                                  <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                                  <button onClick={() => removeItem(item._id)} className="remove-btn">Remove</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;

