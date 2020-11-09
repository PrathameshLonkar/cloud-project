const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/cloudproject';
mongoose.connect(url,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
},(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('Successful bitch!!');
    }

 
});
const Course = require("./project.model");