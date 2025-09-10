import { Router } from "express";
import { verifyingJwt } from "../middleware/auth.middleware.js";
import {
  userRegistration,
  userLogin,
  userDeleteAccount,
  userUpdatePassword,
  userUpdateAvatar,
  userUpdateEmail,
  userRefreshToken
} from '../controllers/user.controller.js'
const router = Router();


router.route("/register").post(userRegistration);
router.route("/login").post(userLogin);
router.route("/update-password").patch(verifyingJwt, userUpdatePassword);
router.route("/update-avatar").patch(verifyingJwt, userUpdateAvatar);
router.route("/update-email").patch(verifyingJwt, userUpdateEmail);
router.route("/delete-account").delete(verifyingJwt, userDeleteAccount);
router.route("/refresh").get(userRefreshToken);

export default router;

//