const http = require('http');

const server = http.createServer((reg, res) => {
  res.end('Voilà la réponse du serveur !!')
});

server.listen(process.env.PORT || 3000);
