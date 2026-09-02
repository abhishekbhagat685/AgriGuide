const chatbotData = require("../data/chatbotData");

const getResponse = (message) => {

    const text = message.toLowerCase();

    if (text.includes("weather"))
        return chatbotData.weather;

    if (text.includes("fertilizer"))
        return chatbotData.fertilizer;

    if (text.includes("tomato"))
        return chatbotData.tomato;

    if (text.includes("potato"))
        return chatbotData.potato;

    if (text.includes("rice"))
        return chatbotData.rice;

    if (text.includes("disease"))
        return chatbotData.disease;

    if (text.includes("market"))
        return chatbotData.market;

    return "Sorry, I couldn't understand your question.";
};

module.exports = {
    getResponse
};