const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Cloud-writer$$$b#SamTHEcoder09";

//Route 1:
// create a user using: POST "/api/auth/createuser". No login required.
router.post('/createuser', [
    body('name', 'Enter a valid name...').isLength({ min: 1 }),
    body('email', 'Enter a valid email...').isEmail(),
    body('password', 'Password must contain at least 6 characters...').isLength({ min: 6 })
], async (req, res) => {
    // if there are errors in the body input, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //check whether the bcryuser with same email exist already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ errors: "Please use different email, user with this already exists" });
        }
        // crating a secure password
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);
        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
        })
        //creating data for authToken
        const data = {
            user: {
                id: user.id
            }
        }
        //creating authToken
        const authToken = jwt.sign(data, JWT_SECRET);
        //sending auth token as a response
        res.json({ authToken });

        // send user json as a response.  
        res.json(user);
    }
    //this will return a error only if some internal server error occurs.
    catch (error) {
        res.status(500).json({ error: `Internal serer error occured!` });
    }
}
);


//Route 2:
// Authenticate a user using: POST "/api/auth/login". login required.
router.post('/login', [
    body('email', 'Enter a valid email...').isEmail(),
    body('password', 'Password must contain at least 6 characters...').isLength({ min: 6 }),
    body('password', 'Password must not be blank...').exists(),
], async (req, res) => {
    // if there are errors in the body input, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Authenticate the user
    const { email, password } = await req.body;
    try {
        let user = await User.findOne({ email });//no need to write like {email: email} bcoz this is ES6
        //if user do not exists
        if (!user) {
            return res.status(400).json({ error: `Please try to login with the correct credentials.` });
        }
        //checkung the password 
        const passwordCompare = await bcrypt.compare(password, user.password);
        //if password is wrong
        if (!passwordCompare) {
            return res.status(400).json({ error: `Please try to login with the correct credentials.` });
        }
        //if password is correct then creating data for authToken
        const data = {
            user: {
                id: user.id
            }
        }
        //creating authToken
        const authToken = jwt.sign(data, JWT_SECRET);
        //sending auth token as a response
        res.json({ authToken });

    }
    //this will return a error only if some internal server error occurs.
    catch (error) {
        res.status(500).json({ error: `Internal serer error occured!` });
    }
}
)


//Route 3: 
//Gettting loggedin user details using POST "/api/auth/getuser". No login required
router.post('/getuser', fetchuser,  async (req, res) => {
    try {
        //finding the user
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
module.exports = router;