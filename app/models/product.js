const mongoose=require('mongoose');
const photoschema=new mongoose.Schema({
imagePath:{
    type:String,
    required:true
},
name:{
    type:String,
    required:true
},
discription:{
    type:String,
    required:true
},
price:{
    type:Number,
    required:true
},
}),
Photos=mongoose.model('products',photoschema);
module.exports=Photos;