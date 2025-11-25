import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext';
import {useNavigate} from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    food_list, 
    removeFromCart,
    getTotalCartAmount,
    url,
    promoCode,
    promoApplied,
    discount,
    applyPromoCode,
    removePromoCode,
    getTotalWithDiscount
  } = useContext(StoreContext);
  
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details discount-row">
                  <p>Discount (50% off)</p>
                  <p className="discount-amount">-₹{discount.toFixed(2)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalWithDiscount().toFixed(2)}</b>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='Promo code' 
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  if (promoApplied) {
                    removePromoCode();
                  }
                  setPromoError("");
                }}
                disabled={promoApplied}
                className={promoError ? 'promo-input-error' : ''}
              />
              {!promoApplied ? (
                <button 
                  type="button"
                  onClick={() => {
                    const result = applyPromoCode(promoInput);
                    if (result.success) {
                      setPromoError("");
                    } else {
                      setPromoError(result.message);
                    }
                  }}
                >
                  Apply
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => {
                    removePromoCode();
                    setPromoInput("");
                    setPromoError("");
                  }}
                  className="remove-promo-btn"
                >
                  Remove
                </button>
              )}
            </div>
            {promoError && <span className="promo-error-message">{promoError}</span>}
            {promoApplied && (
              <div className="promo-applied">
                <span className="promo-success">✓ Promo code "{promoCode}" applied! 50% off</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
