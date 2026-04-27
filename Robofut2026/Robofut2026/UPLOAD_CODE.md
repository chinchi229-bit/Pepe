# 📤 COMO OTROS EQUIPOS SUBEN SU CÓDIGO

## 📁 Estructura de Carpetas

```
Robofut2026/
├── robofut_game.html           (Juego principal)
├── server.js                   (Servidor)
│
├── teams/                      ← 📍 LOS EQUIPOS SUBEN AQUÍ
│   ├── team_example/           (Plantilla de referencia)
│   ├── tu_equipo_1/            (Tu equipo)
│   ├── tu_equipo_2/            (Otro equipo)
│   └── tu_equipo_3/            (Otro equipo)
│
└── CONTRIBUTORS.md             (Lee esto primero)
```

---

## 🚀 PASOS PARA SUBIR CÓDIGO

### 1. Ve a la carpeta `teams/`
```bash
cd Robofut2026/teams/
```

### 2. Crea una carpeta para tu equipo
```bash
mkdir team_mi_equipo
cd team_mi_equipo
```

### 3. Copia tus archivos
- `robofut_esp32.ino` - Código del ESP32
- `config.json` - Configuración
- `README.md` - Descripción de tu equipo

### 4. Ejemplo de estructura
```
teams/team_mi_equipo/
├── robofut_esp32.ino
├── config.json
└── README.md
```

---

## 📋 Plantilla de config.json

Copia esto en `config.json`:

```json
{
  "equipo": "Tu Equipo Nombre",
  "ciudad": "Tu Ciudad",
  "integrantes": ["Persona 1", "Persona 2", "Persona 3"],
  "robotId": "EQUIPO_1",
  "velocidadMaxima": 255,
  "velocidadTurbo": 255
}
```

---

## 📝 Plantilla de README.md

```markdown
# 🤖 Team [Nombre]

## Integrantes
- Nombre 1
- Nombre 2
- Nombre 3

## Descripción
Breve descripción de tu robot...

## Características
- Característica 1
- Característica 2

## Cómo usar el código
```

---

## ✅ Checklist

- [ ] Cree la carpeta `teams/mi_equipo/`
- [ ] Copié `robofut_esp32.ino`
- [ ] Copié `config.json`
- [ ] Copié `README.md`
- [ ] Verifiqué que todos los archivos estén presentes

---

## 🎯 Archivos de Referencia

Mira estos archivos para entender la estructura:
- `teams/team_example/robofut_esp32.ino`
- `teams/team_example/config.json`
- `teams/team_example/README.md`

---

## 📞 ¿Preguntas?

Lee:
1. `CONTRIBUTORS.md` - Instrucciones detalladas
2. `teams/team_example/` - Ejemplo completo
3. `ROBOFUT_README.md` - Documentación del juego

---

**¡Tu equipo está listo para competir! 🚀**
