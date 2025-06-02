// PoolBall Class to create poolballs 
class PoolBall {
    constructor(x, y, radius, color) {
        this.body = Matter.Bodies.circle(x, y, radius, {
            restitution: 0.8, // Bounciness
            friction: 0.09, // Increase friction to slow down balls gradually
            frictionAir: 0.008, // Add slight air resistance
        });

        this.radius = radius;
        this.color = color;
        this.followMouse = false; // Determines if the ball follows the mouse
        this.opacity = 255; // Initialize full opacity
        this.spawnX = x; // Save initial spawn position
        this.spawnY = y;
        this.removed = false; // Track if the ball is removed

        Matter.World.add(world, this.body); // Add to Matter.js world
    }

    drawBall() {
        const pos = this.body.position;

        // If the cue ball is set to follow the mouse
        if (this.followMouse) {
            Matter.Body.setPosition(this.body, { x: mouseX, y: mouseY });
        }

        fill(`rgba(${this.getColorRGB()}, ${this.opacity / 255})`);
        ellipse(pos.x, pos.y, this.radius * 2.3); // Draw the ball
    }

    enableMouseFollow() {
        this.followMouse = true;
        Matter.Body.setPosition(this.body, { x: mouseX, y: mouseY });
    }

    releaseFromMouse() {
        this.followMouse = false;
    }

    isInDZone(baulkX, baulkY, radius) {
        const pos = this.body.position;
        const distanceFromD = dist(pos.x, pos.y, baulkX, baulkY);
        return distanceFromD <= radius; // Check if inside "D" zone
    }

    disableMovement() {
        Matter.Body.setStatic(this.body, true); // Temporarily make the ball static
    }

    enableMovement() {
        Matter.Body.setStatic(this.body, false); // Restore dynamic behavior
    }

    getColorRGB() {
        // Convert color names to RGB values (customize as needed)
        const colors = {
            red: '255,0,0',
            yellow: '255,255,0',
            lightgreen: '144,238,144',
            saddlebrown: '139,69,19',
            blue: '0,0,255',
            pink: '255,192,203',
            black: '0,0,0',
            white: '255,255,255',
        };
        return colors[this.color] || '255,255,255'; // Default to white
    }

    removeFromWorld() {
        if (!this.removed) {
            Matter.World.remove(world, this.body); // Remove from Matter.js world
            this.removed = true;
        }
    }

}

// Arrays to store balls
let redBalls = [];
let coloredBalls = [];
let cueBall;

// Function to create balls
function createBalls() {
    // Create red balls in a triangular formation
    let startX = 950; // Starting X position for the first ball
    let startY = 500; // Starting Y position
    let spacing = 25; // Spacing between balls

    let rows = 5; // Number of rows for the red balls

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
            let x = startX + row * spacing; // Each row moves horizontally
            let y = startY + col * spacing - (row * spacing) / 2; // Adjust to form a horizontal triangle
            let redBall = new PoolBall(x, y, 10, 'red');
            redBall.disableMovement();
            redBalls.push(redBall);
        }
    }

    // Create colored balls
    let yellowBall = new PoolBall(450, 580, 10, 'yellow');
    yellowBall.disableMovement();
    coloredBalls.push(yellowBall);

    let greenBall = new PoolBall(450, 415, 10, 'lightgreen');
    greenBall.disableMovement();
    coloredBalls.push(greenBall);

    let brownBall = new PoolBall(450, 500, 10, 'saddlebrown');
    brownBall.disableMovement();
    coloredBalls.push(brownBall);

    let blueBall = new PoolBall(750, 500, 10, 'blue');
    blueBall.disableMovement();
    coloredBalls.push(blueBall);

    let pinkBall = new PoolBall(918, 500, 10, 'pink');
    pinkBall.disableMovement();
    coloredBalls.push(pinkBall);

    let blackBall = new PoolBall(1120, 500, 10, 'black');
    blackBall.disableMovement();
    coloredBalls.push(blackBall);


    // Create the cue ball
    cueBall = new PoolBall(400, 500, 10, 'white');
    cueBall.enableMouseFollow(); // Enable mouse follow initially
}

// Function to draw balls
function drawBalls() {
    // Draw all red balls
    for (let redBall of redBalls) {
        redBall.drawBall();
    }

    // Draw all colored balls
    for (let coloredBall of coloredBalls) {
        coloredBall.drawBall();
    }

    // Draw the cue ball
    if (cueBall) {
        cueBall.drawBall();
    }
}

