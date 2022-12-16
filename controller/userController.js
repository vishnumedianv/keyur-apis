"use strict";
const admin = require("../models/admin-user");
const leave = require("../models/leave");
const toDo = require("../models/todo");
const mongoose = require("mongoose");
const register = require("../models/register"),
  auth = require("../middleware/auth"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

exports.Leave_of = async function (req, res) {
  try {
    const allleaves = await leave.find();
    res.json(allleaves);
  } catch (err) {
    console.log("err.message");
  }
};

exports.getLeaveList = async function (req, res) {
  try {
    const allleaves = await leave.find({ user: req.params.id });
    res.json(allleaves);
  } catch (error) {
    next(error);
  }
};

//To do
exports.toDo = async function (req, res) {
  try {
    const { taskName, taskType, addMember, DueDate, Description, done } =
      req.body;

    // Validate  input
    if (!(taskName && taskType && addMember && DueDate && Description)) {
      res.status(400).send("All input is required");
    }
    let checklist = new toDo({
      taskName,
      taskType,
      addMember,
      DueDate,
      Description,
      done,
    });
    checklist.save();
    return res.json({
      data: checklist,
      message: "Record save successful..!",
      code: 200,
    });
  } catch (err) {
    console.log("err.message");
    return res.json({ message: err.message });
  }
};

//task list
exports.tasklist = async function (req, res) {
  try {
    let checklist;
    if (req.body.addMember) {
      checklist = await toDo.find({});
    } else {
      checklist = await toDo.find({});
    }
    if (checklist) {
      return res.json({
        data: checklist,
        message: "Data fetched successful..!",
        code: 200,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};

//register
exports.register_user = async function (req, res) {
  try {
    //user input
    const { userName, email, password } = req.body;
    console.log("step 1");
    // Validate user input
    if (!(userName && email && password)) {
      throw "All input is required";
    }
    const oldUser = await register.findOne({ email });

    if (oldUser) {
      throw "user exist";
    }
    console.log("step 2");
    let encryptedPassword = await bcrypt.hash(password, 10);
    let user = new register({
      userName,
      email,
      password: encryptedPassword,
    });
    console.log("step 3");
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: 400000,
      }
    );
    console.log("step 4");
    // save user token
    user.token = token;
    console.log("Step 5");
    // return new user
    res.status(200).json(user);
    user.save();
  } catch (err) {
    res.json(err);
  }
};

//login user && admin
exports.Login = async function (req, res) {
  console.log("login api called");
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const user = await register.findOne({ email });
    if (!user) {
      res.json("user not found");
    }
    if (
      user === null ||
      (await bcrypt.compare(password, user.password)) === false
    ) {
      res.status(400).send("Invalid Credentials");
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: 4000000,
        }
      );
      req.user = register;
      user.token = token;
      res.status(200).json(user);
      const userToekn = user.token;
      const userId = user.id;
    } else {
      res.status(200).json({ msg: "password not match!" });
    }
  } catch (err) {
    console.log("err", err);
    res.json(err.message);
  }

  console.log("executed");
};

//admin schema
exports.register_admin = async function (req, res) {
  try {
    //user input
    const { fullName, email, password } = req.body;
    console.log("step 1");
    // Validate user input
    if (!(fullName && email && password)) {
      throw "All input is required";
    }
    const oldUser = await register.findOne({ email });

    if (oldUser) {
      throw "user exist";
    }
    console.log("step 2");
    let encryptedPassword = await bcrypt.hash(password, 10);
    let user = new register({
      fullName,
      email,
      password: encryptedPassword,
    });
    console.log("step 3");
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: 400000,
      }
    );
    console.log("step 4");
    // save user token
    user.token = token;
    console.log("Step 5");
    // return new user
    res.status(200).json(user);
    user.save();
  } catch (err) {
    res.json(err);
  }
};

//user registration by admin panel only
exports.New_user = async function (req, res) {
  try {
    //user input
    const { fullName, email, password, position } = req.body;
    console.log("step 1");
    // Validate user input
    if (!(fullName && email && password)) {
      throw "All input is required";
    }
    const oldUser = await register.findOne({ email });

    if (oldUser) {
      throw "user exist";
    }
    console.log("step 2");
    let encryptedPassword = await bcrypt.hash(password, 10);
    let user = new register({
      admin: false,
      fullName,
      email,
      position,
      password: encryptedPassword,
    });
    console.log("step 3");
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: 400000,
      }
    );
    console.log("step 4");
    // save user token
    user.token = token;
    console.log("Step 5");
    // return new user
    res.status(200).json(user);
    user.save();
  } catch (err) {
    res.json(err);
  }
};

//admin login
exports.adminLogin = async function (req, res) {
  console.log("login api called");
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const user = await admin.findOne({ email });

    if (
      user === null ||
      (await bcrypt.compare(password, user.password)) === false
    ) {
      res.status(400).send("Invalid Credentials");
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: 4000000,
        }
      );
      req.user = admin;
      user.token = token;
      res.status(200).json(user);
      const userToekn = user.token;
      const userId = user.id;
    } else {
      res.status(200).json({ msg: "password not match!" });
    }
  } catch (err) {
    console.log("err", err);
    res.json(err.message);
  }

  console.log("executed");
};
//get all employees
exports.Employees = async function (req, res) {
  try {
    const all_users_data = await register
      .find()
      .select([
        "fullName",
        "email",
        "number",
        "position",
        "manager",
        "office",
        "profile_pic",
      ]);
    res.send(all_users_data);
  } catch (error) {
    res.send(error);
  }
};

//get particular task
exports.GetTasks = async function (req, res, next) {
  try {
    const userTask = await toDo.find({ addMember: req.params.id });
    res.json(userTask);
  } catch (error) {
    next(error);
  }
};

//update particular task
exports.UpdateTask = async function (req, res) {
  try {
    const updatedTask = await toDo.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { done: true } },
      { new: true }
    );

    res.send(updatedTask);
  } catch (error) {
    res.next(error);
  }
};

exports.updateProfile = async function (req, res, next) {
  try {
    const {
      fullName,
      number,
      Gender,
      DOB,
      Address,
      City,
      Country,
      Postal,
      Bank_name,
      Account_name,
      Account_no,
      Branch,
    } = await req.body;
    console.log(req.params.id);
    const userInfo = await register.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          fullName: fullName,
          number: number,
          Info: {
            DOB: DOB,
            Gender: Gender,
            Address: {
              Address: Address,
              City: City,
              Country: Country,
              Postal: Postal,
            },
            Bank: {
              Bank_name: Bank_name,
              Account_name: Account_name,
              Account_no: Account_no,
              Branch: Branch,
            },
          },
        },
      },
      { new: true }
    );
    res.json(userInfo);
    next();
  } catch (error) {
    res.json(error.message);
  }
};

//my profile
exports.MyProfile = async function (req, res, next) {
  try {
    const myprofile = await register.findById(req.params.id);
    res.json(myprofile);
  } catch (error) {
    res.json(error);
  }
};

//get admin profile
exports.MyAdminProfile = async function (req, res, next) {
  try {
    const myprofile = await admin.findById(req.params.id);
    res.json(myprofile);
  } catch (error) {
    res.json(error);
  }
};

exports.date = async function (req, res, next) {
  try {
    const userDate = await register.find().select("Info.DOB");
    res.json(userDate);
    next();
  } catch (error) {
    next(error);
  }
};

//testing authorization
exports.auth = function (req, res) {
  res.status(200).send("Welcome to the BLACK PEARL site ");
};
