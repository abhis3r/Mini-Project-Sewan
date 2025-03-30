const express=require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const UserModel=require('./models/users'); 

const app=express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/miniproject")
.then(()=>console.log("connected to mongodb"))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/register',(req,res)=>{
    UserModel.create(req.body)
    .then(user=>res.json(user))
    .catch(err=>res.json(err))
})

app.post("/login",(req,res)=>{
    const{email,password}=req.body;
    UserModel.findOne({email:email})
    .then(user=>{
        if(user){
            if(user.password===password){
                res.json("Success");
            } else{
                res.json("wrong password")
            }
        } else{
            res.json("user not found")
        }
    })
})


app.listen(3001,()=>{
    console.log("server is running");
})