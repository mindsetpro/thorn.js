// ThornClient.js
const http = require('http');
const url = require('url');
const querystring = require('querystring');

class ThornClient {
  constructor(options) {
    this.prefix = options.prefix || '!';
    this.commands = new Map();
  }

  registerCommand(commandName, callback) {
    this.commands.set(commandName, callback);
  }

  start(token) {
    const server = http.createServer((req, res) => this.handleRequest(req, res));
    server.listen(3000, () => {
      console.log('Thorn.js is listening on port 3000');
    });

    // Simulate bot starting and handling events
    // In a real scenario, you would need to implement WebSocket handling
    setTimeout(() => this.handleEvent({ type: 'READY' }), 1000);

    // In a real scenario, you would use the bot token for authentication
    // This is a simplified example; don't expose your token like this in production
    console.log(`Bot logged in with token: ${token}`);
  }

  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url);
    const path = parsedUrl.pathname;
    const query = querystring.parse(parsedUrl.query);

    if (path === '/interactions' && req.method === 'POST') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const payload = JSON.parse(body);
        this.handleInteraction(payload, res);
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }

  handleInteraction(interaction, res) {
    if (interaction.type === 1) {
      // Acknowledge a ping
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ type: 1 }));
    } else if (interaction.type === 2) {
      // Handle command interaction
      const commandName = interaction.data.name;
      const command = this.commands.get(commandName);

      if (command) {
        command(interaction, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Command not found');
      }
    }
  }
}

module.exports = ThornClient;
