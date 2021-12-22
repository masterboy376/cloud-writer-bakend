const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


//Route 1:
//this will fetch logged in user's all notes using: GET "/api/notes/fetchallnotes" - Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        // if notes is null or undefined
        if (!notes) {
            return res.status(400).json({ error: `Please try to fetch using correct token.` });
        }
        //sending all the as a response in the form of array on objects.
        res.json({ notes });
    }
    //this will return a error only if some internal server error occurs.
    catch (error) {
        res.status(500).json({ error: `Internal serer error occured!` });
    }
});

//Route 2:
//this will create user's notes using: POST "/api/notes/addnote" - Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title...').isLength({ min: 1 }),
    body('description', 'description must contain at least 5 characters...').isLength({ min: 5 })
], async (req, res) => {
    // if there are errors in the body input, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // if there is noe error in body input.
    try {
        //creating a new note
        const note = await Notes.create({
            user: req.user.id,
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            date: req.body.date,
            isImp: req.body.isImp,
            type: req.body.type,
        });
        //sending a newly created note as a response
        res.json({ note });
    }
    //this will return a error only if some internal server error occurs.
    catch (error) {
        res.status(500).json({ error: `Internal serer error occured!` });
    }
});

module.exports = router;