function validateLoginPayload(req, res, next) {
  const {username, password} = req.body;

  if (!username || !password) return res.status(401).json({ error: "no credentials" });

  next();
}

function validateRegisterPayLoad(req, res, next) {
  const {username, password} = req.body;
  
  if (username === "" || password === "") {
    return res.status(401).json({
      error: "password or username can't be empty"
    });
  }
  next();
}

function validateSendTodoPayLoad(req, res, next) {
    const { username, password } = req.body;
  
  if (username === "" || password === "") {
    return res.status(401).json({
      error: "todo can't be accessed without valid token"
    });
  }
  next();
}

function validateSaveTodoPayLoad(req, res, next) {
    const { username, password } = req.body;
  
  if (username === "" || password === "") {
    return res.status(401).json({
      error: "todo can't be accessed without valid token"
    });
  }
  next();
}

export { 
  validateLoginPayload,
  validateRegisterPayLoad,
  validateSendTodoPayLoad,
  validateSaveTodoPayLoad
 }