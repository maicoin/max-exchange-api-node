const PERIODS = [1, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080]

const SIDES = {
  BUY: 'buy',
  SELL: 'sell'
}

const SORTING_DIRECTIONS = {
  DESC: 'desc',
  ASC: 'asc'
}

const ORD_TYPES = {
  LIMIT: 'limit',
  MARKET: 'market'
}

const DEPOSIT_STATES = {
  SUBMITTING: 'submitting',
  CANCELLED: 'cancelled',
  SUBMITTED: 'submitted',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
  REFUNDED: 'refunded',
  SUSPECT: 'suspect',
  REFUND_CANCELLED: 'refund_cancelled'
}

const WITHDRAWAL_STATES = {
  SUBMITTING: 'submitting',
  SUBMITTED: 'submitted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
  SUSPECT: 'suspect',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  RETRYABLE: 'retryable',
  SENT: 'sent',
  CANCELLED: 'canceled',
  FAILED: 'failed',
  PENDING: 'pending',
  CONFIRMED: 'confirmed'
}

const ORDER_STATES = {
  WAIT: 'wait',
  DONE: 'done',
  CONVERT: 'convert',
  CANCEL: 'cancel'
}

module.exports = { PERIODS, SIDES, SORTING_DIRECTIONS, ORD_TYPES, DEPOSIT_STATES, WITHDRAWAL_STATES, ORDER_STATES }
