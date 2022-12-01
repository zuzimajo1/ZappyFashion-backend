//requiring mongoose
const mongoose = require("mongoose");

//creating a new schema for properties

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {
    //for admin
    type: Boolean,
    default: false, //creating a user will not be admin
  },
}, {timestamps: true});


//exporting schema
module.exports = mongoose.model("User", UserSchema);