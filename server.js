import { WebSocketServer } from 'ws';

// Initialize server on the exact port your frontend dashboard is tracking
const wss = new WebSocketServer({ port: 8080 });

console.log('👑 ONIKUMA TELEMETRY MODULE ONLINE: Listening on port 8080...');

wss.on('connection', (ws) => {
  console.log('📡 Frontend Command Console linked successfully.');

  // Send a packet to the dashboard every 2 seconds
  const streamInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      const telemetryPacket = {
        // Simulates realistic slight variations for the core metrics
        temperature: (3.8 + Math.random() * 0.8).toFixed(1),
        humidity: Math.floor(62 + Math.random() * 5),
        battery: (84.2 - (Date.now() % 1000) / 5000).toFixed(1),
        co2: Math.floor(405 + Math.random() * 15),
        seal: 'SECURE',
        gps: {
          lat: 19.0760 + (Math.random() - 0.5) * 0.001,
          lng: 72.8777 + (Math.random() - 0.5) * 0.001
        }
      };

      ws.send(JSON.stringify(telemetryPacket));
    }
  }, 2000);

  ws.on('close', () => {
    console.log('❌ Console channel closed.');
    clearInterval(streamInterval);
  });
});