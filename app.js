require("dotenv").config();
const express = require("express");
const cors = require('cors')
require("./config/database").connect();

const app = express();

app.use(cors())

app.use(express.json());
module.exports = app;
