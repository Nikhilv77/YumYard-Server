const User = require("../Models/UserModel");
const express = require("express");
const Router = express.Router();
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser');

Router.use(cookieParser());


const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nykhilverma@gmail.com",
    pass: "xrektseciylzhysw",
  },
});
const userRegister = Router.post("/signup", async (req, res) => {
  const { name, email, number, password } = req.body;
  if (
    name.length < 1 ||
    email.length < 1 ||
    number.length < 1 ||
    password.length < 1
  ) {
    return res.status(400).json({ message: "Please give all the information" });
  }

  try {
    const existingUser = await User.findOne({ email });
    const existingUserPh = await User.findOne({ number });
    if (existingUser || existingUserPh) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = new User({ name, email, number, password });
    newUser.save();
    res.send("user registered successfully");
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});
const loginInfo = Router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const number = parseInt(email);
  if (email.includes("@")) {
    try {
      const user = await User.find({ email, password });
      if (user.length > 0) {
        const currUser = {
          name: user[0].name,
          email: user[0].email,
          number: user[0].number,
          password: user[0].password,
          isAdmin: user[0].isAdmin,
          _id: user[0]._id,
        };
        res.send(currUser);
      } else {
        return res.status(400).json({ message: "Invalid Email or Password!" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } else {
    try {
      const user = await User.find({ number, password });
      if (user.length > 0) {
        const currUser = {
          name: user[0].name,
          email: user[0].email,
          number: user[0].number,
          password: user[0].password,
          isAdmin: user[0].isAdmin,
          _id: user[0]._id,
        };
        res.send(currUser);
      } else {
        return res
          .status(400)
          .json({ message: "Invalid Mobile no. or Password!" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
});

const getUsersRoute = Router.get("/getusers", async (req, res) => {
  try {
    const Users = await User.find();
    res.send(Users);
  } catch (error) {
    res.send(error);
  }
});

const removeUser = Router.post("/removeusers", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findOneAndDelete({ _id: userId });
    res.send("User removed Successfully!");
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Could not remove user, something went wrong!" });
  }
});

const getOtp = Router.post("/forgotpassword", async (req, res) => {
  const otp = req.body.oneTimePassword;
  const userEmail = req.body.email;
  const mailOptions = {
    from: "nykhilverma@gmail.com",
    to: userEmail,
    subject: "Your OTP verification for YumYard",
    html: `<div style="width: 80%; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 10px; overflow: hidden;">
   <div style="background-color: #007bff; padding: 20px; text-align: center; color: #fff;">
     <h1 style="margin: 0; font-size: 24px;">YumYard OTP Verification</h1>
   </div>
 
   <div style="background-color: #ffffff; padding: 20px;">
     <p style="margin-bottom: 15px; font-size: 16px;">Your one-time password is: <strong style="color: #28a745; font-size: 1.2em;">${otp}</strong></p>
     <p style="margin-bottom: 15px; font-size: 16px;">This OTP is valid for a short period. Do not share it with anyone.</p>
     <p style="font-size: 16px;">If you did not request this OTP, please ignore this email.</p>
   </div>
 
   <p style="margin: 20px 0; font-size: 16px;">For any assistance, contact our support team:</p>
 
   <div style="text-align: center; color: #888; padding: 20px; background-color: #f8f9fa;">
     <p style="margin: 0; font-size: 16px;">YumYardSupport@yumyard.com</p>
   </div>
 </div>`,
  };

  try {
    await transportMail.sendMail(mailOptions);
    res.status(200).json({ message: "OTP Sent Successfully!", otp });
  } catch (error) {
    res.status(400).json({ message: "OTP Could not be sent" });
  }
});

const doesExist = Router.post("/doesexist", async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    const loginInfo = {
      email:user.email,
      password:user.password,
    }
    res.send(loginInfo);
  } else {
    res.status(400).json({ message: "User does not exist!" });
  }
});

const doesNotExist = Router.post("/doesnotexist", async (req, res) => {
  const email = req.body.email;
  const number = req.body.number;
  const userEmail = await User.findOne({ email: email });
  const userPhone = await User.findOne({number:number})
  if (userEmail || userPhone) {
    res.status(400).json({ message: "User exists!" });
  } else {
    res.send("User does not exist");
  }
});

const doesAlreadyExist = Router.post("/alreadyexists",async(req,res)=>{
const email = req.body.email;
const user = await User.findOne({email:email});
if (user) {
 
  res.status(400).json({ message: "User already exists!" });
} else {
  res.send("User does not exist");
}
});


const doesContactExist= Router.post("/doescontactexist", async (req, res) => {
  const email = req.body.value.email;
  const number = req.body.value.number;
  const emailUser = await User.findOne({ email: email });
  const numberUser = await User.findOne({number:number})
  if (emailUser || numberUser) {
    res.send("User Exists");
  } else {
    res.status(400).json({ message: "User does not exist!" });
  }
});

const doesFeedbackExist= Router.post("/doesfeedbackexist", async (req, res) => {
  const email = req.body.value.email;
  const emailUser = await User.findOne({ email: email });
  if (emailUser) {
    res.send("User Exists");
  } else {
    res.status(400).json({ message: "User does not exist!" });
  }
});

const updatePasswordRoute = Router.post('/updatepassword',async(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({email:email})
    user.password = password;
    await user.save();
    res.send('Password updated successfully!')
  } catch (error) {
    res.status(400).json({message:'Could not update Password!'})
  }

})

const getUserByEmail = Router.post('/getuserbyemail', async(req,res)=>{
  const email = req.body.email;
  try {
    const user = await User.findOne({email:email})
    res.send(user)
  } catch (error) {
    res.status(400).json({message:'Could not find user!'})
  }
})

module.exports = {
  userRegister,
  loginInfo,
  getUsersRoute,
  removeUser,
  getOtp,
  doesExist,
  doesNotExist,
  doesAlreadyExist,
  doesContactExist,
  updatePasswordRoute,
  getUserByEmail,
};
