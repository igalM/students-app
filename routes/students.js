const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose');
const Student = require('../models/student.model');
const StudentInfo = require('../models/student-info.model');

router.post('/addStudent', (req, res) => {
    const student = new Student({
        _id: new Mongoose.Types.ObjectId(),
        studentName: req.body.studentName,
        studentAge: req.body.studentAge
    });
    student.save()
        .then(result => {
            res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        })
})

router.put('/editStudent/:id', (req, res) => {
    const studentID = req.params.id;
    Student.findByIdAndUpdate(studentID,
        {
            studentName: req.body.studentName,
            studentAge: req.body.studentAge
        })
        .then(result => {
            res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        })
})

router.delete('/deleteStudent/:id', (req, res) => {
    const studentID = req.params.id;
    Student.findByIdAndDelete(studentID)
        .then(result => {
            res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        })
})

router.get('/viewStudent/:id', (req, res) => {
    const studentID = req.params.id;
    Student.findById(studentID, (err, student) => {
        if (err) res.sendStatus(400);
        res.json(student);
    });
});

router.get('/filterStudents/:key/:value', (req, res) => {
    const key = req.params.key;
    const value = req.params.value;
    Student.find({ [key]: value }, (err, result) => {
        if (err) res.sendStatus(500);
        res.json(result);
    })
});



module.exports = router;
