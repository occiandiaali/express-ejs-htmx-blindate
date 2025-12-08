import express from "express";
import * as meetings from "../controllers/meetingsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateMeeting } from "../middleware/validation.js";

const router = express.Router();

router.get("/", requireAuth, meetings.indexMyMeetings);
router.get("/new/:username", requireAuth, meetings.newForm);
router.post("/", requireAuth, validateMeeting, meetings.create);
router.get("/:id", requireAuth, meetings.show);
router.post("/:id/delete", requireAuth, meetings.destroy);
router.get("/:id/join", requireAuth, meetings.join);

export default router;
