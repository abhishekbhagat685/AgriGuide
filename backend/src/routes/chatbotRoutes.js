const express = require("express");
const router = express.Router();

const chatbotController = require("../controllers/chatbotController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, chatbotController.chat);

module.exports = router;