var mongoose = require("mongoose");

var semesterplanSchema = new mongoose.Schema({
    CourseName: String,
    TeacherName: String,
    GeneralOutcomesList: [String],
    InstructionsStrategiesList: [String],
    AsesmentsMethodList: [String],
    AssociativeActivitiesList: [String],
    ReflectionList: [String],
    StartDate: String,
    EndDate: String
});

module.exports = mongoose.model("semesterplan" , semesterplanSchema);