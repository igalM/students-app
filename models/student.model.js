const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Student = new Schema({
    _id: Schema.Types.ObjectId,
    studentName: String,
    studentAge: Number,
})

module.exports = mongoose.model('students', Student);