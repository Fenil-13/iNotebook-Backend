const mongoose = require('mongoose')


const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: String,
        default: Date.now
    }
}, { versionKey: false })

module.exports = mongoose.model('notes', NotesSchema)