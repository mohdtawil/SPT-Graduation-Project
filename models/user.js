var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String , unique: true , required: true},
    password: String,
    role : String,
    isAdmin: {type: Boolean, default: false},
    isParent: {type: Boolean, default: false},
    parentID: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "parent"}
    },
    teacherID: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "teacher"}
    },
    studentID: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "student"}
    }
});

userSchema.plugin(passportLocalMongoose); 


module.exports = mongoose.model("User" , userSchema);