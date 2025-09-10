const apiHandler = (err, req, res, next) => {
  console.log("error is catched", err.message);

  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message || "something went wrong",
    success: false
  })
}
export default apiHandler;