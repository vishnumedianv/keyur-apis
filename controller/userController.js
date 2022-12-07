"use strict";
const leave = require("../models/leave");
const toDo = require("../models/todo");
const mongoose = require("mongoose");
const register = require("../models/register"),
  auth = require("../middleware/auth"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

exports.Leave_of = async function (req, res) {
  try {
    // Get user inputs
    const { SelectType, Leaves, SelectDate, Note, AddMember } = req.body;

    // Validate user input
    if (!(SelectType && Leaves && SelectDate && Note && AddMember)) {
      res.status(400).send("All input is required");
    }

    let time_of = new leave({
      SelectType,
      Leaves,
      SelectDate,
      Note,
      AddMember,
    });
    time_of.save();
    return res.json({
      data: time_of,
      message: "Record save successful..!",
      code: 200,
    });
  } catch (err) {
    console.log("err.message");
    return res.json({ message: err.message });
  }
};

exports.getLeaveList = async function (req, res) {
  try {
    let leaves;
    if (req.body.AddMember) {
      leaves = await leave.find({});
    } else {
      leaves = await leave.find({});
    }
    if (leaves) {
      return res.json({
        data: leaves,
        message: "Data fetched successful..!",
        code: 200,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};

//To do
exports.toDo = async function (req, res) {
  try {
    const { taskName, taskType, addMember, DueDate, Description } = req.body;

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
      res.status(400).send("All input is required");
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
        expiresIn: "2h",
      }
    );
    console.log("step 4");
    // save user token
    user.token = token;
    console.log("Step 5");
    // return new user
    res.status(201).json(user);
    user.save();
  } catch (err) {
    console.log("error in register user!");
    return res.json({ message: err });
  }
};

//login user && admin
exports.Login = async function (req, res) {
  console.log('login api called')
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const user = await register.findOne({ email });

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
          expiresIn: "2h",
        }
      );
      req.user = register;
      user.token = token;
      res.status(200).json(user);
      const userToekn = user.token;
      const userId = user.id;
      
      var LocalStorage = require('node-localstorage').LocalStorage,
      localStorage = new LocalStorage('./scratch');
      
      localStorage.setItem('token', userToekn);
      localStorage.setItem('userid', userId);
      console.log(localStorage.getItem('token'));
    } else {
      res.status(200).json({ msg: "password not match!" });
    }
  } catch (err) {
    console.log("err", err);
    res.json(err.message);
  }

  console.log('executed')
};

//get all employees
exports.Employees = async function(req, res){
  try {
    const all_users_data = await register.find()
    res.send(all_users_data)
  } catch (error) {
    res.send(error)
  }
};

//get particular task 
exports.GetTasks = async function(req, res){
    try {
        const userTransaction = await toDo.find({ 'addMember': req.params.id })
        res.json(userTransaction)
    } catch (error) {
        next(error)
    }
  
}

//testing authorization
exports.auth = function (req, res) {
  res.status(200).send("Welcome to the BLACK PEARL site ");
};
