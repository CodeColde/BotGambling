var http = require('http');

http.createServer((req, res) => {
  res.write("Good evening, demon");
  res.end();
}).listen(8080);