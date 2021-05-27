var mongoose = require("mongoose");

var topicSchema = new mongoose.Schema({
    classRoomID: String,
    courseID: String,
    unitID: String,
    maxGrade: Number,
    AVG: Number,
    studentListID: [{type: mongoose.Schema.Types.ObjectId , ref: "student"}],
    name: String,
    ListOfMarks: [
        {
            id: {type: mongoose.Schema.Types.ObjectId , ref: "student"},
            mark: Number, 
            max: Number
        }
    ]
});

module.exports = mongoose.model("topic" ,topicSchema);

