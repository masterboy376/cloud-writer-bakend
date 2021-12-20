const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
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
    isImp:{
        type: Boolean,
        default: false,
    }
  });

  module.exports = mongoose.model('Note', notesSchema);