require('dotenv').config();
const express=require('express');
const app=express();
const PORT=process.env.PORT||10000;
const ejs=require('ejs');
const path=require('path');
// const expressLayout=require('express-ejs-layouts');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo') (session);
const crud=require('./routes/crud');
let mix=require('laravel-mix');
const login1=require('./routes/login1');
var fileupload = require('express-fileupload'); 
const Photo=require("./app/models/product");
var multer = require('multer');
// const Photo = mongoose.model('Photos');
// var flash = require('connect-flash');
const { exec } = require('child_process');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/register1.ejs',crud);
app.use('/login1.ejs',login1);
// app.use(expressLayout);
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine','ejs');
app.use(flash());
var fs = require('fs');

    mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'));
    const connection=mongoose.connection;

    
    
    var imagedata=Photo.find({});

  //mongoDbStore
 let mongoStore= new MongoDbStore({
    mongooseConnection:connection,
    collection:'sessions'

  });




// file upload image
app.use(express.static(path.join(__dirname, './public/')));

//session
app.use(session({
secret:process.env.COOKIE_SECRET,
store:mongoStore,
resave:false,
saveUninitialized:false,
cookie:{maxAge:1000 * 60 * 60 *24 }
}));


/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './public/files',
  filename: function(req, file, fn){
    fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
  }
}); 

//init

const upload =  multer({
  storage: storageEngine,
  limits: { fileSize:200000 },
  fileFilter: function(req, file, callback){
    validateFile(file, callback);
  }
}).single('photo');


var validateFile = function(file, cb ){
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return cb(null, true);
  }else{
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}

app.get('/',async (req,res,next)=>{
    
  Photo.find({}, function(err, photos) {
		return res.render('index', {  photolist : photos });
	});
});

app.get('/index.ejs',async (req,res,next)=>{
    
  Photo.find({}, function(err, photos) {
		return res.render('index', {  photolist : photos });
	});
});
app.get('/about.ejs',(req,res)=>{
    res.render('about');

});
app.get('/cart',(req,res)=>{
  res.render('cart');

});
app.get('/contact.ejs',(req,res)=>{
    res.render('contact');

});
app.get('/blog.ejs',(req,res)=>{
    res.render('blog');

});
app.get('/about.ejs',(req,res)=>{
    res.render('about');

});
app.get('/product_detail3.ejs',(req,res)=>{
    res.render('product_detail3');

});
app.get('/product.ejs',(req,res)=>{
  Photo.find({}, function(err, photos) {
		return res.render('product', {  photolist : photos });
	});

});
app.get('/fileupload1.ejs', async (req, res, next) => {
    Photo.find({}, ['imagePath','name','discription','price'], {sort:{ _id: -1} }, function(err, photos) {
		return res.render('fileupload1', {  photolist : photos });
	});
});

app.post('/upload', function(req, res) {
    
	upload(req, res,(error) => {
		if(error){
			console.log('message', 'Invalid file type. Only JPG, PNG or GIF file are allowed.');
			res.redirect('/fileupload1.ejs');
		}else{
		  if(req.file == undefined){
			
			console.log('message', 'File size too large');
			res.redirect('/fileupload1.ejs');
  
		  }else{
			   
			  /**
			   * Create new record in mongoDB
			   */
			  var fullPath = "files/"+req.file.filename;
  
			  var document = {
				imagePath:          fullPath, 
				name:         req.body.name,
				discription:   req.body.discription,
				price:         req.body.price
			  };
	
			var photo = new Photo(document); 
			photo.save(function(error){
			  if(error){ 
				throw error;
              } 
              console.log('message', 'Photo uploaded successfully');
              res.redirect('/');
              
			  
			  
		   });
      }
	  }
	});    
  });

  app.get('/search',async(req,res,next)=>{
    // // const searchfield=req.body.search;
    // Photo.find({name:req.body.name})
    //           .then(photos=>{
    //           return res.render('search', {  photolist : photos });
    //            })
      if (req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi')
        Photo.find({ "name": regex }, function(err, products) {
          if(err) {
            console.log(err);
        } else {
           res.render("search",{photolist : products });
        }
        });
        
        
        
      }
  
  });





  app.get('/video', function(req, res) {
    const path = './public/video/sample.mp4';
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
  
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
  
      if(start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
        return
      }
      
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
  
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  })


  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};





app.listen(PORT,()=>{

    console.log(`connecting into ${PORT}`)
});