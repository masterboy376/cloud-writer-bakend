const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');


//Route 1:
//this will fetch logged in user's all notes using: GET "/api/notes/fetchallnotes" - Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        // if notes is null or undefined
        if (!notes) {
            return res.status(404).json({ error: `Please try to fetch using correct token.` });
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
        const note = await Note.create({
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


//Route 3:
//this will update user's notes using: PUT "/api/notes/updatenote" - Login required
router.put('/updatenote/:id', fetchuser, [
    body('title', 'Enter a valid title...').isLength({ min: 1 }),
    body('description', 'description must contain at least 5 characters...').isLength({ min: 5 })
], async (req, res) => {
    // if there are errors in the body input, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).json({ error: "Not Found" }) }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not Allowed" });
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    }
    //this will return a error only if some internal server error occurs.
    catch (error) {
        res.status(500).json({ error: `Internal serer error occured!` });
    }
});


//Route 4:
//this will delete user's notes using: DELETE "/api/notes/deletenote" - Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).json({ error: "Not Found" }) }

        //Allow deletion of the note only if user owns this note.
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not Allowed" });
        }

        //deleting note
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({message: `note with id ${req.params.id} has been deleted!`});
    }
    //this will return a error only if some internal server error occurs.
    catch (error) {
        res.status(500).json({ error: `Internal serer error occured!` });
    }
});




module.exports = router;