let scene;
let camera;
let renderer;

let car;
let obstacle;

let running = false;


// ===============================
// SIMULATION SETTINGS
// ===============================

const carSpeed = 0.04;

let currentDistance = 30;

let detectionDistance = 30;


// ===============================
// CREATE 3D WORLD
// ===============================

function createScene() {

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0xdfe8ff);


    // CAMERA

    camera =
        new THREE.PerspectiveCamera(
            60,
            document.getElementById("simulation").clientWidth / 600,
            0.1,
            1000
        );

    camera.position.set(
        0,
        7,
        13
    );

    camera.lookAt(
        0,
        0,
        0
    );


    // RENDERER

    renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });

    renderer.setSize(
        document.getElementById("simulation").clientWidth,
        600
    );

    document
        .getElementById("simulation")
        .appendChild(renderer.domElement);


    // LIGHT

    const light =
        new THREE.DirectionalLight(
            0xffffff,
            1
        );

    light.position.set(
        5,
        10,
        5
    );

    scene.add(light);


    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.6
        );

    scene.add(ambientLight);


    // ============================
    // ROAD
    // ============================

    const roadGeometry =
        new THREE.PlaneGeometry(
            12,
            20
        );

    const roadMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x555555
        });

    const road =
        new THREE.Mesh(
            roadGeometry,
            roadMaterial
        );

    road.rotation.x =
        -Math.PI / 2;

    scene.add(road);


    // ============================
    // ROAD LINES
    // ============================

    for (let z = -8; z <= 8; z += 3) {

        const lineGeometry =
            new THREE.BoxGeometry(
                0.15,
                0.02,
                1
            );

        const lineMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            });

        const line =
            new THREE.Mesh(
                lineGeometry,
                lineMaterial
            );

        line.position.set(
            0,
            0.02,
            z
        );

        scene.add(line);
    }


    // CREATE CAR

    createCar();


    // CREATE OBSTACLE

    createObstacle();


    // START ANIMATION

    animate();
}


// ===============================
// CREATE CAR
// ===============================

function createCar() {

    car =
        new THREE.Group();


    // ============================
    // CAR BODY
    // ============================

    const bodyGeometry =
        new THREE.BoxGeometry(
            2.4,
            0.7,
            3.5
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x4f46e5
        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y = 0.65;

    car.add(body);


    // ============================
    // CAR TOP
    // ============================

    const topGeometry =
        new THREE.BoxGeometry(
            1.7,
            0.6,
            1.7
        );

    const topMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xbfd7ff
        });

    const top =
        new THREE.Mesh(
            topGeometry,
            topMaterial
        );

    top.position.set(
        0,
        1.25,
        0.1
    );

    car.add(top);


    // ============================
    // WHEELS
    // ============================

    const wheelGeometry =
        new THREE.CylinderGeometry(
            0.45,
            0.45,
            0.35,
            20
        );

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x222222
        });


    const wheelPositions = [
        [-1.25, 0.45, 1.1],
        [1.25, 0.45, 1.1],
        [-1.25, 0.45, -1.1],
        [1.25, 0.45, -1.1]
    ];


    wheelPositions.forEach(
        function(position) {

            const wheel =
                new THREE.Mesh(
                    wheelGeometry,
                    wheelMaterial
                );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );

            car.add(wheel);
        }
    );


    // ============================
    // FRONT SENSOR
    // ============================

    const sensorGeometry =
        new THREE.SphereGeometry(
            0.25,
            16,
            16
        );

    const sensorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xff3333
        });

    const sensor =
        new THREE.Mesh(
            sensorGeometry,
            sensorMaterial
        );

    sensor.position.set(
        0,
        0.8,
        -1.85
    );

    car.add(sensor);


    // ============================
    // HEADLIGHTS
    // ============================

    const lightGeometry =
        new THREE.BoxGeometry(
            0.45,
            0.25,
            0.1
        );

    const lightMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffffaa
        });


    const leftLight =
        new THREE.Mesh(
            lightGeometry,
            lightMaterial
        );

    leftLight.position.set(
        -0.65,
        0.75,
        -1.78
    );

    car.add(leftLight);


    const rightLight =
        new THREE.Mesh(
            lightGeometry,
            lightMaterial
        );

    rightLight.position.set(
        0.65,
        0.75,
        -1.78
    );

    car.add(rightLight);


    // ============================
    // START POSITION
    // ============================

    car.position.set(
        0,
        0,
        5
    );

    scene.add(car);
}


// ===============================
// CREATE OBSTACLE
// ===============================

function createObstacle() {

    const geometry =
        new THREE.BoxGeometry(
            3.5,
            2.2,
            1.2
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xff7043
        });

    obstacle =
        new THREE.Mesh(
            geometry,
            material
        );

    obstacle.position.set(
        0,
        1.1,
        -2
    );

    scene.add(obstacle);
}


// ===============================
// CAR LOGIC
// ===============================

function updateCar() {

    if (!running) {
        return;
    }


    // ============================
    // MOVE CAR
    // ============================

    car.position.z -= carSpeed;


    // ============================
    // REDUCE VIRTUAL DISTANCE
    // ============================

    currentDistance -= 0.5;


    if (currentDistance < 0) {
        currentDistance = 0;
    }


    // ============================
    // DISPLAY DISTANCE
    // ============================

    document.getElementById(
        "distance"
    ).innerText =
        Math.round(currentDistance);


    // ============================
    // SENSOR
    // ============================

    if (currentDistance > detectionDistance) {

        document.getElementById(
            "sensorStatus"
        ).innerText =
            "No obstacle detected";


        // ========================
        // CONTROLLER
        // ========================

        document.getElementById(
            "controllerStatus"
        ).innerText =
            "MOVE FORWARD";


        // ========================
        // ACTUATOR
        // ========================

        document.getElementById(
            "motorStatus"
        ).innerText =
            "Motor ON";

    }

    else {

        // ========================
        // STOP CAR
        // ========================

        running = false;


        currentDistance =
            detectionDistance;


        document.getElementById(
            "distance"
        ).innerText =
            detectionDistance;


        // SENSOR

        document.getElementById(
            "sensorStatus"
        ).innerText =
            "⚠️ Obstacle detected";


        // CONTROLLER

        document.getElementById(
            "controllerStatus"
        ).innerText =
            "🛑 STOP CAR";


        // ACTUATOR

        document.getElementById(
            "motorStatus"
        ).innerText =
            "Motor OFF";
    }
}


// ===============================
// START SIMULATION
// ===============================

function startSimulation() {

    const input =
        document.getElementById(
            "distanceInput"
        );


    const enteredDistance =
        Number(input.value);


    // ============================
    // VALIDATION
    // ============================

    if (
        isNaN(enteredDistance) ||
        enteredDistance < 1 ||
        enteredDistance > 200
    ) {

        alert(
            "Please enter a distance between 1 and 200 cm."
        );

        return;
    }


    // ============================
    // SET DISTANCE
    // ============================

    detectionDistance =
        enteredDistance;


    // ============================
    // STARTING DISTANCE
    // ============================

    currentDistance =
        detectionDistance + 30;


    // ============================
    // RESET CAR
    // ============================

    car.position.set(
        0,
        0,
        5
    );


    // ============================
    // START
    // ============================

    running = true;


    document.getElementById(
        "distance"
    ).innerText =
        Math.round(currentDistance);


    document.getElementById(
        "sensorStatus"
    ).innerText =
        "Scanning...";


    document.getElementById(
        "controllerStatus"
    ).innerText =
        "MOVING...";


    document.getElementById(
        "motorStatus"
    ).innerText =
        "Motor ON";
}


// ===============================
// RESET SIMULATION
// ===============================

function resetSimulation() {

    running = false;


    car.position.set(
        0,
        0,
        5
    );


    currentDistance =
        detectionDistance;


    document.getElementById(
        "distance"
    ).innerText =
        "--";


    document.getElementById(
        "sensorStatus"
    ).innerText =
        "Waiting...";


    document.getElementById(
        "controllerStatus"
    ).innerText =
        "Waiting...";


    document.getElementById(
        "motorStatus"
    ).innerText =
        "Motor OFF";
}


// ===============================
// ANIMATION
// ===============================

function animate() {

    requestAnimationFrame(
        animate
    );

    updateCar();

    renderer.render(
        scene,
        camera
    );
}


// ===============================
// START
// ===============================

createScene();