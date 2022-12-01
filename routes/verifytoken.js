const jwt = require('jsonwebtoken');

    //Verifytoken as the middleware
const verifytoken = (req, res, next)=>{
    const authHeader  = req.headers.token;
    if(authHeader){ 
        //split the token because we are going to input Bearer
        //define the token
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{ //verifythetoken if token is inputted
            if(err) res.status(403).json("Token is not valid");
            req.user = user; //success
            next();
        });
    }else{
        return res.status(401).json("You are not authenticated!")
    }
};


const verifytokenandauthorization = (req, res, next)=>{
        //in next, we can create a function
        //the function is created inside a middleware
    verifytoken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next(); // it will go to the next function
        }else{
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

const VerifyTokenAndAdmin = (req, res, next) => {
  verifytoken(req, res, () => { //using the verifytoken function
    if (req.user.isAdmin) { //if user.isAdmin is true
      next(); 
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};





module.exports = {
  verifytoken,
  verifytokenandauthorization,
  VerifyTokenAndAdmin,
};