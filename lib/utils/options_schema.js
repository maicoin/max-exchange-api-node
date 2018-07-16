import * as CONSTANT from '../constants'

const periods = CONSTANT.PERIODS // [1, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080]
const sides = Object.values(CONSTANT.SIDES)
const sortingDirections = Object.values(CONSTANT.SORTING_DIRECTIONS)
const ordTypes = Object.values(CONSTANT.ORD_TYPES)
const depositStates = Object.values(CONSTANT.DEPOSIT_STATES)
const withdrawalStates = Object.values(CONSTANT.WITHDRAWAL_STATES)
const orderStates = Object.values(CONSTANT.ORDER_STATES)

const decimalStringMessage = 'should be a string of number'

function decimalStringValidator(val) {
  const number = parseFloat(val)
  return !isNaN(number)
}

function periodValidator(val) {
  return periods.includes(val)
}

const requiredString = { type: String, required: true }
const optionalString = { type: String }
const optionalNumber = { type: Number }
const requiredNumber = { type: Number, required: true }
const sortingOption = { type: String, enum: sortingDirections }
const periodOption = { type: Number, use: { periodValidator }, message: `period should be a valid number in one of the options: ${periods}.` }
const sideOption = { type: String, enum: sides, required: true }
const optionalSideOption = { type: String, enum: sides }
const volumeOption = { type: String, required: true, use: { decimalStringValidator }, message: `volume ${decimalStringMessage}.` }
const priceOption = { type: String, use: { decimalStringValidator }, message: `price ${decimalStringMessage}.` }
const ordTypeOption = { type: String, enum: ordTypes }
const orderOption = { side: sideOption, volume: volumeOption, price: priceOption, ordType: ordTypeOption }
const depositStateOption = { type: String, enum: depositStates }
const withdrawalStateOption = { type: String, enum: withdrawalStates }
const orderStateOption = { type: String, enum: orderStates }

const optionsSchema = {
  orderBook: {
    market: requiredString,
    asksLimit: optionalNumber,
    bidsLimit: optionalNumber
  },
  depth: {
    market: requiredString,
    limit: optionalNumber
  },
  marketTrades: {
    market: requiredString,
    limit: optionalNumber,
    timestamp: optionalNumber,
    from: optionalNumber,
    to: optionalNumber,
    orderBy: sortingOption
  },
  k: {
    market: requiredString,
    limit: optionalNumber,
    period: periodOption,
    timestamp: optionalNumber,
  },
  deposits: {
    currency: optionalString,
    state: depositStateOption,
    limit: optionalNumber,
    offset: optionalNumber,
    from: optionalNumber,
    to: optionalNumber
  },
  deposit: {
    txid: requiredString
  },
  depositAddresses: {
    currency: optionalString
  },
  withdrawals: {
    currency: optionalString,
    state: withdrawalStateOption,
    limit: optionalNumber,
    offset: optionalNumber,
    from: optionalNumber,
    to: optionalNumber
  },
  withdrawal: {
    uuid: requiredString
  },
  orders: {
    market: requiredString,
    state: orderStateOption,
    limit: optionalNumber,
    page: optionalNumber,
    orderBy: sortingOption
  },
  order: {
    id: requiredNumber
  },
  trades: {
    market: requiredString,
    limit: optionalNumber,
    timestamp: optionalNumber,
    from: optionalNumber,
    to: optionalNumber,
    orderBy: sortingOption
  },
  placeOrder: {
    market: requiredString,
    side: sideOption,
    volume: volumeOption,
    price: priceOption,
    ordType: ordTypeOption
  },
  placeOrders: {
    market: requiredString,
    orders: [orderOption]
  },
  cancelOrders: {
    market: optionalString,
    side: optionalSideOption
  },
  cancelOrder: {
    id: requiredNumber
  }
}

export default optionsSchema
