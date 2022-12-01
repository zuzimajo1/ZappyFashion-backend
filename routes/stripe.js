const router = require('express').Router();
//requiring the stripe
const Stripe = require('stripe');
const stripe = Stripe(
  "sk_test_51K4L2ZDzQhQJzaeDejkSTLohynv2kGIUOJj1mPJrVKVBPNCRo6yaKyMPyhin6ZVDjRFIkw0hIIbu9BaJk1AaW96L00CAY8Lsik"
);

router.post('/payment', async (req, res)=>{
    stripe.charges.create(
        {
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "php",
    },
    (stripeErr, stripeRes)=>{
        if(stripeErr){
             res.status(500).json(stripeErr);
        }else{
             res.status(200).json(stripeRes);
        }
    })
})

module.exports = router;




module.exports = router;