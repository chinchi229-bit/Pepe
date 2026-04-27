/**
 * Servidor RoboFut 3v3
 * Sirve el juego web y gestiona conexiones de ESP32
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Almacenar conexiones de robots ESP32
const robotConnections = new Map();
const gameState = {
    robots: [],
    ball: { x: 0, z: 0 },
    scoreBlue: 0,
    scoreRed: 0,
    gameTime: 300
};

// ==================
// RUTAS HTTP
// ==================

// Servir página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'robofut_game.html'));
});

// Servir archivos estáticos
app.get('/robofut_game.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'robofut_game.js'));
});

// API: Obtener estado actual del juego
app.get('/api/game-state', (req, res) => {
    res.json(gameState);
});

// API: Actualizar estado del robot
app.post('/api/robot-update', (req, res) => {
    const { robotId, motorLeft, motorRight, paddleSpeed } = req.body;
    
    // Validar datos
    if (!robotId || motorLeft === undefined || motorRight === undefined) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const motorL = Math.max(0, Math.min(255, motorLeft)) / 255;
    const motorR = Math.max(0, Math.min(255, motorRight)) / 255;
    const paddle = paddleSpeed ? Math.max(-255, Math.min(255, paddleSpeed)) / 255 : 0;

    robotConnections.set(robotId, {
        motorLeft: motorL,
        motorRight: motorR,
        paddleSpeed: paddle,
        lastUpdate: Date.now()
    });

    res.json({ success: true, robotId });
});

// API: Obtener estado de un robot
app.get('/api/robot/:id', (req, res) => {
    const robot = robotConnections.get(req.params.id);
    if (!robot) {
        return res.status(404).json({ error: 'Robot no encontrado' });
    }
    res.json(robot);
});

// API: Lista de robots conectados
app.get('/api/robots', (req, res) => {
    const robots = Array.from(robotConnections.entries()).map(([id, state]) => ({
        id,
        ...state
    }));
    res.json(robots);
});

// ==================
// WebSocket
// ==================

wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[WebSocket] Cliente conectado: ${clientIp}`);

    let robotId = null;

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            // Mensaje de identificación
            if (message.type === 'identify') {
                robotId = message.robotId;
                console.log(`[WebSocket] Robot identificado: ${robotId}`);
                
                ws.send(JSON.stringify({
                    type: 'ready',
                    message: `Robot ${robotId} conectado`
                }));
            }

            // Actualización de estado del robot
            if (message.type === 'robot-update' && robotId) {
                robotConnections.set(robotId, {
                    motorLeft: Math.max(0, Math.min(1, message.motorLeft || 0)),
                    motorRight: Math.max(0, Math.min(1, message.motorRight || 0)),
                    paddleSpeed: Math.max(-1, Math.min(1, message.paddleSpeed || 0)),
                    lastUpdate: Date.now()
                });
            }

            // Solicitud de estado del juego
            if (message.type === 'get-game-state') {
                ws.send(JSON.stringify({
                    type: 'game-state',
                    data: gameState
                }));
            }

        } catch (error) {
            console.error(`[WebSocket] Error al procesar mensaje: ${error.message}`);
        }
    });

    ws.on('close', () => {
        console.log(`[WebSocket] Cliente desconectado: ${robotId || clientIp}`);
        if (robotId) {
            robotConnections.delete(robotId);
        }
    });

    ws.on('error', (error) => {
        console.error(`[WebSocket] Error: ${error.message}`);
    });
});

// ==================
// SERVIDOR
// ==================

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🤖 ROBOFUT 3v3 VIRTUAL SIMULATOR 🤖   ║
╚════════════════════════════════════════════╝

📡 Servidor iniciado en puerto ${PORT}

🌐 Acceso web: http://localhost:${PORT}

🎮 API REST:
  GET  /api/game-state        - Estado actual del juego
  GET  /api/robots            - Lista de robots conectados
  GET  /api/robot/:id         - Estado de robot específico
  POST /api/robot-update      - Actualizar robot

🔌 WebSocket: ws://localhost:${PORT}
  Identificación:
    { "type": "identify", "robotId": "BLUE_1" }
  
  Actualizar robot:
    { "type": "robot-update", "motorLeft": 255, "motorRight": 255, "paddleSpeed": 100 }
  
  Obtener estado:
    { "type": "get-game-state" }

📝 Documentación: Ver ROBOFUT_README.md
    `);
});

// Manejo de señales
process.on('SIGINT', () => {
    console.log('\n\n[Server] Apagando servidor...');
    server.close(() => {
        console.log('[Server] Servidor cerrado');
        process.exit(0);
    });
});

// Limpiar conexiones inactivas cada 10 segundos
setInterval(() => {
    const now = Date.now();
    const timeout = 10000; // 10 segundos

    for (let [robotId, state] of robotConnections.entries()) {
        if (now - state.lastUpdate > timeout) {
            console.log(`[Server] Robot ${robotId} timeout (inactivo 10s)`);
            robotConnections.delete(robotId);
        }
    }
}, 10000);
