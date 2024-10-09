import React from 'react';
import './Cart.css';

const Cart = ({ cartItems, clearCart, removeItemFromCart, handleBuyClick }) => {
    return (
        <div className="cart-section">
            <h2>Cart Section</h2>
            {cartItems.length > 0 ? (
                <ul className="cart-list">
                    {cartItems.map((item, index) => (
                        <li key={index} className="cart-item">
                            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                            <span className="cart-item-name">{item.name} - ${item.price}</span>
                            <div className="button-group">
                                <button onClick={() => removeItemFromCart(index)} className="remove-item-btn">Remove</button>
                                <button onClick={() => handleBuyClick(item)} className="buy-item-btn">Buy</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
            {cartItems.length > 0 && <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>}
        </div>
    );
};

export default Cart;
