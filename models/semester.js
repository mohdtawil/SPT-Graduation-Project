var mongoose = require("mongoose");

var semesterSchema = new mongoose.Schema({
    name: String,
    classesListID: [{type: mongoose.Schema.Types.ObjectId, ref: "classroom"}]
});

module.exports = mongoose.model("semester" , semesterSchema);