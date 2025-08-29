import { Router } from "express";
import { validateRegisterPayLoad } from "../middleware/auth.middleware.js";
import { registerUser } from "../controllers/register.controller.js"


const router = Router();

router.route("/register").post(validateRegisterPayLoad, registerUser);

export default router;