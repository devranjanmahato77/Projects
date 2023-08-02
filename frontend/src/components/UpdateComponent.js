import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [error, setError] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        getProductDetails();
    },[]);

    const getProductDetails = async () =>{
        // console.warn(params)
        let result = await fetch(`http://localhost:5000/product/${params.id}`,{
            headers:{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json();
        console.warn(result)
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
    }

    const updateProductData = async () => {
        

        let result = await fetch(`http://localhost:5000/product/${params.id}`,{
            method: 'Put',
            body:JSON.stringify({name,price, category, company}),
            headers:{
                'Content-Type':'Application/json'
            }
        });
        result = await result.json();
        if(result){
            navigate('/');
        }

    }
    return (
        <div className='add-product'>
            <h1>Update Product</h1>
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

            <button className="appButton" type="button" onClick={updateProductData}>Update Product</button>

        </div>
    )
}

export default UpdateProduct;