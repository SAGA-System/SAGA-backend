'use strict'

const basicPino = require('pino')
const basicPinoLogger = basicPino({ prettyPrint: true })
const expressPino = require('express-pino-logger')({
  logger: basicPinoLogger
})

const logger = expressPino.logger

const log = {};

log.info = function info(message) {
  logger.info(message);
};

log.error = function error(message) {
  logger.error(message);
};

log.debug = function debug(message) {
  logger.debug(message);
};

module.exports = logger