var mongoose = require("mongoose");

var classroomSchema = new mongoose.Schema({
    name: String,
    CstudentsListID: [{type: mongoose.Schema.Types.ObjectId , ref: "student"}],
    CcoursesListID: [{type: mongoose.Schema.Types.ObjectId , ref: "course"}],
});

module.exports = mongoose.model("classroom" , classroomSchema);