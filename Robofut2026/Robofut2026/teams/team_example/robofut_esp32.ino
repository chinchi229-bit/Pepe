/**
 * TEAM EXAMPLE - RoboFut ESP32 Code
 * Ejemplo de implementación para referencia
 * 
 * Modifica este código con tu lógica específica
 */

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// ==================
// CONFIGURACIÓN WIFI
// ==================
const char* WIFI_SSID = "EJEMPLO_WIFI";
const char* WIFI_PASSWORD = "password";
const char* SERVER_IP = "192.168.1.100";
const uint16_t SERVER_PORT = 3000;

// ==================
// PINES - MOTORS
// ==================
#define MOTOR_LEFT_IN1 32
#define MOTOR_LEFT_IN2 33
#define MOTOR_LEFT_PWM 25

#define MOTOR_RIGHT_IN1 26
#define MOTOR_RIGHT_IN2 27
#define MOTOR_RIGHT_PWM 14

#define PADDLE_MOTOR_IN1 16
#define PADDLE_MOTOR_IN2 17
#define PADDLE_MOTOR_PWM 4

// ==================
// VARIABLES
// ==================
WebSocketsClient webSocket;
String robotId = "EXAMPLE_1";
uint8_t motorLeft = 0;
uint8_t motorRight = 0;
int8_t paddleSpeed = 0;
bool connected = false;

void setupMotors() {
  pinMode(MOTOR_LEFT_IN1, OUTPUT);
  pinMode(MOTOR_LEFT_IN2, OUTPUT);
  ledcSetup(0, 5000, 8);
  ledcAttachPin(MOTOR_LEFT_PWM, 0);

  pinMode(MOTOR_RIGHT_IN1, OUTPUT);
  pinMode(MOTOR_RIGHT_IN2, OUTPUT);
  ledcSetup(1, 5000, 8);
  ledcAttachPin(MOTOR_RIGHT_PWM, 1);

  pinMode(PADDLE_MOTOR_IN1, OUTPUT);
  pinMode(PADDLE_MOTOR_IN2, OUTPUT);
  ledcSetup(2, 5000, 8);
  ledcAttachPin(PADDLE_MOTOR_PWM, 2);
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

void setupWiFi() {
  Serial.print("Conectando WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  }
}

void setupWebSocket() {
  webSocket.begin(SERVER_IP, SERVER_PORT, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
  Serial.println("Conectando WebSocket...");
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      connected = false;
      Serial.println("[WS] Desconectado");
      break;
      
    case WStype_CONNECTED:
      connected = true;
      Serial.println("[WS] Conectado!");
      
      StaticJsonDocument<200> doc;
      doc["type"] = "identify";
      doc["robotId"] = robotId;
      
      String json;
      serializeJson(doc, json);
      webSocket.sendTXT(json);
      break;
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n🤖 TEAM EXAMPLE - RoboFut 2026");
  
  setupMotors();
  setupWiFi();
  setupWebSocket();
}

void loop() {
  webSocket.loop();
  delay(10);
}
