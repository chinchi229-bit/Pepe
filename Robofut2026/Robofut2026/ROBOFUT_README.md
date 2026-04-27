# 🤖 RoboFut 3v3 Virtual Simulator

Simulación web completa de RoboFut (Robot Fútbol) 3v3 con física realista, controles de gamepad/teclado y competencia lista para practicar.

## 🎮 Características

✅ **Juego 3v3** - 3 robots azules vs 3 robots rojos  
✅ **Física realista** - Usando Babylon.js + Cannon.js  
✅ **Vista cenital** - Perspectiva tipo Rocket League  
✅ **Controles duales** - Teclado + Gamepad (Xbox/PS4)  
✅ **Robots reales** - 2 motores traseros + 1 paleta giratoria  
✅ **Sistema de puntuación** - Detección automática de goles  
✅ **Temporizador** - 5 minutos de juego  

## 🎯 Especificaciones del Robot

Cada robot simula el comportamiento de RoboFut real:

- **Tamaño**: 4 x 2 x 6 cm (aproximado)
- **Motores traseros**: Control diferencial para movimiento y giro
- **Paleta giratoria**: Mecanismo frontal para golpear la bola
- **Velocidad máxima**: 0.3 unidades/tick (normal), 0.6 (turbo)
- **Masa**: 2 kg (simulada)

## ⌨️ Controles

### Teclado
- **W/A/S/D** - Movimiento
- **Q/E** - Girar paleta
- **ESPACIO** - Turbo

### Gamepad (Xbox/PS4)
- **Left Stick** - Movimiento
- **LB/RB** - Girar paleta
- **A / X** - Turbo

## 🚀 Inicio Rápido

1. Abre `robofut_game.html` en un navegador web moderno
2. Espera a que cargue (descarga Babylon.js automáticamente)
3. ¡Comienza a jugar!

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- WebGL habilitado
- Internet (para cargar Babylon.js desde CDN)

## 📊 Interfaz

- **Marcador** - Muestra puntuación en tiempo real (arriba)
- **Temporizador** - Cuenta regresiva de 5 minutos
- **Info del Jugador** - Tu robot actual y estado del turbo
- **FPS** - Rendimiento del juego
- **Posición de la bola** - Coordenadas actuales

## 🔧 Integración con ESP32

Para conectar controles ESP32 reales:

### Opción 1: WebSocket
```javascript
// En robofut_game.js, agregar después de setupControls():
const socket = new WebSocket('ws://localhost:8080');
socket.onmessage = (event) => {
    const robotData = JSON.parse(event.data);
    // Actualizar motors y paleta del robot
};
```

### Opción 2: REST API
```javascript
// Polling cada 50ms
setInterval(async () => {
    const response = await fetch('http://esp32.local/robot-state');
    const data = await response.json();
    // {motorLeft: 0-255, motorRight: 0-255, paddleSpeed: -255 a 255}
}, 50);
```

### Protocolo de datos ESP32
```json
{
  "motorLeft": 128,    // 0-255 (PWM)
  "motorRight": 128,   // 0-255 (PWM)
  "paddleSpeed": 50,   // -255 a 255
  "robotId": "BLUE_1"  // Identificador
}
```

## 📋 Reglas de Juego

1. **Duración**: 5 minutos
2. **Equipo Ganador**: Quien tenga más goles
3. **Portería**: Zona marcada en azul (defensa) y rojo (ataque)
4. **Pelota**: Bola amarilla. Se reinicia en el centro tras gol
5. **Límites**: Los robots no pueden salir del campo

## 🎓 Mejoras Futuras

- [ ] Integración con servidor Node.js multiplayer
- [ ] Comunicación WebSocket para ESP32 real
- [ ] Sistema de replays y grabación
- [ ] Modo entrenamiento con IA
- [ ] Gráficos mejorados (texturas, animaciones)
- [ ] Sistema de estadísticas
- [ ] Modos de juego (torneo, liga)
- [ ] Soporte para múltiples navegadores simultáneos

## 🐛 Troubleshooting

**"El juego no carga"**
- Verifica que WebGL esté habilitado
- Intenta en otro navegador
- Revisa la consola (F12) para errores

**"Los controles no funcionan"**
- Conecta el gamepad antes de abrir el juego
- Para teclado, asegúrate de que el foco esté en la ventana

**"Bajo rendimiento"**
- Reduce la calidad gráfica del navegador
- Cierra otras pestañas
- Reinicia el navegador

## 📝 Notas de Desarrollo

- Escrito en JavaScript vanilla + Babylon.js
- Física 3D con Cannon.js
- Sin dependencias externas (excepto librerías CDN)
- Fácil de personalizar y extender

## 📄 Licencia

Este proyecto es educativo y de práctica para competencias de RoboFut.

---

**¿Preguntas?** Revisa la consola del navegador (F12) para debugging detallado.
