const axios = require('axios')
const urls = require('./baseURLs')
const ENV = process.env.NODE_ENV

const api = axios.create({
  baseURL: urls[ENV].baseURL
});

module.exports = api