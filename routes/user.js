const router = require("express").Router();
const cryptojs = require("crypto-js");
const User = require("../models/User");
//requiring the middleware
const {
  verifytoken,
  verifytokenandauthorization,
  VerifyTokenAndAdmin,
} = require("./verifytoken");

//UPDATE
router.put("/update/:id", verifytokenandauthorization, async (req, res) => {
  if (req.body.password) {
    //if there is an inputted password, it will encrypt

    req.body.password = cryptojs.AES.encrypt(
      req.body.password,
      process.env.PASS_KEY
    ).toString(); //using cryptoJS to encrypt the password
  }

  try {
    const newUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        //writes what will be updated
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/delete/:id", verifytokenandauthorization, async (req , res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted..")
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET USER
router.get("/find/:id", VerifyTokenAndAdmin, async (req, res)=>{
      try {
       const user = await User.findById(req.params.id); //find the ID in User schema
        const { password, ...others } = user._doc; //to get only information, password is not included
        res.status(200).json(others); 
      } catch (error) {
        res.status(500).json(error);
      }
});


//GET ALL USERS
router.get("/", VerifyTokenAndAdmin, async (req, res)=>{
    const query = req.query.new //query = "?new"
    try {  //if the query is true, it will sort
        const user = query ? await User.find().sort({ _id : -1}).limit(5) : await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error)
    }
});


//GET USER STATS
router.get("/stats", VerifyTokenAndAdmin, async (req, res)=>{
    const date = new Date(); //get the date
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1)); //setting the date to fullyear - 1 to get the lastyear
    try {
        const data = await User.aggregate([
            {$match: { createdAt: {$gte:lastyear } }},
            {
                $project: {
                    month: { $month: "$createdAt" }, //$month is get the month from createAt and store it to the month variable
                },

            },
            {
                $group:{
                    _id: "$month",
                    total: { $sum : 1 } //will sum every registered user
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error)
    }
});



module.exports = router;
