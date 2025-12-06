import express from "express";
import * as auth from "../controllers/authController.js";
import { validateLogin, validateRegister } from "../middleware/validation.js";
import { verifyCsrf } from "../middleware/csrfMiddleware.js";

const router = express.Router();

router.get("/login", auth.showLogin);
router.post("/login", verifyCsrf, validateLogin, auth.login);
router.get("/register", auth.showRegister);
router.post("/register", verifyCsrf, validateRegister, auth.register);
router.post("/logout", verifyCsrf, auth.logout);

export default router;
