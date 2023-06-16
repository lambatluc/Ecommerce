const { generateToken } = require("../config/jwtToken");
const User=require("../models/userModel");
const asyncHandler= require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
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
const loginUserCtrl= asyncHandler(async(req,res)=>{
    const {email, password}= req.body;
    // console.log(email, password); 
    //chekc if user exists or not
    const findUser= await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
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
};