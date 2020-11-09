const connection = require("./models");
const express = require("express");
const application  = express();
const path = express("path");
const expressHandlebars = require("express-handlebars");
const bodyparser = require("body-parser");
const routingController = require("./controllers/routing");


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

    res.render("index",{});
});

application.use("/routing",routingController);





application.listen("3000",(err)=>{
    if(!err){
        console.log("Server listening");
    }
});