const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

// routes
const authRoutes = require('./src/routes/auth')
const institutionRoutes = require('./src/routes/institution')
const classRoutes = require('./src/routes/class')
const teachersRoutes = require('./src/routes/teachers')
const studentRoutes = require('./src/routes/students')
const permissionRoutes = require('./src/routes/permission')
const rolesRoutes = require('./src/routes/roles')
const evaluationRoutes = require('./src/routes/evaluation')
const bulletinRoutes = require('./src/routes/bulletin')
const schoolCallRoutes = require('./src/routes/schoolCall')
const frequencyRoutes = require('./src/routes/frequency')

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);

  // Pass to next layer of middleware
  next();
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// base routes config
app.use('/api/auth', authRoutes)
app.use('/api/institution', institutionRoutes)
app.use('/api/class', classRoutes)
app.use('/api/teacher', teachersRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/permission', permissionRoutes)
app.use('/api/roles', rolesRoutes)
app.use('/api/evaluation', evaluationRoutes)
app.use('/api/bulletin', bulletinRoutes)
app.use('/api/schoolcalls', schoolCallRoutes)
app.use('/api/frequency', frequencyRoutes)

app.use((req, res, next) => {
  const err = new Error('Rota não encontrada')
  err.status = 404
  next(err)
})

app.use((err, req, res) => {
  res.status(err.status || 500)
  return res.send({
    error: {
      message: err.message
    }
  })
})

module.exports = app;
