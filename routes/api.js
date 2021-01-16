const express=require('express');
const app=express();


app.get('/index.ejs',(req,res)=>{
res.render('index.ejs');

})