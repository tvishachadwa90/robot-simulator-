function startSimulation() {

    // =========================
    // GET ELEMENTS
    // =========================

    let distanceInput =
        document.getElementById("distanceInput");

    let distance =
        Number(distanceInput.value);

    let robot =
        document.getElementById("robot");

    let car =
        document.getElementById("car");

    let sensorBeam =
        document.getElementById("sensorBeam");

    let status =
        document.getElementById("status");

    let sensorInfo =
        document.getElementById("sensorInfo");

    let controllerInfo =
        document.getElementById("controllerInfo");

    let actuatorInfo =
        document.getElementById("actuatorInfo");


    // =========================
    // CHECK INPUT
    // =========================

    if (
        isNaN(distance) ||
        distance < 1 ||
        distance > 200
    ) {

        status.innerHTML =
            "⚠️ Please enter a distance between 1 and 200 cm.";

        return;

    }


    // =========================
    // RESET INFORMATION
    // =========================

    sensorInfo.innerHTML =
        "Detecting object...";

    controllerInfo.innerHTML =
        "Waiting for sensor data...";

    actuatorInfo.innerHTML =
        "Waiting for command...";


    // =========================
    // CALCULATE CAR POSITION
    // =========================

    /*
        Distance range:
        1 cm → close to robot
        200 cm → far from robot
    */

    let minimumPosition = 180;

    let maximumPosition = 850;


    /*
        Convert 1–200 cm
        into screen position.
    */

    let carPosition =
        minimumPosition +
        ((distance - 1) / 199) *
        (maximumPosition - minimumPosition);


    // =========================
    // MOVE CAR
    // =========================

    car.style.left =
        carPosition + "px";


    // =========================
    // SENSOR STAGE
    // =========================

    status.innerHTML =
        "📡 SENSOR: Detecting object at "
        + distance
        + " cm";


    sensorInfo.innerHTML =
        "Object detected at <b>"
        + distance
        + " cm</b>.";


    // =========================
    // SENSOR BEAM
    // =========================

    let beamWidth =
        carPosition - 100;

    if (beamWidth < 0) {

        beamWidth = 0;

    }


    sensorBeam.style.width =
        beamWidth + "px";


    // =========================
    // CONTROLLER STAGE
    // =========================

    setTimeout(function () {

        status.innerHTML =
            "🧠 CONTROLLER: Processing sensor data...";


        controllerInfo.innerHTML =
            "Controller received "
            + distance
            + " cm and calculated the required movement.";

    }, 1200);


    // =========================
    // ACTUATOR STAGE
    // =========================

    setTimeout(function () {

        status.innerHTML =
            "⚙️ ACTUATOR: Robot moving toward object...";


        actuatorInfo.innerHTML =
            "Motors activated. Robot is moving toward the object.";


        /*
            Robot stops 90px
            before the car.
        */

        let robotPosition =
            carPosition - 100;


        // Robot cannot go behind starting point

        if (robotPosition < 60) {

            robotPosition = 60;

        }


        robot.style.left =
            robotPosition + "px";


    }, 2200);


    // =========================
    // STOP STAGE
    // =========================

    setTimeout(function () {

        status.innerHTML =
            "🛑 ROBOT STOPPED — Target detected at "
            + distance
            + " cm.";


        actuatorInfo.innerHTML =
            "Robot stopped at the required position.";

    }, 4500);

}