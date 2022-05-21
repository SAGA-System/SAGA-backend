const port = process.env.PORT || 3333;

module.exports = {
  development: {
    baseURL: `http://localhost:${port}`
  },
  staging: {
    baseURL: `http://localhost:${port}`
  },
  production: {
    baseURL: `http://localhost:${port}`
  }
}