# 📦 Guía de Instalación - RoboFut 3v3

## 🚀 Opción 1: Juego Local (Sin servidor)

Si solo quieres jugar localmente sin necesidad de servidor:

### Pasos:
1. Abre `robofut_game.html` directamente en tu navegador
2. ¡Listo! El juego funciona sin conexión a internet

**Requiere**: Navegador moderno con WebGL

---

## 🖥️ Opción 2: Servidor Node.js (Recomendado)

Para usar el servidor con soporte para ESP32 y WebSocket:

### Prerequisitos:
- **Node.js** 14+ ([Descargar](https://nodejs.org/))
- **npm** (se instala con Node.js)

### Instalación:

1. **Abre terminal en la carpeta del proyecto:**
   ```bash
   cd /Users/estuardmdz16/Desktop/Uni
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor:**
   ```bash
   npm start
   ```

   O en modo desarrollo (con auto-reload):
   ```bash
   npm run dev
   ```

### ¿Qué debería aparecer?
```
╔════════════════════════════════════════════╗
║   🤖 ROBOFUT 3v3 VIRTUAL SIMULATOR 🤖   ║
╚════════════════════════════════════════════╝

📡 Servidor iniciado en puerto 3000

🌐 Acceso web: http://localhost:3000
```

### Acceso:
- **Juego**: http://localhost:3000
- **Servidor corriendo en**: `localhost:3000`

---

## 📱 Conectar ESP32 al Simulador

### Paso 1: Configurar ESP32

1. Descarga Arduino IDE: https://www.arduino.cc/en/software

2. En Arduino IDE, ve a **File → Preferences** y añade esta URL:
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```

3. Instala las librerías (Tools → Manage Libraries):
   - `esp32` (Espressif Systems)
   - `ArduinoJson` (Benoit Blanchon)
   - `WebSocketsClient` (Markus Sattler)

4. Selecciona tu placa ESP32 (Tools → Board → esp32 → Dev Module)

### Paso 2: Configurar el Código

En `robofut_esp32.ino`, edita estas líneas con tus datos:

```cpp
const char* WIFI_SSID = "TU_NOMBRE_WIFI";
const char* WIFI_PASSWORD = "TU_CONTRASEÑA_WIFI";
const char* SERVER_IP = "192.168.1.100";  // IP de tu PC
const char* robotId = "BLUE_1";           // BLUE_1, BLUE_2, BLUE_3, RED_1, etc
```

**Para encontrar tu IP:**
- **macOS**: `System Preferences → Network` o termina: `ifconfig | grep inet`
- **Windows**: Abre PowerShell y escribe: `ipconfig`
- **Linux**: `hostname -I` en terminal

### Paso 3: Subir el Código

1. Conecta el ESP32 a tu computadora por USB
2. En Arduino IDE: **Sketch → Upload**
3. Abre **Serial Monitor** (Tools → Serial Monitor) a velocidad 115200

Deberías ver:
```
RoboFut ESP32 - Inicializando
Conectando WiFi: TU_NOMBRE_WIFI
.....
WiFi conectado!
IP: 192.168.1.xxx
Conectando WebSocket a 192.168.1.100:3000
[WS] Conectado
[WS] Robot listo en el servidor
```

### Paso 4: Probar Conexión

En otra terminal:
```bash
curl http://localhost:3000/api/robots
```

Deberías ver:
```json
[
  {
    "id": "BLUE_1",
    "motorLeft": 0,
    "motorRight": 0,
    "paddleSpeed": 0
  }
]
```

---

## 🎮 Controles Completamente Funcionales

Ahora puedes jugar con:
- ✅ Teclado (WASD + QE)
- ✅ Gamepad (Xbox/PS4)
- ✅ **ESP32 físico** (con los motores reales)

---

## 🔌 Diagrama de Conexiones ESP32

```
ESP32 DEVKIT V1
┌─────────────┐
│             │
│ GPIO32 ─── Motor IZQ IN1
│ GPIO33 ─── Motor IZQ IN2
│ GPIO25 ─── Motor IZQ PWM
│             │
│ GPIO26 ─── Motor DER IN1
│ GPIO27 ─── Motor DER IN2
│ GPIO14 ─── Motor DER PWM
│             │
│ GPIO16 ─── Paleta IN1
│ GPIO17 ─── Paleta IN2
│ GPIO4  ─── Paleta PWM
│             │
│ 5V ─────── +5V (Motores)
│ GND ────── GND (Motores)
│             │
│ (conexión USB para programación)
└─────────────┘
```

### Lista de Componentes:
- ESP32 DevKit V1
- 2x Motor DC (180-300 rpm)
- 1x Motor DC (para paleta)
- 3x Driver Motor (L298N o DRV8833)
- Fuente de alimentación 5V 3A
- Cable USB micro
- Cables de conexión

---

## 🚨 Troubleshooting

### "No se conecta WiFi"
- Verifica el SSID y contraseña
- Asegúrate de que el ESP32 y la PC están en la misma red
- Reinicia el ESP32

### "WebSocket no conecta"
- Verifica que el servidor Node.js esté corriendo
- Comprueba la IP correcta: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
- Intenta pinging a la IP del servidor

### "Motores no se mueven"
- Verifica las conexiones de los motores
- Checa si los drivers tienen alimentación
- Prueba el código de ejemplo en `robofut_esp32.ino`

### "Arduino IDE no reconoce el ESP32"
- Instala los drivers USB del CH340 o CP2102 (según tu ESP32)
- Selecciona el puerto COM correcto (Tools → Port)

---

## 📊 API REST Disponible

```bash
# Ver estado del juego
curl http://localhost:3000/api/game-state

# Ver todos los robots conectados
curl http://localhost:3000/api/robots

# Ver estado de un robot específico
curl http://localhost:3000/api/robot/BLUE_1

# Actualizar robot vía HTTP
curl -X POST http://localhost:3000/api/robot-update \
  -H "Content-Type: application/json" \
  -d '{
    "robotId": "BLUE_1",
    "motorLeft": 200,
    "motorRight": 200,
    "paddleSpeed": 100
  }'
```

---

## 📚 Estructura del Proyecto

```
/Users/estuardmdz16/Desktop/Uni/
├── robofut_game.html       # Página del juego
├── robofut_game.js         # Lógica del juego (JavaScript)
├── server.js               # Servidor Node.js
├── package.json            # Dependencias
├── robofut_esp32.ino       # Código para ESP32
├── ROBOFUT_README.md       # Documentación principal
└── SETUP.md               # Este archivo
```

---

## 🎯 Próximos Pasos

1. **Juega localmente**: Abre `robofut_game.html`
2. **Inicia el servidor**: `npm start`
3. **Carga el código en ESP32**: Arduino IDE
4. **¡Juega la competencia!**

---

## 💡 Tips

- **Prueba los motores**: Usa los ejemplos en `robofut_esp32.ino`
- **Ajusta la física**: Modifica parámetros en `robofut_game.js`
- **Personaliza colores**: Edita `robofut_game.html` CSS
- **Multiplayer**: Los 6 robots (BLUE_1-3, RED_1-3) pueden estar conectados

---

## ¿Preguntas?

Revisa los comentarios en el código o abre la consola del navegador (F12) para debugging.

¡**¡Que disfrutes la simulación!**
