// ================================
// CONFIGURACIÓN PERSONALIZABLE
// ROBOFUT 3v3 SIMULATOR
// ================================

// Edita este archivo para personalizar el juego
// Luego recarga la página en el navegador

const GAME_CONFIG = {
  // ==================
  // CAMPO
  // ==================
  field: {
    width: 120,           // Ancho del campo
    height: 80,           // Alto del campo
    wallThickness: 2,     // Grosor de las paredes
    goalWidth: 30,        // Ancho de la portería (%)
  },

  // ==================
  // PELOTA
  // ==================
  ball: {
    diameter: 2,
    mass: 0.5,
    friction: 0.3,
    restitution: 0.8,    // "Rebote" de la pelota (0-1)
    speedLimit: 2,       // Velocidad máxima
  },

  // ==================
  // ROBOTS
  // ==================
  robot: {
    // Tamaño físico
    width: 4,
    height: 2,
    depth: 6,
    mass: 2,
    friction: 0.3,
    restitution: 0.2,

    // Rendimiento
    maxSpeed: 0.3,
    maxTurboSpeed: 0.6,
    acceleration: 0.1,
    turboBoost: 2.0,     // Multiplicador de velocidad con turbo

    // Paleta
    paddleWidth: 4,
    paddleHeight: 2,
    paddleDepth: 0.3,
    paddleMaxRotationSpeed: 0.1,

    // Ruedas
    wheelDiameter: 0.8,
    wheelFriction: 0.4,
  },

  // ==================
  // JUEGO
  // ==================
  game: {
    gameDuration: 300,   // Segundos (5 minutos)
    initialScore: 0,
    teamsCount: 2,       // Siempre 2 (Azul vs Rojo)
    robotsPerTeam: 3,    // 3v3
  },

  // ==================
  // FÍSICA
  // ==================
  physics: {
    gravity: new BABYLON.Vector3(0, -9.81, 0),
    collisionsEnabled: true,
    deltaTime: 1 / 60,   // 60 FPS
  },

  // ==================
  // COLORES
  // ==================
  colors: {
    fieldGreen: 0x2a8c2a,
    wallDark: 0x333333,
    goalBlue: 0x0066ff,
    goalRed: 0xff3333,
    robotBlue: 0x0099ff,
    robotRed: 0xff6666,
    ballYellow: 0xffcc00,
    groundColor: new BABYLON.Color3(0.2, 0.5, 0.2),
  },

  // ==================
  // CÁMARA
  // ==================
  camera: {
    distance: 150,
    angle: 90,           // Grados (90 = vista cenital)
    fov: 45,
  },

  // ==================
  // ILUMINACIÓN
  // ==================
  lighting: {
    ambientIntensity: 0.6,
    pointLight1Intensity: 1.0,
    pointLight2Intensity: 0.8,
    shadowsEnabled: true,
  },

  // ==================
  // CONTROLES
  // ==================
  controls: {
    keyboardEnabled: true,
    gamepadEnabled: true,
    gamepadDeadzone: 0.1,        // Umbral mínimo del joystick
    paddleRotationSpeed: 0.1,
    turboKey: ' ',               // Espacio
  },

  // ==================
  // UI
  // ==================
  ui: {
    showFPS: true,
    showBallPos: true,
    showControls: true,
    autoHideControlsAfter: 10000, // ms (desactivar si = 0)
  },

  // ==================
  // AUDIO (Futuro)
  // ==================
  audio: {
    enabled: false,
    goalSound: 'assets/goal.wav',
    hitSound: 'assets/hit.wav',
    volume: 0.7,
  },

  // ==================
  // DEBUG
  // ==================
  debug: {
    enabled: false,
    showPhysicsDebug: false,
    showCollisionBounds: false,
    logEveryFrame: false,
    logGoals: true,
    logCollisions: true,
  }
};

// ================================
// CONFIGURACIÓN AVANZADA
// ================================

const ADVANCED_CONFIG = {
  // Posiciones iniciales de los robots (pueden ajustarse)
  initialPositions: {
    blue: [
      { x: -30, z: 0 },      // Defensa
      { x: -15, z: -20 },    // Ataque izquierda
      { x: -15, z: 20 }      // Ataque derecha
    ],
    red: [
      { x: 30, z: 0 },       // Defensa
      { x: 15, z: -20 },     // Ataque izquierda
      { x: 15, z: 20 }       // Ataque derecha
    ]
  },

  // Sensibilidad de los controles
  controlSensitivity: {
    keyboard: {
      x: 1.0,              // Sensibilidad en X (giro)
      z: 1.0,              // Sensibilidad en Z (adelante/atrás)
    },
    gamepad: {
      x: 1.0,
      z: 1.0,
      paddleRotation: 1.0,
    }
  },

  // Parámetros de física avanzada
  physicsParameters: {
    paddleCollisionForce: 8,      // Fuerza del golpe de la paleta
    ballAirResistance: 0.99,      // Resistencia del aire (0-1)
    groundFrictionMultiplier: 0.5,
    wallRestitution: 0.2,
  },

  // Configuración de equipos (para futuras expansiones)
  teams: {
    blue: {
      name: "AZUL",
      color: 0x00bfff,
      startSide: "left"
    },
    red: {
      name: "ROJO",
      color: 0xff4444,
      startSide: "right"
    }
  }
};

// ================================
// FUNCIONES DE UTILIDAD
// ================================

// Aplicar configuración personalizada
function applyCustomConfig(customConfig) {
  Object.assign(GAME_CONFIG, customConfig);
  console.log("Configuración personalizada aplicada:", GAME_CONFIG);
}

// Resetear a configuración por defecto
function resetConfig() {
  location.reload();
}

// Exportar configuración actual
function exportConfig() {
  return {
    game: GAME_CONFIG,
    advanced: ADVANCED_CONFIG
  };
}

// Guardar configuración en localStorage
function saveConfig() {
  localStorage.setItem('robofut_config', JSON.stringify({
    game: GAME_CONFIG,
    advanced: ADVANCED_CONFIG
  }));
  console.log("Configuración guardada en localStorage");
}

// Cargar configuración desde localStorage
function loadConfig() {
  const saved = localStorage.getItem('robofut_config');
  if (saved) {
    const config = JSON.parse(saved);
    Object.assign(GAME_CONFIG, config.game);
    Object.assign(ADVANCED_CONFIG, config.advanced);
    console.log("Configuración cargada desde localStorage");
  }
}

// ================================
// EJEMPLOS DE CUSTOMIZACIÓN
// ================================

/*
// Ejemplo 1: Campo más grande
applyCustomConfig({
  field: {
    width: 150,
    height: 100,
  }
});

// Ejemplo 2: Robots más rápidos
applyCustomConfig({
  robot: {
    maxSpeed: 0.5,
    maxTurboSpeed: 1.0,
  }
});

// Ejemplo 3: Pelota más "viva"
applyCustomConfig({
  ball: {
    restitution: 0.95,
    mass: 0.3,
  }
});

// Ejemplo 4: Juego más largo
applyCustomConfig({
  game: {
    gameDuration: 600,  // 10 minutos
  }
});

// Ejemplo 5: Debug activado
applyCustomConfig({
  debug: {
    enabled: true,
    showPhysicsDebug: true,
  }
});

// Para usar cualquier ejemplo, descomenta y modifica según necesites
// applyCustomConfig({ ... });
*/

// ================================
// PRESETS (Perfiles predefinidos)
// ================================

const PRESETS = {
  // Juego rápido y ágil
  fast: {
    field: { width: 100, height: 70 },
    robot: { maxSpeed: 0.5, maxTurboSpeed: 1.0 },
    ball: { mass: 0.3, restitution: 0.95 },
    game: { gameDuration: 180 }
  },

  // Juego realista
  realistic: {
    field: { width: 120, height: 80 },
    robot: { maxSpeed: 0.3, maxTurboSpeed: 0.6 },
    ball: { mass: 0.5, restitution: 0.8 },
    game: { gameDuration: 300 }
  },

  // Juego lento (para aprender)
  slow: {
    field: { width: 120, height: 80 },
    robot: { maxSpeed: 0.15, maxTurboSpeed: 0.3 },
    ball: { mass: 0.7, restitution: 0.6 },
    game: { gameDuration: 300 }
  },

  // Modo entrenamiento (sin tiempo límite)
  training: {
    field: { width: 150, height: 100 },
    robot: { maxSpeed: 0.4, maxTurboSpeed: 0.8 },
    ball: { mass: 0.5, restitution: 0.85 },
    game: { gameDuration: 9999 }
  }
};

// Función para aplicar un preset
function applyPreset(presetName) {
  if (PRESETS[presetName]) {
    applyCustomConfig(PRESETS[presetName]);
    console.log(`Preset '${presetName}' aplicado`);
  } else {
    console.warn(`Preset '${presetName}' no encontrado`);
  }
}

// Ejemplo: applyPreset('fast');

// ================================
// EXPORTAR PARA USO EN JUEGO
// ================================

// (La configuración se puede usar en robofut_game.js)
// const config = GAME_CONFIG;
// const advanced = ADVANCED_CONFIG;
