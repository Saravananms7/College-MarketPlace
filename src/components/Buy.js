import React, { useState } from 'react';
import './Buy.css';

const Buy = ({ products, addToCart, setSellingProducts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const categorizeProducts = (products) => {
        return products.reduce((categories, product) => {
            const { category } = product;
            if (!category) {
                if (!categories['Other']) {
                    categories['Other'] = [];
                }
                categories['Other'].push(product);
            } else {
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(product);
            }
            return categories;
        }, {});
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categorizedProducts = categorizeProducts(filteredProducts);
    const categories = Object.keys(categorizedProducts);

    const handleBuyClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleConfirmPurchase = async () => {
        if (selectedProduct) {
            try {
                // Send a request to mark the product as sold
                await fetch(`http://localhost:5000/api/products/${selectedProduct._id}/sell`, {
                    method: 'PUT',
                });

                // Log purchase
                console.log(`Purchased: ${selectedProduct.name} for $${selectedProduct.price}`);
                setSellingProducts(prev => prev.map(prod => 
                    prod._id === selectedProduct._id ? { ...prod, status: 'Sold' } : prod
                ));
                closeModal();
            } catch (error) {
                console.error('Error confirming purchase:', error);
            }
        }
    };

    return (
        <div className="buy-section">
            <h2>Buy Section</h2>
            <p>Select from different categories of products or search for a specific item.</p>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for products by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="category-nav">
                {categories.map((category) => (
                    <a key={category} href={`#${category}`} className="category-link">
                        {category}
                    </a>
                ))}
            </div>

            {categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category} id={category} className="category-section">
                        <h3 className="category-title">{category}</h3>
                        <div className="product-grid">
                            {categorizedProducts[category].map((product) => (
                                <div key={product.id} className="product-card">
                                    <img src={product.image} alt={product.name} className="product-image" />
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">Price: ${product.price}</p>
                                    <p className="product-description">{product.description}</p>
                                    <p className="product-contact">Contact: {product.contactNumber}</p>
                                    <div className="button-group">
                                        <button onClick={() => addToCart(product)} className="add-to-cart-button">Add to Cart</button>
                                        <button onClick={() => handleBuyClick(product)} className="buy-button">Buy</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No products found matching your search.</p>
            )}

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

export default Buy;
