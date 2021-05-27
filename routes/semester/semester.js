var express = require("express"),
    router = express.Router(),
    semester = require("../../models/semester"),
    classroom = require("../../models/classroom"),
    MiddleWare = require("../../middleware/index")


// route for view all semster
router.get("/view/semesters", MiddleWare.onlyAdmin, function(req, res) {
    semester.find({} , function(err , foundAllSemseterSchema) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            //console.log(foundAllSemseterSchema);
            res.render("semester/view" , {allSemesters : foundAllSemseterSchema});
        }
    });
});


// route for view detalis for single semester
router.get("/view/semester/:semester_id" , MiddleWare.onlyAdmin, function(req , res) {
    
    semester.findById({_id: req.params.semester_id} ).populate("classesListID").exec( function(err , foundSemester) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            classroom.find({} , function(err , allClassroom) {
                if(err) {
                     req.flash("error" , err.message);
             res.redirect("back");
                } else {
                    res.render("semester/show" , {singleSemester: foundSemester , allClasses : allClassroom});
                }
            });
        }
    });
});


// route for show form to insert new semster
router.get("/insert/semester" , MiddleWare.onlyAdmin, function(req , res) {
    res.render("semester/insert");
});

// route for get form data and create new database schema
router.post("/insert/semester" , MiddleWare.onlyAdmin, function(req , res) {
    var newSemester = {
        name: req.body.form_name
    }
    semester.create(newSemester , function(err , newSemesterSchema) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/semesters");
        }
    });
});

// route for display form to edit single semester data
router.get("/edit/semester/:semester_id" , MiddleWare.onlyAdmin, function(req , res) {
    semester.findById({_id: req.params.semester_id} , function(err , foundSemster) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            //console.log(foundSemster);
            res.render("semester/edit" , { singleSemester: foundSemster });
        }
    });
});

// route for get data from form and save to database schema
router.put("/edit/semester/:semester_id" , MiddleWare.onlyAdmin, function(req , res) {
    var newUpdatedSemester = {
        name: req.body.form_name
    };
    semester.findByIdAndUpdate({_id: req.params.semester_id} , newUpdatedSemester , function(err , foundSemster) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/semesters");
        }
    });
});

// route for delete semster
router.delete("/delete/semester/:semester_id" , MiddleWare.onlyAdmin, function(req , res) {
    semester.findByIdAndRemove({_id : req.params.semester_id} , function(err , delteSemester) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/semesters");
        }
    });
});


//------------------------------------------------------------------------------------------ semester with classes
// route for add class to list of classes in specefic semester
router.get("/add/semester/:semester_id/class/:class_id" , MiddleWare.onlyAdmin, function(req , res) {
    semester.findById({_id: req.params.semester_id} , function(err , foundSemester) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            classroom.findById({_id: req.params.class_id} , function(err , foundClassroom) {
                if(err) {
                     req.flash("error" , err.message);
             res.redirect("back");
                } else {
                    foundSemester.classesListID.push(foundClassroom);
                    foundSemester.save();
                    res.redirect("/view/semester/" + foundSemester._id);
                }
            });
        }
    });
});

// route for delete specific class from specific semester 
router.get("/delete/semester/:semester_id/class/:class_id" , MiddleWare.onlyAdmin, function(req , res) {
    semester.findById({_id: req.params.semester_id} , function(err , foundSemester) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            classroom.findById({_id: req.params.class_id} , function(err , foundClassroom) {
                if(err) {
                     req.flash("error" , err.message);
             res.redirect("back");
                } else {
                    foundSemester.classesListID.remove(foundClassroom);
                    foundSemester.save();
                    res.redirect("/view/semester/" + foundSemester._id);
                }
            });
        }
    });
});






module.exports = router;