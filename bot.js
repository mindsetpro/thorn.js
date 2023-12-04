// bot.js
const ThornClient = require('./ThornClient');

const client = new ThornClient({ prefix: '$' });

client.registerCommand('ping', (interaction, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ type: 1, data: { content: 'Pong!' } }));
});

client.start('');
