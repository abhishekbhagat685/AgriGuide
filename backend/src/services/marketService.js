const axios = require("axios");
const MarketSearch = require("../models/MarketSearch");

// The data.gov.in Agmarknet resource only supports exact-match `filters[field]`
// and a `limit`/`offset`. It does not reliably support price-range filters or
// server-side sorting, so we pull a bounded batch matching the exact-match
// filters, then filter/sort/paginate locally.

const RESOURCE_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const MAX_EXTERNAL_RECORDS = 1000;

// Dataset dates arrive as "DD/MM/YYYY" strings.
const parseArrivalDate = (value) => {
  if (!value) return null;

  const [day, month, year] = value.split("/").map(Number);

  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
};

const parsePrice = (value) => {
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const fetchRawRecords = async ({
  state,
  district,
  commodity,
  market,
}) => {
  const params = {
    "api-key": process.env.MARKET_API_KEY,
    format: "json",
    limit: MAX_EXTERNAL_RECORDS,
  };

  if (state) params["filters[state]"] = state;
  if (district) params["filters[district]"] = district;
  if (commodity) params["filters[commodity]"] = commodity;
  if (market) params["filters[market]"] = market;

  const response = await axios.get(RESOURCE_URL, { params });

  return response.data.records || [];
};

const applyLocalFilters = (
  records,
  { minPrice, maxPrice, fromDate, toDate }
) => {
  return records.filter((record) => {
    if (minPrice !== undefined || maxPrice !== undefined) {
      const modalPrice = parsePrice(record.modal_price);

      if (modalPrice === null) return false;

      if (minPrice !== undefined && modalPrice < minPrice) return false;

      if (maxPrice !== undefined && modalPrice > maxPrice) return false;
    }

    if (fromDate || toDate) {
      const arrivalDate = parseArrivalDate(record.arrival_date);

      if (!arrivalDate) return false;

      if (fromDate && arrivalDate < fromDate) return false;

      if (toDate && arrivalDate > toDate) return false;
    }

    return true;
  });
};

const applySort = (records, { sortBy, order }) => {
  if (!sortBy) return records;

  const direction = order === "desc" ? -1 : 1;

  return [...records].sort((a, b) => {
    let valA;
    let valB;

    if (sortBy === "arrival_date") {
      valA = parseArrivalDate(a.arrival_date);
      valB = parseArrivalDate(b.arrival_date);
    } else {
      valA = parsePrice(a[sortBy]);
      valB = parsePrice(b[sortBy]);
    }

    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    if (valA < valB) return -1 * direction;

    if (valA > valB) return 1 * direction;

    return 0;
  });
};

const paginate = (records, { page, limit }) => {
  const total = records.length;

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const start = (page - 1) * limit;

  const data = records.slice(start, start + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

/**
 * Fetches market data and stores search history.
 */

const fetchMarketData = async (query, userId) => {
  const raw = await fetchRawRecords(query);

  // Save search history
  if (userId) {
    await MarketSearch.create({
      user: userId,
      commodity: query.commodity || "",
      state: query.state || "",
      district: query.district || "",
    });
  }

  const filtered = applyLocalFilters(raw, query);

  const sorted = applySort(filtered, query);

  return paginate(sorted, query);
};

module.exports = {
  fetchMarketData,
};