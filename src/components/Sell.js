import React, { useState } from 'react';
import './Sell.css';

const Sell = ({ sellingProducts, setSellingProducts }) => {
    const [sellData, setSellData] = useState({ productName: '', category: '', price: '', image: '', description: '', contactNumber: '' });

    const handleSellChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files && files.length > 0) {
            setSellData({ ...sellData, image: URL.createObjectURL(files[0]) });
        } else {
            setSellData({ ...sellData, [name]: value });
        }
    };

    const handleSellSubmit = (e) => {
        e.preventDefault();
        setSellingProducts([...sellingProducts, { name: sellData.productName, status: 'Pending' }]);
        setSellData({ productName: '', category: '', price: '', image: '', description: '', contactNumber: '' });
    };

    return (
        <div className="sell-section">
            <h2>Sell Section</h2>
            <p>Fill in the details below to sell your product.</p>
            <form onSubmit={handleSellSubmit}>
                <input type="text" name="productName" value={sellData.productName} onChange={handleSellChange} placeholder="Product Name" required />
                <select name="category" value={sellData.category} onChange={handleSellChange} required>
                    <option value="">Select a category</option>
                    <option value="books">Books</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="other">Other</option>
                </select>
                <input type="number" name="price" value={sellData.price} onChange={handleSellChange} placeholder="Price" required />
                <input type="file" accept="image/*" name="image" onChange={handleSellChange} required />
                {sellData.image && <img src={sellData.image} alt="Product Preview" />}
                <textarea name="description" value={sellData.description} onChange={handleSellChange} placeholder="Description" required />
                <input type="tel" name="contactNumber" value={sellData.contactNumber} onChange={handleSellChange} placeholder="Contact Number" required />
                <button type="submit">Sell</button>
            </form>
        </div>
    );
};

export default Sell;
