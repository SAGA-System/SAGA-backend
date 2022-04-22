const http = require('http');
const port = process.env.PORT || 3333;

const app = require('./app')

const server = http.createServer(app);

console.log(`\nlistening on http://localhost:${port}\n`);
server.listen(port);