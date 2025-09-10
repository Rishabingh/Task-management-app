import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken';
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.models.js";

export const verifyingJwt = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if(!token) throw new ApiError(401, "looks like token expired, try to refresh the token");

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET);
    if(!decodedToken) throw new ApiError(400, "unathorized access")

    const user = await User.findById(decodedToken._id);
    if(!user) throw new ApiError(400, "unathorized access")

    req.user = user
    next()
  } catch (error) {
    throw new ApiError(403, "invalid token, something went wrong at auth.middleware.js")
  }
})