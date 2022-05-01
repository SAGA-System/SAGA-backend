const express = require('express');
const app = express();

// routes
const authRoutes = require('./src/routes/auth')
const institutionRoutes = require('./src/routes/institution')
const classRoutes = require('./src/routes/class')
const teachersRoutes = require('./src/routes/teachers')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/institution', institutionRoutes)
app.use('/class', classRoutes)
app.use('/teacher', teachersRoutes)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    return res.status(200)
  }

  next()
})

app.use((next) => {
  const err = new Error('Rota não encontrada')
  err.status = 404
  next(err)
})

app.use((err, res) => {
  res.status(err.status || 500)
  return res.send({
    error: {
      message: err.message
    }
  })
})

module.exports = app;
