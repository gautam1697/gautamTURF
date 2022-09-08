const User=require('../models/user.Model')
const jwt = require("../middlewares/jwt");
const crypto=require('crypto')
const bcrypt=require('bcrypt')
const {sendEmail}=require('../middlewares/sendEmail')
const {getResetPasswordToken}=require('../middlewares/jwt')

exports.register=async(req,res)=>{
    try{
        
        const{username,email,password,firstname,lastname,phone,role}=req.body;
        let user=await User.findOne({email});
        if(user){
         return res.status(400).json({success:false,message:'user already exists'})
        }

        user=await User.create({username,email,password,firstname,lastname,phone,role})
       
    res.status(201).json({success:true,user})
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
//User login code

exports.logout=async(req,res)=>{
    try{
        res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({
            success:true,
            message:"Log Out"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.getUser = async(req,res)=>{
    try { 
         const user = await User.findById(req.token.id)
         if(!user){
            res.status(403).send();
            return;
         }
         return res.json(
            {
                data:user.email
            }
         )

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        }) 
    }
}
////


exports.updateRole=async(req,res)=>{
    try{
        user=await User.findOneAndUpdate({'email':req.body.email},{role:req.body.role})
        res.json({success:true,user})
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
/////

exports.loginUser=async(req,res)=>{
    try{
        
        const{email,password}=req.body;
        const user= await User.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({Success:false,message:"user not found"})
        }
        const isMatch=await user.matchPassword(password)
       
        
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            })
        }
        const token= await jwt.sign(user);

        res.status(201).json({
            success:true,
            message:"User logged in successfully",
            user,token
        })
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }
}

exports.getUserDetails=async(req,res)=>{
    try {
    
        const user=await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({success:false,message:"user not found"})
        }
        else{
            return res.status(200).json({success:true,user})
        }
        
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
        
    }
}
exports.updateUserProfile=async(req,res)=>{
    try{
    const user= await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    return res.status(200).json({success:true,user})
}
catch(error){
    return res.status(500).json({success:false,message:error.message})
}
}
exports.blockUserProfile=async(req,res)=>{
    try {
        const user= await User.findByIdAndUpdate(req.params.id,{$set:{'user_status':req.body.user_status}})
        return res.status(200).json({success:true,message:"user blocked/unblocked successfully",user});


    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
        
    }
}

exports.getAllUsers=async(req,res)=>{
    try{
        const users=await User.find({})
        res.status(200).json({
            success:true,
            users
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.forgotPassword=async(req,res)=>{

    try {
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json({success:false,message:"user does not exist"})
        }
        const resetPasswordToken=getResetPasswordToken();
        await user.save();
    const resetUrl=`${req.protocol}://${req.get("host")}/api/v2/password/reset/${resetPasswordToken}`
    const message=`Reset your password by clicking on the link below:\ ${resetUrl}`
    try { 
        await sendEmail({email:user.email
            ,subject:"Reset Password"
            ,message,});

    res.status(200).json
    ({success:true,
    message:`Email sent to ${user.email}`});
        
    } catch (error) {
      user.ResetPasswordToken=undefined;
      user.ResetPasswordExpire=undefined;
      await user.save()
      res.status(500).json
      ({success:false,
    message:error.message})   
    } 
    } catch (error) {
        return res.status(500).json
        ({success:false,
        message:error.message})
    }

}

exports.resetPassword=async(req,res)=>{
    try{
        const resetPasswordToken=crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")
        console.log(resetPasswordToken)

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    }).select("+password");
    if(!user){
        return res.status(401).json({
            success:false,
            message:"Token is invalid or hash expired"
        })
    }
console.log(user)
    user.password=req.body.password;
    await user.save()
    // user.resetPasswordToken=undefined;
    // user.resetPasswordExpire=undefined;
    res.status(200).json({
        success:true,
        message:"password reset successfully"
    })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.updatePassword=async(req,res)=>{
    try {
        const{email,password,updatedkey}=req.body;
        const user= await User.findOne({email}).select("+password")
        if(!user){
            return res.status(404).json({success:false,message:"user not found"})
        }
        if(bcrypt.compare(req.body.password,user.password)){
            user.password=req.body.updatedkey
            await user.save()
            res.status(200).json({success:true,message:"password changed succesfully"})

        }
        res.status(401).json({success:false,message:"Incorrect password"})

        
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
        
    }
}