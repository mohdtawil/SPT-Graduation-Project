const MiddleWare = require("../../middleware");

var express = require("express"),
    router = express.Router(),
    teacher = require("../../models/teacher"),
    User = require("../../models/user");



// route for view all teachers
router.get("/view/teachers" , MiddleWare.onlyAdmin, function(req, res) {
    teacher.find({} , function(err , foundAllTeachersSchema) {
        if(err) {
             req.flash("error" , err.message);
            res.redirect("back");
        } else {
            res.render("teacher/view" , {allTeachers : foundAllTeachersSchema});
        }
    });
});

// route for show form to insert new teacher
router.get("/insert/teacher" , MiddleWare.onlyAdmin, function(req , res) {
    res.render("teacher/insert");
});


// route for get form data and create new database schema
router.post("/insert/teacher" ,MiddleWare.onlyAdmin, function(req , res) {

    var ssnFrom = String(req.body.form_ssn);
        if(ssnFrom.length != 10) {
            req.flash("error" , "Error Teacher SSN Length Must Be 10 Digits Plasea try Again");
            res.redirect("/view/teachers");
        }

    var ssnFrom = String(req.body.form_ssn);
        if(Number(ssnFrom.length) == 10) {
        var newTeacher = {
            name: req.body.form_name,
            ssn: req.body.form_ssn,
            ministerialNum: req.body.form_ministerialNum,
            phoneNum: req.body.form_phoneNum
        };
        teacher.create(newTeacher , function(err , newTeacherSchema) {
            if(err) {
                 req.flash("error" , err.message);
        res.redirect("back");
            } else {
                var newTeacherUser = {
                    teacherID: {
                        id: newTeacherSchema
                    },
                    username: newTeacherSchema.ssn, 
                    role: "Teacher"
                }
                User.register( new User(newTeacherUser) , newTeacherSchema.ssn , function(err , user){
                    if(err) {
                         req.flash("error" , err.message);
        res.redirect("back");
                    }
                    console.log(user);
                    res.redirect("/view/teachers");
                    passport.authenticate("local")(req , res , function(){
                        
                    });
                });
                res.redirect("/view/teachers");
            }
        });
    }
    else
    {
        req.flash("error" , "Error Teacher SSN Length Must Be 10 Digits Plasea try Again");
        res.redirect("back");
    }
});

// route for view detalis for single teacher
router.get("/view/teacher/:teacher_id" , MiddleWare.onlyAdminAndCurrentTeacher , function(req , res) {
    teacher.findById({_id: req.params.teacher_id}).populate("CourseList").exec(function(err , foundTeacher) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("teacher/show" , {singleTeacher: foundTeacher});
        }
    });
});

// route for change teacher real
router.get("/change/teacher/:teacher_id" ,MiddleWare.onlyAdmin, function(req , res) {
    teacher.findById({_id: req.params.teacher_id} , function(err , foundTeacher) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            console.log(foundTeacher);
            if(foundTeacher.RealTeacher) {
                foundTeacher.RealTeacher = false;
                foundTeacher.save();
                res.redirect("/view/teachers");
            } else {
                foundTeacher.RealTeacher = true;
                foundTeacher.save();
                res.redirect("/view/teachers");
            }
        }
    });
});

// route for display form to edit single teacher data
router.get("/edit/teacher/:teacher_id" ,MiddleWare.onlyAdminAndCurrentTeacher, function(req , res) {
    teacher.findById({_id: req.params.teacher_id} , function(err , foundTeacher) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("teacher/edit" , { singleTeacher: foundTeacher });
        }
    });
});

// route for get data from form and save to database schema
router.put("/edit/teacher/:teacher_id" ,MiddleWare.onlyAdminAndCurrentTeacher, function(req , res) {
    var newUpdatedTeacher = {
        name: req.body.form_name,
        ssn: req.body.form_ssn,
        ministerialNum: req.body.form_ministerialNum,
        phoneNum: req.body.form_phoneNum
    };
    teacher.findByIdAndUpdate({_id: req.params.teacher_id} , newUpdatedTeacher , function(err , foundTeacher) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.redirect("/view/teacher/" + foundTeacher._id);
        }
    });
});

// route for delete teacher
router.delete("/delete/teacher/:teacher_id" ,MiddleWare.onlyAdmin, function(req , res) {
    teacher.findByIdAndRemove({_id : req.params.teacher_id} , function(err , deletedTeacher) {
        if(err) {
             req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.redirect("/view/teachers");
        }
    });
});


module.exports = router;