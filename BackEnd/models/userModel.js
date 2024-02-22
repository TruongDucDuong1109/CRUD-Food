const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isBlocked: { type: Boolean, default: false },
  cart: { type: Array, default: [] },
  address: { type: String },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  refreshToken: { type: String },
  passwordChangedAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
}, {
  timestamps: true
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
   const isPassword =  await bcrypt.compare(enteredPassword, this.password);
   console.log(isPassword); 
   return isPassword;
};


userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
  return resettoken;
};



// Đăng ký mô hình 'User' trước khi sử dụng
// const User = mongoose.model("user", userSchema, "infousers");


module.exports = mongoose.model( "User", userSchema,"infousers"  );
