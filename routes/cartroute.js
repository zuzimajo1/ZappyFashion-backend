const express = require("express");
const router = express.Router();
const cryptojs = require("crypto-js");
const Cart = require("../models/Cart");
//requiring the middleware
const {
  verifytoken,
  verifytokenandauthorization,
  VerifyTokenAndAdmin,
} = require("./verifytoken");

//CREATE CART

router.post("/", verifytoken, async (req, res) => {
  const addCart = new Cart(req.body); //put into the database all the inputted information

  try {
    const Cart = await addCart.save();
    res.status(200).json(Cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE CART
router.put("/update/:id", verifytokenandauthorization, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        //writes what will be updated
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE CART
router.delete("/delete/:id", verifytokenandauthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted..");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER CART
router.get("/find/:userID", verifytokenandauthorization, async (req, res) => {
  try {     //findOne because every cart has a userID
    const getCart = await Cart.findOne({userID: req.params.userID}); //find the userID in Cart schema
    res.status(200).json(getCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL CART
router.get('/', VerifyTokenAndAdmin, async (req, res)=>{
    try {
        const GetallCart = await Cart.find(); //find method to get all data
        res.status(200).json(GetallCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
