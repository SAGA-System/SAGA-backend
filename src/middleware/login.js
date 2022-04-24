const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token, process.env.JWT_KEY)
    req.user = decode
    next()
  } catch (err) {
    return res.status(401).send({
      error: {
        message: 'Falha na autenticação'
      }
    })
  }
}