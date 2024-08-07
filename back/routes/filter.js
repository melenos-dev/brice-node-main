import express from "express";
const router = express.Router();
import * as filterCtrl from "../controllers/filter.js";
import { auth, isAllowed } from "../middleware/authMiddleware.js";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyRoles from "../middleware/verifyRoles.js";

router.get("/:id", verifyRoles([1984, 5150]), filterCtrl.getByCreation);
router.get("/", verifyRoles([1984, 5150]), filterCtrl.getAll);
router.get("/:id", filterCtrl.getById);
router.put("/edit/:id", verifyRoles([1984, 5150]), filterCtrl.edit);
router.delete("/delete/:id", verifyRoles([1984, 5150]), filterCtrl.del);
router.post("/create", verifyRoles([1984, 5150]), filterCtrl.create);
router.post("/relate", verifyRoles([1984, 5150]), filterCtrl.relate);

export default router;
