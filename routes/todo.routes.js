import { Router } from "express";
import {
  sendTodo, 
  saveTodo,
  deleteTodo,
  updateTodo
} from '../controllers/todo.controller.js'
import { verifyingJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/get").get(verifyingJwt, sendTodo);
router.route("/save").post(verifyingJwt, saveTodo);
router.route("/delete").delete(verifyingJwt, deleteTodo);
router.route("/update").patch(verifyingJwt, updateTodo);

export default router