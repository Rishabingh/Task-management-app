import { ApiResponse } from "../utils/api-response.js"
const checkEmptyField = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      if(!req.body[field]?.trim()) return res.status(401).json(new ApiResponse(401, "", `${field} is empty`)) 
    }
  next()
  }
}

export { checkEmptyField }