import React, { useState } from 'react';
import axios from 'axios';
import './Feedback.css';

// Simple toast function if react-toastify is not available
const toast = {
    success: (msg) => alert(msg),
    error: (msg) => alert(msg)
};

const Feedback = ({ isOpen, onClose, item, orderId, userId, url, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [text, setText] = useState('');
    const [photos, setPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + photos.length > 5) {
            toast.error('Maximum 5 photos allowed');
            return;
        }

        const newPhotos = [...photos, ...files];
        setPhotos(newPhotos);

        // Create previews
        const newPreviews = [];
        newPhotos.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === newPhotos.length) {
                    setPhotoPreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const newPreviews = photoPreviews.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        setPhotoPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('orderId', orderId);
        formData.append('itemId', item.itemId || item._id);
        formData.append('itemName', item.name);
        formData.append('stallName', item.stall || '');
        formData.append('rating', rating);
        formData.append('text', text);
        
        photos.forEach((photo) => {
            formData.append('photos', photo);
        });

        try {
            const response = await axios.post(`${url}/api/feedback/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                toast.success('Feedback submitted successfully!');
                onSuccess();
                handleClose();
            } else {
                toast.error('Error submitting feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Error submitting feedback');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRating(0);
        setText('');
        setPhotos([]);
        setPhotoPreviews([]);
        onClose();
    };

    return (
        <div className="feedback-overlay" onClick={handleClose}>
            <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
                <div className="feedback-header">
                    <h2>Rate Your Experience</h2>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>
                
                <div className="feedback-item-info">
                    <h3>{item.name}</h3>
                </div>

                <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="rating-section">
                        <label>Rating *</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="text-section">
                        <label>Your Feedback</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Share your experience with this food item..."
                            rows="4"
                        />
                    </div>

                    <div className="photo-section">
                        <label>Upload Photos (Max 5)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoChange}
                            disabled={photos.length >= 5}
                        />
                        {photoPreviews.length > 0 && (
                            <div className="photo-previews">
                                {photoPreviews.map((preview, index) => (
                                    <div key={index} className="photo-preview">
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-photo"
                                            onClick={() => removePhoto(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="feedback-actions">
                        <button type="button" onClick={handleClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading || rating === 0}>
                            {loading ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Feedback;

