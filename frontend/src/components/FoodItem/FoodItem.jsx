import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image, isHighlighted, averageRating = 0, totalRatings = 0 }) => {
  const { cartItems, addToCart, removeFromCart , url} = useContext(StoreContext);

  // Render star rating based on averageRating
  const renderStars = () => {
    if (averageRating === 0 || totalRatings === 0) {
      // Show empty stars for items without ratings
      return (
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="star empty">★</span>
          ))}
          <span className="rating-text">No ratings</span>
        </div>
      );
    }

    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= fullStars) {
            return <span key={star} className="star filled">★</span>;
          } else if (star === fullStars + 1 && hasHalfStar) {
            return <span key={star} className="star half">★</span>;
          } else {
            return <span key={star} className="star empty">★</span>;
          }
        })}
        <span className="rating-text">{averageRating.toFixed(1)} ({totalRatings})</span>
      </div>
    );
  };

  return (
    <div className={`food-item ${isHighlighted ? 'highlighted' : ''}`} id={`food-item-${id}`}>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/images/"+image} alt="" />
        {!cartItems[id]
          ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt='' />
          : <div className='food-item-counter'>
              <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
              <p>{cartItems[id]}</p>
              <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
            </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          {renderStars()}
        </div>
        <p className="food-item-desc">{description}</p>
        <p className='food-item-price'>₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
