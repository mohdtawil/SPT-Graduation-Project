const parent = require("../../models/parent");

var express = require("express"),
router = express.Router(),
student = require("../../models/student");
                     
// route for view single parent dashboard
router.get("/view/parent/:parent_id" , function(req  , res) {
    parent.findById(req.params.parent_id).populate("refrenceStudent").exec( function(err , foundSingleParentSechema) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("parent/show" , {singleParent: foundSingleParentSechema});
        }
    })
})

router.get("/add/student/to/parent/:parent_id" , function(req , res) {
    parent.findById(req.params.parent_id).populate("refrenceStudent").exec( function(err , foundSingleParentSechema) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("parent/insert-student" , {singleParent: foundSingleParentSechema});
        }
    });
});

router.post("/add/student/to/parent/:parent_id" ,  function(req , res) {
    parent.findById(req.params.parent_id).populate("refrenceStudent").exec( async function(err , foundSingleParentSechema) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            var newStudent = "";
            var std = await student.find({ RealStudent: true} , function(err , foundStudents) {
                if(err) {
                     req.flash("error" , err.message);
             res.redirect("back");
                } else {
                    foundStudents.forEach(function(studentFormDB) {
                        if(studentFormDB.ssn == req.body.ssn) {
                            newStudent = studentFormDB;
                        }
                    });
                    return newStudent;
                }
            }); 

            if(newStudent.length != 0) {
                foundSingleParentSechema.refrenceStudent.push(newStudent);
                foundSingleParentSechema.save();
                res.redirect("/view/parent/" + req.params.parent_id);
            } else {
                res.redirect("/view/parent/" + req.params.parent_id);
            }
        }
    });
});

module.exports  = router;