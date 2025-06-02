
// Matter.js variables
let engine, world;

// Game objects
let poolTable;
let cueStick;
let alertUser = false; // Flag to put ball in "D" zone alert
let cueStickVisible = true; // Cue stick visibility
let canHitBall = false; // Controls when the spacebar can be pressed
let initialPlacement = true; // Tracks if the game is in the placement phase
let firstHitComplete = false; // Tracks if the first hit has been completed

// sounds 
let cueHitSound, cueBallFallSound, redBallFallSound, coloredBallSpotSound, waterSound, lavaSound;

function preload() {
    cueHitSound = loadSound("sounds/tap.wav");
    cueBallFallSound = loadSound("sounds/cueball.mp3");
    redBallFallSound = loadSound("sounds/redBall.mp3");
    coloredBallSpotSound = loadSound("sounds/glow.wav");
    waterSound = loadSound("sounds/water.mp3");
    lavaSound = loadSound("sounds/fire.mp3");
}

function setup() {
    // Create a canvas using p5.js
    createCanvas(1500, 1000);

    // Initialize Matter.js engine and world
    engine = Matter.Engine.create();
    world = engine.world;

    //disable gravity for horizontal gameplay
    engine.gravity.y = 0.0; 

    // Create the pool table
    poolTable = new PoolTable(1000, 500); 
    poolTable.createBoundaries(); // Add static boundaries around the table

    // Initialize pockets
    initializePockets(poolTable);

    //Create a cuestick
    cueStick = new CueStick();

    // Create the balls
    createBalls();

    // Initialize collision notifications (placed after engine and objects are initialized)
    initializeCollisionNotifications(engine, cueBall, redBalls, coloredBalls, poolTable);

}

function draw() {
    // Clear the background
    background(100);

    // Draw the pool table
    poolTable.drawTable();

    // Draw the balls
    drawBalls();

    // Check for pocketed balls
    checkPocketedBalls([...redBalls, ...coloredBalls, cueBall]);

    // Draw the cue stick if visible
    if (cueStickVisible) {
        cueStick.drawCue(cueBall);
        cueStick.rotateCue(mouseX, mouseY, cueBall);
        cueStick.drawTrajectory(cueBall);
    }

    // Show instruction to retrieve the cue stick
    if (!cueStickVisible) {
        fill(255);
        textSize(30);
        textAlign(CENTER);
        text("Press C to retrieve cue stick", width / 2, height - 100);
    }

    // Display instruction menu
    handleBallModes();

    // Handle creative mode rendering
    if (isCreativeMode) {
        drawCreativeMode();
    }

    //Show instruction to place cue ball in D zone
    if (alertUser && cueBall.followMouse && initialPlacement) {
        fill(255);
        textSize(30);
        textAlign(CENTER);
        text("Place the cue ball inside the 'D' zone!", width / 2, height - 100);
    }

    // Display collision notifications
    displayCollisionNotification();
    displayRuleViolationNotification();

    // Update Matter.js engine
    Matter.Engine.update(engine);

}

function keyPressed() {
    // Cue stick controls
    if (key === ' ' && cueStickVisible && canHitBall) {
        cueStick.hitCueBall(cueBall); // Apply force
        cueHitSound.play();
        cueStickVisible = false; // Hide the cue stick
        canHitBall = false; // Prevent hitting the ball again until the cue stick is retrieved
        return false; // prevents default action of spacebar, does not move page down
    } else if (key === 'C' || key === 'c') {
        cueStickVisible = true; // Show the cue stick
        canHitBall = true; // Allow the ball to be hit again after retrieval
    }

    // Force adjustment
    if (cueStickVisible) {
        if (key === 'W' || key === 'w') {
            cueStick.adjustForce(true); // Increase force
        } else if (key === 'S' || key === 's') {
            cueStick.adjustForce(false); // Decrease force
        }
    }

    // Ball mode controls
    if (key === "1" || key === "2" || key === "3" || key === "4") {
        // Stop all sounds when switching modes
        waterSound.stop();
        lavaSound.stop();
        cueHitSound.stop();
        cueBallFallSound.stop();
        redBallFallSound.stop();
        coloredBallSpotSound.stop();

        // Additional logic depending on the mode
        if (key === "1") {
            setStartingPositions(); // Standard starting positions
            initialPlacement = true; 
            isCreativeMode = false; // Deactivate creative mode
            creativeModeManager = null;
        } else if (key === "2") {
            setRandomRedPositions(); // Random red ball positions
            initialPlacement = true; 
            isCreativeMode = false; // Deactivate creative mode
            creativeModeManager = null;
        } else if (key === "3") {
            setRandomAllPositions(); // Random all ball positions
            initialPlacement = true; 
            isCreativeMode = false; // Deactivate creative mode
            creativeModeManager = null;
        } else if (key === "4") { 
            creativeMode(); // Call creative mode function
            initialPlacement = true; 
        }

        // Common setup for all modes
        alertUser = true; // Show "D" zone alert
        cueStickVisible = true; // Make the cue stick visible
        canHitBall = false; // Prevent hitting until placed

        // Reinitialize collision notifications for updated balls
        initializeCollisionNotifications(engine, cueBall, redBalls, coloredBalls, poolTable);
    }
}


function mouseReleased() {
    if (!initialPlacement || !poolTable) return; // Ignore if not in placement phase or table is not ready

    const baulkX = width / 2 - poolTable.width / 2 + poolTable.width / 6; // Center of the "D" zone
    const baulkY = height / 2;
    const radius = poolTable.width / 18; // Radius of the "D" zone

    if (cueBall.isInDZone(baulkX, baulkY, radius)) {
        cueBall.releaseFromMouse();
        alertUser = false; // Reset the alert after successful placement
        canHitBall = true; // Allow the ball to be hit
        initialPlacement = false; // Switch to gameplay mode
        firstHitComplete = true; // Mark that the first hit is complete

        // Enable movement for all balls
        for (let ball of [...redBalls, ...coloredBalls]) {
            ball.enableMovement();
        }
    } else {
        alertUser = true; // Display alert if the ball is outside the "D" zone
        cueBall.enableMouseFollow(); // Re-enable mouse follow to reposition
    }
}

