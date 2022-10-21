const http = require('http');
const port = process.env.PORT || 3333;
require('dotenv').config()

const app = require('./app')

const server = http.createServer(app);

let url

switch (process.env.NODE_ENV) {
  case 'development': {
    url = `http://localhost:${port}/api`
    break;
  }
  case 'staging': {
    url = "https://saga-backend.herokuapp.com/api"
    break;
  }
}

console.log(`\nlistening on ${url}\n`);
server.listen(port);