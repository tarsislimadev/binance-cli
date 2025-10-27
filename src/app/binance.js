const API_URL = 'https://api2.binance.com/api/v3'

const request = async (method, path, body = null) => {
  return await fetch(`${API_URL}${path}`, { method, body: method == 'GET' ? null : body }).then(r => r.json())
}

const path4params = (path, params = {}) => {
  return `${path}?${Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')}`
}

const binance = {
  api: {
    v3: {
      ticker: {
        price: async (symbol) => await request('GET', path4params('/ticker/price', { symbol })),
        historicalTrades: async (symbol) => await request('GET', path4params('/historicalTrades', { symbol })),
        klines: async (symbol, interval = '1m') => await request('GET', path4params('/klines', { symbol, interval })),
      }
    }
  }
}

module.exports = { binance }
