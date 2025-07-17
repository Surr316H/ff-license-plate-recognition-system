import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import express from "express";
import { generateMockData } from "./mock-utils.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set();
wss.on("connection", (ws, req) => {
  console.log("New client connected from:", req.socket.remoteAddress);
  clients.add(ws);

  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to License Plate Recognition Server",
      timestamp: new Date(),
    })
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received from client:", data);

      ws.send(
        JSON.stringify({
          type: "echo",
          data: data,
          timestamp: new Date(),
        })
      );
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});

const broadcastData = (data) => {
  const message = JSON.stringify({
    type: "licenseplate",
    data: data,
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

let dataInterval;

const startDataGeneration = () => {
  console.log("Starting data generation...");
  dataInterval = setInterval(() => {
    if (clients.size > 0) {
      const mockData = generateMockData();
      broadcastData(mockData);
      console.log(
        `Sent data to ${clients.size} clients:`,
        mockData.plateNumber
      );
    }
  }, 100);
};

const stopDataGeneration = () => {
  if (dataInterval) {
    clearInterval(dataInterval);
    dataInterval = null;
    console.log("Data generation stopped");
  }
};

startDataGeneration();

// Basic HTTP endpoints
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>License Plate Recognition Server</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .container { max-width: 800px; margin: 0 auto; }
          .data-item { 
            background: #f5f5f5; 
            padding: 10px; 
            margin: 5px 0; 
            border-radius: 5px;
            border-left: 4px solid #007bff;
          }
          .timestamp { color: #666; font-size: 0.9em; }
          .plate-number { font-weight: bold; color: #007bff; }
          #messages { height: 400px; overflow-y: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>License Plate Recognition WebSocket Server</h1>
          <p>WebSocket URL: <code>ws://localhost:3000</code></p>
          <p>Server Status: <span id="status">Connecting...</span></p>
          <h2>Live Data Stream:</h2>
          <div id="messages"></div>
        </div>
        
        <script>
          const ws = new WebSocket('ws://localhost:3000');
          const messagesDiv = document.getElementById('messages');
          const statusSpan = document.getElementById('status');
          
          ws.onopen = function() {
            statusSpan.textContent = 'Connected';
            statusSpan.style.color = 'green';
          };
          
          ws.onmessage = function(event) {
            const message = JSON.parse(event.data);
            
            if (message.type === 'licenseplate') {
              const div = document.createElement('div');
              div.className = 'data-item';
              div.innerHTML = \`
                <div class="plate-number">Plate: \${message.data.plateNumber}</div>
                <div>Type: \${message.data.vehicleType} | Confidence: \${message.data.confidence}%</div>
                <div class="timestamp">ID: \${message.data.id} | \${new Date(message.data.timestamp).toLocaleTimeString()}</div>
              \`;
              messagesDiv.insertBefore(div, messagesDiv.firstChild);
              
              // Keep only last 20 messages
              while (messagesDiv.children.length > 20) {
                messagesDiv.removeChild(messagesDiv.lastChild);
              }
            }
          };
          
          ws.onclose = function() {
            statusSpan.textContent = 'Disconnected';
            statusSpan.style.color = 'red';
          };
          
          ws.onerror = function(error) {
            statusSpan.textContent = 'Error';
            statusSpan.style.color = 'red';
            console.error('WebSocket error:', error);
          };
        </script>
      </body>
    </html>
  `);
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "running",
    connectedClients: clients.size,
    dataGeneration: dataInterval ? "active" : "stopped",
    timestamp: new Date(),
  });
});

process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  stopDataGeneration();

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready at ws://localhost:${PORT}`);
  console.log(`HTTP server ready at http://localhost:${PORT}`);
});

export { app, server, wss };
