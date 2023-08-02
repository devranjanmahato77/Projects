import React, { useState } from 'react';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [error, setError] = useState(false);

    const sendProductData = async () => {
        console.log(name, price, category, company);
        if(!name || !price || !category || !company){
            setError(true);
            return false;
        }
        const userId = JSON.parse(localStorage.getItem('user'))._id;

        let result = await fetch("http://localhost:5000/add-product", {
            method: 'post',
            body: JSON.stringify({ name, price, category, userId, company }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        console.log(result)
        alert("Product added successfully.")
    }
    return (
        <div className='add-product'>
            <h1>Add Product</h1>
            <input type="text" placeholder="Enter product name" className="inputBox"
                onChange={(e) => setName(e.target.value)} value={name} />
            {(error && !name)? <span className='invalid-input'>Enter valid name</span>:null}

            <input type="text" placeholder="Enter product price" className="inputBox"
                onChange={(e) => setPrice(e.target.value)} value={price} />
            {(error && !price)? <span className='invalid-input'>Enter valid price</span>:null}

            <input type="text" placeholder="Enter product category" className="inputBox"
                onChange={(e) => setCategory(e.target.value)} value={category} />
            {(error && !category)? <span className='invalid-input'>Enter valid category</span>:null}

            <input type="text" placeholder="Enter product company" className="inputBox"
                onChange={(e) => setCompany(e.target.value)} value={company} />
            {(error && !company)? <span className='invalid-input'>Enter valid company</span>:null}

            <button className="appButton" type="button" onClick={sendProductData}>Add Product</button>

        </div>
    )
}

export default AddProduct;