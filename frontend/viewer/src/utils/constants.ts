export const API_URL = process.env.API_URL || 'http://localhost:8080';

export const WS_URL = process.env.WS_URL || 'ws://localhost:8008/subscriptions';

export const BLANK_CLAIM: Readonly<Protos.Claim> = Object.freeze({
  status: 0,
  created: '2019-01-01T00:00:00.000Z',
  modified: '2019-01-01T00:00:00.000Z',
  date_of_loss: '2019-01-01T00:00:00.000Z',
  insurer: {
    name: '',
    deductible: 0,
    has_gap: false,
  },
  vehicle: {
    miles: 0,
    location: '',
    vin: '',
  },
  files: [],
});
