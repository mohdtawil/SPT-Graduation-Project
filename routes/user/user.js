
var express = require("express"),
router = express.Router(),
User = require("../../models/user");



router.get("/user/:user_id/reset-password" , function(req , res) {
    User.findById(req.params.user_id , function(err , foundUser) {
        if(err) {
            req.flash("error" , err.message);
            res.redirect("back");
        } else {
            res.render("user/reset-password" , {singleUser: foundUser});
        }
    });
});

router.post("/user/:user_id/reset-password" , function(req , res) {

    if(req.user.id == req.params.user_id) {
        User.findById(req.params.user_id , (err , foundUser) => {
            if(err) {
                req.flash("error" , err.message);
                return res.redirect("back");
            } else {
                if(req.body.newPassword != req.body.reNewPassword) {
                    req.flash("error" , "Passwords not match");
                    res.redirect("back");
                } else {
                    foundUser.changePassword(req.body.oldPassword , req.body.newPassword , (err) => {
                        if(err) {
                            req.flash("error" , err.message);
                            res.redirect("back");
                            
                        } else {
                            req.flash("success" , "Change Password Successfully");
                            res.redirect("/");
                        }
                    });
                }
            }
        });
    } else {
        req.flash("error" , "Don't have promssion to do that");
        return res.redirect("back");
    }


    
});



module.exports = router;