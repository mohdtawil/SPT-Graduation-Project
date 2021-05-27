var express = require("express"),
    router = express.Router(),
    classroom = require("../../models/classroom")


// route for home page
router.get("/" , function(req , res) {
    console.log(req.user);
    classroom.find({} , function(err , foundAllClassesSchema) {
        if(err) {
            req.flash("error" , err.message);
             res.redirect("back");
        } else {
            res.render("home/index" , {allClasses : foundAllClassesSchema});
        }
    });
});

module.exports = router;