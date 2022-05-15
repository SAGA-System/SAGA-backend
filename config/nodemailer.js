const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config()
const hbs = require("nodemailer-express-handlebars")

var transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/views/')
  },
  viewPath: path.resolve('./src/resources/views/'),
  extName: '.html',
}));

module.exports = transport;