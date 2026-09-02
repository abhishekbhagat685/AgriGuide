const { fetchMarketData } = require("../services/marketService");

const getMarketPrices = async (req, res) => {
  try {

    // Pass logged-in user's ID to save search history
    const { data, meta } = await fetchMarketData(
      req.marketQuery,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      data,
      meta,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(502).json({
      success: false,
      message: "Failed to fetch market data from upstream source",
    });
  }
};

module.exports = {
  getMarketPrices,
};