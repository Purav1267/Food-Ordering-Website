import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { food_list as initialFoodList } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState(initialFoodList);
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [discount, setDiscount] = useState(0);

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCartItems = { ...prev };
            if (updatedCartItems[itemId] > 1) {
                updatedCartItems[itemId] -= 1;
            } else {
                delete updatedCartItems[itemId];
            }
            return updatedCartItems;
        });
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const item = food_list.find(product => product._id === itemId);
            if (item) {
                totalAmount += item.price * cartItems[itemId];
            }
        }
        return totalAmount;
    };

    const applyPromoCode = (code) => {
        const codeUpper = code.trim().toUpperCase();
        if (codeUpper === "BML") {
            const subtotal = getTotalCartAmount();
            const deliveryFee = subtotal === 0 ? 0 : 2;
            const totalBeforeDiscount = subtotal + deliveryFee;
            const discountAmount = totalBeforeDiscount * 0.5; // 50% off
            setDiscount(discountAmount);
            setPromoApplied(true);
            setPromoCode(codeUpper);
            return { success: true, message: "Promo code applied! 50% off" };
        } else if (code.trim() === "") {
            return { success: false, message: "Please enter a promo code" };
        } else {
            setPromoApplied(false);
            setDiscount(0);
            return { success: false, message: "Invalid promo code" };
        }
    };

    const removePromoCode = () => {
        setPromoCode("");
        setPromoApplied(false);
        setDiscount(0);
    };

    const getTotalWithDiscount = () => {
        const subtotal = getTotalCartAmount();
        const deliveryFee = subtotal === 0 ? 0 : 2;
        const total = subtotal + deliveryFee - discount;
        return Math.max(0, total); // Ensure total is not negative
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
        setCartItems(response.data.cartData);
    }


    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        fetchFoodList,
        promoCode,
        promoApplied,
        discount,
        applyPromoCode,
        removePromoCode,
        getTotalWithDiscount
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;