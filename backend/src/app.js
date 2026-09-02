require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
connectDB();

app.use(express.json());
app.use(cors());

// ===== DEBUG MIDDLEWARE =====
app.use((req, res, next) => {
  console.log("Incoming Request:");
  console.log(req.method, req.originalUrl);
  next();
});
// ============================

const recommendRoutes = require("./routes/recommendRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const marketRoutes = require("./routes/marketRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const fertilizerRoutes = require("./routes/fertilizerRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const yieldRoutes = require("./routes/yieldRoutes");
const soilRoutes = require("./routes/soilRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const exportRoutes = require("./routes/exportRoutes");

app.use("/api/calendar", calendarRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/fertilizer", fertilizerRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api", recommendRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/yield", yieldRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/export", exportRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});