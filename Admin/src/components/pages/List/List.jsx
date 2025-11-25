import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../../assets/assets';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stall: ""
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("Error fetching food list: " + error.message);
    }
  };

  const removeFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to remove this food item?")) {
      return;
    }
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Refresh list after removal
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Error removing food: " + error.message);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditData({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "",
      stall: item.stall || ""
    });
    setEditImage(null);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setEditingItem(null);
    setEditImage(null);
    setEditData({
      name: "",
      description: "",
      price: "",
      category: "",
      stall: ""
    });
  };

  const handleEditChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEditData(data => ({ ...data, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const formData = new FormData();
      formData.append("id", editingItem._id);
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      formData.append("price", Number(editData.price));
      formData.append("category", editData.category);
      formData.append("stall", editData.stall || "");
      if (editImage) {
        formData.append("image", editImage);
      }

      const response = await axios.put(`${url}/api/food/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Refresh list after update
        closeEditModal();
      } else {
        toast.error("Error updating food item");
      }
    } catch (error) {
      toast.error("Error updating food item: " + error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, [url]); // Add `url` to dependency array

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Stall</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.stall || "N/A"}</p>
              <p>₹{item.price}</p>
              <div className="list-actions">
                <button onClick={() => openEditModal(item)} className="edit-btn">Edit</button>
                <button onClick={() => removeFood(item._id)} className="remove-btn">X</button>
              </div>
            </div>
          ))
        ) : (
          <p>No foods available</p>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Food Item</h2>
              <button className="close-btn" onClick={closeEditModal}>×</button>
            </div>
            <form className="edit-form flex-col" onSubmit={handleEditSubmit}>
              <div className="add-img-upload flex-col">
                <p>Upload New Image (Optional)</p>
                <label htmlFor="edit-image">
                  <img 
                    src={
                      editImage 
                        ? URL.createObjectURL(editImage) 
                        : editingItem 
                          ? `${url}/images/${editingItem.image}` 
                          : assets.upload_area
                    } 
                    alt="" 
                  />
                </label>
                <input 
                  onChange={(e) => setEditImage(e.target.files[0])} 
                  type="file" 
                  id="edit-image" 
                  hidden 
                />
              </div>
              <div className="add-product-name flex-col">
                <p>Product Name</p>
                <input 
                  onChange={handleEditChange} 
                  value={editData.name} 
                  type="text" 
                  name="name" 
                  placeholder="Type here" 
                  required
                />
              </div>
              <div className="add-product-description flex-col">
                <p>Product Description</p>
                <textarea 
                  onChange={handleEditChange} 
                  value={editData.description} 
                  name="description" 
                  rows="6" 
                  placeholder="Write description here"
                  required
                ></textarea>
              </div>
              <div className="add-category-price">
                <div className="add-category flex-col">
                  <p>Product Category</p>
                  <select 
                    onChange={handleEditChange} 
                    name="category" 
                    value={editData.category} 
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Salad">Salad</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Cake">Cake</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                  </select>
                </div>
                <div className="add-price flex-col">
                  <p>Product Price</p>
                  <input 
                    onChange={handleEditChange} 
                    value={editData.price} 
                    type="Number" 
                    name="price" 
                    placeholder="₹ 100" 
                    required
                  />
                </div>
              </div>
              <div className="add-stall flex-col">
                <p>Stall (Optional)</p>
                <select onChange={handleEditChange} name="stall" value={editData.stall}>
                  <option value="">Select Stall</option>
                  <option value="Kathi Junction">Kathi Junction</option>
                  <option value="Smoothie Zone">Smoothie Zone</option>
                  <option value="Muskan Hotel">Muskan Hotel</option>
                  <option value="Old Rao Hotel">Old Rao Hotel</option>
                  <option value="Shyam Dhaba">Shyam Dhaba</option>
                  <option value="Shyaam Dhaba">Shyaam Dhaba</option>
                </select>
              </div>
              <div className="edit-modal-buttons">
                <button type="button" onClick={closeEditModal} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
