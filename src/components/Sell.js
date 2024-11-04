import React, { useState, useEffect } from 'react';
import './Sell.css';
import { useAuth } from '../AuthContext';

const Sell = ({ sellingProducts, setSellingProducts }) => {
    const { sellerId } = useAuth();

    console.log("sellerId in Sell component:", sellerId);

    const [sellData, setSellData] = useState({
        productName: '',
        category: '',
        price: '',
        image: '',
        description: '',
        contactNumber: ''
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleSellChange = (e) => {
        const { name, value } = e.target;
        setSellData({ ...sellData, [name]: value });

        if (name === 'image' && value) {
            setPreviewImage(value);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSellData({ ...sellData, image: file });
            setPreviewImage(imageUrl);
        }
    };

    const handleSellSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        if (!sellerId) {
            setError('You must be logged in to sell products.');
            setLoading(false);
            return;
        }
    
        try {
            const priceValue = parseFloat(sellData.price);
            if (isNaN(priceValue) || priceValue <= 0) {
                setError('Price must be a positive number.');
                return;
            }
    
            const formData = new FormData();
            formData.append('name', sellData.productName);
            formData.append('category', sellData.category);
            formData.append('price', priceValue);
            
            // Append image only if it exists
            if (sellData.image instanceof File) {
                formData.append('image', sellData.image);
            }
    
            formData.append('description', sellData.description);
            formData.append('contactNumber', sellData.contactNumber);
            formData.append('seller', sellerId);

            // Log the formData
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Product creation failed');
            }
    
            const newProduct = await response.json();
            setSellingProducts([...sellingProducts, { ...newProduct, status: 'Available' }]);
            setSuccess('Product added successfully!');
    
            setSellData({
                productName: '',
                category: '',
                price: '',
                image: '',
                description: '',
                contactNumber: ''
            });
            setPreviewImage(null);
    
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error adding product:', error);
            setError(error.message || 'An error occurred while adding the product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sell-section">
            <h2>Sell Section</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSellSubmit}>
                <input
                    type="text"
                    name="productName"
                    value={sellData.productName}
                    onChange={handleSellChange}
                    placeholder="Product Name"
                    required
                />
                <select
                    name="category"
                    value={sellData.category}
                    onChange={handleSellChange}
                    required
                >
                    <option value="">Select a category</option>
                    <option value="books">Books</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="other">Other</option>
                </select>
                <input
                    type="number"
                    name="price"
                    value={sellData.price}
                    onChange={handleSellChange}
                    placeholder="Price"
                    required
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                {previewImage && <img src={previewImage} alt="Product Preview" />}
                <textarea
                    name="description"
                    value={sellData.description}
                    onChange={handleSellChange}
                    placeholder="Product Description"
                    required
                ></textarea>
                <input
                    type="text"
                    name="contactNumber"
                    value={sellData.contactNumber}
                    onChange={handleSellChange}
                    placeholder="Contact Number"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Sell'}
                </button>
            </form>
        </div>
    );
};

export default Sell;
