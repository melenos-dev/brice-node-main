import express from "express";
const router = express.Router();
import logout from "../controllers/logout.js";
import * as userCtrl from "../controllers/user.js";
import * as auth from "../controllers/auth.js";

router.post("/signup", userCtrl.signup);

router.post("/login", auth.handleLogin);

router.get("/logout", logout.handleLogout);

export default router;
