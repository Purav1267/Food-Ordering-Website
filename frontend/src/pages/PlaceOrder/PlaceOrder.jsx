// import React, { useContext, useState } from 'react'
// import './PlaceOrder.css'
// import { StoreContext } from '../../context/StoreContext'
// const PlaceOrder = () => {

//   const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: ""
//   })

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData(data => ({ ...data, [name]: value }))
//   }

//   const placeOrder = async (event) => {
//     event.preventDefault();
//     let orderItems = [];
//     food_list.map((item) => {
//       if (cartItems[item._id] > 0) {
//         let itemInfo = item;
//         itemInfo["quantity"] = cartItems[item._id]
//         orderItems.push(itemInfo)
//       }
//     })
//     let orderData = {
//       address:data,
//       items:orderItems,
//       amount:getTotalCartAmount()+2,
//     }
//     let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})
//     if (response.data.success) {
//       const {session_url} = response.data;
//       window.location.replace(session_url);
//     }
//     else{
//       alert("Error")
//     }
//   }

//   return (
//     <form onSubmit={placeOrder} className='place-order' >
//       <div className="place-order-left">
//         <p className='title'>Delivery Information</p>
//         <div className="multi-fields">
//           <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
//           <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
//         </div>
//         <input required name='email' onChange={onChangeHandler} value={data.email} type="text" placeholder='Email Address' />
//         <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
//         <div className="multi-fields">
//           <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
//           <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
//         </div>
//         <div className="multi-fields">
//           <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
//           <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
//         </div>
//         <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
//       </div>
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>₹{getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
//             </div>
//           </div>
//           <button type='submit' >PROCEED TO PAYMENT</button>
//         </div>
//       </div>
//     </form>
//   )
// }

// export default PlaceOrder

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  
  const context = useContext(StoreContext);
  const { 
    getTotalCartAmount = () => 0, 
    token, 
    food_list = [], 
    cartItems = {}, 
    url = "http://localhost:4000",
    getTotalWithDiscount = () => 0,
    discount = 0,
    promoCode = "",
    promoApplied = false
  } = context || {};
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (phone) => {
    // Remove all non-digit characters for validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone) {
      return "Phone number is required";
    }
    // Indian phone numbers: 10 digits (can start with +91 or 0)
    // International: 10-15 digits
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return "Please enter a valid phone number (10-15 digits)";
    }
    return "";
  };

  const validateName = (name, fieldName) => {
    if (!name.trim()) {
      return `${fieldName} is required`;
    }
    if (name.trim().length < 2) {
      return `${fieldName} must be at least 2 characters`;
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return `${fieldName} should only contain letters`;
    }
    return "";
  };

  const validateZipcode = (zipcode) => {
    if (!zipcode) {
      return "Zip code is required";
    }
    // Allow alphanumeric zip codes (for international support)
    if (!/^[a-zA-Z0-9\s-]{4,10}$/.test(zipcode.trim())) {
      return "Please enter a valid zip code";
    }
    return "";
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        error = validateName(value, "First name");
        break;
      case "lastName":
        error = validateName(value, "Last name");
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "street":
        if (!value.trim()) {
          error = "Street address is required";
        }
        break;
      case "city":
        if (!value.trim()) {
          error = "City is required";
        }
        break;
      case "state":
        if (!value.trim()) {
          error = "State is required";
        }
        break;
      case "zipcode":
        error = validateZipcode(value);
        break;
      case "country":
        if (!value.trim()) {
          error = "Country is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
    
    // Validate on change
    const error = validateField(name, value);
    setErrors((errors) => ({ ...errors, [name]: error }));
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(data).forEach((key) => {
      const error = validateField(key, data[key]);
      newErrors[key] = error;
      if (error) {
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Check if form has any errors
  const hasErrors = () => {
    return Object.values(errors).some(error => error !== "");
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return Object.values(data).every(value => value.trim() !== "") && !hasErrors();
  };

  // const placeOrder = async (event) => {
  //   event.preventDefault();
  //   let orderItems = [];
  //   food_list.forEach((item) => {
  //     if (cartItems[item._id] > 0) {
  //       let itemInfo = item;
  //       itemInfo["quantity"] = cartItems[item._id];
  //       orderItems.push(itemInfo);
  //     }
  //   });

  //   let orderData = {
  //     address: data,
  //     items: orderItems,
  //     amount: getTotalCartAmount() ,
  //   };

  //   try {
  //     const response = await axios.post(`${url}/api/order/place`, orderData, {
  //       headers: { token },
  //     });
  //     if (response.data.success) {
  //       const { order_id } = response.data;

  //       const options = {
  //         key: "rzp_test_nXpT7OOHz9G5md",
  //         amount: (getTotalCartAmount() + 0) * 100,
  //         currency: "INR",
  //         name: "TOMATO - Food Ordering",
  //         description: "Test Transaction",
  //         order_id: order_id,
  //         handler: function (response) {
  //           alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
  //           window.location.replace(`${frontend_url}/verify?success=true&orderId=${order_id}`);
  //         },
  //         prefill: {
  //           name: `${data.firstName} ${data.lastName}`,
  //           email: data.email,
  //           contact: data.phone,
  //         },
  //         notes: {
  //           address: data.street,
  //         },
  //         theme: {
  //           color: "#3399cc",
  //         },
  //       };

  //       const rzp1 = new window.Razorpay(options);
  //       rzp1.open();
  //     } else {
  //       alert("Error");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Error");
  //   }
  // };
  const placeOrder = async (event) => {
    event.preventDefault();
    
    // Validate all fields before proceeding
    if (!validateAllFields()) {
      alert("Please fill all fields correctly before proceeding to payment.");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
            let itemInfo = item;
            itemInfo["quantity"] = cartItems[item._id];
            orderItems.push(itemInfo);
        }
    });

    const finalAmount = getTotalWithDiscount();
    
    let orderData = {
        address: data,
        items: orderItems,
        amount: finalAmount, // final amount after discount
        promoCode: promoApplied ? promoCode : null,
        discount: discount || 0
    };

    try {
        const response = await axios.post(`${url}/api/order/place`, orderData, {
            headers: { token },
        });

        if (response.data.success) {
            const { order_id, successUrl, cancelUrl } = response.data;

            const options = {
                key: "rzp_test_nXpT7OOHz9G5md",
                amount: finalAmount * 100, // amount in smallest currency unit (after discount)
                currency: "INR",
                name: "TOMATO - Food Ordering",
                description: "Test Transaction",
                order_id: order_id,
                handler: function (response) {
                    // Redirect to success URL
                    window.location.replace(successUrl);
                },
                modal: {
                    ondismiss: function() {
                        // Redirect to cancel URL if the payment is canceled
                        window.location.replace(cancelUrl);
                    },
                },
                prefill: {
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    contact: data.phone,
                },
                notes: {
                    address: data.street,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else {
            alert("Error");
        }
    } catch (error) {
        console.error(error);
        alert("Error");
    }
};

const navigate = useNavigate();
useEffect(()=>{
  if (!token) {
    navigate('/cart');
    return;
  }
  const total = getTotalCartAmount();
  if (total === 0) {
    navigate('/cart');
  }
},[token, navigate, getTotalCartAmount])

  // Safety check - don't render if context is not available
  if (!context) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <div className="input-field-wrapper">
            <input 
              required 
              name='firstName' 
              onChange={onChangeHandler} 
              value={data.firstName} 
              type="text" 
              placeholder='First Name'
              className={errors.firstName ? 'error-input' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          <div className="input-field-wrapper">
            <input 
              required 
              name='lastName' 
              onChange={onChangeHandler} 
              value={data.lastName} 
              type="text" 
              placeholder='Last Name'
              className={errors.lastName ? 'error-input' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>
        <div className="input-field-wrapper">
          <input 
            required 
            name='email' 
            onChange={onChangeHandler} 
            value={data.email} 
            type="email" 
            placeholder='Email Address'
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="input-field-wrapper">
          <input 
            required 
            name='street' 
            onChange={onChangeHandler} 
            value={data.street} 
            type="text" 
            placeholder='Street'
            className={errors.street ? 'error-input' : ''}
          />
          {errors.street && <span className="error-message">{errors.street}</span>}
        </div>
        <div className="multi-fields">
          <div className="input-field-wrapper">
            <input 
              required 
              name='city' 
              onChange={onChangeHandler} 
              value={data.city} 
              type="text" 
              placeholder='City'
              className={errors.city ? 'error-input' : ''}
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>
          <div className="input-field-wrapper">
            <input 
              required 
              name='state' 
              onChange={onChangeHandler} 
              value={data.state} 
              type="text" 
              placeholder='State'
              className={errors.state ? 'error-input' : ''}
            />
            {errors.state && <span className="error-message">{errors.state}</span>}
          </div>
        </div>
        <div className="multi-fields">
          <div className="input-field-wrapper">
            <input 
              required 
              name='zipcode' 
              onChange={onChangeHandler} 
              value={data.zipcode} 
              type="text" 
              placeholder='Zip Code'
              className={errors.zipcode ? 'error-input' : ''}
            />
            {errors.zipcode && <span className="error-message">{errors.zipcode}</span>}
          </div>
          <div className="input-field-wrapper">
            <input 
              required 
              name='country' 
              onChange={onChangeHandler} 
              value={data.country} 
              type="text" 
              placeholder='Country'
              className={errors.country ? 'error-input' : ''}
            />
            {errors.country && <span className="error-message">{errors.country}</span>}
          </div>
        </div>
        <div className="input-field-wrapper">
          <input 
            required 
            name='phone' 
            onChange={onChangeHandler} 
            value={data.phone} 
            type="tel" 
            placeholder='Phone Number'
            className={errors.phone ? 'error-input' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
      </div>
      <div className="place-order-right">
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
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            {discount && discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details discount-row">
                  <p>Discount (50% off)</p>
                  <p className="discount-amount">-₹{discount.toFixed(2)}</p>
                </div>
              </>
            )}
            {promoApplied && promoCode && (
              <div className="promo-info">
                <p className="promo-applied-text">✓ Promo code "{promoCode}" applied</p>
              </div>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalWithDiscount().toFixed(2)}</b>
            </div>
          </div>
          <button 
            type='submit' 
            disabled={!isFormValid()}
            className={!isFormValid() ? 'disabled-button' : ''}
          >
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
