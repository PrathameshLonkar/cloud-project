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

application.post("/",(req,res)=>{
  
    projectModel.find(req.body,(err, docs)=>{ 
        if(!err){
            res.render("list",{data :docs});
           // console.log(docs);
         
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
            owner: 'shubham',
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
    res.redirect('/');
  });
