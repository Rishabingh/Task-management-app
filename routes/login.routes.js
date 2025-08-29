import { Router } from "express";
import {validateLoginPayload} from "../middleware/auth.middleware.js";
import { loginUser } from "../controllers/login.controller.js";

const router = Router();

router.route("/login").post( validateLoginPayload, loginUser);

export default router;