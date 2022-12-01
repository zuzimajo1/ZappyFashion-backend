//requiring mongoose
const mongoose = require("mongoose");

//creating a new schema for properties

const OrderSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    products: [
      {
        productID: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

//exporting schema
module.exports = mongoose.model("Order", OrderSchema);
