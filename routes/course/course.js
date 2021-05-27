const MiddleWare = require("../../middleware");
const classroom = require("../../models/classroom");
const todo = require("../../models/todo");

var express = require("express"),
    router = express.Router(),
    course = require("../../models/course"),
    semesterplan = require("../../models/semesterplan"),
    student = require("../../models/student"),
    teacher = require("../../models/teacher"),
    unit = require("../../models/unit");



// route for view all courses
router.get("/view/courses" , MiddleWare.onlyAdminAndTeacher, function(req, res) {
    course.find({} , function(err , foundAllCoursesSchema) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("course/view" , {allCourses : foundAllCoursesSchema});
        }
    });
});

// route for show form to insert new course
router.get("/insert/course" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    res.render("course/insert");
});


// route for get form data and create new database schema
router.post("/insert/course" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    var newCourse = {
        name: req.body.form_name,
        authorName: req.body.form_authorName
    }
    course.create(newCourse , function(err , newCourseSchema) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.redirect("/view/courses");
        }
    });
});





// route for view detalis for single course
router.get("/view/course/:course_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById({_id: req.params.course_id}).populate("StudentList , Teacher , UnitListID").exec(function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            student.find({RealStudent: true} , function(err , foundStudents) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    teacher.find({RealTeacher: true} , function(err , foundTeachers) {
                        if(err) {
                             req.flash("error" , err.message);
        res.redirect("back");
                        } else {
                            unit.find({} , function(err , foundUnits) {
                                if(err) {
                                     req.flash("error" , err.message);
        res.redirect("back");
                                } else {
                                    res.render("course/show" , {singleCourse: foundCourse , allStudents: foundStudents , allTeachers: foundTeachers , allUnits: foundUnits});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


// route for display form to edit single course data
router.get("/edit/course/:course_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById({_id: req.params.course_id} , function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("course/edit" , { singleCourse: foundCourse });
        }
    });
});

// route for get data from form and save to database schema
router.put("/edit/course/:course_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    var newUpdatedCourse = {
        name: req.body.form_name
    };
    course.findByIdAndUpdate({_id: req.params.course_id} , newUpdatedCourse , function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.redirect("/view/courses");
        }
    });
});

// route for delete course
router.delete("/delete/course/:course_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findByIdAndRemove({_id : req.params.course_id} , function(err , deleteCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.redirect("/view/courses");
        }
    });
});

//---------------------------------------------------------------------------- course with semesterplan
// route for show form to insert new semsterplan for specific course
router.get("/insert/course/:course_id/semesterplan" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById({_id: req.params.course_id} , function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            if(foundCourse.SemesterPlan.length == 0) {
                res.render("course/insert-semesterplan" , {singleCourse: foundCourse});
            } else {
                // course have semesterpan
                res.redirect("/view/course/" + req.params.course_id);
            }
        }
    });
});


// route for get form data and and add to semesterplan for specific course
router.post("/insert/course/:course_id/semesterplan" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    // make \n for textarea
    var GOL = ( req.body.form_GeneralOutcomesList.length == 0 )? [] : req.body.form_GeneralOutcomesList.split("+");
    var ISL = ( req.body.form_InstructionsStrategiesList.length == 0 )? [] : req.body.form_InstructionsStrategiesList.split("+");
    var AML = ( req.body.form_AsesmentsMethodList.length == 0 )? [] : req.body.form_AsesmentsMethodList.split("+");
    var AAL = ( req.body.form_AssociativeActivitiesList.length == 0 )? [] : req.body.form_AssociativeActivitiesList.split("+");
    var RL = ( req.body.form_ReflectionList.length == 0 )? [] : req.body.form_ReflectionList.split("+");
    var newSemesterplan = {
        CourseName: req.body.form_CourseName,
        TeacherName: req.body.form_TeacherName,
        GeneralOutcomesList: GOL,
        InstructionsStrategiesList: ISL,
        AsesmentsMethodList: AML,
        AssociativeActivitiesList: AAL,
        ReflectionList: RL,
        StartDate: req.body.form_StartDate,
        EndDate: req.body.form_EndDate
    };
    console.log(newSemesterplan);
    semesterplan.create(newSemesterplan , function(err , newSemesterplanSchema) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            course.findById(req.params.course_id).populate("Teacher").exec( function(err , foundCourse) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    foundCourse.SemesterPlan.push(newSemesterplanSchema);
                    foundCourse.save();
                    res.redirect("/view/course/" + foundCourse._id);
                }
            });
        }
    });
});

// route for show form to edit new semsterplan for specific course
router.get("/edit/course/:course_id/semesterplan" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById({_id: req.params.course_id}).populate("SemesterPlan").exec(function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("course/edit-semesterplan" , {singleCourse: foundCourse});
        }
    });
});


// route for get form data and update  semesterplan for specific course
router.put("/edit/course/:course_id/semesterplan/:semesterplan_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {

    // get old semesterplan
    var oldPlan;
    semesterplan.findById({_id: req.params.semesterplan_id} , function(err , foundOldSemsterplan) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            oldPlan = foundOldSemsterplan;
        }
    });


    var GOL = ( req.body.form_GeneralOutcomesList.length == 0 )? [] : req.body.form_GeneralOutcomesList.split("+");
    var ISL = ( req.body.form_InstructionsStrategiesList.length == 0 )? [] : req.body.form_InstructionsStrategiesList.split("+");
    var AML = ( req.body.form_AsesmentsMethodList.length == 0 )? [] : req.body.form_AsesmentsMethodList.split("+");
    var AAL = ( req.body.form_AssociativeActivitiesList.length == 0 )? [] : req.body.form_AssociativeActivitiesList.split("+");
    var RL = ( req.body.form_ReflectionList.length == 0 )? [] : req.body.form_ReflectionList.split("+");
    var newUpdatedSemesterplan = {
        CourseName: req.body.form_CourseName,
        TeacherName: req.body.form_TeacherName,
        GeneralOutcomesList: GOL,
        InstructionsStrategiesList: ISL,
        AsesmentsMethodList: AML,
        AssociativeActivitiesList: AAL,
        ReflectionList: RL,
        StartDate: req.body.form_StartDate,
        EndDate: req.body.form_EndDate
    };

    semesterplan.findByIdAndUpdate({_id: req.params.semesterplan_id} , newUpdatedSemesterplan , function(err , newUpdatedSemesterplanSchema) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            course.findById({_id: req.params.course_id} , function(err , foundCourse) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    // remove old semesterplan
                    foundCourse.SemesterPlan.remove(oldPlan);

                    // add new updated semesterplan
                    foundCourse.SemesterPlan.push(newUpdatedSemesterplanSchema);
                    foundCourse.save();
                    res.redirect("/view/course/" + foundCourse._id +  "/semesterplan/" + newUpdatedSemesterplanSchema._id);
                }
            });
        }
    });
});

// route for delete specific semsterplan from specific course
router.delete("/delete/course/:course_id/semesterplan/:semesterplan_id" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById({_id: req.params.course_id} , function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            semesterplan.findById({_id: req.params.semesterplan_id} , function(err , foundSemesterplan) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    foundCourse.SemesterPlan.remove(foundSemesterplan);
                    foundCourse.save();
                    res.redirect("/view/course/" + foundCourse._id);
                }
            });
        }
    });
});

// route for show semsterplan for specific course
router.get("/view/course/:course_id/semesterplan/:semesterplan_id" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById({_id: req.params.course_id}).populate("SemesterPlan").exec(function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            semesterplan.findById({_id: req.params.semesterplan_id} , function(err , foundSemesterplan) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    res.render("course/show-semesterplan" , {/*singlePlan: foundSemesterplan ,*/ singleCourse: foundCourse });
                }
            });
        }
    });
});

//------------------------------------------------------------------------------------------ course with todo
// route for add new todo to spicific course
router.get("/insert/course/:course_id/todo", MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById(req.params.course_id , function(err, foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("course/insert-todo" , {singleCourse: foundCourse});
        }
    })
})

router.post("/insert/course/:course_id/todo" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    var newTODO = {
        todoTitle: req.body.form_todoTitle,
        todoDescription: req.body.form_todoDescription,
        courseName: req.body.form_courseName,
        DueDate: req.body.form_DueDate,
        courseID: {
            id: req.params.course_id
        }
    };
    todo.create(newTODO , function(err , newTodoSchema) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            course.findById(req.params.course_id).populate("StudentList").exec( function(err, foundCourse) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    foundCourse.StudentList.forEach(function(stu) {
                        student.findById(stu._id , function(err, fourndStudent) {
                            if(err) {
                                 req.flash("error" , err.message);
        res.redirect("back");
                            } else {
                                fourndStudent.ToDoListID.push(newTodoSchema);
                                fourndStudent.save();
                            }
                        })
                    });
                    res.redirect("/view/course/" + foundCourse._id);
                }
            });
        }
    });
    
});





//------------------------------------------------------------------------------------------ course with teacher
// route for add single teacher to list of teachers in specefic course
router.get("/add/course/:course_id/teacher/:teacher_id" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById({_id: req.params.course_id} , function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            teacher.findById({_id: req.params.teacher_id} , function(err , foundTeacher) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {

                    var found = false;
                    if(!foundCourse.Teacher.length == 0) {
                        found = true;
                    }

                    if(!found) {
                        foundCourse.Teacher.push(foundTeacher);
                        foundCourse.save();

                        foundTeacher.CourseList.push(foundCourse);
                        foundTeacher.save();
                        res.redirect("/view/course/" + foundCourse._id);
                    } else {
                        res.redirect("/view/course/" + foundCourse._id);
                    }
                }
            });
        }
    });
});

// route for delete specific teacher from specific course
router.get("/delete/course/:course_id/teacher/:teacher_id" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById({_id: req.params.course_id} , function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            teacher.findById({_id: req.params.teacher_id} , function(err , foundTeacher) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    foundCourse.Teacher.remove(foundTeacher);
                    foundCourse.save();

                    foundTeacher.CourseList.remove(foundCourse);
                    foundTeacher.save();
                    res.redirect("/view/course/" + foundCourse._id);
                }
            });
        }
    });
});



//------------------------------------------------------------------------------------------ course with unit
// route for add unit to list of units in specefic course
router.get("/add/course/:course_id/unit/:unit_id" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById(req.params.course_id, function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            unit.findById(req.params.unit_id , function(err , foundUnit) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {

                    var found = false;
                    foundCourse.UnitListID.forEach(function(UniID) {
                        if(String(foundUnit._id) == String(UniID._id)) {
                            found = true;
                        }
                    });
                    if(!found) { // id not found in "UnitList" list push it

                        foundUnit.courseID = foundCourse._id;
                        foundUnit.classRoomID = foundCourse.classRoomID;
                        foundUnit.save();
                        foundCourse.UnitListID.push(foundUnit);
                        foundCourse.save();

                        // foundUnit.CoursesListID.push(foundCourse);
                        // foundUnit.save();
                        res.redirect("/view/course/" + foundCourse._id);
                    } else { // id found in "StudentList" list not push it's imposible to find two students in the same id in one class
                        res.redirect("/view/course/" + foundCourse._id);
                    }
                }
            });
        }
    });
});

// route for delete specific studnt from specific course
router.get("/delete/course/:course_id/unit/:unit_id" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById( req.params.course_id, function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            unit.findById(req.params.unit_id , function(err , foundUnit) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    foundCourse.UnitListID.remove(foundUnit);
                    foundCourse.save();

                    // foundUnit.CoursesListID.remove(foundCourse);
                    // foundUnit.save();
                    res.redirect("/view/course/" + foundCourse._id);
                }
            });
        }
    });
});

//------------------------------------------------------------------------------------------ course with attendence student
// route for view list of all student to make register attendence
router.get("/view/course/:course_id/students" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById(req.params.course_id).populate("StudentList").exec( function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("course/show-students" , {singleCourse: foundCourse});
        }
    });
});

// route for make refresh to fill student list in spicific course to make attendence
router.get("/refresh/course/:course_id/to-fill-student-list" , function(req , res) {
    course.findById(req.params.course_id).populate("StudentList").exec( function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            classroom.findById(foundCourse.classRoomID).populate("CstudentsListID").exec(function(err , foundClass) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    foundCourse.StudentList = foundClass.CstudentsListID;
                    foundCourse.save();
                    res.redirect("back")
                }
            })
        }
    });
})

// route for make attend to spicific student and increment the student absence for spicific course
router.post("/add/course/:course_id/student/:student_id/attend" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    course.findById(req.params.course_id , function(err , foundCourse) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            student.findById(req.params.student_id, function(err , foundStudent) {
                if(err) {
                     req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    if(req.body.attend == "on") {
                        var updatedAttendenceMap = [Object];
                        foundStudent.AttendenceMap.forEach(function(attenMap) {
                            if(attenMap.courseID.equals(foundCourse._id)) { 
                                attenMap.absence = attenMap.absence + 1;
                            }
                            updatedAttendenceMap.push(attenMap);
                        })
                        foundStudent.AttendenceMap = updatedAttendenceMap;
                        foundStudent.save();
                        res.redirect("/view/course/" + foundCourse._id + "/students")
                    } else {
                        
                        res.redirect("/view/course/" + foundCourse._id + "/students")
                    }            
                }
            })
        }
    })
})
module.exports = router;