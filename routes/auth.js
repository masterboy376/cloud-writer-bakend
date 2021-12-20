const express = require('express');
// const { Schema } = mongoose;
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();


// create a user using: POST "/api/auth/" : Doesn't require Authentication.
router.post('/',[
    body('name', 'Enter a valid name...').isLength({ min: 1 }),
    body('email', 'Enter a valid email...').isEmail(),
    body('password', 'Password must contain at least 6 characters...').isLength({ min: 6 })
] ,(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    else{
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          }).then(user => res.json(user)).catch((error)=>{
              console.log("error during creating the user. " +error);
              res.json({error:'please enter a unique value for email...', message: error.message})
          });
        }
    }
);

module.exports = router;