import express from "express";
const router = express.Router();
import * as refreshToken from "../controllers/refreshToken.js";

router.get("/refresh", refreshToken.handleRefreshToken);

export default router;
