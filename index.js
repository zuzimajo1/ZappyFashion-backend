//requiring express
const express = require("express");

const app = express();
//requiring mongoose
const mongoose = require("mongoose");

//requiring the dotenv
const dotenv = require("dotenv");

//requiring cors
const cors = require('cors');

//requiring the router
const RouterData = require('./routes/userrouter');

//requiring router for register and login
const AuthRouter = require('./routes/auth');

//requiring router for user
const UserRouter = require('./routes/user');

//requiring router for product
const ProductRouter = require('./routes/productroute');

//requiring router for cart
const CartRouter = require('./routes/cartroute');

//requiring router for order
const OrderRouter = require('./routes/orderrouter');

//requiring router for stripe checkout
const StripeRouter = require('./routes/stripe');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL) //using the MONGO_URL env
  .then(() => console.log("DBConnection Successful"))
  .catch((err) => {
    console.log(err);
  });

//send and receive json data
app.use(express.json());
app.use(cors());
app.use('/api/auth', AuthRouter);
app.use("/api/user/", UserRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", CartRouter);
app.use("/api/order", OrderRouter);
app.use("/api/checkout", StripeRouter);



//lc:/api/user/usertest



app.get("/", (req, res) => {
  res.status(200).send("This is ZappyFashion backend");
});

        //if there is no port, use 5000
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is listening on port 5000");
});
