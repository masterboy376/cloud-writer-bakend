const mongoose = require('mongoose');
const { Schema } = mongoose;

//creating a schema for note to be added.
const notesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type: String,
        default: 'Untitled',  
    },
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        default: 'General', 
    },
    date:{
        type: Date,
        default: Date.now,  
    },
    type:{
        type: String,
        default: "Typed",  
    },
    isImp:{
        type:Boolean,
        default:false,
    }
  });
  //creating Notes model
  const Notes = mongoose.model('Notes', notesSchema);
  //exporting Notes model
  module.exports = mongoose.model('Notes', notesSchema);