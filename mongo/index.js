import "./loadEnvironment.mjs";
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const routes = require("./routes/index");

app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.use(routes);

app.listen(3002, function () {});
