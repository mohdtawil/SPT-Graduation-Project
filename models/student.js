var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
    name: String,
    ssn: String,
    ToDoListID: [{type: mongoose.Schema.Types.ObjectId , ref: "todo"}],
    RealStudent: {type: Boolean , default: false},
    ClassID: [{type: mongoose.Schema.Types.ObjectId , ref: "classroom"}],
    RemedialNotification: [{type: mongoose.Schema.Types.ObjectId , ref: "remedialplan"}],
    AttendenceMap: [Object]
});

module.exports = mongoose.model("student" , studentSchema);