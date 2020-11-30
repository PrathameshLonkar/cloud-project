const mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    Username :{
        type : String,
        required : "Required"
    },
    Password:{
        type : String,
    }
},
{collection: 'projects'}

    
);

mongoose.model("project",projectSchema);