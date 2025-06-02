// constructor to draw lava and water
class Hotspot {
    constructor(type, x, y, radius) {
        this.type = type; // "water" or "lava"
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.time = 0; // For Perlin noise animations used in water ripples or lava flow
        this.activeBalls = new Set(); // Track balls inside this hotspot
    }

    draw() {
        noStroke();
        if (this.type === "water") {
            this.drawWaterRipples();
        } else if (this.type === "lava") {
            this.drawLavaFlow();
        }
    }

    drawWaterRipples() {
        let gridSize = 5;
        for (let x = this.x - this.radius; x < this.x + this.radius; x += gridSize) {
            for (let y = this.y - this.radius; y < this.y + this.radius; y += gridSize) {
                let distSq = (x - this.x) ** 2 + (y - this.y) ** 2;
                if (distSq < this.radius ** 2) {
                    let n = noise(x * 0.05, y * 0.05, this.time); // noise is used to create ripple-like patterns
                    let c = map(n, 0, 1, 100, 255);
                    fill(0, 100, c, 150); // Blueish ripple effect
                    noStroke();
                    ellipse(x, y, gridSize, gridSize);
                }
            }
        }
        this.time += 0.01;
    }

    drawLavaFlow() {
        for (let i = 0; i < this.radius; i += 5) {
            let alpha = map(i, 0, this.radius, 255, 50);
            let red = map(noise(this.x * 0.02, this.y * 0.02, this.time), 0, 1, 200, 255);
            fill(red, 50, 0, alpha);
            ellipse(this.x, this.y, i * 2);
        }
        this.time += 0.01;
    }

    checkCollision(ball) {
        let distSq = (ball.body.position.x - this.x) ** 2 + (ball.body.position.y - this.y) ** 2;
        if (distSq < this.radius ** 2) {
            if (this.type === "water") {
                this.applyWaterEffect(ball);
            } else if (this.type === "lava") {
                this.applyLavaEffect(ball);
            }
        } else {
            // Ensure balls are removed from activeBalls if they leave the hotspot
            if (this.activeBalls.has(ball)) {
                this.activeBalls.delete(ball);
                this.stopSoundIfNoBalls();
            }
        }
    }

    applyWaterEffect(ball) {
        if (!this.activeBalls.has(ball)) {
            this.activeBalls.add(ball);

            // Stop lava sound if playing
            if (lavaSound.isPlaying()) {
                lavaSound.stop();
            }

            // Start water sound if not already playing
            if (!waterSound.isPlaying()) {
                waterSound.loop();
            }
        }

        // Apply slowing whirlpool effect
        let dx = this.x - ball.body.position.x;
        let dy = this.y - ball.body.position.y;
        let distSq = dx * dx + dy * dy;
        let forceMagnitude = 0.005 / Math.sqrt(distSq + 1);
        let dist = Math.sqrt(distSq);
        let forceX = (dx / dist) * forceMagnitude;
        let forceY = (dy / dist) * forceMagnitude;
        Matter.Body.applyForce(ball.body, { x: ball.body.position.x, y: ball.body.position.y }, { x: forceX, y: forceY });
    }

    applyLavaEffect(ball) {
        if (!this.activeBalls.has(ball)) {
            this.activeBalls.add(ball);

            // Stop water sound if playing
            if (waterSound.isPlaying()) {
                waterSound.stop();
            }

            // Start lava sound if not already playing
            if (!lavaSound.isPlaying()) {
                lavaSound.loop();
            }
        }

        // Apply opacity reduction
        ball.opacity -= 10;
        if (ball.opacity <= 0) {
            this.activeBalls.delete(ball);
            ball.removeFromWorld();

            // Correctly calculate the pool table boundaries
            const tableLeft = width / 2 - poolTable.width / 2 + poolTable.borderThickness;
            const tableRight = width / 2 + poolTable.width / 2 - poolTable.borderThickness;
            const tableTop = height / 2 - poolTable.height / 2 + poolTable.borderThickness;
            const tableBottom = height / 2 + poolTable.height / 2 - poolTable.borderThickness;

            // Ensure the respawn position is within the pool table boundaries
            const randomX = random(tableLeft + ball.radius, tableRight - ball.radius);
            const randomY = random(tableTop + ball.radius, tableBottom - ball.radius);

            Matter.Body.setPosition(ball.body, { x: randomX, y: randomY });
            ball.opacity = 255; // Reset opacity
            Matter.World.add(world, ball.body); // Add back to Matter.js world
            ball.removed = false; // Reset removed flag

            this.stopSoundIfNoBalls(); // Stop lava sound if no balls remain
        }
    }



    stopSoundIfNoBalls() {
        if (this.activeBalls.size === 0) {
            if (this.type === "water" && waterSound.isPlaying()) {
                waterSound.stop();
            } else if (this.type === "lava" && lavaSound.isPlaying()) {
                lavaSound.stop();
            }
        }
    }
}
