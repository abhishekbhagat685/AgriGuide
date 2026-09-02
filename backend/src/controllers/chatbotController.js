const chatbotService = require("../services/chatbotService");

exports.chat = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const reply = chatbotService.getResponse(message);

        return res.json({
            success: true,
            userMessage: message,
            botReply: reply
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

};