import React, { useState } from 'react';
import './Dashboard.css';
import Buy from './Buy';
import Sell from './Sell';
import Cart from './Cart';
import Status from './Status';
import Profile from './Profile';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('buy');
    const [cartItems, setCartItems] = useState([]);
    const [sellingProducts, setSellingProducts] = useState([]);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'student',
        department: '',
        year: '',
    });
    const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = [
        { 
            id: 1, 
            name: 'JavaScript Book', 
            price: 20, 
            description: 'Learn JavaScript.', 
            category: 'Books', 
            imageUrl: 'https://books.goalkicker.com/JavaScriptBook/JavaScriptGrow.png',
            contactNumber: '123-456-7890'
        },
        { 
            id: 2, 
            name: 'Laptop', 
            price: 500, 
            description: 'A powerful laptop.', 
            category: 'Electronics', 
            imageUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?cs=srgb&dl=pexels-life-of-pix-7974.jpg&fm=jpg',
            contactNumber: '234-567-8901'
        },
        { 
            id: 3, 
            name: 'T-Shirt', 
            price: 15, 
            description: 'Comfortable cotton t-shirt.', 
            category: 'Clothing', 
            imageUrl: 'https://veirdo.in/cdn/shop/files/Artboard8.png?v=1724158576&width=360',
            contactNumber: '345-678-9012'
        },
        { 
            id: 4, 
            name: 'Headphones', 
            price: 50, 
            description: 'Noise-cancelling headphones.', 
            category: 'Electronics', 
            imageUrl: 'https://img.freepik.com/free-photo/pink-headphones-wireless-digital-device_53876-96804.jpg',
            contactNumber: '456-789-0123'
        },
        { 
            id: 5, 
            name: 'Pen', 
            price: 10, 
            description: 'Ball pen.', 
            category: 'Others', 
            imageUrl: 'https://5.imimg.com/data5/SELLER/Default/2020/10/PX/KF/AW/20193325/ink-pen.jpg',
            contactNumber: '567-890-1234'
        },
    ];
    
    // Add product to cart
    const addToCart = (product) => {
        const itemToAdd = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
        };
        setCartItems((prevItems) => [...prevItems, itemToAdd]);
    };

    // Remove product from cart by index
    const removeItemFromCart = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
    };

    // Clear the entire cart
    const clearCart = () => setCartItems([]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleBuyClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Placeholder function to simulate purchase logic
    const handleConfirmPurchase = () => {
        if (selectedProduct) {
            console.log(`Purchased: ${selectedProduct.name} for $${selectedProduct.price}`);
            closeModal();
        }
    };

    return (
        <div className="dashboard-container">
            <div className="navbar">
                <button className={activeSection === 'buy' ? 'active' : ''} onClick={() => setActiveSection('buy')}>Buy</button>
                <button className={activeSection === 'sell' ? 'active' : ''} onClick={() => setActiveSection('sell')}>Sell</button>
                <button className={activeSection === 'cart' ? 'active' : ''} onClick={() => setActiveSection('cart')}>Cart</button>
                <button className={activeSection === 'status' ? 'active' : ''} onClick={() => setActiveSection('status')}>Status</button>
                <button className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>Profile</button>
            </div>

            <div className="page-design">
                {activeSection === 'buy' && <Buy products={products} addToCart={addToCart} handleBuyClick={handleBuyClick} />}
                {activeSection === 'sell' && <Sell sellingProducts={sellingProducts} setSellingProducts={setSellingProducts} />}
                {activeSection === 'cart' && (
                    <Cart 
                        cartItems={cartItems} 
                        clearCart={clearCart} 
                        removeItemFromCart={removeItemFromCart} 
                        handleBuyClick={handleBuyClick} // Pass handleBuyClick to Cart
                    />
                )}
                {activeSection === 'status' && <Status sellingProducts={sellingProducts} />}
                {activeSection === 'profile' && (
                    <Profile 
                        profileData={profileData} 
                        setProfileData={setProfileData} 
                        profileImage={profileImage} 
                        setProfileImage={setProfileImage} 
                    />
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Purchase</h3>
                        <p>Are you sure you want to buy <strong>{selectedProduct?.name}</strong> for ${selectedProduct?.price}?</p>
                        <button onClick={closeModal} className="modal-button">Cancel</button>
                        <button onClick={handleConfirmPurchase} className="modal-button">Confirm</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
