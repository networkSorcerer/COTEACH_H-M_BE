const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const indexRouter = require("./routes/index");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", indexRouter);
const mongoURI = process.env.LOCAL_DB_ADDRESS;
console.log("MongoDB URI:", process.env.LOCAL_DB_ADDRESS);

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log("DB connection fail", err));

app.listen(process.env.PORT || 5000, () => {
  console.log("server on");
});
