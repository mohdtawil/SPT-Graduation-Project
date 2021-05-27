const student = require("../../models/student");
var classroom = require("../../models/classroom");
const remedialplan = require("../../models/remedialplan");
const MiddleWare = require("../../middleware");
const { isLoggedIn } = require("../../middleware");
var express = require("express"),
    router  = express.Router(),
    course = require("../../models/course"),
    topic = require("../../models/topic");


// route for view all topics
router.get("/view/topics" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    topic.find({} , function(err , foundAllTopics) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {

            res.render("topic/view" , {allTopics: foundAllTopics});
        }
    });
});



// route for show form to insert new toip
router.get("/insert/topic" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    res.render("topic/insert");
});

// route for get data from form and save them to database
router.post("/insert/topic" ,MiddleWare.onlyAdminAndTeacher,  function(req ,res) {
    var Tmaxgrade = String(req.body.name_maxGrade);
   if (Number(Tmaxgrade) > 0)
    {
        var newTopic = {
            name: req.body.name_form,
            maxGrade: req.body.name_maxGrade
        };

        topic.create(newTopic, function(err , newTopic) {
            if(err) {
                req.flash("error" , err.message);
        res.redirect("back"); 
            } else {
                res.redirect("/view/topics");
            }
        });
    }
    else
    {
        req.flash("error" , "Error Max Grade should be greater than zero, Plasea try Again");
        res.redirect("back");
    }  
});

// route for view detalis for single topic
router.get("/view/topic/:topic_id" ,  MiddleWare.onlyAdminAndTeacher, function(req , res) {
    topic.findById(req.params.topic_id).populate("studentListID , ListOfMarks , ListOfMarks.id").exec(function(err , foundTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("topic/show" , {singleTopic: foundTopic});
        }
    });
});

// route for show form to edit specific topic
router.get("/edit/topic/:topic_id" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    topic.findById(req.params.topic_id , function(err , foundSingleTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.render("topic/edit" , {singleTopic: foundSingleTopic});
        }   
    })
    
})

// route for get edited data from form and save them to databas
router.put("/edit/topic/:topic_id"  ,MiddleWare.onlyAdminAndTeacher,  function(req , res) {
    var newUpdatedTopic = {
        name: req.body.name_form,
        maxGrade: req.body.name_maxGrade
    };

    topic.findByIdAndUpdate(req.params.topic_id, newUpdatedTopic, function(err , foundUpdataedSingleTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.redirect("/view/topics");
        }
    });
});


// route for delete specific topic
router.delete("/delete/topic/:topic_id" , MiddleWare.onlyAdminAndTeacher, function(req, res) {
    topic.findByIdAndRemove(req.params.topic_id , function(err , deletedTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            res.redirect("/view/topics");
        }
    });
});

//--------------------------------------------------------------------------------------- topic with student to set mark
// route for add new mark for spicifc student 
router.post("/add/topic/:topic_id/student/:student_id/mark" ,MiddleWare.onlyAdminAndTeacher, function(req , res) {
    console.log(req.body.max);
    topic.findById(req.params.topic_id , function(err , foundTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            student.findById(req.params.student_id, function(err , foundStudent) {
                if(err) {
                    req.flash("error" , err.message);
        res.redirect("back"); 
                } else {
                    var newMark = {
                        id: foundStudent,
                        mark: req.body.form_mark
                    };
                    var found = false;
                    // loop for check student have old grade or not
                    foundTopic.ListOfMarks.forEach((mark) => {
                        if(mark.id.equals(foundStudent._id)) {
                            found = true;
                        }
                    });

                    if(found) { // student have grade
                        res.redirect("/view/topic/" + foundTopic._id);
                    } else { // student no have grade
                        foundTopic.ListOfMarks.push(newMark);
                        foundTopic.save();
                        res.redirect("/view/topic/" + foundTopic._id);
                    }
                    
                }
            })
        }
    })
})

// route for delete mark for spicifc student 
router.delete("/delete/topic/:topic_id/student/:student_id/mark" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    topic.findById(req.params.topic_id , function(err , foundTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            student.findById(req.params.student_id, function(err , foundStudent) {
                if(err) {
                    req.flash("error" , err.message);
        res.redirect("back"); 
                } else {

                    var deleteMark;
                    foundTopic.ListOfMarks.forEach((mark) => {
                        if(mark.id.equals(foundStudent._id)) {
                            deleteMark = mark;
                        }
                    });

                    foundTopic.ListOfMarks.remove(deleteMark);
                    foundTopic.save();
                    res.redirect("/view/topic/" + foundTopic._id);
                }
            })
        }
    });
});


// route for refresh to update student list between classroom and spicifc topic
router.get("/refresh/topic/:topic_id" , MiddleWare.onlyAdminAndTeacher, function(req , res) {
    topic.findById(req.params.topic_id , function(err , foundTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
           classroom.findById(foundTopic.classRoomID , function(err , foundClassroom) {
                if(err) {
                    req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    foundTopic.studentListID = foundClassroom.CstudentsListID;
                    foundTopic.save();
                    res.redirect("/view/topic/" + foundTopic._id);
                }
            }) 
        }
    })
})

//--------------------------------------------------------------------------------------- topic with remedialplan
// route for make new remedialplan of students has low grade
router.get("/add/topic/:topic_id/remedialplan" ,MiddleWare.onlyAdminAndTeacher, function(req, res) {
    topic.findById(req.params.topic_id , function(err , foundTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            course.findById(foundTopic.courseID , function(err , foundCourse) {
                if(err) {
                    req.flash("error" , err.message);
        res.redirect("back");
                } else {
                   // console.log(foundTopic);
                    res.render("topic/insert-remedialplan" , {singleTopic: foundTopic , singleCourse: foundCourse} );
                }
            })
        }
    })
})


// route for make new remedialplan of students has low grade
router.post("/add/topic/:topic_id/remedialplan" ,MiddleWare.onlyAdminAndTeacher, function(req, res) {
    topic.findById(req.params.topic_id).populate("ListOfMarks , ListOfMarks.id").exec( function(err , foundTopic) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            //console.log(foundTopic);
            
            var list = [];
            var stdIDs = [];
            //console.log(foundTopic.maxGrade);
            foundTopic.ListOfMarks.forEach(function(mark) {
                if(mark.mark < foundTopic.maxGrade/2) {
                    list.push(mark);
                    stdIDs.push(mark.id._id);
                    
                }
            });

            
            var newRemedialPlan = {
                TopicID: req.params.topic_id,
                TopicName: foundTopic.name,
                CourseName: req.body.form_CourseName ,
                ProcedularList: req.body.form_ProcedularList.split("+"),
                NoteList: req.body.form_NoteList.split("+"),
                StartDate: req.body.form_StartDate ,
                EndDate: req.body.form_EndDate,
                StudentListID: list
            };
            //console.log(stdIDs);
            remedialplan.create(newRemedialPlan , function(err , newRemedialPlanSchema) {
                if(err) {
                    req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    //console.log(newRemedialPlanSchema);
                    stdIDs.forEach(function(stdID) {
                        student.findById(stdID, function(err , foundStudent) {
                            if(err) {
                                req.flash("error" , err.message);
        res.redirect("back"); 
                            } else {
                                // console.log(foundStudent);
                                // console.log(newRemedialPlanSchema);
                                foundStudent.RemedialNotification.push(newRemedialPlanSchema); 
                                foundStudent.save();
                            }
                        });
                    });
                    res.redirect("/view/topic/"+ foundTopic._id);
                }
            })    
        }
    })
})



// route for view all remedial plans for spicific topic
router.get("/show/topic/:topic_id/remedialplan" ,MiddleWare.onlyAdminAndTeacher, function(req, res) {
    remedialplan.find({TopicID: req.params.topic_id}, function(err , foundRemedials) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {
            topic.findById(req.params.topic_id , function(err , foundTopic) {
                if(err) {
                    req.flash("error" , err.message);
        res.redirect("back");
                } else {
                    res.render("topic/view-remedialplan" ,{allRemedials: foundRemedials , singleTopic: foundTopic});
                }
            }) 
        }
    })
    
})

// route for delete spicific remedial plan for sicific topic
router.delete("/delete/topic/:topic_id/remedialplan/:remedialplan_id" ,MiddleWare.onlyAdminAndTeacher, function(req, res) {
    remedialplan.findByIdAndRemove(req.params.remedialplan_id , function(err , foundRemovedRemedial) {
        if(err) {
            req.flash("error" , err.message);
        res.redirect("back");
        } else {  
            res.redirect("/show/topic/" + req.params.topic_id + "/remedialplan");     
        }
    })
})


//--------------------------------------------------------------------------------------- topic with remedialplan
// route for claculate avarage for spicific topic
router.get("/calculate/topic/:topic_id" , function(req , res) {
    topic.findById(req.params.topic_id , function(err , foundTopic) {
        if(err) {
            /*
            req.flash("error" , err.message);
            res.redirect("back");
            */
           req.flash("error" , err.message);
        res.redirect("back");
        } else {
            var sum =0;
            foundTopic.ListOfMarks.forEach(function(STDmark) {
                sum += STDmark.mark;
            });
            foundTopic.AVG = sum / foundTopic.ListOfMarks.length;
            foundTopic.save();
            console.log(foundTopic.AVG = sum / foundTopic.ListOfMarks.length);
            res.redirect("back")
        }
    })
})



module.exports = router;