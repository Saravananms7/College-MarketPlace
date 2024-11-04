import React, { useState, useEffect } from 'react';
import './Sell.css';

const Sell = ({ sellingProducts, setSellingProducts, sellerId }) => {
    const [sellData, setSellData] = useState({
        productName: '',
        category: '',
        price: '',
        image: '',
        description: '',
        contactNumber: ''
    });

    const [previewImage, setPreviewImage] = useState(null); // For image preview
    const [error, setError] = useState(null); // For error handling
    const [loading, setLoading] = useState(false); // For loading state
    const [success, setSuccess] = useState(null); // For success message

    useEffect(() => {
        // Cleanup preview URL when image changes
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleSellChange = (e) => {
        const { name, value } = e.target;
        setSellData({ ...sellData, [name]: value });
        
        // Update preview if image is a URL
        if (name === 'image' && value) {
            setPreviewImage(value); // Use the URL as the preview
        }
    };

    const handleSellSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError(null); // Reset error state
        setSuccess(null); // Reset success state

        try {
            // Validate price is a positive number
            if (parseFloat(sellData.price) <= 0) {
                setError('Price must be a positive number.');
                return;
            }

            // Validate image URL format (more detailed regex check)
            const validImageUrlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))/i; // Check for valid image URL format
            if (!validImageUrlPattern.test(sellData.image)) {
                setError('Invalid image URL');
                return;
            }

            // Submit product details with the image URL
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: sellData.productName,
                    category: sellData.category,
                    price: sellData.price,
                    image: sellData.image, // Use the provided URL directly
                    description: sellData.description,
                    contactNumber: sellData.contactNumber,
                    seller: sellerId,
                }),
            });

            if (!response.ok) {
                throw new Error('Product creation failed');
            }

            const newProduct = await response.json();
            setSellingProducts([...sellingProducts, { ...newProduct, status: 'Available' }]);
            setSuccess('Product added successfully!'); // Set success message

            // Reset form after submission
            setSellData({
                productName: '',
                category: '',
                price: '',
                image: '',
                description: '',
                contactNumber: ''
            });
            setPreviewImage(null);
        } catch (error) {
            console.error('Error adding product:', error);
            setError(error.message || 'An error occurred while adding the product.');
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="sell-section">
            <h2>Sell Section</h2>
            {error && <p className="error">{error}</p>} {/* Display error */}
            {success && <p className="success">{success}</p>} {/* Display success message */}
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
                    type="text"
                    name="image"
                    value={sellData.image}
                    onChange={handleSellChange}
                    placeholder="Image URL"
                    required
                />
                {previewImage && <img src={previewImage} alt="Product Preview" />} {/* Image preview */}
                <textarea
                    name="description"
                    value={sellData.description}
                    onChange={handleSellChange}
                    placeholder="Description"
                    required
                />
                <input
                    type="tel"
                    name="contactNumber"
                    value={sellData.contactNumber}
                    onChange={handleSellChange}
                    placeholder="Contact Number"
                    required
                />
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Sell'}</button>
            </form>
        </div>
    );
};

export default Sell;
