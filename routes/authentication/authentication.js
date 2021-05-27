const parent = require("../../models/parent");
const student = require("../../models/student");

var express = require("express"),
    passport = require("passport"),
    User = require("../../models/user"),
        router = express.Router();



// route for view form to login
router.get("/login" , function(req , res) {
    res.render("authentiaction/login");
});

// rote for get login info from form and check if data is correct or not
router.post("/login" , passport.authenticate("local" , {
    successRedirect: "/", 
    failureRedirect: "/faliureLogin"
   }) ,function(req , res){
    // this function empty for now
});

router.get("/faliureLogin" , function(req ,res) {
    req.flash("error" , "Username/SSN or Passowrd incorrect!");
    res.redirect("/login");
})


// route for view form to register
router.get("/register" , function(req , res) {
    res.render("authentiaction/register");
});

// route for get new register user and save them to database
router.post("/register" , async function(req,res) { 

    var ssnFormList = [];
    (req.body.ssn1.length == 0)? console.log("none") : ssnFormList.push(req.body.ssn1);
    (req.body.ssn2.length == 0)? console.log("none") : ssnFormList.push(req.body.ssn2);
    (req.body.ssn3.length == 0)? console.log("none") : ssnFormList.push(req.body.ssn3);

    ssnFormList.forEach(function(studentFormList) {
        if(Number(studentFormList.length) ==  10) {
           console.log("valid SSN");
        } else {
            req.flash("error" , "Error SSN For Student Must Be Length 10 Digits Plasea try Again");
            res.redirect("/register");
        }
    });
    var studentWillAdded= [];
    var std = await student.find({ RealStudent: true} , function(err , foundStudents) {
        if(err) {
            console.log(err);
        } else {
            foundStudents.forEach(function(studentFormDB) {
                ssnFormList.forEach(function(studentFormList) {
                    if(studentFormDB.ssn == studentFormList) {
                        studentWillAdded.push(studentFormDB);
                    }
                });
            });
            return studentWillAdded;
        }
    })

    if(studentWillAdded.length == 0) {
        req.flash("error" , "Error you Must Enter Real SSN to Countinue.... Plasea try Again");
        res.redirect("/register");
    } else {
        var ssnFrom = String(req.body.ssn);
        if(ssnFrom.length != 10) {
            req.flash("error" , "Error SSN Length Must Be 10 Digits Plasea try Again");
            res.redirect("/register");
        }

        var phoneFrom = String(req.body.phone);
        if(phoneFrom.length != 10) {
            req.flash("error" , "Error phone Length Must Be 10 Digits Plasea try Again");
            res.redirect("/register");
        }
        
        console.log("ok");
        var newParent = {
            name: String(req.body.name),
            ssn: String(req.body.ssn),
            phone: req.body.phone,
            refrenceStudent: studentWillAdded
        };
        console.log(newParent);
        parent.create(newParent , function(err , newParentSchema) {
            if(err) {
                req.flash("error" , err.message);
                        res.redirect("back");
            } else {
                var pID = {
                    id: newParentSchema
                };
                User.register( new User({username: req.body.username , role: "Parent" , parentID: pID, isParent: true } ) , req.body.password , function(err , user){
                    if(err) {
                        req.flash("error" , err.message);
                        res.redirect("back");
                    }
                    console.log(user);
                    req.flash("success" , "You Are Register Successfually, ");
                    res.redirect("/");
                    passport.authenticate("local")(req , res , function(){
                        
                    });
                });
            }
        })
    }









    
});



// route for logout
router.get("/logout" , function(req , res) {
    req.logout();
    res.redirect("/");
})





module.exports = router;