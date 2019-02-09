const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentInfo = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'courses' },
    student: { type: Schema.Types.ObjectId, ref: 'students' },
    grade: Number
})

module.exports = mongoose.model('student_info', StudentInfo);