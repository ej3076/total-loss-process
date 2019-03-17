const API_PORT = process.env.REACT_APP_API_PORT || '8080';
const WS_PORT = process.env.REACT_APP_WS_PORT || '8008';

export const API_URL = `http://localhost:${API_PORT}`;
export const WS_URL = `ws://localhost:${WS_PORT}/subscriptions`;

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
