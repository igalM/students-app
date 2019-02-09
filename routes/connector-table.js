const express = require('express');
const router = express.Router();
const Student = require('../models/student.model');
const StudentInfo = require('../models/student-info.model');


router.post('/pair/:studentID/:courseID', (req, res) => {
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    const pair = new StudentInfo({
        course: courseID,
        student: studentID,
        grade: null
    });
    StudentInfo.find({ course: courseID, student: studentID }, (err, result) => {
        if (err) res.sendStatus(500);
        if (result.length == 0) {
            pair.save()
                .then(result => {
                    res.sendStatus(200);
                })
                .catch(err => {
                    res.sendStatus(500);
                })
        } else {
            res.sendStatus(400);
        }
    });
});

router.put('/setScore/:courseID/:studentID', (req, res) => {
    const studentID = req.params.studentID;
    const courseID = req.params.courseID;
    const grade = req.body.grade;
    const query = { course: courseID, student: studentID };
    StudentInfo.findOneAndUpdate(query, { grade: grade })
        .then(result => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

router.get('/filterStudentsByCourse/:courseID', (req, res) => {
    const courseID = req.params.courseID;
    StudentInfo.find({ course: courseID }, 'student')
        .populate('student')
        .exec((err, students) => {
            res.json(students)
        })
});

router.get('/outstandingStudents/:term', (req, res) => {
    const condition = req.params.term;
    StudentInfo.find({})
        .populate('student course')
        .exec((err, info) => {
            const orderedList = [];
            const studentsGrades = [];
            info.forEach(studentInfo => {
                let points = studentInfo.course.coursePoints;
                let studentID = studentInfo.student.id;
                let grade = studentInfo.grade;
                let totalScore = grade * points;
                let studentIndex = studentsGrades.findIndex(student_info => student_info.id == studentID);
                if (studentIndex == -1) {
                    studentsGrades.push({
                        id: studentID,
                        name: studentInfo.student.studentName,
                        age: studentInfo.student.studentAge,
                        totalScore: totalScore,
                        points: points
                    });
                } else {
                    studentsGrades[studentIndex].totalScore += totalScore;
                    studentsGrades[studentIndex].points += points;
                }
            });
            studentsGrades.forEach(student => {
                const average = student.totalScore / student.points;
                if (average > 90) orderedList.push({
                    id: student.id,
                    name: student.name,
                    age: student.age,
                    average: average
                });
            });
            switch (condition) {
                case 'highest':
                    orderedList.sort(compareAverages);
                    res.json(orderedList[0]);
                    break;
                case 'all':
                    res.json(orderedList.sort(compareAverages));
                    break;
                default:
                    res.send('No outstanding students');
            }
        });
});

function compareAverages(a, b) {
    if (a.average > b.average) return -1;
    return 1;
}



router.post('/subscribeAllStudents/:courseID', (req, res) => {
    const courseID = req.params.courseID;
    const promiseArray = [];
    Student.find({})
        .then(students => {
            students.forEach(student => {
                let obj = new StudentInfo({
                    course: courseID,
                    student: student._id,
                    grade: null
                })
                let promise = obj.save()
                    .then(result => {
                        console.log('added to course');
                    })
                    .catch(err => {
                        console.log(err);
                    })
                promiseArray.push(promise);
            })
            Promise.all(promiseArray)
                .then(result => {
                    res.sendStatus(200);
                })
                .catch(err => {
                    res.sendStatus(500);
                })
        })
});


module.exports = router;