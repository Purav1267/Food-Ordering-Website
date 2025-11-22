import React, { useContext, useEffect, useState } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category, scrollToItemId, selectedStall }) => {
  const { food_list } = useContext(StoreContext);
  const [highlightedId, setHighlightedId] = useState(null);

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

  return (
    <div className='food-display' id='food-display'>
      <h2>{selectedStall ? `${selectedStall} - Top Dishes` : "Top Dishes near you"}</h2>
      <div className="food-display-list">
        {food_list.map((item,index)=>{
            // Filter by category
            const matchesCategory = category==="All" || category === item.category;
            // Filter by stall (if selected)
            const matchesStall = !selectedStall || (item.stall && item.stall === selectedStall);
            
            if(matchesCategory && matchesStall){
                return (
                  <FoodItem 
                    key={index} 
                    id={item._id} 
                    name={item.name} 
                    description={item.description} 
                    price={item.price} 
                    image={item.image}
                    isHighlighted={highlightedId === item._id}
                  />
                );
            }
            return null;    
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
