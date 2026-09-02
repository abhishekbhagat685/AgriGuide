const ALLOWED_SORT_FIELDS = ["modal_price", "min_price", "max_price", "arrival_date"];
const ALLOWED_ORDERS = ["asc", "desc"];

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

// Accepts "YYYY-MM-DD" from the client and converts to a Date for comparison.
const parseISODate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const validateMarketQuery = (req, res, next) => {
  const errors = [];
  const {
    state,
    district,
    commodity,
    market,
    minPrice,
    maxPrice,
    fromDate,
    toDate,
    sortBy,
    order,
    page,
    limit,
  } = req.query;

  // --- pagination ---
  let parsedPage = DEFAULT_PAGE;
  if (page !== undefined) {
    parsedPage = Number(page);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      errors.push("`page` must be a positive integer");
    }
  }

  let parsedLimit = DEFAULT_LIMIT;
  if (limit !== undefined) {
    parsedLimit = Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      errors.push("`limit` must be a positive integer");
    } else if (parsedLimit > MAX_LIMIT) {
      errors.push(`\`limit\` cannot exceed ${MAX_LIMIT}`);
    }
  }

  // --- sorting ---
  let parsedSortBy;
  if (sortBy !== undefined) {
    if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
      errors.push(`\`sortBy\` must be one of: ${ALLOWED_SORT_FIELDS.join(", ")}`);
    } else {
      parsedSortBy = sortBy;
    }
  }

  let parsedOrder = "asc";
  if (order !== undefined) {
    const lower = String(order).toLowerCase();
    if (!ALLOWED_ORDERS.includes(lower)) {
      errors.push(`\`order\` must be one of: ${ALLOWED_ORDERS.join(", ")}`);
    } else {
      parsedOrder = lower;
    }
  }

  // --- price range ---
  let parsedMinPrice;
  if (minPrice !== undefined) {
    parsedMinPrice = Number(minPrice);
    if (Number.isNaN(parsedMinPrice) || parsedMinPrice < 0) {
      errors.push("`minPrice` must be a non-negative number");
    }
  }

  let parsedMaxPrice;
  if (maxPrice !== undefined) {
    parsedMaxPrice = Number(maxPrice);
    if (Number.isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
      errors.push("`maxPrice` must be a non-negative number");
    }
  }

  if (
    parsedMinPrice !== undefined &&
    parsedMaxPrice !== undefined &&
    !Number.isNaN(parsedMinPrice) &&
    !Number.isNaN(parsedMaxPrice) &&
    parsedMinPrice > parsedMaxPrice
  ) {
    errors.push("`minPrice` cannot be greater than `maxPrice`");
  }

  // --- date range ---
  let parsedFromDate;
  if (fromDate !== undefined) {
    parsedFromDate = parseISODate(fromDate);
    if (!parsedFromDate) errors.push("`fromDate` must be a valid date in YYYY-MM-DD format");
  }

  let parsedToDate;
  if (toDate !== undefined) {
    parsedToDate = parseISODate(toDate);
    if (!parsedToDate) errors.push("`toDate` must be a valid date in YYYY-MM-DD format");
  }

  if (parsedFromDate && parsedToDate && parsedFromDate > parsedToDate) {
    errors.push("`fromDate` cannot be after `toDate`");
  }

  // --- basic string filters (just guard against empty strings) ---
  [
    ["state", state],
    ["district", district],
    ["commodity", commodity],
    ["market", market],
  ].forEach(([key, value]) => {
    if (value !== undefined && String(value).trim() === "") {
      errors.push(`\`${key}\` cannot be empty`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors,
    });
  }

  req.marketQuery = {
    state,
    district,
    commodity,
    market,
    minPrice: parsedMinPrice,
    maxPrice: parsedMaxPrice,
    fromDate: parsedFromDate,
    toDate: parsedToDate,
    sortBy: parsedSortBy,
    order: parsedOrder,
    page: parsedPage,
    limit: parsedLimit,
  };

  next();
};

module.exports = validateMarketQuery;