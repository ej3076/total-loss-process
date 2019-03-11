'use strict';

const __STATE = new Map();

module.exports = {
  __STATE,
  async getStateItem(address) {
    if (__STATE.has(address)) {
      return {
        data: __STATE.get(address),
        head: '',
        link: '',
      };
    }
    throw new Error('Nonexistant key');
  },
  async getState() {
    return Promise.resolve({
      data: [...__STATE.entries()].map(([address, data]) => ({
        address,
        data,
      })),
      head: '',
      link: '',
      paging: {
        limit: null,
        start: null,
      },
    });
  },
  async getStatus() {},
  async sendBatches() {
    return Promise.resolve(JSON.stringify({ link: '' }));
  },
  async pingBatchResponse() {
    return Promise.resolve();
  },
};
