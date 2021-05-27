
var mongoose = require("mongoose");

var remedialplanSchema = new mongoose.Schema({
    CourseName: String,
    TopicID: String,
    TopicName: String,
    StudentListID: [{type: mongoose.Schema.Types.ObjectId , ref: "student"}],
    ProcedularList: [String],
    NoteList: [String],
    StartDate: String,
    EndDate: String
});

module.exports = mongoose.model("remedialplan" , remedialplanSchema);