//requiring mongoose
const mongoose = require("mongoose");

//creating a new schema for properties

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, },
    img: { type: String, required: true },
    categories: { type: Array },
    color: { type: String  },
    size: { type: String },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

//exporting schema
module.exports = mongoose.model("Product", ProductSchema);
