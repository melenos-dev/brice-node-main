import express from "express";
const router = express.Router();
import * as creationCtrl from "../controllers/creation.js";
import verifyRoles from "../middleware/verifyRoles.js";
import multer from "../middleware/multer-config.js";

router.get("/", creationCtrl.getAll);
router.get("/length", creationCtrl.getTotalLength);
router.get("/:id", creationCtrl.getById);
router.put("/:id/editP", verifyRoles([1984, 5150]), creationCtrl.edit);
router.delete("/:id/delete", verifyRoles([1984, 5150]), creationCtrl.del);
router.post("/create", verifyRoles([1984, 5150]), multer, creationCtrl.create);
router.post(
  "/relateImages",
  verifyRoles([1984, 5150]),
  creationCtrl.relateImages
);

export default router;
