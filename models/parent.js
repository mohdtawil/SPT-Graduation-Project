var mongoose = require("mongoose");

var parentSchema = new mongoose.Schema({
    name: String,
    ssn: String,
    phone: String,
    refrenceStudent: [{type: mongoose.Schema.Types.ObjectId , ref: "student"}]
});

module.exports = mongoose.model("parent" , parentSchema);