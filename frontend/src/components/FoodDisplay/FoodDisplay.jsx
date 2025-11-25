import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem'
import { stalls_list } from '../../assets/assets';

const FoodDisplay = ({ category, scrollToItemId, selectedStall }) => {
  const { food_list } = useContext(StoreContext);
  const navigate = useNavigate();
  const [highlightedId, setHighlightedId] = useState(null);
  const [exploreMoreCount, setExploreMoreCount] = useState(0); // 0 = initial, 1 = first click, 2 = second click
  const [topRatedStalls, setTopRatedStalls] = useState([]);

  // Reset exploreMoreCount when category or stall changes
  useEffect(() => {
    setExploreMoreCount(0);
    // Scroll to food display section when category is selected
    if (category !== "All") {
      setTimeout(() => {
        const foodDisplayElement = document.getElementById('food-display');
        if (foodDisplayElement) {
          foodDisplayElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [category, selectedStall]);

  useEffect(() => {
    if (scrollToItemId) {
      // Wait for items to render
      setTimeout(() => {
        const element = document.getElementById(`food-item-${scrollToItemId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          setHighlightedId(scrollToItemId);
          // Remove highlight after animation
          setTimeout(() => {
            setHighlightedId(null);
          }, 2000);
        }
      }, 100);
    }
  }, [scrollToItemId, food_list]);

  // Function to get curated initial 8 items - prioritizing highest rated
  const getCuratedItems = () => {
    // Filter out paused items first - handle undefined, null, and false as not paused
    const availableItems = food_list.filter(item => item.isPaused !== true);
    // Sort all items by rating (highest first), then by totalRatings
    const sortedByRating = [...availableItems].sort((a, b) => {
      const ratingA = a.averageRating || 0;
      const ratingB = b.averageRating || 0;
      if (ratingB !== ratingA) return ratingB - ratingA;
      return (b.totalRatings || 0) - (a.totalRatings || 0);
    });
    
    // Get highest rated items by category
    const salads = sortedByRating.filter(item => 
      item.category && item.category.toLowerCase().includes('salad')
    );
    
    const rolls = sortedByRating.filter(item => 
      item.category && item.category.toLowerCase().includes('roll')
    );
    
    const others = sortedByRating.filter(item => {
      const isSalad = item.category && item.category.toLowerCase().includes('salad');
      const isRoll = item.category && item.category.toLowerCase().includes('roll');
      return !isSalad && !isRoll;
    });

    const curatedItems = [];
    
    // Add 1 highest rated salad
    if (salads.length > 0) {
      curatedItems.push(salads[0]);
    }
    
    // Add 2-3 highest rated rolls from different stalls
    const selectedRolls = [];
    const usedStalls = new Set();
    for (const roll of rolls) {
      if (selectedRolls.length >= 3) break;
      if (!usedStalls.has(roll.stall)) {
        selectedRolls.push(roll);
        usedStalls.add(roll.stall);
      }
    }
    curatedItems.push(...selectedRolls);
    
    // Add remaining highest rated items to reach 8 total
    const remaining = 8 - curatedItems.length;
    const selectedOthers = [];
    const usedOtherStalls = new Set(curatedItems.map(item => item.stall).filter(Boolean));
    for (const item of others) {
      if (selectedOthers.length >= remaining) break;
      if (!usedOtherStalls.has(item.stall) || selectedOthers.length < remaining - 2) {
        selectedOthers.push(item);
        if (item.stall) usedOtherStalls.add(item.stall);
      }
    }
    curatedItems.push(...selectedOthers);
    
    return curatedItems.slice(0, 8);
  };

  // Function to get items based on explore more count
  const getDisplayItems = () => {
    // Filter out paused items from the base list - handle undefined, null, and false as not paused
    const availableItems = food_list.filter(item => item.isPaused !== true);
    
    // If category is selected, show all items in that category
    if (category !== "All") {
      const filtered = availableItems.filter((item) => {
        // Case-insensitive category matching
        const itemCategory = (item.category || '').toLowerCase();
        const selectedCategory = category.toLowerCase();
        const itemName = (item.name || '').toLowerCase();
        
        // Direct exact match (most reliable)
        if (itemCategory === selectedCategory) return true;
        
        // Special category mappings - be more specific
        if (selectedCategory === 'cake') {
          // Cake should only match items that are actually cakes
          return itemCategory === 'cake' || 
                 itemName.includes('cake') || 
                 itemName.includes('pastry');
        }
        
        if (selectedCategory === 'deserts' || selectedCategory === 'desserts') {
          // Deserts should match desserts, but NOT beverages
          // Check if it's actually a beverage (drinks) - exclude these even if category is "Deserts"
          const isBeverage = itemName.includes('tea') || 
                            itemName.includes('chai') || 
                            itemName.includes('coffee') || 
                            itemName.includes('latte') || 
                            itemName.includes('espresso') || 
                            itemName.includes('americano') || 
                            itemName.includes('mocha') || 
                            itemName.includes('caramel') ||
                            itemName.includes('hazelnut') ||
                            itemName.includes('vanilla') ||
                            itemName.includes('lassi') || 
                            itemName.includes('frappe') || 
                            itemName.includes('chocolate') ||
                            itemName.includes('drink') ||
                            itemCategory === 'beverages';
          
          // Exclude beverages - they're incorrectly categorized as "Deserts" in the database
          if (isBeverage) {
            return false;
          }
          
          // Match actual desserts, cakes, ice cream, etc.
          return itemCategory === 'deserts' || 
                 itemCategory === 'desserts' ||
                 itemName.includes('dessert') ||
                 itemName.includes('sweet') ||
                 itemName.includes('ice cream') ||
                 itemName.includes('pudding') ||
                 itemName.includes('cake');
        }
        
        if (selectedCategory === 'salad') {
          return itemCategory === 'salad' || 
                 itemCategory === 'salads' ||
                 itemName.includes('salad');
        }
        
        if (selectedCategory === 'rolls') {
          return itemCategory === 'rolls' || 
                 itemCategory === 'roll' ||
                 itemName.includes('roll');
        }
        
        if (selectedCategory === 'sandwich') {
          return itemCategory === 'sandwich' || 
                 itemCategory === 'sandwiches' ||
                 itemName.includes('sandwich');
        }
        
        if (selectedCategory === 'pure veg') {
          return itemCategory === 'pure veg' || 
                 itemCategory === 'pureveg';
        }
        
        if (selectedCategory === 'pasta') {
          return itemCategory === 'pasta' ||
                 itemName.includes('pasta');
        }
        
        if (selectedCategory === 'noodles') {
          return itemCategory === 'noodles' ||
                 itemName.includes('noodle');
        }
        
        // Fallback: partial match for other categories
        if (itemCategory.includes(selectedCategory) || selectedCategory.includes(itemCategory)) {
          return true;
        }
        
        return false;
      }).filter((item) => {
        const matchesStall = !selectedStall || (item.stall && item.stall === selectedStall);
        return matchesStall;
      });
      
      return filtered;
    }

    // If stall is selected, show all items from that stall
    if (selectedStall) {
      return availableItems.filter((item) => {
        return item.stall && item.stall === selectedStall;
      });
    }

    // Initial state: show curated 8 items
    if (exploreMoreCount === 0) {
      return getCuratedItems();
    }

    // First explore more: show 8 more items (total 16)
    if (exploreMoreCount === 1) {
      const curated = getCuratedItems();
      const curatedIds = new Set(curated.map(item => item._id));
      const additional = availableItems.filter(item => !curatedIds.has(item._id)).slice(0, 8);
      return [...curated, ...additional];
    }

    // Second explore more: show all items
    return availableItems;
  };

  // Calculate displayItems - make it reactive to category and food_list changes
  // Note: getDisplayItems() already filters out paused items, so no need to filter again
  const displayItems = useMemo(() => {
    return getDisplayItems();
  }, [category, selectedStall, exploreMoreCount, food_list]);

  // Calculate top-rated stalls for the selected category
  useEffect(() => {
    if (category && category !== "All" && !selectedStall) {
      // Get all items in this category (excluding paused items)
      const categoryItems = food_list.filter(item => 
        item.category === category && item.isPaused !== true
      );
      
      // Group by stall and calculate average rating
      const stallRatings = {};
      categoryItems.forEach(item => {
        if (item.stall) {
          if (!stallRatings[item.stall]) {
            stallRatings[item.stall] = {
              stallName: item.stall,
              items: [],
              totalRating: 0,
              totalRatings: 0
            };
          }
          stallRatings[item.stall].items.push(item);
          if (item.averageRating && item.averageRating > 0) {
            stallRatings[item.stall].totalRating += item.averageRating;
            stallRatings[item.stall].totalRatings += item.totalRatings || 0;
          }
        }
      });
      
      // Calculate average rating per stall and sort
      const stallsWithRatings = Object.values(stallRatings)
        .map(stall => ({
          ...stall,
          averageRating: stall.items.length > 0 
            ? stall.totalRating / stall.items.filter(i => i.averageRating > 0).length 
            : 0,
          itemCount: stall.items.length
        }))
        .filter(stall => stall.averageRating > 0 || stall.itemCount > 0)
        .sort((a, b) => {
          // Sort by average rating first, then by number of ratings, then by item count
          if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating;
          }
          if (b.totalRatings !== a.totalRatings) {
            return b.totalRatings - a.totalRatings;
          }
          return b.itemCount - a.itemCount;
        })
        .slice(0, 3); // Top 3 stalls
      
      // Get stall images from stalls_list
      const stallsWithImages = stallsWithRatings.map(stall => {
        const stallInfo = stalls_list.find(s => s.stall_name === stall.stallName);
        return {
          ...stall,
          stallImage: stallInfo ? stallInfo.stall_image : null
        };
      }).filter(stall => stall.stallImage); // Only include stalls with images
      
      setTopRatedStalls(stallsWithImages);
    } else {
      setTopRatedStalls([]);
    }
  }, [category, food_list, selectedStall]);

  const handleExploreMore = () => {
    if (exploreMoreCount === 0) {
      setExploreMoreCount(1);
    } else if (exploreMoreCount === 1) {
      setExploreMoreCount(2);
      // Scroll to stalls section
      setTimeout(() => {
        const exploreMenu = document.getElementById('explore-menu');
        if (exploreMenu) {
          exploreMenu.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleStallClick = (stallName) => {
    // Navigate to stall dashboard with category filter
    navigate(`/stall/${encodeURIComponent(stallName)}?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className='food-display' id='food-display'>
      <h2>
        {selectedStall 
          ? `${selectedStall} - Top Dishes` 
          : category !== "All" 
            ? `${category} - All Items` 
            : "Top Dishes near you"}
      </h2>
      <div className="food-display-list">
        {displayItems.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No items found in this category.</p>
          </div>
        ) : (
          displayItems.map((item, index) => (
            <FoodItem 
              key={item._id} 
              id={item._id} 
              name={item.name} 
              description={item.description} 
              price={item.price} 
              image={item.image}
              isHighlighted={highlightedId === item._id}
              averageRating={item.averageRating || 0}
              totalRatings={item.totalRatings || 0}
            />
          ))
        )}
      </div>
      
      {/* Show Explore More button only when no stall/category is selected and not all items are shown */}
      {!selectedStall && category === "All" && exploreMoreCount < 2 && (
        <div className="explore-more-container">
          <button className="explore-more-btn" onClick={handleExploreMore}>
            {exploreMoreCount === 0 ? "Explore More" : "Explore More Stalls"}
          </button>
        </div>
      )}

      {/* Show top-rated stalls for the selected category */}
      {category && category !== "All" && !selectedStall && topRatedStalls.length > 0 && (
        <div className="top-rated-stalls-section">
          <h3 className="top-rated-stalls-title">🏆 Top Rated Stalls for {category}</h3>
          <p className="top-rated-stalls-subtitle">Click on a stall to explore their {category.toLowerCase()} menu</p>
          <div className="top-rated-stalls-list">
            {topRatedStalls.map((stall, index) => (
              <div 
                key={stall.stallName} 
                className="top-rated-stall-item"
                onClick={() => handleStallClick(stall.stallName)}
              >
                <div className="stall-badge">
                  {index === 0 && <span className="rank-badge">🥇</span>}
                  {index === 1 && <span className="rank-badge">🥈</span>}
                  {index === 2 && <span className="rank-badge">🥉</span>}
                </div>
                <img 
                  src={stall.stallImage} 
                  alt={stall.stallName}
                  className="stall-image"
                />
                <p className="stall-name">{stall.stallName}</p>
                {stall.averageRating > 0 && (
                  <div className="stall-rating">
                    <span className="rating-stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < Math.round(stall.averageRating) ? 'star filled' : 'star'}>★</span>
                      ))}
                    </span>
                    <span className="rating-value">{stall.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
