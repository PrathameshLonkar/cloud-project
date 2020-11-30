const connection = require("./models");
const express = require("express");
const application  = express();
const path = require("path");
const expressHandlebars = require("express-handlebars");
const bodyparser = require("body-parser");
const routingController = require("./controllers/routing");
const multer =  require('multer');
const gridFsStorage = require('multer-gridfs-storage');
const grid = require('gridfs-stream');
const mongoose = require('mongoose');
const crypto = require('crypto');
const projectModel =  mongoose.model("project");

var username='';

application.use(bodyparser.urlencoded({ 
    extended: true
}));


application.engine("hbs",expressHandlebars({
    extname : "hbs", 
    defaultLayout : "mainLayout",
    layoutDir : __dirname + "/views/layouts",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      }
}));

application.set("view engine","hbs");

application.get("/",(req,res)=>{

    //res.render("index",{});
    res.render("login_page");
});

application.post("/login",(req,res)=>{
  console.log(req.body);
    projectModel.find(req.body,(err, docs)=>{ 
        if(!err){
            console.log(docs);
            let data = docs[0].Username;
            username = data;
            console.log(data);
            res.render("list",{data :docs});
           // console.log(docs);
         
        }
        else{
         res.send(err);
        }
     }
    )


})

application.get("/register",(req,res)=>{
  res.render("Register_page");

})

application.post("/register_id",(req,res)=>{
  
    projectModel.insertMany(req.body,(err, docs)=>{ 
        if(!err){
            
            res.render("login_page");
         
        }
        else{
         res.send(err);
        }
     }
    )


})
application.use("/routing",routingController);





application.listen("3000",(err)=>{
    if(!err){
        console.log("Server listening");
    }
});




const url = 'mongodb://localhost:27017/cloudproject';
var conn = mongoose.createConnection(url);
let gfs;
conn.once('open', ()=> {
  gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
  // all set!
});


// Create storage engine
const storage = new gridFsStorage({
    url: url,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            metadata: {owner: username},
            bucketName: 'uploads'
            
          };
          resolve(fileInfo);
        });
      });
    }
  });

  const upload = multer({ storage });

  application.post('/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    let docs1 = {Username: ''};
    docs1["Username"] = username;
    
    res.render("list",{data :docs1});

  });

  application.get('/displayCollection', (req, res) => {

    gfs.files.find({metadata: {owner : username}}).toArray((err,files) => {
        let docs1 = {Username: ''};
if(!files || files.length === 0){
    
    docs1["Username"] = username;
    console.log("Entered if");
   res.render("list",{data : docs1});
}
else{
    //res.json(files);
    console.log("Entered else");
    docs1["Username"] = username;
files.map(file =>{

    if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){


        file.isImage = true;
    }else{
file.isImage = false;
    }

})
console.log(files); 
res.render("coll",{data : docs1, files : files});



}

    })  

});


  
application.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });