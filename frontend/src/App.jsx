import React, { useState } from 'react';
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';  // Import Footer component
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders';
import StallDashboard from './pages/StallDashboard/StallDashboard';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />}></Route>
          <Route path='/myorders' element={<MyOrders/>}></Route>
          <Route path='/stall/:stallName' element={<StallDashboard />} />
        </Routes>
      </div>
      <Footer />  {/* Ensure Footer is properly imported and used */}
    </>
  );
}

export default App;
