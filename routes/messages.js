import express from "express";

import * as messages from "../controllers/messagesController.js";

const router = express.Router();

router.get("/messages/new/:username", messages.newMessageForm);
router.post("/messages/new/:username", messages.sendMessage);

export default router;
