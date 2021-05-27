var mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
    name: String,
    authorName: String,
    classRoomID: String,
    UnitListID: [{type: mongoose.Schema.Types.ObjectId , ref: "unit"}],
    RePlanListID: [{type: mongoose.Schema.Types.ObjectId , ref: "remedialplan"}],
    SemesterPlan: [{type: mongoose.Schema.Types.ObjectId, ref: "semesterplan"}],
    Teacher: [{type: mongoose.Schema.Types.ObjectId , ref: "teacher"}],
    StudentList: [{type: mongoose.Schema.Types.ObjectId , ref: "student"}]
});

module.exports = mongoose.model("course" , courseSchema);