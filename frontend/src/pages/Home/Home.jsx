import React, { useState, useEffect, useContext, useMemo } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

const Home = () => {
  const [category, setCategory] = useState("All");
  const [selectedStall, setSelectedStall] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [scrollToItemId, setScrollToItemId] = useState(null);
  const { food_list, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  
  // Calculate total items in cart reactively
  const totalCartItems = useMemo(() => {
    if (!cartItems || typeof cartItems !== 'object') return 0;
    return Object.keys(cartItems).filter(key => cartItems[key] > 0).length;
  }, [cartItems]);

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      // Find the food item
      const foodItem = food_list.find(item => item._id === itemId);
      if (foodItem) {
        // Set category to "All" to show all food items
        setCategory("All");
        // Clear stall selection
        setSelectedStall("");
        // Set the item to scroll to
        setScrollToItemId(itemId);
        // Clear the URL parameter after scrolling
        setTimeout(() => {
          setSearchParams({});
        }, 2500);
      }
    }
  }, [searchParams, food_list, setSearchParams]);

  // Reset category when stall is selected
  useEffect(() => {
    if (selectedStall) {
      setCategory("All");
    }
  }, [selectedStall]);

  return (
    <div>
        <Header/>
        <ExploreMenu 
          category={category} 
          setCategory={setCategory}
          selectedStall={selectedStall}
          setSelectedStall={setSelectedStall}
        />
        <FoodDisplay 
          category={category} 
          scrollToItemId={scrollToItemId}
          selectedStall={selectedStall}
        />
        <AppDownload/>
        
        {/* Floating Cart Button */}
        {totalCartItems > 0 && (
          <div className="home-footer-actions">
            <button className="view-cart-btn" onClick={() => navigate('/cart')}>
              <img src={assets.basket_icon} alt="cart" />
              View Cart ({totalCartItems})
            </button>
          </div>
        )}
    </div>
  )
}

export default Home