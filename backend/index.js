require('dotenv').config();
const port = process.env.PORT;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { userInfo } = require('os');

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect(process.env.MONGODB_URL)

// API Creation
app.get("/",(req,res) => {
    res.send("Express App is Running")
})


// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb) => {
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage: storage})


// Creating Upload Endpoint for images
app.use('/images',express.static("upload/images"))
app.post("/upload",upload.single("product"),(req,res)=>{
    res.json({
        success: 1,
        image_url: `https://e-commerce-site-backend-tt1n.onrender.com/upload/images/${req.file.filename}`
    })
})


// Schema for Creating Products
const Product = mongoose.model("Product",{
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
})


// Creating API for Adding Products
app.post('/addproduct', async (req,res) =>{
    let products = await Product.find({});
    let id;
    if (products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
})


// Creating API for Deleting Products
app.post('/removeproduct',async (req,res) => {
    await Product.findOneAndDelete({id: req.body.id});
    console.log("Removed")
    res.json({
        success: true,
        name: req.body.name,
    })
})


// Creating API for Getting All products
app.get('/allproducts', async (req,res) =>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})


// Schema Creating for User Model
const Users = mongoose.model("Users",{
    name:{
        type: String,
    },
    email:{
        type: String,
        Unique: true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})


// Creating Endpoint for Registering the User
app.post('/signup',async (req,res) => {

    let check  = await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success: false, errors: "Email Already Exists"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++){
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();

    const data = {
        user:{
            id: userInfo.id
        }
    }

    const token = jwt.sign(data,process.env.SECRET_KEY);
    res.json({success: true, token})

})


// Creating Endpoint for User Login
app.post('/login',async (req,res) =>{
    let user = await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data = {
                user:{
                    id: user.id
                }
            }
            const token = jwt.sign(data,process.env.SECRET_KEY);
            res.json({success: true, token});
        }
        else{
            res.json({success: false, errors: "Invalid Password"});
        }
    }
    else{
        res.json({success: false, errors: "Wrong Email"});
    }
})

// Creating Endpoint for New Collection Data
app.get('/newcollections',async (req,res) => {
    let products = await Product.find({});
    let new_collection = products.slice(1).slice(-8);
    console.log("New Collection Fetched");
    res.send(new_collection);
})


// Creating Endpoint for Popular in Women Category
app.get('/popularinwomen',async (req,res) => {
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in Women Fetched");
    res.send(popular_in_women);
})


// Creating Middleware to Fetch User
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token){
        req.status(401).send({errors: "Please Authenticate using a valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,process.env.SECRET_KEY);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors: "Please Authenticate using a valid token"})
        }
    }
}


// Creating Endpoint for Adding Products to Cart
app.post('/addtocart', fetchUser, async (req,res) => {
    console.log("Added", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added to Cart");
})


// Creating Endpoint for Removing Products from Cart
app.post('/removefromcart', fetchUser, async (req,res) =>{
    console.log("Removed", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed From Cart");
})


// Creating Endpoint for Getting Cart Data
app.post('/getcart', fetchUser, async (req,res) => {
    console.log("Getting Cart Data");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


app.listen(port, (error) => {
    if (!error){
        console.log("Server Running on Port "+port)
    }
    else{
        console.log("Error : "+error)
    }
})
 