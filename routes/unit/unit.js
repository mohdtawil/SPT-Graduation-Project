const MiddleWare = require("../../middleware");
const classroom = require("../../models/classroom");

var express = require("express"),
    router = express.Router(),
    unit = require("../../models/unit"),
    topic = require("../../models/topic");



// route for view all units
router.get("/view/units" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    unit.find({} , function(err , foundAllUnits) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("unit/view" , {AllUnits: foundAllUnits});
        }
    });
});

// route for view detailes for spicific unit
router.get("/view/unit/:unit_id" ,  MiddleWare.onlyAdminAndTeacher, function(req , res) {
    unit.findById(req.params.unit_id).populate("TopicListID").exec( function(err , foundSingleUnit) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back"); 
        } else {
            topic.find({} , function(err , foundAllTopics) {
                if(err) {
                     req.flash("error" , err.message);
             res.redirect("back"); 
                } else {
                    res.render("unit/show" , {singleUnit: foundSingleUnit , allTopics: foundAllTopics});
                }   
            })
        }
    })
});

// route for display form to insert new unit
router.get("/insert/unit" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    res.render("unit/insert");
});

// route for get data from form and insert them to the database
router.post("/insert/unit" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    
    var newUnit = {
        name: req.body.form_name
    };

    unit.create(newUnit , function(err , newUnit) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            console.log(newUnit);
            res.redirect("/view/units");
        }
    });
});


// route for display form to edit specific unit
router.get("/edit/unit/:unit_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    unit.findById(req.params.unit_id , function(err , foundSingleUnit) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("unit/edit" , {singleUnit : foundSingleUnit}) ;
        }
    });
});


// route for get updated data from form and update them to the database
router.put("/edit/unit/:unit_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    
    var newUpdatedUnit = {
        name: req.body.form_name
    };
    
    unit.findByIdAndUpdate(req.params.unit_id , newUpdatedUnit , function(err , newUpdatedUnitSchema) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/units");
        }
    });
});

// route for delete single unit 
router.delete("/delete/unit/:unit_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    unit.findByIdAndRemove(req.params.unit_id , function(err , deletedUnit) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.redirect("/view/units");
        }
    });
});





//------------------------------------------------------------------------------------------ unit with topic
// route for add topic to list of topics in specefic unit
router.get("/add/unit/:unit_id/topic/:topic_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    unit.findById(req.params.unit_id, function(err , foundUnit) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            topic.findById(req.params.topic_id , function(err , foundTopic) {
                if(err) {
                     req.flash("error" , err.message);
             res.redirect("back");
                } else {

                    var found = false;
                    foundUnit.TopicListID.forEach(function(UnitID) {
                        if(String(foundTopic._id) == String(UnitID._id)) {
                            found = true;
                        }
                    });
                    if(!found) { // id not found in "TopicListID" list push it
                    
                    //*************************************************** */
                    foundTopic.classRoomID = foundUnit.classRoomID;
                    foundTopic.courseID = foundUnit.courseID;
                    foundTopic.unitID = foundUnit._id;
                    classroom.findById(foundUnit.classRoomID).populate("CstudentsListID").exec( (err , foundClassRoom) => {
                        if(err) {
                             req.flash("error" , err.message);
             res.redirect("back");
                        } else {
                            console.log(foundClassRoom);
                            foundTopic.studentListID = foundClassRoom.CstudentsListID;
                            foundTopic.save();
                        }
                    });
                    
                    //*************************************************** */
                    
                    foundUnit.TopicListID.push(foundTopic);
                    foundUnit.save();

                        // foundUnit.CoursesListID.push(foundCourse);
                        // foundUnit.save();
                        res.redirect("/view/unit/" + foundUnit._id);
                    } else { // id found in "TopicListID" list not push it's imposible to find two topics in the same id in one unit
                        res.redirect("/view/unit/" + foundUnit._id);
                    }
                }
            });
        }
    });
});



// route for delete specific topic from specific unit
router.get("/delete/unit/:unit_id/topic/:topic_id" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    unit.findById( req.params.unit_id, function(err , foundUnit) {
        if(err) {
             req.flash("error" , err.message);
             res.redirect("back");
        } else {
            topic.findById(req.params.topic_id , function(err , foundTopic) {
                if(err) {
                     req.flash("error" , err.message);
             res.redirect("back");
                } else {
                    foundUnit.TopicListID.remove(foundTopic);
                    foundUnit.save();

                    // foundUnit.UnitsListID.remove(foundUnit);
                    // foundUnit.save();
                    res.redirect("/view/unit/" + foundUnit._id);
                }
            });
        }
    });
});





module.exports = router;