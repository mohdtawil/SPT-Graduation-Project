const classroom = require("../../models/classroom");
const course = require("../../models/course");
const topic = require("../../models/topic");
const unit = require("../../models/unit");
var User = require("../../models/user");
var MiddleWare = require("../../middleware/index");
const { route } = require("../teacher/teacher");

var express = require("express"),
    router = express.Router(),
    student = require("../../models/student");



// route for view all students
router.get("/view/students" ,MiddleWare.onlyAdmin, function(req, res) {
    student.find({} , function(err , foundAllStudnetsSchema) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("student/view" , {allStudents : foundAllStudnetsSchema});
        }
    });
});

// route for show form to insert new student
router.get("/insert/student" ,MiddleWare.onlyAdmin, function(req , res) {
    res.render("student/insert");
});


// route for get form data and create new database schema
router.post("/insert/student" ,MiddleWare.onlyAdmin, function(req , res) {


    var ssnFrom = String(req.body.form_ssn);
    if(Number(ssnFrom.length) == 10) {
        var newStudent = {
            name: req.body.form_name,
            ssn: req.body.form_ssn
        }
        student.create(newStudent , function(err , newStudentSchema) {
            if(err) {
                 req.flash("error" , err.message);
                res.redirect("back");
            } else {
                var newStudentUser = {
                    studentID: {
                        id: newStudentSchema
                    },
                    username: newStudentSchema.ssn, 
                    role: "Student"
                }
                User.register( new User(newStudentUser) , newStudentSchema.ssn , function(err , user){
                    if(err) {
                         req.flash("error" , err.message);
                        res.redirect("back");
                    }
                    //console.log(user);
                    res.redirect("/view/students");
                    passport.authenticate("local")(req , res , function(){
                        
                    });
                });
                res.redirect("/view/students");
            }
        });
    } else {
        req.flash("error" , "Error Student SSN Length Must Be 10 Digits Plasea try Again");
        res.redirect("back");
    }


    
});

// route for view detalis for single student
router.get("/view/student/:student_id" , MiddleWare.onlyAdminAndCurrentStudent, function(req , res) {
     
    
    student.findById(req.params.student_id).populate({
        path: "ClassID", // populate blogs
        populate: {
            path: "CcoursesListID",
           populate: {
            path: "UnitListID",
            populate: {
                path: "TopicListID",
                populate: {
                    path: "ListOfMarks",
                    populate: {
                        path: "id" // in blogs, populate comments
                    }
                }
            } 
           }
        }
     }).exec(function(err , foundStudent) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("student/show" , {singleStudent: foundStudent});
        }
    });
});

// route for view detalis for single student form parent
router.get("/view/student/:student_id/parent" , MiddleWare.onlyAdminAndParentAndCurrentStudent, function(req , res) {
     
    
    student.findById(req.params.student_id).populate({
        path: "ClassID", // populate blogs
        populate: {
            path: "CcoursesListID",
           populate: {
            path: "UnitListID",
            populate: {
                path: "TopicListID",
                populate: {
                    path: "ListOfMarks",
                    populate: {
                        path: "id" // in blogs, populate comments
                    }
                }
            } 
           }
        }
     }).exec(function(err , foundStudent) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("student/show" , {singleStudent: foundStudent});
        }
    });
});


// route for change student real
router.get("/change/student/:student_id" ,MiddleWare.onlyAdminAndCurrentStudent, function(req , res) {
    student.findById({_id: req.params.student_id} , function(err , foundStudent) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            if(foundStudent.RealStudent) {
                foundStudent.RealStudent = false;
                foundStudent.save();
                res.redirect("/view/students");
            } else {
                foundStudent.RealStudent = true;
                foundStudent.save();
                res.redirect("/view/students");
            }
        }
    });
});

//-------------------------------------------------------------------------------------- handeling student to show todos
// route for view todo for spicifc student
router.get("/view/student/:student_id/todo" ,MiddleWare.onlyAdminAndCurrentStudent, function(req, res) {
    student.findById(req.params.student_id).populate("ToDoListID").exec( function(err , foundSingleStudent) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("student/show-todo" , {singleStudent: foundSingleStudent});
        }
    });
})

//-------------------------------------------------------------------------------------- handeling student to show remedials
// route for view todo for spicifc student
router.get("/view/student/:student_id/remedials" ,MiddleWare.onlyAdminAndCurrentStudent, function(req, res) {
    student.findById(req.params.student_id).populate("RemedialNotification").exec( function(err , foundSingleStudent) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("student/show-remedials" , {singleStudent: foundSingleStudent});
        }
    });
})

// route for display form to edit single student data
router.get("/edit/student/:student_id" ,MiddleWare.onlyAdminAndCurrentStudent, function(req , res) {
    student.findById({_id: req.params.student_id} , function(err , foundStudent) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("student/edit" , { singleStudent: foundStudent });
        }
    });
});

// route for get data from form and save to database schema
router.put("/edit/student/:student_id" ,MiddleWare.onlyAdminAndCurrentStudent, function(req , res) {
    var newUpdatedStudent = {
        name: req.body.form_name,
        ssn: req.body.form_ssn

    };
    student.findByIdAndUpdate({_id: req.params.student_id} , newUpdatedStudent , function(err , foundStudent) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/students");
        }
    });
});

// route for delete student
router.delete("/delete/student/:student_id" ,MiddleWare.onlyAdmin, function(req , res) {
    student.findByIdAndRemove({_id : req.params.student_id} , function(err , deleteStudent) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/students");
        }
    });
});


module.exports = router;