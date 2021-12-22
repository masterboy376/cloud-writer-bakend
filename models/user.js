const mongoose = require('mongoose');
const { Schema } = mongoose;

//creating a schema for user.
const userSchema = new Schema({
  name:{
      type: String,
      required: true,  
  },
  email:{
      type: String,
      required: true,  
      unique: true,
  },
  password:{
      type: String,
      required: true,  
  },
  date:{
      type: Date,
      default: Date.now,  
  },
  type:{
      type: String,
      default: "Typed",  
  },
});
//creating User model
const User = mongoose.model('User', userSchema);
//exporting User model
module.exports = User;