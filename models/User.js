const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECERET_KEY = process.env.JWT_SECERET_KEY;
const userSchema = Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, default: "customer" },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

userSchema.methods.generateToken -
  async function () {
    const token = await jwt.sign({ _id: this._id }, JWT_SECERET_KEY, {
      expiresIn: "1d",
    });
  };

const User = mongoose.model("User", userSchema);
module.exports = User;
