import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    required: [true, "username is required"]
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, "email is required"],
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  password: {
    type: String,
    required: [true, "password is required"]
  },
  refreshToken: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: "https://placehold.co/100"
  },
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 6);
  next()
});

userSchema.methods.comparePassword = async function(password) {
  const isMatched = await bcrypt.compare(password, this.password);
  return isMatched;
}

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { _id: this._id,
      username: this.username
    },
    process.env.ACCESS_SECRET,
    {expiresIn: "15m"}
  )
}
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { _id: this._id,
      username: this.username
    },
    process.env.REFRESH_SECRET,
    {expiresIn: "60d"}
  )
}

export const User = mongoose.model("User", userSchema);