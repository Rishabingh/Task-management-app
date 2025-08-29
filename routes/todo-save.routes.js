import Router from 'express';
import { validateSaveTodoPayLoad } from "../middleware/auth.middleware.js";
import { saveTodo } from "../controllers/save.controllers.js"

const router = Router();


router.route("/save").post( validateSaveTodoPayLoad, saveTodo );


export default router;