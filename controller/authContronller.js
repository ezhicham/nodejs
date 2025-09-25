const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usermodel = require("../models/userSchema");

const {  validationResult, cookie } = require("express-validator");

// register new user and check the email and password are valid using expreess validator

const register_post = async (req, res) => {

  const objError = validationResult(req);
  console.log(objError.errors);

  if (objError.errors.length > 0) {
    return res.json({ validateErrors: objError.errors });
  }

  // search about user depends on email ===============
  const isexist = await usermodel.findOne({ email: req.body.email });

  // check if the user exist or not  if exist don't register again  if not save the user
  if (isexist == null) {
    const saveduser = await usermodel.create(req.body);

    try {
      // save cookies when the user register
      const token = jwt.sign({ id: saveduser._id }, process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 8660000 });

      console.log(saveduser);
      console.log("user saved successfully");
      return res.json({ usersavedSuccessfully: saveduser._id });
    } catch (error) {
      console.log("user note saved ");
      return res.json({ saveError: " user not saved check your internet" });
    }
  } else {
    return res.json({
      userexist: "user already exist please user another email ",
    });
  }
};

// verify the data of user and check if he user or not

const login_post_verify = async (req, res) => {
  //  1# check if email is exist
  // 2# hash password and compare it with stored password

  const isEmailExist = await usermodel.findOne({ email: req.body.email });

  if (isEmailExist == null) {
    return res.json({ userNotexist: "user not exist please register first " });
  } else {
    console.log("email  exist");
    // 2# hash password and compare it with stored password
    const matches = await bcrypt.compare(
      req.body.password,
      isEmailExist.password
    );

    // 3# check if the hashed passwords are  matches
    if (matches) {
      //  console.log("password matches and email exist")
      //  4# save the jwt in the cookies if the credentials is correct
      const token = jwt.sign({ id: isEmailExist._id },process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 8660000 });

      return res.json({ useID: isEmailExist._id });
    } else {
      // console.log("passowrd not matches and email exist")
      return res.json({ passwordWrong: "Password wrong please try again " });
    }
  }
};

//

module.exports = { register_post,login_post_verify };
