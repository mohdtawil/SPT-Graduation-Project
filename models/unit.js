var mongoose = require("mongoose");

var unitSchema = new mongoose.Schema({
    name: String,
    courseID: String,
    classRoomID: String,
    TopicListID: [{type: mongoose.Schema.Types.ObjectId , ref: "topic"}]
});

module.exports = mongoose.model("unit" , unitSchema);