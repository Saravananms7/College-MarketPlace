import React, { useState, useEffect } from 'react';
import './Sell.css';

const Sell = ({ sellingProducts, setSellingProducts, sellerId }) => {
    const [sellData, setSellData] = useState({
        productName: '',
        category: '',
        price: '',
        image: null,
        description: '',
        contactNumber: ''
    });

    const [previewImage, setPreviewImage] = useState(null); // For image preview
    const [error, setError] = useState(null); // For error handling

    useEffect(() => {
        // Cleanup preview URL when image changes
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleSellChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files && files.length > 0) {
            setSellData({ ...sellData, image: files[0] });
            setPreviewImage(URL.createObjectURL(files[0])); // Generate preview for the image
        } else {
            setSellData({ ...sellData, [name]: value });
        }
    };

    const handleSellSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null); // Reset error state

            // 1. Upload the image first
            const formData = new FormData();
            formData.append('image', sellData.image);

            const imageResponse = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!imageResponse.ok) {
                throw new Error('Image upload failed');
            }

            const imageData = await imageResponse.json();
            const imageUrl = imageData.url; // Image URL returned from the backend

            // 2. Submit product details with the image URL
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: sellData.productName,
                    category: sellData.category,
                    price: sellData.price,
                    image: imageUrl, // Use the image URL from the upload response
                    description: sellData.description,
                    contactNumber: sellData.contactNumber,
                    seller: sellerId, // Use the actual seller ID passed as a prop
                }),
            });

            if (!response.ok) {
                throw new Error('Product creation failed');
            }

            const newProduct = await response.json();
            setSellingProducts([...sellingProducts, { ...newProduct, status: 'Available' }]);

            // Reset form after submission
            setSellData({ productName: '', category: '', price: '', image: null, description: '', contactNumber: '' });
            setPreviewImage(null); // Reset image preview

        } catch (error) {
            console.error('Error adding product:', error);
            setError('An error occurred while adding the product.');
        }
    };

    return (
        <div className="sell-section">
            <h2>Sell Section</h2>
            {error && <p className="error">{error}</p>} {/* Display error */}
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
                    accept="image/*"
                    name="image"
                    onChange={handleSellChange}
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
                <button type="submit">Sell</button>
            </form>
        </div>
    );
};

export default Sell;
