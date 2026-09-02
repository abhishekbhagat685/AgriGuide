# 🌱 AgriGuide

> **An agriculture-focused decision-support platform that helps farmers make better farming decisions through crop recommendations, soil analysis, disease detection, fertilizer guidance, crop calendars, weather information, and agricultural analytics.**

---

## 📌 Overview

**AgriGuide** is a full-stack agriculture web application designed to bring multiple farming-related services into a single platform.

The application provides farmers with tools for:

* 🌾 Crop recommendation
* 🧪 Soil analysis and recommendations
* 🦠 Plant disease detection
* 🌱 Fertilizer guidance
* 🌦️ Weather information
* 📅 Crop calendar management
* 💰 Market information
* ⭐ Favorite crops
* 👤 User profile management
* 🤖 Agriculture-focused chatbot
* 📊 Agricultural analytics
* 🔐 Secure authentication and role-based access
* 🛠️ Admin management and dashboard

The project combines a **React frontend**, **Node.js/Express backend**, **MongoDB database**, and **Python-based AI components** to provide an integrated agriculture-support platform.

---

## 🎯 Problem Statement

Farmers often need to make decisions about crop selection, soil health, fertilizer usage, plant diseases, weather conditions, and crop management.

These decisions can require information from multiple sources.

**AgriGuide aims to provide these functionalities through a single platform**, helping organize agricultural information and providing decision-support tools in one application.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* User registration
* User login
* Password hashing using **bcrypt**
* JWT-based authentication
* Protected API routes
* Role-based access control
* Admin-specific functionality

### 🌾 Crop Recommendation

* Crop recommendations based on:

  * Soil type
  * Season
* Recommended seed information
* Fertilizer recommendation
* Crop data management

### 🧪 Soil Analysis

Users can provide soil parameters such as:

* Soil type
* Nitrogen
* Phosphorus
* Potassium
* pH
* Moisture

The system analyzes the provided values and generates a soil recommendation.

### 🦠 Disease Detection

* Plant disease analysis
* AI-based disease prediction component
* Disease information
* Confidence information
* Recommended precautions/management information

The AI service is implemented using Python and a trained machine-learning model.

> **Note:** Large trained model files and image datasets are excluded from this repository to keep the GitHub repository lightweight.

### 🌱 Fertilizer Management

* Fertilizer information
* Crop-specific fertilizer recommendations
* Nutrient information including:

  * Nitrogen
  * Phosphorus
  * Potassium
* Fertilizer quantity information

### 🌦️ Weather Information

* Weather information based on location
* Weather API module
* Backend service for weather-related requests

### 💰 Market Information

* Agricultural market information
* Market search functionality
* Backend market service
* Market-related API endpoints

### 📅 Crop Calendar

Farmers can manage crop schedules including:

* Crop
* Season
* Sowing period
* Harvest period
* Crop duration
* Irrigation requirement
* Temperature range
* Rainfall requirement

Supported operations include:

* Add calendar
* View calendars
* View calendar by crop
* Update calendar
* Delete calendar

### ⭐ Favorites

* Add crops to favorites
* View favorite crops
* Remove favorites

### 👤 User Profile

* View user profile
* User-specific data management

### 🤖 Agriculture Chatbot

AgriGuide includes an agriculture-focused chatbot module designed to provide users with farming-related information.

### 📊 Analytics & Dashboard

The application includes analytics functionality for agricultural and application data.

The project also includes a **Power BI dashboard** for analyzing application datasets and generating business-oriented insights.

### 🛠️ Admin Features

Admin functionality includes management and monitoring of application data such as:

* Users
* Crops
* Fertilizers
* Diseases
* Soil analyses
* Crop calendars
* Dashboard analytics

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Farmer         │
                    │      / Admin        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌─────────────┐   ┌─────────────┐
       │ MongoDB    │   │ Python AI   │   │ External /  │
       │ Database   │   │ Services    │   │ API Modules │
       └────────────┘   └─────────────┘   └─────────────┘
```

---

## 🧰 Tech Stack

### Frontend

* **React.js**
* **Vite**
* JavaScript
* CSS
* Axios

### Backend

* **Node.js**
* **Express.js**
* REST APIs
* CORS
* dotenv
* Multer

### Database

* **MongoDB**
* **Mongoose**
* MongoDB Atlas

### Authentication & Security

* **JWT**
* **bcrypt**
* Role-based authorization
* Protected API routes

### AI / Machine Learning

* **Python**
* Machine-learning model for plant disease detection
* Python-based crop yield prediction component

### Data Analytics

* **Power BI**
* JSON / CSV datasets
* Data cleaning and transformation
* Interactive dashboards

### Development Tools

* Visual Studio Code
* Git
* GitHub
* MongoDB Compass
* Thunder Client

---

## 📂 Project Structure

```text
AgriGuide/
│
├── backend/
│   │
│   ├── ai_service/
│   │   ├── app.py
│   │   ├── predict.py
│   │   └── train.py
│   │
│   ├── yield_ai/
│   │   ├── app.py
│   │   ├── train.py
│   │   └── requirements.txt
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── package.json
│   └── package-lock.json
│
├── datasets/
│   └── cropData.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── YieldPredictor.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔌 Major API Modules

The backend is organized into modular REST API routes.

| Module              | Base Route        |
| ------------------- | ----------------- |
| Authentication      | `/api/auth`       |
| Crop Recommendation | `/api`            |
| Weather             | `/api/weather`    |
| Market              | `/api/market`     |
| Profile             | `/api/profile`    |
| Favorites           | `/api/favorites`  |
| Fertilizer          | `/api/fertilizer` |
| Disease             | `/api/disease`    |
| Crop Calendar       | `/api/calendar`   |
| Soil Analysis       | `/api/soil`       |
| Yield Prediction    | `/api/yield`      |
| Chatbot             | `/api/chatbot`    |
| Dashboard           | `/api/dashboard`  |
| Admin               | `/api/admin`      |
| Analytics           | `/api/analytics`  |
| Data Export         | `/api/export`     |

---

## 🔑 Example API Operations

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Crop Recommendation

```text
POST /api/recommend
GET /api/allcrops
```

### Soil Analysis

```text
POST /api/soil/add
GET /api/soil
GET /api/soil/:id
PUT /api/soil/:id
DELETE /api/soil/:id
```

### Crop Calendar

```text
POST /api/calendar
GET /api/calendar
GET /api/calendar/:id
PUT /api/calendar/:id
DELETE /api/calendar/:id
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abhishekbhagat685/AgriGuide.git
cd AgriGuide
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit your `.env` file or database credentials to GitHub.

### 4. Start the Backend

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The frontend will be available through the Vite development server.

---

## 📊 Power BI Analytics

AgriGuide also includes a Power BI analytics component.

The dashboard analyzes application-related datasets such as:

* Users
* Crops
* Fertilizers
* Diseases
* Soil analyses
* Crop calendars

### Dashboard KPIs

The current project dataset used for the dashboard contains metrics such as:

* Total Users
* Total Farmers
* Total Admins
* Total Crops
* Total Fertilizers
* Total Disease Analyses
* Total Soil Analyses
* Total Crop Calendars

The dashboard also includes interactive analysis using filters/slicers such as **Crop** and **Season**.

---

## 🔒 Security Considerations

The project implements several security practices:

* Passwords are hashed using bcrypt.
* JWT tokens are used for authentication.
* Protected routes require authentication.
* Admin routes use role-based authorization.
* Sensitive environment variables are stored in `.env`.
* `.env` is excluded through `.gitignore`.
* Large ML datasets and generated Python cache files are excluded from Git.

---

## 🚀 Future Enhancements

Potential future improvements include:

* 📱 Mobile application for farmers
* 🌐 Multi-language support
* 🗣️ Voice-based agricultural assistant
* 🤖 More advanced AI-based crop recommendations
* 🌦️ Improved real-time weather integration
* 💰 More comprehensive agricultural market-price integration
* 🛰️ Satellite-based crop monitoring
* 📈 Advanced crop yield forecasting
* 🔔 Weather and crop-management alerts
* ☁️ Cloud deployment
* 👨‍🌾 Personalized farmer recommendations
* 📊 More advanced predictive analytics

---

## 🎓 Project Objectives

The major objectives of AgriGuide are to:

1. Centralize important agricultural information.
2. Provide crop recommendations based on soil and season.
3. Assist farmers with soil and fertilizer decisions.
4. Support plant disease identification.
5. Provide crop scheduling information.
6. Provide weather and market-related information.
7. Provide analytics for agricultural and application data.
8. Implement secure authentication and role-based access.
9. Integrate AI/ML components into an agriculture-focused application.

---

## 👨‍💻 Developer

**Abhishek Kumar Bhagat**

B.Tech Student | Data Analytics | Full-Stack Development | AI/ML

### Connect

* 💼 LinkedIn: https://www.linkedin.com/in/abhishek-kumar-bhagat-b66758315/
* 🐙 GitHub: https://github.com/abhishekbhagat685
* 💻 LeetCode: https://leetcode.com/u/abhishekkumarbgt/

---

## ⭐ Project Highlights

**AgriGuide demonstrates practical experience with:**

```text
React + Vite
       ↓
Node.js + Express
       ↓
REST APIs
       ↓
MongoDB + Mongoose
       ↓
JWT + bcrypt
       ↓
Python AI/ML Services
       ↓
Power BI Analytics
```

The project combines **full-stack development, database management, authentication, REST API development, AI/ML integration, and data analytics** into a single agriculture-focused application.

---

## 📄 License

This project is developed for educational and portfolio purposes.
