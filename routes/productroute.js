const express = require("express");
const router = express.Router();
const cryptojs = require("crypto-js");
const Product = require("../models/Product");
//requiring the middleware
const {
  verifytoken,
  verifytokenandauthorization,
  VerifyTokenAndAdmin,
} = require("./verifytoken");

//CREATE PRODUCT

router.post("/", VerifyTokenAndAdmin, async (req, res) => {
  const addproduct = new Product(req.body); //put into the database all the inputted information

  try {
    const product = await addproduct.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE PRODUCT
router.put("/update/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const updateproduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        //writes what will be updated
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateproduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //DELETE PRODUCT
router.delete("/delete/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted..");
  } catch (error) {
    res.status(500).json(error);
  }
});

// //GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const getproduct = await Product.findById(req.params.id); //find the ID in User schema
    res.status(200).json(getproduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new; //query = "?new"
  const qCategory = req.query.category; //query = "?category"
  try {
    let qProducts;
    if(qCategory){
        qProducts = await Product.find({
            categories: {
                $in: [qCategory], //return all the products that was have the category inputted in query
        }
        });
        return res.status(200).json(qProducts);
    }else if(qNew){
        qProducts = await Product.find().sort({createdAt: -1}).limit(1); //sort the product by createAt
        return res.status(200).json(qProducts);

    }else{
        qProducts = await Product.find(); //return all the products
        return res.status(200).json(qProducts)
    }

  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
