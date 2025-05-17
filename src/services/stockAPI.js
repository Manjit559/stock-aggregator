const BASE_URL = 'http://20.244.56.144/evaluation-service/stocks';

export const getAllStocks = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const getStockHistory = async (ticker, minutes) => {
  const res = await fetch(`${BASE_URL}/${ticker}?minutes=${minutes}`);
  const raw = await res.json();

  // Convert API response into an array if necessary
  if (Array.isArray(raw)) return raw;
  if (raw.stock) return [raw.stock];
  return Object.values(raw);
};
