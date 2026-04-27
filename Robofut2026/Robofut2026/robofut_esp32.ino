/**
 * CÓDIGO ESP32 PARA ROBOFUT
 * Conecta el robot real con el simulador web
 * 
 * INSTALACIÓN:
 * 1. Instala las librerías necesarias en Arduino IDE:
 *    - esp32 (Espressif)
 *    - ArduinoJson
 *    - WiFi (incluida)
 * 
 * 2. Configura los pines según tu circuitería
 * 3. Actualiza WIFI_SSID, WIFI_PASSWORD y SERVER_IP
 */

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// ==================
// CONFIGURACIÓN WiFi
// ==================
const char* WIFI_SSID = "TU_RED_WIFI";
const char* WIFI_PASSWORD = "TU_CONTRASEÑA";
const char* SERVER_IP = "192.168.1.100";  // IP de tu computadora
const uint16_t SERVER_PORT = 3000;

// ==================
// CONFIGURACIÓN PINES
// ==================
// Motor izquierdo
#define MOTOR_LEFT_IN1 32
#define MOTOR_LEFT_IN2 33
#define MOTOR_LEFT_PWM 25

// Motor derecho
#define MOTOR_RIGHT_IN1 26
#define MOTOR_RIGHT_IN2 27
#define MOTOR_RIGHT_PWM 14

// Paleta giratoria
#define PADDLE_MOTOR_IN1 16
#define PADDLE_MOTOR_IN2 17
#define PADDLE_MOTOR_PWM 4

// Sensor de línea (opcional)
#define SENSOR_LINE 34

// ==================
// VARIABLES GLOBALES
// ==================
WebSocketsClient webSocket;
String robotId = "BLUE_1";  // Cambiar según robot
uint8_t motorLeftSpeed = 0;
uint8_t motorRightSpeed = 0;
int8_t paddleSpeed = 0;
bool connected = false;
unsigned long lastUpdate = 0;
const unsigned long UPDATE_INTERVAL = 50;  // 50ms

// ==================
// FUNCIONES DE CONTROL
// ==================

void setupMotors() {
  // Motor izquierdo
  pinMode(MOTOR_LEFT_IN1, OUTPUT);
  pinMode(MOTOR_LEFT_IN2, OUTPUT);
  ledcSetup(0, 5000, 8);
  ledcAttachPin(MOTOR_LEFT_PWM, 0);
  
  // Motor derecho
  pinMode(MOTOR_RIGHT_IN1, OUTPUT);
  pinMode(MOTOR_RIGHT_IN2, OUTPUT);
  ledcSetup(1, 5000, 8);
  ledcAttachPin(MOTOR_RIGHT_PWM, 1);
  
  // Paleta
  pinMode(PADDLE_MOTOR_IN1, OUTPUT);
  pinMode(PADDLE_MOTOR_IN2, OUTPUT);
  ledcSetup(2, 5000, 8);
  ledcAttachPin(PADDLE_MOTOR_PWM, 2);
  
  // Sensor de línea
  pinMode(SENSOR_LINE, INPUT);
  
  stopAllMotors();
}

void setMotorSpeed(uint8_t speed, bool leftMotor) {
  if (leftMotor) {
    digitalWrite(MOTOR_LEFT_IN1, speed > 0 ? HIGH : LOW);
    digitalWrite(MOTOR_LEFT_IN2, speed > 0 ? LOW : HIGH);
    ledcWrite(0, abs(speed));
  } else {
    digitalWrite(MOTOR_RIGHT_IN1, speed > 0 ? HIGH : LOW);
    digitalWrite(MOTOR_RIGHT_IN2, speed > 0 ? LOW : HIGH);
    ledcWrite(1, abs(speed));
  }
}

void setPaddleSpeed(int8_t speed) {
  digitalWrite(PADDLE_MOTOR_IN1, speed > 0 ? HIGH : LOW);
  digitalWrite(PADDLE_MOTOR_IN2, speed > 0 ? LOW : HIGH);
  ledcWrite(2, abs(speed));
}

void stopAllMotors() {
  ledcWrite(0, 0);
  ledcWrite(1, 0);
  ledcWrite(2, 0);
}

void moveRobot(uint8_t leftSpeed, uint8_t rightSpeed) {
  motorLeftSpeed = leftSpeed;
  motorRightSpeed = rightSpeed;
  setMotorSpeed(leftSpeed, true);
  setMotorSpeed(rightSpeed, false);
  
  Serial.printf("[Motor] Left: %d, Right: %d\n", leftSpeed, rightSpeed);
}

void rotatePaddle(int8_t speed) {
  paddleSpeed = speed;
  setPaddleSpeed(speed);
  
  Serial.printf("[Paddle] Speed: %d\n", speed);
}

// ==================
// FUNCIONES WiFi
// ==================

void setupWiFi() {
  Serial.print("Conectando WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nNo se pudo conectar WiFi");
  }
}

// ==================
// FUNCIONES WebSocket
// ==================

void setupWebSocket() {
  webSocket.begin(SERVER_IP, SERVER_PORT, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
  
  Serial.printf("Conectando WebSocket a %s:%d\n", SERVER_IP, SERVER_PORT);
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("[WS] Desconectado");
      connected = false;
      stopAllMotors();
      break;
      
    case WStype_CONNECTED:
      Serial.println("[WS] Conectado");
      connected = true;
      
      // Identificarse con el servidor
      StaticJsonDocument<200> doc;
      doc["type"] = "identify";
      doc["robotId"] = robotId;
      
      String json;
      serializeJson(doc, json);
      webSocket.sendTXT(json);
      break;
      
    case WStype_TEXT:
      handleWebSocketMessage((char*)payload, length);
      break;
      
    case WStype_BIN:
      // Binario no soportado
      break;
      
    case WStype_ERROR:
      Serial.println("[WS] Error");
      break;
      
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;
  }
}

void handleWebSocketMessage(char* payload, size_t length) {
  StaticJsonDocument<500> doc;
  DeserializationError error = deserializeJson(doc, payload);
  
  if (error) {
    Serial.printf("[WS] Error JSON: %s\n", error.c_str());
    return;
  }
  
  const char* type = doc["type"];
  
  if (strcmp(type, "robot-command") == 0) {
    // Comandos del servidor para este robot
    if (doc.containsKey("motorLeft")) {
      motorLeftSpeed = doc["motorLeft"];
    }
    if (doc.containsKey("motorRight")) {
      motorRightSpeed = doc["motorRight"];
    }
    if (doc.containsKey("paddleSpeed")) {
      paddleSpeed = doc["paddleSpeed"];
    }
    
    applyMotorCommands();
  }
  else if (strcmp(type, "ready") == 0) {
    Serial.println("[WS] Robot listo en el servidor");
  }
}

void applyMotorCommands() {
  setMotorSpeed(motorLeftSpeed, true);
  setMotorSpeed(motorRightSpeed, false);
  setPaddleSpeed(paddleSpeed);
}

void sendRobotState() {
  if (!connected) return;
  
  StaticJsonDocument<300> doc;
  doc["type"] = "robot-update";
  doc["robotId"] = robotId;
  doc["motorLeft"] = motorLeftSpeed;
  doc["motorRight"] = motorRightSpeed;
  doc["paddleSpeed"] = paddleSpeed;
  doc["sensorValue"] = analogRead(SENSOR_LINE);
  
  String json;
  serializeJson(doc, json);
  webSocket.sendTXT(json);
}

// ==================
// CONTROL LOCAL (BOTONES/SENSORES)
// ==================

void handleLocalControls() {
  // Aquí puedes añadir lógica de sensores locales
  // Por ejemplo: botones, sensores de línea, etc.
  
  // Ejemplo: si el jugador presiona un botón local
  // moveRobot(200, 200);  // Adelante
  // rotatePaddle(150);    // Girar paleta
}

// ==================
// SETUP
// ==================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n╔═══════════════════════════════╗");
  Serial.println("║  RoboFut ESP32 - Inicializando ║");
  Serial.println("╚═══════════════════════════════╝\n");
  
  setupMotors();
  setupWiFi();
  setupWebSocket();
  
  Serial.println("\n✓ Sistema iniciado");
  Serial.printf("Robot ID: %s\n", robotId.c_str());
}

// ==================
// LOOP
// ==================

void loop() {
  webSocket.loop();
  
  unsigned long now = millis();
  if (now - lastUpdate >= UPDATE_INTERVAL) {
    lastUpdate = now;
    
    handleLocalControls();
    sendRobotState();
    
    // Debug
    static unsigned long lastDebug = 0;
    if (now - lastDebug >= 1000) {
      lastDebug = now;
      Serial.printf("[Debug] Motor L:%d R:%d | Paddle:%d | Connected:%s\n",
                    motorLeftSpeed, motorRightSpeed, paddleSpeed,
                    connected ? "Si" : "No");
    }
  }
  
  delay(10);
}

// ==================
// EJEMPLOS DE USO
// ==================

/*
// Ejemplo 1: Movimiento adelante
void example_moveForward() {
  moveRobot(200, 200);
  delay(1000);
  moveRobot(0, 0);
}

// Ejemplo 2: Giro derecha
void example_turnRight() {
  moveRobot(200, 100);  // Motor izquierdo más rápido
  delay(500);
  moveRobot(0, 0);
}

// Ejemplo 3: Girar paleta
void example_paddleRotation() {
  rotatePaddle(200);    // Girar derecha
  delay(500);
  rotatePaddle(-200);   // Girar izquierda
  delay(500);
  rotatePaddle(0);      // Detener
}

// Para usar, llamar en handleLocalControls()
*/
