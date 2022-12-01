const express = require("express");
const router = express.Router();
const cryptojs = require("crypto-js");
const Order = require("../models/Order");
//requiring the middleware
const {
  verifytoken,
  verifytokenandauthorization,
  VerifyTokenAndAdmin,
} = require("./verifytoken");

//CREATE ORDER

router.post("/", verifytoken, async (req, res) => {
  const addOrder = new Order(req.body); //put into the database all the inputted information
  try {
    const Order = await addOrder.save();
    res.status(200).json(Order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE ORDER
router.put("/update/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        //all the inputted will be updated
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE ORDER
router.delete("/delete/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted..");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER ORDER
router.get("/find/:userID", verifytokenandauthorization, async (req, res) => {
  try {
    //find because user can have more than 1 orders
    const getOrder = await Order.find({ userID: req.params.userID }); //find the userID in Order schema
    res.status(200).json(getOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL ORDERS
router.get("/", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const GetallOrder = await Order.find(); //find method to get all data
    res.status(200).json(GetallOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET MONTHLY INCOME
router.get("/income",VerifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1)); //setting the month to lastmonth
  const previousMonth = new Date(date.setMonth(lastMonth - 1)); //lastmonth - 1

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } }, //get all the createdAt from greater than or equal to previousMonth
      {
        $project: {
          month: { $month: "$createdAt" }, //get the month from createdAt and store it to month
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month", //the id will be the month
          total: { $sum: "$sales" }, //the total will be the sum of sales
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
