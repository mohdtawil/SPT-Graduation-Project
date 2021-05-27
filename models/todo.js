var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
    todoTitle: String,
    todoDescription: String,
    courseName: String,
    courseID: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "course"}
    },
    DueDate: String
});

module.exports = mongoose.model("todo" , todoSchema);