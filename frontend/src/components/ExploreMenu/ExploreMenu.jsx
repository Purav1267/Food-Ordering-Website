import React from 'react'
import './ExploreMenu.css'
import { menu_list, stalls_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory, selectedStall, setSelectedStall}) => {

  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time. </p>
        <div className="explore-menu-list">
            {menu_list.map((item, index) => {
                return(
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-item">
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
        <h2 className='explore-stalls-title'>Explore with Stalls</h2>
        <p className='explore-menu-text'>Select your favorite stall to see their delicious offerings</p>
        <div className="explore-stalls-list">
            {stalls_list.map((stall, index) => {
                return(
                    <div onClick={()=>setSelectedStall(prev=>prev===stall.stall_name?"":stall.stall_name)} key={index} className="explore-stalls-list-item">
                        <img className={selectedStall===stall.stall_name?"active":""} src={stall.stall_image} alt="" />
                        <p>{stall.stall_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu