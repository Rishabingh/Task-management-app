import { Router } from "express";
import { validateSendTodoPayLoad } from "../middleware/auth.middleware.js";
import { sendTodo } from "../controllers/send.controllers.js";


const router = Router();

router.post("/send", validateSendTodoPayLoad, sendTodo);

export default router;