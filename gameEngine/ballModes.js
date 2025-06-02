// Ball Modes Implementation
function handleBallModes() {
    textSize(25);
    fill(255);
    textAlign(LEFT);
    text("Select: ", width / 1.65, 45);
    text("1. Start with standard starting position", width / 1.65, 85);
    text("2. Start with random red ball position", width / 1.65, 115);
    text("3. Start with random red and coloured ball position", width / 1.65, 145);
    text("4. Creative Mode - Water vs Lava Snooker", width / 1.65, 176);
    text("W - to increase force to hit cueball, S -  to decrease force to hit cueball, Spacebar - to hit cueball with cue stick", width / 9, 210)
}


function setStartingPositions() {
    // Clear current ball arrays and remove from Matter.js world
    for (let ball of [...redBalls, ...coloredBalls]) {
        ball.removeFromWorld();
    }
    redBalls = [];
    coloredBalls = [];
    if (cueBall) cueBall.removeFromWorld();
    cueBall = null;

    // Recreate balls in starting positions
    createBalls();
}


// Helper function to check overlap
function isOverlapping(x, y, ballsArray, radius) {
    for (let ball of ballsArray) {
        let distSq = (x - ball.body.position.x) ** 2 + (y - ball.body.position.y) ** 2;
        if (distSq < (radius * 2) ** 2) {
            return true; // Overlap detected
        }
    }
    return false; // No overlap
}

function setRandomRedPositions() {
    // Remove all existing balls
    for (let ball of [...redBalls, ...coloredBalls]) {
        ball.removeFromWorld();
    }
    redBalls = [];
    coloredBalls = [];
    if (cueBall) cueBall.removeFromWorld();
    cueBall = null;

    // Recreate random red positions
    let rows = 5;
    let maxAttempts = 100; // Limit the number of retries to avoid infinite loops
    for (let i = 0; i < rows * rows; i++) {
        let x, y;
        let attempts = 0;
        do {
            x = random(width / 2 - 300, width / 2 + 300);
            y = random(height / 2 - 200, height / 2 + 200);
            attempts++;
        } while (isOverlapping(x, y, redBalls, 10) && attempts < maxAttempts);

        if (attempts < maxAttempts) {
            redBalls.push(new PoolBall(x, y, 10, "red", true));
        }
    }

    // Recreate colored balls in their standard positions
    let colorsAndPositions = [
        { x: 450, y: 580, color: 'yellow' },
        { x: 450, y: 415, color: 'lightgreen' },
        { x: 450, y: 500, color: 'saddlebrown' },
        { x: 750, y: 500, color: 'blue' },
        { x: 918, y: 500, color: 'pink' },
        { x: 1120, y: 500, color: 'black' }
    ];

    for (let { x, y, color } of colorsAndPositions) {
        let coloredBall = new PoolBall(x, y, 10, color);
        coloredBall.disableMovement(); // Ensure they start as stationary
        coloredBalls.push(coloredBall);
    }

    // Create the cue ball in its starting position
    cueBall = new PoolBall(400, 500, 10, "white");
    cueBall.enableMouseFollow(); // Allow repositioning in the "D" zone
}



function setRandomAllPositions() {
    // Remove all existing balls
    for (let ball of [...redBalls, ...coloredBalls]) {
        ball.removeFromWorld();
    }
    redBalls = [];
    coloredBalls = [];
    if (cueBall) cueBall.removeFromWorld();
    cueBall = null;

    // Randomize red balls
    let rows = 5;
    let maxAttempts = 100; // Limit the number of retries
    for (let i = 0; i < rows * rows; i++) {
        let x, y;
        let attempts = 0;
        do {
            x = random(width / 2 - 300, width / 2 + 300);
            y = random(height / 2 - 200, height / 2 + 200);
            attempts++;
        } while (isOverlapping(x, y, [...redBalls, ...coloredBalls], 10) && attempts < maxAttempts);

        if (attempts < maxAttempts) {
            redBalls.push(new PoolBall(x, y, 10, "red", true));
        }
    }

    // Randomize colored balls
    let colors = ["yellow", "lightgreen", "saddlebrown", "blue", "pink", "black"];
    for (let color of colors) {
        let x, y;
        let attempts = 0;
        do {
            x = random(width / 2 - 300, width / 2 + 300);
            y = random(height / 2 - 200, height / 2 + 200);
            attempts++;
        } while (isOverlapping(x, y, [...redBalls, ...coloredBalls], 10) && attempts < maxAttempts);

        if (attempts < maxAttempts) {
            coloredBalls.push(new PoolBall(x, y, 10, color, true));
        }
    }

    // Create the cue ball
    cueBall = new PoolBall(400, 500, 10, "white");
    cueBall.enableMouseFollow();
}
