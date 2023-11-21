const express = require("express");
var cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
