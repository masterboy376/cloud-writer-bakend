const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();


// create a user using: POST "/api/auth/createuser". No login required.
router.post('/createuser',[
    body('name', 'Enter a valid name...').isLength({ min: 1 }),
    body('email', 'Enter a valid email...').isEmail(),
    body('password', 'Password must contain at least 6 characters...').isLength({ min: 6 })
] ,async (req,res)=>{
    // if there are errors in the body input, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        //check whether the user with same email exist already
       let user = await User.findOne({email: req.body.email});
       if(user){
        return res.status(400).json({ errors: "Please use different email, user with this already exists" });
       }
       //create a new user
       user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          })
        // send user jason as aresponse.  
        res.json(user);
        }
        //this will return a error only if some internal server error occurs.
        catch(error){
            res.status(500).json({error: `Some error occured in the server! ERROR: ${error}`});
        }
    }
);

module.exports = router;