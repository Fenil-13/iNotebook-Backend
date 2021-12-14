const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const authUser = require('../middleware/authUser')

router.get('/', (req, res) => {
    return res.send({
        error: "You are not authenticate for notes"
    })
})

router.get('/get_notes', authUser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.data.id })
        return res.send(notes)
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.post('/create_note', authUser,
    [body('title', "Enter the Valid Title").exists(),
    body('description', "Enter the Description more then 5 Charc").isLength({ min: 5 })]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try {
            const { title, description, tag } = req.body
            let note = new Note({
                title, description, tag, user: req.data.id
            })

            const savedNote = await note.save().catch(err => {
                return res.status(400).json({ error: err.message })
            })
            return res.send({
                note: savedNote,
                status: "Note Created Successfully"
            })
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" })
        }
    })

router.put('/update_note/:id', authUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        const oldNote = await Note.findById(req.params.id);
        if (!oldNote) {
            return res.status(404).json({ error: "Note Not Found" })
        }

        if (oldNote.user.toString() != req.data.id) {
            return res.status(401).json({ error: "Not Allowed" })
        }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        return res.send({
            note: updatedNote,
            status: "Note Update Successfully"
        })
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.delete('/delete_note/:id', authUser, async (req, res) => {
    try {
        const oldNote = await Note.findById(req.params.id);
        if (!oldNote) {
            return res.status(404).send({ error: "Note Not Found" })
        }

        if (oldNote.user.toString() != req.data.id) {
            return res.status(401).send({ error: "Not Allowed" })
        }

        const deletedNote = await Note.findByIdAndDelete(req.params.id)
        return res.send({
            note: deletedNote,
            status: "Note Delete Successfully"
        })
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" })
    }
})

module.exports = router