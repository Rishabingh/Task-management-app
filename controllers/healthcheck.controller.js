import { ApiResponse } from "../utils/api-response.js"

const healthCheck = (req, res, next) => {
  res.status(200).json(new ApiResponse(200, "", "server is running"));
  next()
}

export { healthCheck }