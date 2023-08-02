import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        const auth = localStorage.getItem('user');
        if(auth){
            navigate('/');
        }
    })

    const collectData = async () => {
        console.log("Submitted successfully!!!", name, email, password)
        // integrate signup API
        let result = await fetch("http://localhost:5000/register", {
            method: 'post',
            body: JSON.stringify({ name, email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.log(result)
        localStorage.setItem('user',JSON.stringify(result.result));
        localStorage.setItem('token',JSON.stringify(result.auth));
        navigate('/');
    }

    return (
        <div className="register">
            <h1>Register</h1>
            <input className="inputBox" type="text" placeholder="Enter full name"
                onChange={(e) => setName(e.target.value)} value={name}
            />
            <input className="inputBox" type="text" placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} value={email}
            />
            <input className="inputBox" type="password" placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} value={password}
            />
            <button className="appButton" type="button" onClick={collectData}>Sign Up</button>
        </div>
    )
}
export default SignUp;