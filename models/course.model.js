const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Course = new Schema({
    _id: Schema.Types.ObjectId,
    courseName: String,
    coursePoints: Number
})

module.exports = mongoose.model('courses', Course);