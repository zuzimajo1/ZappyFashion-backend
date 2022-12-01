const express = require("express"); //requiring express
const User = require("../models/User"); //requiring user from schema
const router = express.Router(); //making a router
const cryptojs = require("crypto-js"); //requiring crypto-js
const jwt = require('jsonwebtoken'); //requiring JWT

//Register
router.post("/register", async (req, res) => {
  //create a new user using the schema
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptojs.AES.encrypt(
      req.body.password,
      process.env.PASS_KEY
    ).toString(), //using cryptoJS to encrypt the password
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); //get the information data of the USER and storing it to the user variable
                                                    
    if(!user){
      return res.status(401).json("Wrong credentials!");
    }

    //decrypting the password
    const hashedPassword = cryptojs.AES.decrypt(
      user.password,
      process.env.PASS_KEY
    );
    const password2 = hashedPassword.toString(cryptojs.enc.Utf8);
    if(password2 !== req.body.password){
      //if the inputted password is not equal to the db
      return res.status(401).json("Wrong credentials!");
    }
    
    const AccessToken = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SEC,{
      expiresIn: '3d'
    });

    const {password, ...others} = user._doc; //to get only information, password is not included

    res.status(200).json({...others, AccessToken }); //add the accesstoken in the json data information
  } catch (error) {
    res.status(500).json(error);
  }
});

//export router
module.exports = router;
