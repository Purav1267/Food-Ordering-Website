import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import './StallDashboard.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { stalls_list } from '../../assets/assets';

const StallDashboard = () => {
  const { stallName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { food_list, cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  
  // Calculate total items in cart reactively
  const totalCartItems = useMemo(() => {
    if (!cartItems || typeof cartItems !== 'object') return 0;
    return Object.keys(cartItems).filter(key => cartItems[key] > 0).length;
  }, [cartItems]);
  const [stallMenu, setStallMenu] = useState([]);
  const [stallInfo, setStallInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [targetCategory, setTargetCategory] = useState(null);

  useEffect(() => {
    // Find stall info
    const stall = stalls_list.find(s => s.stall_name === stallName);
    setStallInfo(stall);

    // Filter food items by stall
    const filteredMenu = food_list.filter(item => 
      item.stall && item.stall === stallName
    );
    setStallMenu(filteredMenu);

    // Check for category parameter in URL
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Map the category from menu_list to smart category
      const categoryMap = {
        'Cake': 'Other',
        'Deserts': 'Beverages',
        'Desserts': 'Beverages',
        'Sandwich': 'Snacks',
        'Pure Veg': 'Snacks',
        'Pasta': 'Other',
        'Noodles': 'Other',
        'Salad': 'Salads',
        'Rolls': 'Rolls'
      };
      const mappedCategory = categoryMap[categoryParam] || categoryParam;
      setTargetCategory(mappedCategory);
    }
  }, [stallName, food_list, searchParams]);

  const getQuantity = (itemId) => {
    return cartItems[itemId] || 0;
  };

  // Smart categorization based on item name, description, and category
  const getItemCategory = (item) => {
    const name = item.name.toLowerCase();
    const description = (item.description || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const combined = `${name} ${description} ${category}`;

    // Salads
    if (name.includes('salad')) return 'Salads';

    // Rolls - check category first, then name
    if (category.includes('roll') || name.includes('roll')) return 'Rolls';

    // Cake - Check for cake items BEFORE beverages (to catch "vanilla cake" etc.)
    // For Smoothie Zone, show Cake items as "Cake" instead of "Snacks"
    if (stallName && stallName.toLowerCase().includes('smoothie')) {
      if (category.includes('cake') || name.includes('cake')) {
        return 'Cake';
      }
    }

    // Beverages - Hot and Cold drinks (but NOT cakes)
    // Exclude items that have "cake" in the name to prevent misclassification
    if (
      !name.includes('cake') && (
        name.includes('tea') || 
        name.includes('chai') || 
        name.includes('coffee') || 
        name.includes('latte') || 
        name.includes('espresso') || 
        name.includes('americano') || 
        name.includes('mocha') || 
        name.includes('caramel') || 
        name.includes('hazelnut') || 
        name.includes('vanilla') || 
        name.includes('lassi') || 
        name.includes('frappe') || 
        name.includes('chocolate') ||
        combined.includes('beverage') ||
        combined.includes('drink')
      )
    ) {
      return 'Beverages';
    }

    // Breads - Paranthas, Roti, Naan, Bhature, Poori, etc.
    if (
      name.includes('parantha') || 
      name.includes('paratha') || 
      name.includes('roti') || 
      name.includes('naan') || 
      name.includes('kulcha') ||
      name.includes('bhature') ||
      name.includes('poori')
    ) {
      return 'Breads';
    }

    // Curries - Choley, Curry dishes (but not combo items with bread)
    if (
      (name.includes('curry') || name.includes('choley') || name.includes('chole') || name.includes('subji')) &&
      !name.includes('bhature') && !name.includes('poori') && !name.includes('parantha')
    ) {
      return 'Curries';
    }
    
    // Bhaji (vegetable curry) - but not Pav Bhaji (which is a snack)
    if (name.includes('bhaji') && !name.includes('pav') && !name.includes('poori')) {
      return 'Curries';
    }

    // Snacks - Samosa, Pakora, Tikki, Pav Bhaji, etc.
    if (
      name.includes('samosa') || 
      name.includes('pakora') || 
      name.includes('tikki') || 
      name.includes('pav') ||
      name.includes('snack')
    ) {
      return 'Snacks';
    }

    // Sandwich - check for sandwich items
    if (
      name.includes('sandwich') ||
      category.includes('sandwich')
    ) {
      return 'Sandwich';
    }

    // If category is "Pure Veg" and not matched above, check if it's a snack or other
    if (category.includes('pure veg') || category.includes('pureveg')) {
      // Most "Pure Veg" items that aren't paranthas are snacks
      return 'Snacks';
    }

    // For Smoothie Zone, default to Sandwich instead of Other (but not if it's a cake)
    if (stallName && stallName.toLowerCase().includes('smoothie')) {
      if (!name.includes('cake') && !category.includes('cake')) {
        return 'Sandwich';
      }
    }

    // Default to Other if nothing matches
    return 'Other';
  };

  // Define category order for display
  const categoryOrder = ['Salads', 'Rolls', 'Breads', 'Curries', 'Beverages', 'Snacks', 'Sandwich', 'Cake', 'Other'];

  // Group menu items by category
  const groupedMenu = () => {
    const groups = {};
    // Filter out paused items - don't show them to customers
    let filteredItems = stallMenu.filter(item => !item.isPaused);

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

    // Sort categories according to predefined order, then alphabetically for others
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
  };

  const menuGroups = groupedMenu();

  // Toggle category expansion
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

  // Expand all categories when search is active or target category is set
  useEffect(() => {
    if (searchQuery) {
      const currentGroups = groupedMenu();
      setExpandedCategories(new Set(Object.keys(currentGroups)));
    } else if (targetCategory) {
      // Expand the target category and scroll to it
      const currentGroups = groupedMenu();
      if (currentGroups[targetCategory]) {
        setExpandedCategories(new Set([targetCategory]));
        setTimeout(() => {
          const categoryElement = document.getElementById(`category-${targetCategory}`);
          if (categoryElement) {
            categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    } else {
      // Collapse all when search is cleared and no target category
      setExpandedCategories(new Set());
    }
  }, [searchQuery, stallMenu, targetCategory]);

  return (
    <div className="stall-dashboard">
      <div className="stall-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        {stallInfo && (
          <div className="stall-info">
            <img src={stallInfo.stall_image} alt={stallInfo.stall_name} className="stall-logo" />
            <div className="stall-details">
              <h1>{stallInfo.stall_name}</h1>
              <p className="stall-description">Explore our delicious menu and place your order</p>
            </div>
          </div>
        )}
      </div>

      <div className="stall-menu-section">
        <div className="menu-header-controls">
          <h2>Menu</h2>
          <div className="search-container">
            <img src={assets.search_icon} alt="search" className="search-icon" />
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
              >
                ×
              </button>
            )}
          </div>
        </div>

        {stallMenu.length === 0 ? (
          <div className="no-menu">
            <p>No items available at this stall currently.</p>
          </div>
        ) : Object.keys(menuGroups).length === 0 ? (
          <div className="no-menu">
            <p>No items found matching your search.</p>
          </div>
        ) : (
          <div className="menu-categories">
            {Object.entries(menuGroups).map(([category, items]) => {
              const isExpanded = expandedCategories.has(category);
              return (
                <div key={category} id={`category-${category}`} className="menu-category-section">
                  <h3 
                    className={`category-title ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    <span className="category-name">{category}</span>
                    <span className="category-count">({items.length})</span>
                    <span className="category-arrow">{isExpanded ? '▼' : '▶'}</span>
                  </h3>
                  {isExpanded && (
                    <div className="menu-list">
                      {items.map((item) => (
                    <div key={item._id} className="menu-item-row">
                      <div className="menu-item-image">
                        <img src={url + "/images/" + item.image} alt={item.name} />
                      </div>
                      <div className="menu-item-details">
                        <div className="menu-item-header">
                          <h3>{item.name}</h3>
                          <div className="menu-item-rating">
                            {item.averageRating > 0 && item.totalRatings > 0 ? (
                              <>
                                <div className="rating-stars-inline">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span 
                                      key={star} 
                                      className={star <= Math.floor(item.averageRating) ? 'star filled' : 'star empty'}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="rating-value-text">
                                  {item.averageRating.toFixed(1)} ({item.totalRatings})
                                </span>
                              </>
                            ) : (
                              <span className="no-rating-text">No ratings yet</span>
                            )}
                          </div>
                        </div>
                        <p className="menu-item-description">{item.description}</p>
                        <div className="menu-item-footer">
                          <span className="menu-item-price">₹{item.price}</span>
                          <div className="menu-item-actions">
                            {getQuantity(item._id) === 0 ? (
                              <button 
                                className="add-to-cart-btn"
                                onClick={() => addToCart(item._id)}
                              >
                                <img src={assets.add_icon_white} alt="add" />
                                Add
                              </button>
                            ) : (
                              <div className="quantity-controls">
                                <button 
                                  className="quantity-btn"
                                  onClick={() => removeFromCart(item._id)}
                                >
                                  <img src={assets.remove_icon_red} alt="remove" />
                                </button>
                                <span className="quantity">{getQuantity(item._id)}</span>
                                <button 
                                  className="quantity-btn"
                                  onClick={() => addToCart(item._id)}
                                >
                                  <img src={assets.add_icon_green} alt="add" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {totalCartItems > 0 && (
        <div className="stall-footer-actions">
          <button className="view-cart-btn" onClick={() => navigate('/cart')}>
            <img src={assets.basket_icon} alt="cart" />
            View Cart ({totalCartItems})
          </button>
        </div>
      )}
    </div>
  );
};

export default StallDashboard;

