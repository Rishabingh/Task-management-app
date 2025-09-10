import { User } from "../models/user.models.js";
import { Todo } from "../models/todo.models.js"
import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async (id) => {
  try {
    const user = await User.findById(id)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false});
    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, 'something went wrong while generating access and refresh token')
  }
}

const userRegistration = asyncHandler(async (req, res, next) => {
  const { username, password, email, avatar } = req.body;
  // todo dont allow register with username that have space also add jwt token

  if(!username?.trim() || !password?.trim() || !email?.trim()) throw new ApiError(400, "only avatar field can be empty")

   if (!email.includes("@") || !email.includes(".") || email.length < 6) throw new ApiError(400, "invalid email format")

  if(password.length<4) throw new ApiError(409, "password is too small min length is 5")

    const findUser = await User.findOne({
      $or: [{username}, {email}]
    })
    if(findUser) throw new ApiError(400, "username or email already exsist please login")

  const user = await User.create({username, password, email, avatar})

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

  res.status(201)
  .cookie('accessToken', accessToken, {httpOnly: true, secure: process.env.NODE_ENV==="production"})
  .cookie('refreshToken', refreshToken, {httpOnly: true, secure: process.env.NODE_ENV==="production"})
  .json(new ApiResponse(201, {username: user.username, email: user.email}, "user registered successfully"))
})

const userLogin = asyncHandler(async (req, res, next) => {
  const {loginMethod, password} = req.body

  if (!loginMethod?.trim() || !password?.trim()) throw new ApiError(400, "email or username and password cant be empty for login")

  const user = await User.findOne({
    $or: [{email: loginMethod}, {username: loginMethod}]
  })
  if(!user) throw new ApiError(400, "username or email dont exsist please register")

  const isPasswordValid = await user.comparePassword(password);
  if(!isPasswordValid) throw new ApiError(409, "invalid password")

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)


  res.status(200)
    .cookie('accessToken', accessToken, {httpOnly: true, secure: process.env.NODE_ENV==="production"})
    .cookie('refreshToken', refreshToken, {httpOnly: true, secure: process.env.NODE_ENV==="production"})
    .json(new ApiResponse(200, {username: user.username, email: user.email}, "user login successfully"));
})

const userDeleteAccount = asyncHandler(async (req, res, next) => {
  const {emailOrUsername, password} = req.body

  if (!emailOrUsername?.trim() || !password?.trim()) throw new ApiError(400, "email or username and password cant be empty")

  const user = req.user

  if(!user) throw new ApiError(400, "user not found")

  const isPasswordValid = await user.comparePassword(password);
  if(!isPasswordValid) throw new ApiError(400, "invalid password")

  const userDelete = await User.findByIdAndDelete(user._id)

  if(!userDelete) throw new ApiError(500, "something went wrong")

  res.status(200).json(new ApiResponse(200, {username: user.username}, "account deleted successfully"));

  try {
   await Todo.deleteMany({
    createdBy: user._id
   })
  } catch (error) {
    console.log(`todos of user: ${user.username} are not deleted for some reasons`)
  }

})

const userUpdatePassword = asyncHandler(async(req, res, next) => {
  const {oldPassword, newPassword} = req.body
  if (!oldPassword?.trim() || !newPassword?.trim()) throw new ApiError(400, "things cant be empty"); 

  if(newPassword.length < 8) throw new ApiError(400, "password cant be smaller than 8 character")
  
  const user = req.user
  if(!user) throw new ApiError(400, "user not found");

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if(!isPasswordCorrect) throw new ApiError(400, "old password is wrong try again");

  user.password = newPassword

  await user.save();

  res.status(201).json(new ApiResponse(201, {username: user.username}, "password updated successfully"))
  
})

const userUpdateAvatar = asyncHandler(async (req, res, next) => {
  const { url } = req.body
  if (!url?.trim()) throw new ApiError(400, "url cant be empty"); 
  
  const user = req.user
  if(!user) throw new ApiError(400, "user not found");

  user.avatar = url

  await user.save();

  res.status(201).json(new ApiResponse(201, {username: user.username, avatar: url}, "avatar updated successfully"))
})

const userUpdateEmail = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!password?.trim() || !email?.trim()) throw new ApiError(400, "things cant be empty"); 

  if(password.length < 5 || email.length < 5) throw new ApiError(400, "invalid password")
  
  const user = req.user

  if(!user) throw new ApiError(400, "user not found");

  const isPasswordCorrect = await user.comparePassword(password);

  if(!isPasswordCorrect) throw new ApiError(400, "password is wrong try again");

  user.email = email

  await user.save();

  res.status(201).json(new ApiResponse(201, {email: user.email}, "email updated successfully"))
})

const userRefreshToken = asyncHandler(async (req, res, next) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) throw new ApiError(401, "No refresh token provided");

  let decode;
  try {
    decode = jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Custom code for frontend to detect inactivity
      throw new ApiError(440, "Refresh token expired, please login again");
    } else {
      throw new ApiError(401, "Invalid refresh token");
    }
  }

  const userId = decode._id;
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userId);

  res.status(200)
    .cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    .cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    .json(new ApiResponse(200, "", "Token refreshed successfully"));
});

export { 
  userRegistration,
  userLogin,
  userDeleteAccount,
  userUpdatePassword,
  userUpdateAvatar,
  userUpdateEmail,
  userRefreshToken
 }