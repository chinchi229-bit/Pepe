// ================================
// ROBOFUT 3v3 SIMULATOR
// ================================

class RoboFutGame {
    constructor() {
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = null;
        this.camera = null;
        this.robots = [];
        this.ball = null;
        this.scoreBlue = 0;
        this.scoreRed = 0;
        this.gameTime = 300; // 5 minutos
        this.playerControlledIndex = 0; // El robot que controla el jugador
        this.gameRunning = true;
        this.lastGoalTime = 0;
        
        // Configuración de la cancha
        this.fieldWidth = 120;
        this.fieldHeight = 80;
        this.fieldZ = 0;
        
        // Controles
        this.gamepadConnected = false;
        this.gamepadState = null;
        
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createLights();
        this.createField();
        this.createBall();
        this.createRobots();
        this.setupPhysics();
        this.setupControls();
        this.setupGameLoop();
        window.addEventListener('resize', () => this.engine.resize());
        this.handleGamepadConnection();
    }

    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.15);
        this.scene.collisionsEnabled = true;
        this.scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.CannonJSPlugin());
    }

    createCamera() {
        this.camera = new BABYLON.ArcRotateCamera(
            "camera",
            BABYLON.Tools.ToRadians(0),
            BABYLON.Tools.ToRadians(90),
            150,
            new BABYLON.Vector3(0, 0, 0),
            this.scene
        );
        this.camera.attachControl(this.canvas, true);
        this.camera.wheelPrecision = 100;
        this.camera.angularSensibilityX = 0;
        this.camera.angularSensibilityY = 0;
        this.camera.inertia = 0;
        this.camera.attachControl(this.canvas, true);
    }

    createLights() {
        const light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(50, 100, 50), this.scene);
        light1.intensity = 1;
        light1.range = 500;

        const light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-50, 100, -50), this.scene);
        light2.intensity = 0.8;
        light2.range = 500;

        const ambientLight = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), this.scene);
        ambientLight.intensity = 0.6;
    }

    createField() {
        // Piso
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {
            width: this.fieldWidth,
            height: this.fieldHeight
        }, this.scene);
        
        const groundMaterial = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMaterial.diffuse = new BABYLON.Color3(0.2, 0.5, 0.2);
        groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        ground.material = groundMaterial;
        ground.position.z = this.fieldZ;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(
            ground,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, friction: 0.5, restitution: 0 },
            this.scene
        );

        // Paredes
        this.createWall(-this.fieldWidth / 2 - 2, 0, 0, 4, 20, this.fieldHeight + 4, 0x333333);
        this.createWall(this.fieldWidth / 2 + 2, 0, 0, 4, 20, this.fieldHeight + 4, 0x333333);
        
        // Portería azul
        this.createWall(0, 0, -this.fieldHeight / 2 - 2, this.fieldWidth * 0.3, 10, 4, 0x0066ff);
        
        // Portería roja
        this.createWall(0, 0, this.fieldHeight / 2 + 2, this.fieldWidth * 0.3, 10, 4, 0xff3333);
    }

    createWall(x, y, z, width, height, depth, color) {
        const wall = BABYLON.MeshBuilder.CreateBox("wall", {
            width: width,
            height: height,
            depth: depth
        }, this.scene);
        
        wall.position = new BABYLON.Vector3(x, y, z);
        
        const wallMaterial = new BABYLON.StandardMaterial("wallMat", this.scene);
        wallMaterial.diffuse = BABYLON.Color3.FromHexString("#" + color.toString(16).padStart(6, '0'));
        wall.material = wallMaterial;
        
        wall.physicsImpostor = new BABYLON.PhysicsImpostor(
            wall,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, friction: 0.5, restitution: 0.2 },
            this.scene
        );
    }

    createBall() {
        this.ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 2, segments: 16 }, this.scene);
        this.ball.position = new BABYLON.Vector3(0, 1, this.fieldZ);
        
        const ballMaterial = new BABYLON.StandardMaterial("ballMat", this.scene);
        ballMaterial.emissiveColor = new BABYLON.Color3(1, 0.84, 0);
        ballMaterial.diffuse = new BABYLON.Color3(1, 0.9, 0);
        this.ball.material = ballMaterial;
        
        this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.ball,
            BABYLON.PhysicsImpostor.SphereImpostor,
            { mass: 0.5, friction: 0.3, restitution: 0.8 },
            this.scene
        );
    }

    createRobots() {
        // Robots azules (equipo 1)
        const bluePositions = [
            { x: -30, z: 0 },      // Defensa
            { x: -15, z: -20 },    // Ataque
            { x: -15, z: 20 }      // Ataque
        ];

        bluePositions.forEach((pos, index) => {
            this.createRobot(pos.x, pos.z, "BLUE", index, "blue");
        });

        // Robots rojos (equipo 2)
        const redPositions = [
            { x: 30, z: 0 },       // Defensa
            { x: 15, z: -20 },     // Ataque
            { x: 15, z: 20 }       // Ataque
        ];

        redPositions.forEach((pos, index) => {
            this.createRobot(pos.x, pos.z, "RED", index, "red");
        });
    }

    createRobot(x, z, team, index, color) {
        const robotGroup = new BABYLON.TransformNode("robot_" + team + "_" + index, this.scene);
        robotGroup.position = new BABYLON.Vector3(x, 1, z);
        robotGroup.rotation.y = team === "BLUE" ? 0 : Math.PI;

        // Cuerpo principal (chasis) - más grande para mejor visibilidad
        const chassis = BABYLON.MeshBuilder.CreateBox("chassis", {
            width: 5,
            height: 2.5,
            depth: 7.5
        }, this.scene);
        chassis.parent = robotGroup;
        chassis.position.y = 0;

        const chassisMaterial = new BABYLON.StandardMaterial("chassisMat_" + team + index, this.scene);
        chassisMaterial.diffuse = color === "blue" ? new BABYLON.Color3(0, 0.6, 1) : new BABYLON.Color3(1, 0.2, 0.2);
        chassis.material = chassisMaterial;

        // Ruedas traseras
        this.createWheel(robotGroup, -1.2, -1, "left", 0.8);
        this.createWheel(robotGroup, 1.2, -1, "right", 0.8);

        // Rueda delantera (omnidireccional)
        const frontWheel = BABYLON.MeshBuilder.CreateCylinder("frontWheel", { diameter: 0.8, height: 1 }, this.scene);
        frontWheel.parent = robotGroup;
        frontWheel.position = new BABYLON.Vector3(0, 0, 3);
        frontWheel.rotation.x = Math.PI / 2;

        const wheelMat = new BABYLON.StandardMaterial("frontWheelMat", this.scene);
        wheelMat.diffuse = new BABYLON.Color3(0.3, 0.3, 0.3);
        frontWheel.material = wheelMat;

        // Paleta giratoria para golpear la pelota
        const paddle = BABYLON.MeshBuilder.CreateBox("paddle", {
            width: 4,
            height: 2,
            depth: 0.3
        }, this.scene);
        paddle.parent = robotGroup;
        paddle.position = new BABYLON.Vector3(0, 0.5, 3.5);

        const paddleMaterial = new BABYLON.StandardMaterial("paddleMat_" + team + index, this.scene);
        paddleMaterial.diffuse = color === "blue" ? new BABYLON.Color3(0.3, 0.8, 1) : new BABYLON.Color3(1, 0.5, 0.5);
        paddleMaterial.alpha = 0.7;
        paddle.material = paddleMaterial;

        // Crear física del robot
        const robotPhysics = BABYLON.MeshBuilder.CreateBox("robotPhysics", {
            width: 5,
            height: 2.5,
            depth: 7.5
        }, this.scene);
        robotPhysics.parent = robotGroup;
        robotPhysics.isVisible = false;

        robotPhysics.physicsImpostor = new BABYLON.PhysicsImpostor(
            robotPhysics,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 2, friction: 0.3, restitution: 0.2 },
            this.scene
        );

        const names = {
            "BLUE": ["DEFENSA", "ATAQUE-IZQ", "ATAQUE-DER"],
            "RED": ["DEFENSA", "ATAQUE-IZQ", "ATAQUE-DER"]
        };

        const robot = {
            group: robotGroup,
            chassis: chassis,
            paddle: paddle,
            paddleNode: new BABYLON.TransformNode("paddleNode_" + team + index, this.scene),
            physics: robotPhysics,
            team: team,
            index: index,
            name: team + "-" + (index + 1) + " (" + names[team][index] + ")",
            motorSpeed: { left: 0, right: 0 },
            paddleRotation: 0,
            paddleSpeed: 0,
            turbo: false,
            maxSpeed: 0.5,           // Aumentado para facilitar
            maxTurboSpeed: 1.0,      // Aumentado para facilitar
            color: color,
            controlled: index === 0 && team === "BLUE"
        };

        this.robots.push(robot);
    }

    createWheel(parent, x, y, side, diameter) {
        const wheel = BABYLON.MeshBuilder.CreateCylinder("wheel_" + side, {
            diameter: diameter,
            height: 1
        }, this.scene);
        wheel.parent = parent;
        wheel.position = new BABYLON.Vector3(x, y, 0);
        wheel.rotation.x = Math.PI / 2;

        const wheelMat = new BABYLON.StandardMaterial("wheelMat_" + side, this.scene);
        wheelMat.diffuse = new BABYLON.Color3(0.2, 0.2, 0.2);
        wheel.material = wheelMat;

        return wheel;
    }

    setupPhysics() {
        // Ya configurada en createScene
    }

    setupControls() {
        // Solo controles de gamepad
        // Los controles de teclado están deshabilitados
    }

    handleGamepadConnection() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad conectado:', e.gamepad.id);
            this.gamepadConnected = true;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad desconectado');
            this.gamepadConnected = false;
        });
    }

    updateControls() {
        const robot = this.robots[this.playerControlledIndex];
        if (!robot) return;

        // Reset
        robot.motorSpeed.left = 0;
        robot.motorSpeed.right = 0;
        robot.paddleSpeed = 0;

        // SOLO CONTROLES GAMEPAD
        let moveX = 0;
        let moveZ = 0;
        let paddleRotation = 0;

        const gamepads = navigator.getGamepads();
        if (gamepads && gamepads[0]) {
            const gp = gamepads[0];
            
            // Left stick para movimiento
            if (Math.abs(gp.axes[0]) > 0.1) moveX = gp.axes[0];
            if (Math.abs(gp.axes[1]) > 0.1) moveZ = gp.axes[1];
            
            // LB/RB para paleta
            if (gp.buttons[4]) paddleRotation = -1;
            if (gp.buttons[5]) paddleRotation = 1;
            
            // A para turbo
            robot.turbo = gp.buttons[0];
        } else {
            robot.turbo = false;
        }

        // Aplicar movimiento
        const speed = robot.turbo ? robot.maxTurboSpeed : robot.maxSpeed;
        
        // Convertir entrada a velocidad de motores (diferencial)
        if (moveX !== 0 || moveZ !== 0) {
            const magnitude = Math.sqrt(moveX * moveX + moveZ * moveZ);
            if (magnitude > 0) {
                moveX /= magnitude;
                moveZ /= magnitude;
            }

            // Movimiento hacia adelante
            if (moveZ > 0) {
                robot.motorSpeed.left = speed * moveZ;
                robot.motorSpeed.right = speed * moveZ;
            }

            // Giro
            robot.motorSpeed.left += speed * moveX * 0.5;
            robot.motorSpeed.right -= speed * moveX * 0.5;
        }

        // Paleta giratoria (sensibilidad aumentada)
        if (paddleRotation !== 0) {
            robot.paddleSpeed = paddleRotation * 0.25;
        }
    }

    updateRobots() {
        this.robots.forEach(robot => {
            // Aplicar velocidades de motores
            const avgSpeed = (robot.motorSpeed.left + robot.motorSpeed.right) / 2;
            const direction = robot.group.getDirection(BABYLON.Axis.Z);
            const velocity = new BABYLON.Vector3(
                direction.x * avgSpeed,
                0,
                direction.z * avgSpeed
            );

            // Giro diferencial (aumentado para mejor control)
            const spinDelta = (robot.motorSpeed.right - robot.motorSpeed.left) * 0.15;
            robot.group.rotation.y += spinDelta;

            // Aplicar velocidad
            if (robot.physics.physicsImpostor) {
                robot.physics.physicsImpostor.setLinearVelocity(velocity);
            }

            // Rotación de paleta
            robot.paddle.rotation.x += robot.paddleSpeed;
            
            // Limitar altura
            if (robot.group.position.y < 0.5) {
                robot.group.position.y = 0.5;
            }

            // Límites de campo
            robot.group.position.x = BABYLON.Scalar.Clamp(robot.group.position.x, -this.fieldWidth / 2 + 3, this.fieldWidth / 2 - 3);
            robot.group.position.z = BABYLON.Scalar.Clamp(robot.group.position.z, -this.fieldHeight / 2 + 3, this.fieldHeight / 2 - 3);
        });
    }

    updateBall() {
        // Limitar altura mínima
        if (this.ball.position.y < 0.5) {
            this.ball.position.y = 0.5;
            if (this.ball.physicsImpostor) {
                this.ball.physicsImpostor.applyImpulse(
                    new BABYLON.Vector3(0, 5, 0),
                    this.ball.getAbsolutePosition()
                );
            }
        }

        // Detectar goles
        this.detectGoals();

        // Colisiones con paletas
        this.detectPaddleCollisions();
    }

    detectGoals() {
        const ballZ = this.ball.position.z;
        const ballX = this.ball.position.x;

        // Portería azul (z negativo)
        if (ballZ < -this.fieldHeight / 2 && Math.abs(ballX) < this.fieldWidth * 0.15) {
            this.scoreRed++;
            this.showGoalAnimation("RED");
            this.resetBall();
        }

        // Portería roja (z positivo)
        if (ballZ > this.fieldHeight / 2 && Math.abs(ballX) < this.fieldWidth * 0.15) {
            this.scoreBlue++;
            this.showGoalAnimation("BLUE");
            this.resetBall();
        }
    }

    detectPaddleCollisions() {
        this.robots.forEach(robot => {
            if (!robot.paddle) return;

            const paddleWorldPos = BABYLON.Vector3.TransformCoordinates(
                robot.paddle.getAbsolutePosition(),
                robot.group.getWorldMatrix()
            );

            const distance = BABYLON.Vector3.Distance(paddleWorldPos, this.ball.position);
            
            if (distance < 2.5) {
                const direction = BABYLON.Vector3.Normalize(
                    BABYLON.Vector3.Subtract(this.ball.position, paddleWorldPos)
                );
                
                // Fuerza aumentada para golpes más efectivos
                const force = 15;
                const impulse = BABYLON.Vector3.Scale(direction, force);

                if (this.ball.physicsImpostor) {
                    this.ball.physicsImpostor.applyImpulse(
                        impulse,
                        this.ball.getAbsolutePosition()
                    );
                }
            }
        });
    }

    resetBall() {
        this.ball.position = new BABYLON.Vector3(0, 1, this.fieldZ);
        if (this.ball.physicsImpostor) {
            this.ball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
            this.ball.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        }
    }

    showGoalAnimation(team) {
        const now = Date.now();
        if (now - this.lastGoalTime < 2000) return;
        this.lastGoalTime = now;

        const goalDiv = document.createElement('div');
        goalDiv.className = 'goal-animation';
        goalDiv.textContent = '⚽ ¡GOOOL!';
        document.getElementById('ui').appendChild(goalDiv);

        setTimeout(() => goalDiv.remove(), 1000);
    }

    updateUI() {
        document.getElementById('scoreBlue').textContent = this.scoreBlue;
        document.getElementById('scoreRed').textContent = this.scoreRed;

        // Timer
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Info
        document.getElementById('fps').textContent = Math.round(this.engine.getFps());
        document.getElementById('ballPos').textContent = 
            `${this.ball.position.x.toFixed(1)}, ${this.ball.position.z.toFixed(1)}`;

        // Player info
        const robot = this.robots[this.playerControlledIndex];
        if (robot) {
            const status = this.gamepadConnected ? '🎮 CONECTADO' : '❌ Sin Control';
            document.getElementById('playerInfo').textContent = 
                `${status} | ${robot.name} | Turbo: ${robot.turbo ? '🔥 ON' : 'OFF'}`;
            document.getElementById('robotName').textContent = robot.name;
            
            // Mostrar lista de equipos
            if (!document.getElementById('teamsList').innerHTML) {
                let teamsList = '<div style="color: #00bfff;">AZUL:</div>';
                this.robots.slice(0, 3).forEach(r => {
                    teamsList += `<div>${r.name}</div>`;
                });
                teamsList += '<div style="color: #ff4444; margin-top: 5px;">ROJO:</div>';
                this.robots.slice(3, 6).forEach(r => {
                    teamsList += `<div>${r.name}</div>`;
                });
                document.getElementById('teamsList').innerHTML = teamsList;
            }
        }
    }

    setupGameLoop() {
        let lastTime = Date.now();
        
        this.engine.runRenderLoop(() => {
            const now = Date.now();
            const deltaTime = (now - lastTime) / 1000;
            lastTime = now;

            if (this.gameRunning) {
                this.gameTime -= deltaTime;
                if (this.gameTime <= 0) {
                    this.gameRunning = false;
                    alert(`¡Fin del Juego!\nAzul: ${this.scoreBlue}\nRojo: ${this.scoreRed}`);
                    this.resetGame();
                }
            }

            this.updateControls();
            this.updateRobots();
            this.updateBall();
            this.updateUI();

            this.scene.render();
        });
    }

    resetGame() {
        this.scoreBlue = 0;
        this.scoreRed = 0;
        this.gameTime = 300;
        this.gameRunning = true;
        this.resetBall();
        this.robots.forEach((robot, index) => {
            const team = robot.team;
            const idx = robot.index;
            const bluePositions = [
                { x: -30, z: 0 },
                { x: -15, z: -20 },
                { x: -15, z: 20 }
            ];
            const redPositions = [
                { x: 30, z: 0 },
                { x: 15, z: -20 },
                { x: 15, z: 20 }
            ];
            
            const pos = team === "BLUE" ? bluePositions[idx] : redPositions[idx];
            robot.group.position = new BABYLON.Vector3(pos.x, 1, pos.z);
            robot.group.rotation.y = team === "BLUE" ? 0 : Math.PI;
        });
    }
}

// Iniciar el juego cuando la página cargue
window.addEventListener('load', () => {
    const game = new RoboFutGame();
});
