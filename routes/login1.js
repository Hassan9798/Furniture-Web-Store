const express=require('express');
const router=express.Router();
const {User}=require('../app/models/crud');
router.use(express.json());

router.get('/',(req,res)=>{
    res.render('login1');

});
router.post('/',async(req,res)=>{
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user.password===req.body.pass)
        {
            res.send("login successfully");

        }
        else{

            res.send("again login");
        }
        

    });

});

module.exports=router;
