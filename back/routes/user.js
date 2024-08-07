import express from "express";
const router = express.Router();
import * as userCtrl from "../controllers/user.js";

router.get("/users/:id", userCtrl.getById);

export default router;
