const express = require("express");
require('./db/config');
const User = require("./db/User");
const Product = require("./db/Product");
const app = express();
const cors = require("cors");

const Jwt = require('jsonwebtoken');
const jwtkey = 'e-comm'

app.use(express.json());
app.use(cors());

app.post('/register', async (req, res)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    // res.send(result)

    Jwt.sign({result},jwtkey,{expiresIn:"2h"},(err, token)=>{
        if(err){
            res.send({result:"Something went wrong!!!"})
        }
        res.send({result, auth:token})

    })

})

app.post('/login', async (req,res)=>{
    if(req.body.email && req.body.password){
        let user = await User.findOne(req.body).select("-password");
        if(user){
            Jwt.sign({user},jwtkey,{expiresIn:"2h"},(err, token)=>{
                if(err){
                    res.send({result:"Something went wrong!!!"})
                }
                res.send({user, auth:token})

            })
           
        }else{
            res.send({result:"Invalid credincials"})
        }
    }else{
        res.send({result:"Fill the required fields"})
    } 
})

app.post('/add-product', verifyToken, async (req,res)=>{
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
    
    console.log("result: ",result)
})

app.get('/products',verifyToken, async (req,res)=>{
    let products = await Product.find();
    if(products.length > 0){
        res.send(products);
    }else{
        res.send({result:"No result found!!!"});
    }
})

app.delete('/product/:id', verifyToken, async (req,res)=>{
    let result = await Product.deleteOne({_id:req.params.id})
    res.send(result);
})

// Get single product api

app.get("/product/:id", verifyToken, async(req,res)=>{
    let result = await Product.findOne({_id: req.params.id});
    if(result){
        res.send(result);
    }else{
        res.send({"result":"No Data Found!!!"})
    }
})

// update api

app.put('/product/:id', verifyToken, async (req,res)=>{
    let result = await Product.updateOne(
        {_id: req.params.id},
        {$set: req.body}
    )
    res.send(result);
});

// Search Api

app.get('/search/:key', verifyToken,  async (req,res) => {
    let result = await Product.find({
        "$or":[
            {
                name:{$regex: req.params.key}
            },
            {
                price:{$regex: req.params.key}
            },
            {
                category:{$regex: req.params.key}
            },
            {
                company:{$regex: req.params.key}
            },
        ]
    });
    res.send(result);
})

// Authentication middleware 

function verifyToken(req, res, next){
    // console.log(req.headers['authorization'])
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        Jwt.verify(token, jwtkey, (err, valid)=>{
            if(err){
                res.status(403).send({result:'Please provide a token.'})
            }else{
                next();
            }
        });
    }else{
        res.status(403).send({result:'Please provide a token.'})
    }
}

app.listen(5000,(req,res)=>{
    console.log("Connected to server.")
});
