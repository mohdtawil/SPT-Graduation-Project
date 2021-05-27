var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    app = express(),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    homeRouter = require("./routes/home/index"),
    semesterRouter = require("./routes/semester/semester"),
    classRouter = require("./routes/classroom/classroom"),
    studentRouter = require("./routes/student/student"),
    courseRouter = require("./routes/course/course"),
    teacherRouter = require("./routes/teacher/teacher"),
    unitRouter = require("./routes/unit/unit"),
    topicRouter = require("./routes/topic/topic"),
    authentiactionRouter = require("./routes/authentication/authentication"),
    pernetRouter        = require("./routes/parent/parent"),
    userRouter = require("./routes/user/user"),
    adminRouter = require("./routes/admin/admin");

// connect mongoDB to local host and make the database name is "SPT_DB"
//mongoose.connect("mongodb://localhost/SPT_DB_v1" , { useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false});
mongoose.connect("mongodb://SPT:SPT2021@stp-shard-00-00.rdhvt.mongodb.net:27017,stp-shard-00-01.rdhvt.mongodb.net:27017,stp-shard-00-02.rdhvt.mongodb.net:27017/SPT_DB?ssl=true&replicaSet=atlas-k5tn4n-shard-0&authSource=admin&retryWrites=true&w=majority" , { useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false});



app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());

app.use(require("express-session")({
    secret: "this is for Graduation Project Test",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

   
app.use(function(req , res, next){
    if(req.user == undefined) {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    } else {
        User.findById(req.user.id).populate("studentID.id , teacherID.id , parentID.id").exec( function( err , foundUser) {
            if(err) {
                console.log(err);
            } else {
                res.locals.currentUser = foundUser;
                res.locals.error = req.flash("error");
                res.locals.success = req.flash("success");
                next();
            }
        })
    }
    
    
    
});
   

// include routes pages
app.use(homeRouter);
app.use(semesterRouter);
app.use(classRouter);
app.use(studentRouter);
app.use(courseRouter);
app.use(teacherRouter);
app.use(unitRouter);
app.use(topicRouter);
app.use(authentiactionRouter);
app.use(pernetRouter);
app.use(userRouter);
app.use(adminRouter);

var port = process.env.PORT || 8123;

// the app view in localhost 8123
app.listen(port , function() {
    console.log("Server is Starting....");
});