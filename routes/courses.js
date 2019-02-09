const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose');
const Course = require('../models/course.model');
const StudentInfo = require('../models/student-info.model');

router.post('/addCourse', (req, res) => {
    const course = new Course({
        _id: new Mongoose.Types.ObjectId(),
        courseName: req.body.courseName,
        coursePoints: req.body.coursePoints
    });
    course.save()
        .then(result => {
            res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        })
});

router.put('/editCourse/:id', (req, res) => {
    const courseID = req.params.id;
    Course.findByIdAndUpdate(courseID,
        {
            courseName: req.body.courseName,
            coursePoints: req.body.coursePoints
        })
        .then(result => {
            res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        })
})

router.delete('/deleteCourse/:id', (req, res) => {
    const courseID = req.params.id;
    const promises = [];
    const deleteCourse = Course.findByIdAndDelete(courseID)
        .then(result => {
            console.log('course deleted');
        }).catch(err => {
            console.log(err);
        })
    promises.push(deleteCourse);
    StudentInfo.find({ course: courseID })
        .then(results => {
            results.forEach(student_paired => {
                let deletePair = StudentInfo.findByIdAndDelete(student_paired.id)
                    .then(result => {
                        console.log('pair deleted');
                    })
                    .catch(err => {
                        console.log(err);
                    })
                promises.push(deletePair);
            });
        });
    Promise.all(promises)
        .then(result => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.sendStatus(500);
        })
});

router.get('/viewCourse/:id', (req, res) => {
    const courseID = req.params.id;
    Course.findById(courseID, (err, course) => {
        if (err) res.sendStatus(500);
        res.json(course);
    });
});

router.get('/filterCourses/:key/:value', (req, res) => {
    const key = req.params.key;
    const value = req.params.value;
    Course.find({ [key]: value }, (err, result) => {
        if (err) res.sendStatus(500);
        res.json(result);
    })
});



module.exports = router;