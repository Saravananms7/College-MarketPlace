import React from 'react';

const Status = ({ sellingProducts }) => {
    return (
        <div>
            <h2>Status Section</h2>
            <ul>
                {sellingProducts.map((product, index) => (
                    <li key={index}>
                        {product.name} - {product.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Status;
