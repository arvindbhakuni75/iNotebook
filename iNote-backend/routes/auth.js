const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Arvind is a coder';

// ROUTE: 1 Create a user using: POST "/api/auth/createuser". No Login required..

router.post('/createuser',[
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password lenght must be 5").isLength({ min: 5 }),
], async (req, res)=> {
  //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try{
      
    //check whether the user with this email exist already
    let user = await User.findOne({email: req.body.email});
    if(user){
      return res.status(400).json({error: "Sorry a user with this email already exists"})
    }
    // Create a new User
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt) 
     user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })

      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(authtoken)
      
      //res.json(user)
      res.json({authtoken})

      //Catch error..
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error");;
    }
});


// ROUTE: 2 Authenticate a user using: POST "/api/auth/createuser". No Login required..

router.post('/login',[
  body('email', "Enter a valid email").isEmail(),
  body('password', "Password cannot be blank").exists(),
], async (req, res)=> {

   //if there are errors, return bad request and the errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   const {email, password} = req.body;

   try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Plese try to login with correct Credentials"});
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare) {
        return res.status(400).json({error: "Plese try to login with correct Credentials"});
      }

      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({authtoken})

   } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }

})

// ROUTE: 3 Get loggedin  User Detail using: POST "/api/auth/getuser". Login required..

router.post('/getuser', fetchuser, async (req, res)=> {

try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
  
} catch (error) {
  console.log(error.message);
  res.status(500).send("Internal server Error");
}
})



module.exports = router;