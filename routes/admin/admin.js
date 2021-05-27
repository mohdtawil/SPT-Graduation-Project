var express = require("express"),
    semester      = require("../../models/semester"),
    classroom     = require("../../models/classroom"),
    course       = require("../../models/course"),
    unit          = require("../../models/unit"),
    topic         = require("../../models/topic"),
    student       = require("../../models/student"),
    teacher      = require("../../models/teacher"),
    parent          = require("../../models/parent"),
    semsterplans = require("../../models/semesterplan"),
    remedilplans = require("../../models/remedialplan"),
    router = express.Router();

// admin dashboard to view all data in the SPT 
router.get("/admin/dashboard" , function(req , res) {
    semester.find({} , function(err , foundAllsemesters) {
        if(err) {
           req.flash("error" , err.message);
           res.redirect("back");
        } else {
            course.find({} , function(err , foundAllcourses) {
                if(err) {
                   req.flash("error" , err.message);
                   res.redirect("back");
                } else {
                    classroom.find({} , function(err , foundAllclassrooms) {
                        if(err) {
                           req.flash("error" , err.message);
                           res.redirect("back");
                        } else {
                            unit.find({} , function(err , foundAllunits) {
                                if(err) {
                                   req.flash("error" , err.message);
                                    res.redirect("back");
                                } else {
                                    topic.find({} , function(err , foundAlltopics) {
                                        if(err) {
                                           req.flash("error" , err.message);
                                            res.redirect("back");
                                        } else {
                                            student.find({} , function(err , foundAllstudents) {
                                                if(err) {
                                                   req.flash("error" , err.message);
                                                   res.redirect("back");
                                                } else {
                                                    teacher.find({} , function(err , foundAllteachers) {
                                                        if(err) {
                                                           req.flash("error" , err.message);
                                                            res.redirect("back");
                                                        } else {
                                                            parent.find({} , function(err , foundAllparents) {
                                                                if(err) {
                                                                   req.flash("error" , err.message);
                                                                   res.redirect("back");
                                                                } else {
                                                                    semsterplans.find({} , function(err , foundAllsemsterplans) {
                                                                        if(err) {
                                                                           req.flash("error" , err.message);
                                                                           res.redirect("back");
                                                                        } else {
                                                                            remedilplans.find({} , function(err , foundAllremedilplans) {
                                                                                if(err) {
                                                                                   req.flash("error" , err.message);
                                                                                    res.redirect("back");
                                                                                } else {
                                                                                    console.log(foundAllclassrooms);
                                                                                    res.render("admin/show" , {
                                                                                        semester    : foundAllsemesters, 
                                                                                        classroom   : foundAllclassrooms,
                                                                                        course      : foundAllcourses,
                                                                                        unit        : foundAllunits,
                                                                                        topic       : foundAlltopics,
                                                                                        student     : foundAllstudents,
                                                                                        teacher     : foundAllteachers,
                                                                                        parent      : foundAllparents,
                                                                                        semsterplans: foundAllsemsterplans,
                                                                                        remedilplans: foundAllremedilplans,
                                                                                    });
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;