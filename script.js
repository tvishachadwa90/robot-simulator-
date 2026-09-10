let scene;
let camera;
let renderer;

let robot;
let obstacle;

let running = false;


// ===============================
// SIMULATION SETTINGS
// ===============================

// Speed of robot on screen
const robotSpeed = 0.04;

// Virtual sensor distance
let currentDistance = 30;

// Distance selected by user
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
        8,
        12
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
            0.5
        );

    scene.add(ambientLight);


    // FLOOR

    const floorGeometry =
        new THREE.PlaneGeometry(
            20,
            20
        );

    const floorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

    const floor =
        new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );

    floor.rotation.x =
        -Math.PI / 2;

    scene.add(floor);


    // CREATE ROBOT

    createRobot();


    // CREATE OBSTACLE

    createObstacle();


    // START ANIMATION

    animate();
}


// ===============================
// CREATE ROBOT
// ===============================

function createRobot() {

    robot =
        new THREE.Group();


    // BODY

    const bodyGeometry =
        new THREE.BoxGeometry(
            2,
            1,
            2
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x6c63ff
        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y = 1;

    robot.add(body);


    // HEAD

    const headGeometry =
        new THREE.BoxGeometry(
            1.4,
            1,
            1.4
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );

    head.position.y = 2;

    robot.add(head);


    // SENSOR

    const sensorGeometry =
        new THREE.SphereGeometry(
            0.2,
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
        2,
        -0.8
    );

    robot.add(sensor);


    // ROBOT START POSITION

    robot.position.set(
        0,
        0,
        5
    );

    scene.add(robot);
}


// ===============================
// CREATE OBSTACLE
// ===============================

function createObstacle() {

    const geometry =
        new THREE.BoxGeometry(
            3,
            2,
            1
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xff8a65
        });

    obstacle =
        new THREE.Mesh(
            geometry,
            material
        );

    obstacle.position.set(
        0,
        1,
        -2
    );

    scene.add(obstacle);
}


// ===============================
// ROBOT LOGIC
// ===============================

function updateRobot() {

    // If simulation isn't running,
    // do nothing.

    if (!running) {
        return;
    }


    // ============================
    // MOVE ROBOT
    // ============================

    robot.position.z -= robotSpeed;


    // ============================
    // REDUCE VIRTUAL DISTANCE
    // ============================

    currentDistance -= 0.5;


    // Prevent negative distance

    if (currentDistance < 0) {
        currentDistance = 0;
    }


    // Display current sensor distance

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
        // STOP ROBOT
        // ========================

        running = false;


        // Show exact selected distance

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
            "🛑 STOP ROBOT";


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

    // Get input box

    const input =
        document.getElementById(
            "distanceInput"
        );


    // Convert input to number

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
    // SET DETECTION DISTANCE
    // ============================

    detectionDistance =
        enteredDistance;


    // ============================
    // STARTING SENSOR DISTANCE
    // ============================

    // Robot starts 30 cm farther
    // than selected distance.

    currentDistance =
        detectionDistance + 30;


    // ============================
    // RESET ROBOT POSITION
    // ============================

    robot.position.set(
        0,
        0,
        5
    );


    // ============================
    // START
    // ============================

    running = true;


    // Initial display

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


    // Reset robot

    robot.position.set(
        0,
        0,
        5
    );


    // Reset distance

    currentDistance =
        detectionDistance;


    // Reset display

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

    updateRobot();

    renderer.render(
        scene,
        camera
    );
}


// ===============================
// START EVERYTHING
// ===============================

createScene();