# 🚀 ROBOFUT 3v3 - GUÍA COMPLETA

## 📋 Resumen

Has recibido una **simulación web completa de RoboFut 3v3** lista para jugar y practicar competencias. El simulador incluye:

✅ Juego 3D con física realista  
✅ 6 robots (3 azules vs 3 rojos)  
✅ Cada robot tiene 2 motores + 1 paleta giratoria  
✅ Controles: Teclado + Gamepad + ESP32  
✅ Servidor Node.js con WebSocket  
✅ Detección automática de goles  
✅ Sistema de puntuación  

---

## 📁 Archivos Creados

```
robofut_game.html           ← Página del juego (ABRE ESTO)
robofut_game.js             ← Lógica del juego en 3D
config.js                   ← Configuración personalizable
server.js                   ← Servidor Node.js (opcional)
package.json                ← Dependencias Node.js
robofut_esp32.ino           ← Código para ESP32
ROBOFUT_README.md           ← Documentación del juego
SETUP.md                    ← Guía de instalación
MAINTAINER.md               ← Este archivo
```

---

## ⚡ OPCIÓN 1: JUEGA AHORA (Sin instalación)

### En macOS:
1. Abre Finder
2. Ve a `/Users/estuardmdz16/Desktop/Uni/`
3. Haz doble click en `robofut_game.html`
4. ¡Se abre en tu navegador!

### Controles:
- **Teclado**: WASD (movimiento) + QE (paleta) + ESPACIO (turbo)
- **Gamepad**: Conecta Xbox/PS4 y usa los sticks

---

## 🖥️ OPCIÓN 2: INSTALAR SERVIDOR (Con ESP32)

Si quieres conectar robots ESP32 reales:

```bash
cd /Users/estuardmdz16/Desktop/Uni

# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

Luego accede a: **http://localhost:3000**

---

## 🔧 PERSONALIZAR EL JUEGO

### Cambiar velocidad de robots:
En `config.js`:
```javascript
applyCustomConfig({
  robot: {
    maxSpeed: 0.5,      // Aumentar velocidad
    maxTurboSpeed: 1.0,
  }
});
```

### Cambiar tamaño del campo:
```javascript
applyCustomConfig({
  field: {
    width: 150,   // Más ancho
    height: 100,  // Más alto
  }
});
```

### Usar presets:
```javascript
applyPreset('fast');       // Juego rápido
applyPreset('realistic');  // Juego realista
applyPreset('training');   // Modo entrenamiento
```

### Ver todas las opciones:
Lee `config.js` (está bien documentado)

---

## 🎮 CONECTAR ESP32

### Paso 1: Arduino IDE
1. Instala Arduino IDE
2. Configura placa ESP32
3. Instala librerías:
   - ArduinoJson
   - WebSocketsClient

### Paso 2: Configurar código
En `robofut_esp32.ino`, edita:
```cpp
const char* WIFI_SSID = "TU_WIFI";
const char* WIFI_PASSWORD = "TU_PASSWORD";
const char* SERVER_IP = "192.168.x.x";    // Tu IP
const char* robotId = "BLUE_1";            // Tu robot
```

### Paso 3: Subir
1. Conecta ESP32 por USB
2. Upload en Arduino IDE
3. Abre Serial Monitor (115200 baud)

### Paso 4: Ver conexión
Terminal:
```bash
curl http://localhost:3000/api/robots
```

---

## 📊 ARCHITETURA DEL SISTEMA

```
┌──────────────────────────────────────────┐
│      JUGADOR EN NAVEGADOR                 │
│  (robofut_game.html + robofut_game.js)   │
└──────────────────┬───────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    Teclado            Gamepad USB
        │                     │
        └──────────┬──────────┘
                   │
           ┌───────▼────────┐
           │  NAVEGADOR     │
           │  (Juego 3D)    │
           └───────┬────────┘
                   │
              WebSocket
                   │
        ┌──────────▼──────────┐
        │  SERVER NODE.JS     │
        │  (server.js)        │
        └──────────┬──────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
      ESP32-1            ESP32-2, etc
     (BLUE_1)           (BLUE_2, RED_1...)
         │                   │
    ┌────▼─────┐        ┌────▼─────┐
    │2 Motores │        │2 Motores │
    │1 Paleta  │        │1 Paleta  │
    └──────────┘        └──────────┘
```

---

## 🐛 SOLUCIONAR PROBLEMAS

### "El juego no carga"
- ✅ Verifica que abras `robofut_game.html`
- ✅ Intenta en Chrome (mejor compatibilidad)
- ✅ Prensa F12 para ver errores en consola

### "Controles no funcionan"
- ✅ Teclado: Asegúrate que la ventana está enfocada
- ✅ Gamepad: Conecta ANTES de abrir el juego
- ✅ ESP32: Verifica Serial Monitor para errores

### "Bajo rendimiento"
- ✅ Cierra otras pestaña y apps
- ✅ Reduce opciones en DevTools
- ✅ Reinicia el navegador

### "No se ve el servidor"
- ✅ ¿Corrió `npm install`? Si no: `npm install`
- ✅ ¿Está Node.js instalado? Escribe `node --version`
- ✅ ¿El puerto 3000 está libre? `lsof -i :3000`

---

## 💡 TIPS PRO

1. **Modo Debug**: Abre `robofut_game.html` + F12 para ver más info
2. **Teleoperación**: Usa teclado para controlador remoto
3. **Múltiples robots**: Cada ESP32 puede ser un robot diferente
4. **Grabación**: Usa OBS o ScreenFlow para grabar partidas
5. **Estadísticas**: El servidor guarda todo en la consola

---

## 📈 EXPANDIR EL JUEGO

### Agregar IA:
```javascript
// En robofut_game.js, crear AI class
class RobotAI {
  update() {
    // Lógica de IA aquí
  }
}
```

### Agregar sonido:
```javascript
// Reproducir sonido al anotar gol
new Audio('sound.mp3').play();
```

### Guardar replays:
```javascript
// Grabar movimientos en cada frame
const replay = [];
replay.push({frame, robots, ball, score});
```

---

## 🚀 PRÓXIMAS VERSIONES

- [ ] Multiplayer en red (varios navegadores)
- [ ] Inteligencia Artificial
- [ ] Editor de campos personalizados
- [ ] Sistema de ligas y torneos
- [ ] App móvil con controles táctiles
- [ ] Integración con Discord
- [ ] Física mejorada
- [ ] Gráficos en 4K

---

## 📚 RECURSOS EXTERNOS

- **Babylon.js**: https://www.babylonjs-playground.com/
- **Cannon.js**: https://cannon-es6.io/
- **Node.js**: https://nodejs.org/
- **Arduino ESP32**: https://github.com/espressif/arduino-esp32

---

## 📞 SOPORTE

**Si algo no funciona:**

1. Lee la consola del navegador (F12)
2. Revisa el Serial Monitor del ESP32
3. Comprueba los archivos creados
4. Intenta en otro navegador

---

## 📝 CHANGELOG

### v1.0 (Actual)
- ✅ Juego 3v3 completamente funcional
- ✅ Física realista
- ✅ Controles teclado + gamepad
- ✅ Servidor Node.js
- ✅ Código ESP32
- ✅ Configuración personalizable

---

## ⚖️ LICENCIA

Este proyecto es educativo para competencias de RoboFut.

---

**¡A DISFRUTAR EL JUEGO! 🎮⚽🤖**

Abre `robofut_game.html` y comienza a jugar ahora.

