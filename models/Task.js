const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    iscomplete: {
        type: String,
        default: "Not completed"
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('TodoTask', todoTaskSchema);