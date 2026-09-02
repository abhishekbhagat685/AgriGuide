const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    res.json({
      city: response.data.name,
      temperature: response.data.main.temp + "°C",
      humidity: response.data.main.humidity + "%",
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed + " m/s"
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Weather data not found"
    });
  }
});

module.exports = router;