var mongoose = require("mongoose");

var teacherSchema = new mongoose.Schema({
    name: String,
    ssn: String,
    ministerialNum: String,
    phoneNum: String,
    RealTeacher: {type: Boolean , default: false},
    CourseList: [{type: mongoose.Schema.Types.ObjectId , ref: "course"}]
});

module.exports = mongoose.model("teacher" , teacherSchema);