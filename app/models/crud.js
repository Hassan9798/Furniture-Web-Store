const express=require('express');
const app=express();
const mongoose=require('mongoose');

const User=mongoose.model('login_user',new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:5,
        max:255
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    },
    confpassword:{
        type:Number,
        required:true,
        minlength:5,
        maxlength:255
    },
    vendor:{
        type:String,
        required:true
    }
}));

exports.User=User;