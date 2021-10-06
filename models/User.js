const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    phone: Number,
    email: String,
    role: String,
    language: String,
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);