const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    coursename: {
        type: String,
        required: true
    },
    coursedesc: {
        type: String,

    }

})
module.exports = mongoose.model('Courses', courseSchema);