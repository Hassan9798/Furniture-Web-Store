const express=require('express');
const router=express.Router();
const {User}=require('../app/models/crud');
router.use(express.json());


router.get('/',(req,res)=>{
    res.render('register1');

});
router.post('/',async(req,res)=>{
    // let user=await User.findOne({email:req.body.email});
    //    if(user){res.send("user already exits");}
          user=new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.pass,
        confpassword:req.body.confpass,
        vendor:req.body.vendor
    });
    user= await user.save();
    res.send(user);
});

module.exports=router;