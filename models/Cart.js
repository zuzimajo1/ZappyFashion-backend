//requiring mongoose
const mongoose = require("mongoose");

//creating a new schema for properties

const CartSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    products: [
        {
            productID :{
                type: String,
            },
            quantity :{
                type: Number,
                default: 1,
            }
        }
    ],

  },
  { timestamps: true }
);

//exporting schema
module.exports = mongoose.model("Cart", CartSchema);
