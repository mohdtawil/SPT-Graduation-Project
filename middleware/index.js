const parent = require("../models/parent");

var MiddleWare = {
    isLoggedIn: function(req , res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error" , "You must login to do that");
            res.redirect("/login");
        }
    },
    onlyAdmin: function (req, res, next) {
        if(req.isAuthenticated()) {
            if(req.user.isAdmin) {
                return next();
            } else {
                req.flash("error" , "You don't have permission to do that");
                res.redirect("back");
            }
        } else {
            req.flash("error" , "You don't have permission to do that");
            res.redirect("back");
        }
    },
    onlyAdminAndTeacher: function (req, res, next) {
        if(req.isAuthenticated()) {
            if(req.user.isAdmin || req.user.role == "Teacher") {
                return next();
            } else {
                req.flash("error" , "You don't have permission to do that");
                res.redirect("back");
            }
        } else {
            req.flash("error" , "You must login to do that");
            res.redirect("/login");
        }
    },
    onlyAdminAndCurrentTeacher: function (req, res, next) {
        if(req.isAuthenticated()) {
            if(req.user.isAdmin || req.user.teacherID.id._id == req.params.teacher_id) {
                return next();
            } else {
                req.flash("error" , "You don't have permission to do that");
                res.redirect("back");
            }
        } else {
            req.flash("error" , "You must login to do that");
            res.redirect("/login");
        }
    },
    onlyAdminAndCurrentStudent: function (req, res, next) {
        if(req.isAuthenticated()) {
            if(req.user.role == "Parent") {
                return next();
            } else {
                if(req.user.isAdmin || req.user.studentID.id._id == req.params.student_id ) {
                    return next();
                } else {
                    req.flash("error" , "You don't have permission to do that");
                    res.redirect("back");
                }
            }
            
        } else {
            req.flash("error" , "You must login to do that");
            res.redirect("/login");
        }
    },
    onlyAdminAndParentAndCurrentStudent: function (req, res, next) {
        var check  = false;
        if(req.user.isAdmin) {
            return next();
        } else {
            parent.findById(req.user.parentID.id._id).populate("refrenceStudent").exec(function(err , foundParent) {
                if(err) {
                    console.log(err);
                } else {
                    foundParent.refrenceStudent.forEach(student => {
                        console.log(String(req.params.student_id));
                        console.log(String(student._id));
                        if(String(req.params.student_id) == String(student._id)) {
                            check = true;
                            console.log("yes");
                        }
                    });
                    if(req.isAuthenticated()) {
                        console.log(check);
                        
                            if(req.user.isAdmin || req.user.parentID.id._id == req.params.student_id || check ) {
                                return next();
                            } else {
                                req.flash("error" , "You don't have permission to do that");
                                res.redirect("back");
                            }
                        
                        
                    } else {
                        req.flash("error" , "You must login to do that");
                        res.redirect("/login");
                    }
                    
                }
            })
        }
        
        
    }
};

module.exports = MiddleWare;