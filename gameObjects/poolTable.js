class PoolTable {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.borderThickness = 20; // Thickness of the brown border
        this.ballDiameter = this.width / 36; // Ball diameter
        this.pocketRadius = this.ballDiameter * 1.5; // Pocket size
        this.boundaries = []; // Initialize boundaries as an empty array
        this.pockets = this.definePocketPositions(); // Define pocket positions

    }

    drawTable() {
        // Draw the brown table border
        fill(139, 69, 19); // Brown color
        rectMode(CENTER);
        rect(width / 2, height / 2, this.width + this.borderThickness * 2, this.height + this.borderThickness * 2);

        // Draw the green felt area
        fill(34, 139, 34); // Green felt color
        rect(width / 2, height / 2, this.width, this.height);

        // Draw the rotated baulk line
        stroke(255); // White color for lines
        strokeWeight(2);
        let baulkX = width / 2 - this.width / 2 + this.width / 5; // Baulk line X position
        line(baulkX, height / 2 - this.height / 2, baulkX, height / 2 + this.height / 2); // Vertical baulk line

        // Draw the rotated D-zone (semi-circle)
        noFill(); // No fill for the semi-circle
        arc(baulkX, height / 2, this.width / 6, this.width / 6, HALF_PI, PI + HALF_PI);

        // Draw the yellow squares and black pockets independently
        this.drawPocket(width / 2 - this.width / 2 - this.borderThickness / 2, height / 2 - this.height / 2 - this.borderThickness / 2, "top-left"); // Top-left pocket
        this.drawPocket(width / 2 + this.width / 2 + this.borderThickness / 2, height / 2 - this.height / 2 - this.borderThickness / 2, "top-right"); // Top-right pocket
        this.drawPocket(width / 2 - this.width / 2 - this.borderThickness / 2, height / 2 + this.height / 2 + this.borderThickness / 2, "bottom-left"); // Bottom-left pocket
        this.drawPocket(width / 2 + this.width / 2 + this.borderThickness / 2, height / 2 + this.height / 2 + this.borderThickness / 2, "bottom-right"); // Bottom-right pocket
        this.drawPocket(width / 2, height / 2 - this.height / 2 - this.borderThickness / 2, "top-center"); // Top-center pocket
        this.drawPocket(width / 2, height / 2 + this.height / 2 + this.borderThickness / 2, "bottom-center"); // Bottom-center pocket
    }


    drawPocket(squareX, squareY, position) {
        // Draw the yellow square
        fill(255, 215, 0); // Yellow color
        noStroke();
        rectMode(CENTER);
        rect(squareX, squareY, this.pocketRadius * 0.7, this.pocketRadius * 0.7); // Yellow square stays fixed

        // Draw the black pocket at an offset from the square (adjust for each position)
        let pocketX = squareX;
        let pocketY = squareY;

        // Apply offset to move black pocket
        if (position === "top-left") {
            pocketX += 7;
            pocketY += 7;
        } else if (position === "top-right") {
            pocketX -= 7;
            pocketY += 7;
        } else if (position === "bottom-left") {
            pocketX += 7;
            pocketY -= 7;
        } else if (position === "bottom-right") {
            pocketX -= 7;
            pocketY -= 7;
        } else if (position === "top-center") {
            pocketY += 7;
        } else if (position === "bottom-center") {
            pocketY -= 7;
        }

        // Draw the black pocket
        fill(0); // Black color
        ellipse(pocketX, pocketY, this.pocketRadius * 0.8); // Black pocket position is now independent
    }

    definePocketPositions() {
        return [
            { x: width / 2 - this.width / 2 - this.borderThickness / 2, y: height / 2 - this.height / 2 - this.borderThickness / 2 },
            { x: width / 2 + this.width / 2 + this.borderThickness / 2, y: height / 2 - this.height / 2 - this.borderThickness / 2 },
            { x: width / 2 - this.width / 2 - this.borderThickness / 2, y: height / 2 + this.height / 2 + this.borderThickness / 2 },
            { x: width / 2 + this.width / 2 + this.borderThickness / 2, y: height / 2 + this.height / 2 + this.borderThickness / 2 },
            { x: width / 2, y: height / 2 - this.height / 2 - this.borderThickness / 2 },
            { x: width / 2, y: height / 2 + this.height / 2 + this.borderThickness / 2 },
        ];
    }

    getPocketPositions() {
        return this.pockets.map(pocket => ({
            x: pocket.x,
            y: pocket.y,
            radius: this.pocketRadius,
        }));
    }

    createBoundaries() {
        // Top boundary
        this.boundaries.push(
            Matter.Bodies.rectangle(width / 2, height / 2 - this.height / 2 - this.borderThickness / 2, this.width, 10, {
                isStatic: true,
            })
        );

        // Bottom boundary
        this.boundaries.push(
            Matter.Bodies.rectangle(width / 2, height / 2 + this.height / 2 + this.borderThickness / 2, this.width, 10, {
                isStatic: true,
            })
        );

        // Left boundary
        this.boundaries.push(
            Matter.Bodies.rectangle(width / 2 - this.width / 2 - this.borderThickness / 2, height / 2, 10, this.height, {
                isStatic: true,
            })
        );

        // Right boundary
        this.boundaries.push(
            Matter.Bodies.rectangle(width / 2 + this.width / 2 + this.borderThickness / 2, height / 2, 10, this.height, {
                isStatic: true,
            })
        );

        // Add the boundaries to the Matter.js world
        Matter.World.add(world, this.boundaries);
    }
}
