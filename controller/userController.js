const { generateToken } = require("../config/jwtToken");
const User=require("../models/userModel");
const asyncHandler= require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const {generateRefreshToken}= require("../config/refreshToken");
const jwt= require('jsonwebtoken');
//Create a User
const createUser= asyncHandler(async(req, res) => {
    const email= req.body.email;
    const findUser= await User.findOne({email:email});
    if(!findUser){
        //Create a new User
        const newUser= await User.create(req.body);
        res.json(newUser);
    }
    else{
        throw new Error("User Already Exists");
    }
    });

// Login a user
const loginUserCtrl= asyncHandler(async(req,res)=>{
    const {email, password}= req.body;
    // console.log(email, password); 
    //check if user exists or not
    const findUser= await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken= await generateRefreshToken(findUser?._id);
        const updateuser= await User.findByIdAndUpdate(
            findUser.id, 
            {
            refreshToken: refreshToken,
            }, 
            {new: true}
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72* 60* 60* 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile:findUser?.mobile,
            token:generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

//Get all users
const getAllUser= asyncHandler(async(req, res)=>{
    try{
        const getUsers= await User.find();
        res.json(getUsers);
    }
    catch (error){
        throw new Error(error)
    }
});

//Get a single user
const getaUser= asyncHandler(async(req,res)=>{
    const {id}= req.params;
    validateMongoDbId(id);
    try{
        const getaUser= await User.findById(id);
        res.json({
            getaUser,
        })
    }
    catch(error){
        throw new Error(error);
    }
}); 

// handle refresh token
const handleRefreshToken= asyncHandler(async(req,res)=>{
    const cookie= req.cookies;
    console.log(cookie);
    if(!cookie?.refreshToken) throw new Error('No Refresh token In Cookies');
    const refreshToken= cookie.refreshToken;
    console.log(refreshToken);
    const user= await User.findOne({refreshToken});
    if(!user) throw new Error("No Refresh token present in db or not matched");
    jwt.verify(
        refreshToken, 
        process.env.JWT_SECRET,
        (err, 
        (decoded)=>{
            
        })
    );
});

//Update a user
const updatedUser= asyncHandler(async(req, res)=>{
    console.log(req.user);
    const {_id}= req.user;
    validateMongoDbId(id);
    try{
        const updatedUser= await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new: true,
        }
        );
        res.json(updatedUser);
    } catch(error){
        throw new Error(error);
    }
})

//Delete a user
const deleteaUser= asyncHandler(async(req,res)=>{
    const {id}= req.params;
    try{
        const deleteaUser= await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        })
    }
    catch(error){
        throw new Error(error);
    }
}); 

const blockUser= asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const blockUser=await User.findByIdAndUpdate(
        id, {
            isBlocked:true,
        },
        {
            new: true,
        }
        );
        res.json(blockUser);
    }catch(error){
        throw new Error(error);
    }
});
const unblockUser= asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const unblockUser=await User.findByIdAndUpdate(
        id, {
            isBlocked: false,
        },
        {
            new: true,
        }
        );
        res.json(unblockUser);
    }catch(error){
        throw new Error(error);
    }
});


module.exports={
    createUser, 
    loginUserCtrl, 
    getAllUser,
    getaUser, 
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
};