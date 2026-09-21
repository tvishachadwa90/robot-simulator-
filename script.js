const car = document.getElementById("robotCar");
const motorcycle = document.getElementById("motorcycle");
const sensorBeam = document.getElementById("sensorBeam");
const stopMarker = document.getElementById("stopMarker");

const statusText = document.getElementById("statusText");
const distanceDisplay = document.getElementById("distanceDisplay");

const sensorCard = document.getElementById("sensorCard");
const controllerCard = document.getElementById("controllerCard");
const actuatorCard = document.getElementById("actuatorCard");

const sensorStatus = document.getElementById("sensorStatus");
const controllerStatus = document.getElementById("controllerStatus");
const actuatorStatus = document.getElementById("actuatorStatus");


function startSimulation() {

    const distance = Number(
        document.getElementById("distanceInput").value
    );

    if (!distance || distance < 1 || distance > 200) {
        alert("Please enter a distance between 1 and 200 cm.");
        return;
    }


    // RESET VISUALS

    clearCards();

    car.style.left = "10%";
    stopMarker.style.opacity = "0";
    sensorBeam.style.width = "0";
    sensorBeam.style.opacity = "0";

    distanceDisplay.innerText =
        "Target stopping distance: " + distance + " cm";

    statusText.innerText = "SCANNING";


    /* =========================
       STEP 1 - SENSOR
       ========================= */

    setTimeout(() => {

        sensorCard.classList.add("active");

        sensorStatus.innerText = "OBSTACLE DETECTED";

        sensorBeam.style.width = "65%";
        sensorBeam.style.opacity = "1";

        statusText.innerText = "SENSOR ACTIVE";

    }, 700);


    /* =========================
       STEP 2 - CONTROLLER
       ========================= */

    setTimeout(() => {

        controllerCard.classList.add("active");

        controllerStatus.innerText =
            "DISTANCE = " + distance + " CM";

        statusText.innerText = "PROCESSING";

    }, 2000);


    /* =========================
       STEP 3 - CALCULATE STOP
       ========================= */

    setTimeout(() => {

        /*
        Convert 1–200 cm into a visual gap.

        Small distance = car stops close.
        Large distance = car stops farther away.
        */

        const minGap = 35;
        const maxGap = 300;

        const gap =
            minGap +
            ((distance - 1) / 199) *
            (maxGap - minGap);


        /*
        Motorcycle is around 82% of track width.
        We calculate the car's final position
        according to the selected distance.
        */

        const track =
            document.getElementById("track");

        const trackWidth =
            track.clientWidth;

        const motorcyclePosition =
            trackWidth * 0.82;

        const carWidth =
            120;


        let finalPosition =
            motorcyclePosition - carWidth - gap;


        /*
        Prevent the car from going
        outside the starting area.
        */

        const minimumPosition =
            trackWidth * 0.10;

        if (finalPosition < minimumPosition) {
            finalPosition = minimumPosition;
        }


        /* Controller has decided the position */

        stopMarker.style.left =
            finalPosition + "px";

        stopMarker.style.opacity = "1";


        controllerStatus.innerText =
            "STOP AT " + distance + " CM";


        /* =========================
           STEP 4 - ACTUATOR
           ========================= */

        setTimeout(() => {

            actuatorCard.classList.add("active");

            actuatorStatus.innerText =
                "BRAKING CAR";

            statusText.innerText =
                "CAR MOVING";


            car.style.left =
                finalPosition + "px";


        }, 500);


        /* =========================
           STEP 5 - FINAL STOP
           ========================= */

        setTimeout(() => {

            actuatorStatus.innerText =
                "CAR STOPPED";

            statusText.innerText =
                "STOPPED";

            sensorStatus.innerText =
                "MOTORCYCLE DETECTED";

            controllerStatus.innerText =
                "SAFE DISTANCE: " + distance + " CM";

        }, 3600);


    }, 3000);
}


/* RESET */

function resetSimulation() {

    car.style.left = "10%";

    stopMarker.style.opacity = "0";

    sensorBeam.style.width = "0";
    sensorBeam.style.opacity = "0";

    distanceDisplay.innerText =
        "Distance: -- cm";

    statusText.innerText =
        "READY";

    clearCards();
}


/* CLEAR COMPONENT CARDS */

function clearCards() {

    sensorCard.classList.remove("active");
    controllerCard.classList.remove("active");
    actuatorCard.classList.remove("active");

    sensorStatus.innerText =
        "WAITING";

    controllerStatus.innerText =
        "WAITING";

    actuatorStatus.innerText =
        "WAITING";
}