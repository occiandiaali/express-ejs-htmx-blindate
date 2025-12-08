import express from "express";
import * as users from "../controllers/usersController.js";
import {
  requireAuth,
  requireOwnerParamId,
} from "../middleware/authMiddleware.js";
import { verifyCsrf } from "../middleware/csrfMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, users.index);
router.get("/:id", requireAuth, users.show);
router.get("/:id/edit", requireAuth, requireOwnerParamId, users.editForm);
router.post("/:id", requireAuth, requireOwnerParamId, verifyCsrf, users.update);
router.post(
  "/:id/delete",
  requireAuth,
  requireOwnerParamId,
  verifyCsrf,
  users.destroy
);
//router.post("/:id/like", requireAuth, verifyCsrf, users.like);
router.post("/:id/toggle-like", requireAuth, verifyCsrf, users.toggleLike);

export default router;
