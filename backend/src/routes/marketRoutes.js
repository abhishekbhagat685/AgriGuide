const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");


const { getMarketPrices } = require("../controllers/marketController");
const validateMarketQuery = require("../middleware/validateMarketQuery");

//router.get("/", validateMarketQuery, getMarketPrices);
router.get("/", auth, validateMarketQuery, getMarketPrices);

module.exports = router;