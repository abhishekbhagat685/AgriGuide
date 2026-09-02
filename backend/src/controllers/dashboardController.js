const Disease = require("../models/Disease");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
    try {

        const userId = req.user.id;

        // User Details
        const user = await User.findById(userId).select("name email");

        // All Disease Records
        const history = await Disease.find({ user: userId })
            .sort({ createdAt: -1 });

        const totalPredictions = history.length;

        // Healthy Count
        const healthyCount = history.filter(item =>
            item.disease.toLowerCase().includes("healthy")
        ).length;

        // Diseased Count
        const diseasedCount = totalPredictions - healthyCount;

        // Most Common Disease
        const diseaseFrequency = {};

        history.forEach(item => {
            diseaseFrequency[item.disease] =
                (diseaseFrequency[item.disease] || 0) + 1;
        });

        let mostCommonDisease = "No Prediction";

        if (history.length > 0) {
            mostCommonDisease = Object.keys(diseaseFrequency).reduce((a, b) =>
                diseaseFrequency[a] > diseaseFrequency[b] ? a : b
            );
        }

        // Latest Prediction
        const latestPrediction =
            history.length > 0 ? history[0] : null;

        // Recent 5 Predictions
        const recentPredictions = history.slice(0, 5);

        res.status(200).json({
            success: true,

            dashboard: {
                user,

                totalPredictions,

                healthyCount,

                diseasedCount,

                mostCommonDisease,

                latestPrediction,

                recentPredictions
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
};