const port = process.env.PORT || 3333;

module.exports = {
  development: {
    baseURL: `http://localhost:${port}/api`
  },
  staging: {
    baseURL: `https://saga-backend.herokuapp.com/api`
  },
  production: {
    baseURL: `http://localhost:${port}`
  }
}