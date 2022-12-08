"use strict";

const auth = require("../middleware/auth");

module.exports = function (app) {
  const UserApi = require("../controller/userController");

  //request for the leave
  app.route("/Leave").post(UserApi.Leave_of);

  //Hr get all the leave list And the Admin who are add can also se the request
  app.route("/getLeaveList").post(UserApi.getLeaveList);

  //to do
  app.route("/Checklist").post(UserApi.toDo);

  //user can see the
  app.route("/my-task").post(UserApi.tasklist);
  //this api is still under progress

  //register
  app.route("/register").post(UserApi.register_user);

  //user login
  app.route("/login").post(UserApi.Login);

  app.route("/employees").get(UserApi.Employees);

  app.route("/tasks/:id").get(auth, UserApi.GetTasks);
};
