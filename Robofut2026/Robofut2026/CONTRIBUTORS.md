# 🤝 CONTRIBUCIONES DE EQUIPOS

## Cómo subir tu código de RoboFut

### 1️⃣ Crea una carpeta con el nombre de tu equipo

```
teams/
├── tu_equipo_nombre/
│   ├── robofut_esp32.ino
│   ├── controlador.java (si lo tienes)
│   ├── README.md (opcional, describe tu implementación)
│   └── config.json (configuración de tu robot)
```

### 2️⃣ Qué incluir

- **robofut_esp32.ino** - Código principal del ESP32
- **controlador.java** - Código Java de control (si aplica)
- **config.json** - Configuración específica del robot
- **README.md** - Descripción de tu implementación

### 3️⃣ Ejemplo de estructura

Mira: `teams/team_example/` para ver un template

### 4️⃣ Formato de config.json

```json
{
  "equipo": "Tu Equipo",
  "ciudad": "Tu Ciudad",
  "integrantes": ["Juan", "María", "Pedro"],
  "velocidadMaxima": 255,
  "velocidadTurbo": 255,
  "motorIzqPin": 32,
  "motorDerPin": 26,
  "palataPin": 16,
  "wifiSSID": "TU_WIFI",
  "descripcion": "Breve descripción de tu robot"
}
```

### 5️⃣ Envío

**Opción A: Git (si sabes usar)**
```bash
git add teams/tu_equipo_nombre/
git commit -m "Agrega código de Tu Equipo"
git push
```

**Opción B: Carpeta local**
Simplemente copia tus archivos en `teams/tu_equipo_nombre/`

---

## ⚡ Plantilla Rápida

Copia esto en `teams/tu_equipo_nombre/README.md`:

```markdown
# 🤖 Equipo [TU NOMBRE]

## Integrantes
- Nombre 1
- Nombre 2
- Nombre 3

## Descripción
Breve descripción de tu implementación...

## Características
- Feature 1
- Feature 2
- Feature 3

## Cambios Principales
- Modificación 1
- Modificación 2

## Cómo usar
```

---

## 📋 Equipos Registrados

| Equipo | Carpeta | Estado |
|--------|---------|--------|
| Ejemplo | `team_example` | Template |
| Tu Equipo | `tu_equipo_nombre` | Pendiente... |

---

## 🎯 Directorios Disponibles

```
teams/
├── team_example/           (Plantilla)
├── tu_equipo_1/            (Crea aquí)
├── tu_equipo_2/            (Crea aquí)
├── tu_equipo_3/            (Crea aquí)
└── ...
```

---

## 📞 Instrucciones

1. **Crea tu carpeta**: `teams/nombre_tu_equipo/`
2. **Sube tus archivos**: `.ino`, `.java`, `.json`, `.md`
3. **Actualiza este archivo** con tu equipo en la tabla

¡Listo! Tu código estará disponible en la simulación.

---

## 🚀 Estructura Completa del Proyecto

```
Robofut2026/
├── robofut_game.html              (Juego principal)
├── robofut_game.js                (Lógica 3D)
├── server.js                      (Servidor)
├── config.js                      (Configuración global)
├── index.html                     (Tutorial)
│
├── teams/                         (📁 SUBE TU CÓDIGO AQUÍ)
│   ├── team_example/
│   │   ├── robofut_esp32.ino
│   │   ├── config.json
│   │   └── README.md
│   ├── tu_equipo_1/
│   ├── tu_equipo_2/
│   └── tu_equipo_3/
│
├── ROBOFUT_README.md
├── SETUP.md
└── CONTRIBUTORS.md               (Este archivo)
```

---

## 💡 Tips

- ✅ Revisa `teams/team_example/robofut_esp32.ino` como referencia
- ✅ Mantén nombres simples sin espacios: `team_roboticos` ✓, `team roboticos` ✗
- ✅ Documenta tus cambios en README.md
- ✅ Incluye config.json con tus parámetros

¡**Que comience la competencia! 🚀**
