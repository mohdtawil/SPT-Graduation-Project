const MiddleWare = require("../../middleware");

var express = require("express"),
    router = express.Router(),
    classroom = require("../../models/classroom"),
    student = require("../../models/student"),
    course = require("../../models/course");



// route for view all classes
router.get("/view/classes" , MiddleWare.onlyAdmin,  function(req, res) {
    classroom.find({} , function(err , foundAllClassesSchema) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("classroom/view" , {allClasses : foundAllClassesSchema});
        }
    });
});

// route for view detalis for single class
router.get("/view/class/:class_id" ,MiddleWare.onlyAdmin, function(req , res) {
    classroom.findById({_id: req.params.class_id}).populate("CstudentsListID , CcoursesListID").exec(function(err , foundClass) {
        if(err) {
             req.flash("error" , err.message);
            res.redirect("back");
        } else {
            student.find({RealStudent: true} , function(err , foundStudents) {
                if(err) {
                     req.flash("error" , err.message);
                      res.redirect("back");
                } else {
                    course.find({} , function(err , foundCourses) {
                        if(err) {
                             req.flash("error" , err.message);
                             res.redirect("back");
                        } else {
                            res.render("classroom/show" , {singleClass: foundClass , allStudents: foundStudents , allCourses: foundCourses});
                        }
                    });
                }
            });
        }
    });
});



// route for show form to insert new class
router.get("/insert/class" ,MiddleWare.onlyAdmin, function(req , res) {
    res.render("classroom/insert");
});


// route for get form data and create new database schema
router.post("/insert/class" ,MiddleWare.onlyAdmin, function(req , res) {
    var newClass = {
        name: req.body.form_name
    }
    classroom.create(newClass , function(err , newClassSchema) {
        if(err) {
             req.flash("error" , err.message);
            res.redirect("back");
        } else {
            res.redirect("/view/classes");
        }
    });
});


// route for display form to edit single semester data
router.get("/edit/class/:class_id" ,MiddleWare.onlyAdmin, function(req , res) {
    classroom.findById({_id: req.params.class_id} , function(err , foundClass) {
        if(err) {
             req.flash("error" , err.message);
            res.redirect("back");
        } else {
            res.render("classroom/edit" , { singleClass: foundClass });
        }
    });
});


// route for get data from form and save to database schema
router.put("/edit/class/:class_id" ,MiddleWare.onlyAdmin, function(req , res) {
    var newUpdatedClass = {
        name: req.body.form_name
    };
    classroom.findByIdAndUpdate({_id: req.params.class_id} , newUpdatedClass , function(err , foundClass) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/classes");
        }
    });
});


// route for delete class
router.delete("/delete/class/:class_id" ,MiddleWare.onlyAdmin, function(req , res) {
    classroom.findByIdAndRemove({_id : req.params.class_id} , function(err , deletedClass) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/classes");
        }
    });
});


//------------------------------------------------------------------------------------------ classroom with student
// route for add student to list of students in specefic classroom
router.get("/add/class/:class_id/student/:student_id" ,MiddleWare.onlyAdmin, function(req , res) {
    classroom.findById({_id: req.params.class_id}).populate("CcoursesListID").exec( function(err , foundClassroom) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            student.findById({_id: req.params.student_id} , function(err , foundStudent) {
                if(err) {
                     req.flash("error" , err.message);
                    res.redirect("back");
                } else {

                    var found = false;
                    foundClassroom.CstudentsListID.forEach(function(StuID) {
                        if(String(foundStudent._id) == String(StuID._id)) {
                            found = true;
                        }
                    });
                    if(!found) { // id not found in "CstudentsListID" list push it
                        
                        
                        if(!foundStudent.ClassID.length == 0 ) {
                            res.redirect("/view/class/" + foundClassroom._id);
                        } else {
                            foundClassroom.CstudentsListID.push(foundStudent);
                            foundClassroom.save();
                            foundStudent.ClassID.push(foundClassroom);
                            var AttendArray = [Object];
                            foundClassroom.CcoursesListID.forEach(function(course) {
                                var newAttend = {
                                    courseName: course.name,
                                    courseID: course._id,
                                    absence: 0 
                                };
                                AttendArray.push(newAttend);
                            })
                            
                            foundStudent.AttendenceMap = AttendArray;
                            foundStudent.save();
                            res.redirect("/view/class/" + foundClassroom._id);
                        }
                        
                        
                    } else { // id found in "CstudentsListID" list not push it's imposible to find tow students in the same id in one class
                        res.redirect("/view/class/" + foundClassroom._id);
                    }
                }
            });
        }
    });
});

// route for delete specific studnt from specific class
router.get("/delete/class/:class_id/student/:student_id" ,MiddleWare.onlyAdmin, function(req , res) {
    classroom.findById({_id: req.params.class_id} , function(err , foundClassroom) {
        if(err) {
             req.flash("error" , err.message);
              res.redirect("back");
        } else {
            student.findById({_id: req.params.student_id} , function(err , foundStudent) {
                if(err) {
                     req.flash("error" , err.message);
                      res.redirect("back");
                } else {
                    foundClassroom.CstudentsListID.remove(foundStudent);
                    foundClassroom.save();

                    foundStudent.ClassID.remove(foundClassroom);
                    foundStudent.save();
                    res.redirect("/view/class/" + foundClassroom._id);
                }
            });
        }
    });
});

//------------------------------------------------------------------------------------------ classroom with course
// route for add course to list of courses in specefic classroom
router.get("/add/class/:class_id/course/:course_id" ,MiddleWare.onlyAdmin, function(req , res) {
    classroom.findById({_id: req.params.class_id} , function(err , foundClassroom) {
        if(err) {
             req.flash("error" , err.message);
           res.redirect("back");
        } else {
            course.findById({_id: req.params.course_id} , function(err , foundCourse) {
                if(err) {
                     req.flash("error" , err.message);
                    res.redirect("back");
                } else {

                    var found = false;
                    foundClassroom.CcoursesListID.forEach(function(CouID) {
                        if(String(foundCourse._id) == String(CouID._id)) {
                            found = true;
                        }
                    });
                    if(!found) { // id not found in "CcoursesListID" list push it
                        foundClassroom.CcoursesListID.push(foundCourse);
                        foundCourse.classRoomID = foundClassroom._id;
                        foundCourse.StudentList = foundClassroom.CstudentsListID;
                        foundCourse.save();

                        console.log(foundCourse) ;
                        

                        foundClassroom.save();

                        res.redirect("/view/class/" + foundClassroom._id);
                    } else { // id found in "CcoursesListID" list not push it's imposible to find tow courses in the same id in one class
                        res.redirect("/view/class/" + foundClassroom._id);
                    }
                }
            });
        }
    });
});

// route for delete specific class from specific semester
router.get("/delete/class/:class_id/course/:course_id" ,MiddleWare.onlyAdmin, function(req , res) {
    classroom.findById({_id: req.params.class_id} , function(err , foundClassroom) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            course.findById({_id: req.params.course_id} , function(err , foundCourse) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    foundClassroom.CcoursesListID.remove(foundCourse);
                    foundClassroom.save();
                    res.redirect("/view/class/" + foundClassroom._id);
                }
            });
        }
    });
});




// route for refresh to add all student to courses list we have
router.get("/refresh/class/:class_id" ,MiddleWare.onlyAdmin, function(req , res) {
    classroom.findById({_id: req.params.class_id}).populate("CstudentsListID , CcoursesListID").exec(function(err , foundClassroom) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            foundClassroom.CcoursesListID.forEach(function(singleCourse) {
                course.findById(singleCourse._id).populate("StudentList").exec(function(err , foundCourse) {
                    if(err) {
                         req.flash("error" , err.message);
        res.redirect("back"); 
                    } else {
                        foundCourse.StudentList = foundClassroom.CstudentsListID;
                        foundCourse.save();
                    }
                });
            });
            res.redirect("/view/class/" + foundClassroom._id);
        }
    });
});


module.exports = router;