const { binance } = require('./binance.js')
const { database } = require('./database.js')

const db = new database('./data')

const ee = new EventTarget()

const SYMBOL = 'BTCBRL'

const saveKlines = async () => {
  const klines = await binance.api.v3.ticker.klines(SYMBOL)
  klines.map(([open_time, open_price, high_price, low_price, close_price, volume, close_time]) => {
    db.in(SYMBOL).newObject(open_time).writeMany({ open_price, high_price, low_price, close_price, volume })
  })
}

saveKlines().finally(() => process.exit(0))
