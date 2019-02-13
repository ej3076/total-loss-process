'use strict';

const { inspect } = require('util');

const winston = require('winston');

module.exports = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.printf(
    ({ level, message, data }) =>
      `[${level.toUpperCase()}]: ${message.replace(/\.*$/, '.')} ${
        data ? inspect({ ...data }, { colors: true, depth: Infinity }) : ''
      }`,
  ),
  transports: [new winston.transports.Console()],
  silent: process.env.NODE_ENV === 'test',
});
