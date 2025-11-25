import React, { useContext, useState, useRef, useEffect } from 'react'
import './Navbar.css' 
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({setShowLogin}) => {

  const [menu,setMenu] = useState("Home");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const {getTotalCartAmount,token,setToken,food_list,url} = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }

  // Filter food items based on search query
  const filteredFoods = food_list.filter((food) => {
    const query = searchQuery.toLowerCase();
    return (
      food.name.toLowerCase().includes(query) ||
      food.description.toLowerCase().includes(query) ||
      food.category.toLowerCase().includes(query)
    );
  }).slice(0, 5); // Limit to 5 results

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSearchQuery("");
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }, 100);
    }
  }

  const handleFoodClick = (foodId) => {
    setShowSearch(false);
    setSearchQuery("");
    // Navigate to home with item ID as URL parameter
    navigate(`/?item=${foodId}`);
  }

  return (
    <div className='navbar'>
        <Link to=''><img src={assets.logo} alt="" className="logo" /></Link>
        <ul className="navbar-menu">
            <Link to='/' onClick={()=>setMenu("Home")} className={menu==="Home"?"active":""}>Home</Link>
            <a href='#explore-menu' onClick={()=>setMenu("Menu")} className={menu==="Menu"?"active":""}>Menu</a>
            <a href='#app-download' onClick={()=>setMenu("Mobile-App")} className={menu==="Mobile-App"?"active":""}>Mobile-App</a>
            <a href='#footer' onClick={()=>setMenu("Contact-Us")} className={menu==="Contact-Us"?"active":""}>Contact Us</a>
        </ul>
        <div className="navbar-right">
            <div className="navbar-search-container" ref={searchRef}>
              <img 
                src={assets.search_icon} 
                alt="" 
                onClick={handleSearchClick}
                className="search-icon-clickable"
              />
              {showSearch && (
                <div className="search-dropdown">
                  <div className="search-input-wrapper">
                    <img src={assets.search_icon} alt="" className="search-icon-in-input" />
                    <input
                      type="text"
                      placeholder="Search for food items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                    {searchQuery && (
                      <img 
                        src={assets.cross_icon} 
                        alt="" 
                        className="clear-search-icon"
                        onClick={() => setSearchQuery("")}
                      />
                    )}
                  </div>
                  {searchQuery && (
                    <div className="search-results">
                      {filteredFoods.length > 0 ? (
                        filteredFoods.map((food) => (
                          <div
                            key={food._id}
                            className="search-result-item"
                            onClick={() => handleFoodClick(food._id)}
                          >
                            <img 
                              src={url + "/images/" + food.image} 
                              alt={food.name}
                              className="search-result-image"
                            />
                            <div className="search-result-info">
                              <p className="search-result-name">{food.name}</p>
                              <p className="search-result-price">₹{food.price}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="search-no-results">
                          <p>No food items found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="navbar-search-icon">
                <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                <div className={getTotalCartAmount()===0?"":"dot"}></div>
            </div>
            {!token?<button onClick={()=>setShowLogin(true)}>Sign In</button>
            :<div className='navbar-profile' ref={profileRef}> 
                <img 
                  src={assets.profile_icon} 
                  alt="" 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                />
                {showProfileDropdown && (
                  <ul className="nav-profile-dropdown">
                    <li onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/myorders');
                    }}>
                      <img src={assets.bag_icon} alt="" /><p>Orders</p>
                    </li>
                    <hr />
                    <li onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                    }}>
                      <img src={assets.logout_icon} alt="" /><p>Logout</p>
                    </li>
                  </ul>
                )}
              </div>}
        </div>
    </div>
  )
}

export default Navbar