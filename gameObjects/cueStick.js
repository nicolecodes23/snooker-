//constructor for cuestick
class CueStick {
    constructor() {
        this.length = 190; // Length of the cue stick
        this.width = 5; // Width of the cue stick
        this.angle = 0; // Current angle of the cue stick
        this.force = 0.005; // Initial force applied to the cue ball
        this.maxForce = 0.015; // Maximum force to prevent overly strong hits
        this.minForce = 0.001; // Minimum force to avoid too weak hits
        this.forceStep = 0.0005; // Increment for the force adjustment
    }

    drawCue(cueBall) {
        // Position cue stick at the cue ball's position
        const pos = cueBall.body.position;

        push();
        translate(pos.x, pos.y);
        rotate(this.angle);

        // Access the 2D canvas context for gradient drawing
        const ctx = drawingContext;

        // Create a linear gradient along the length of the cue stick
        const gradient = ctx.createLinearGradient(
            -this.length * 0.76, 0, // Start of the gradient (relative to cue stick length)
            this.length * 0.44, 0   // End of the gradient
        );

        // Add multiple colors to the gradient for a magical look
        gradient.addColorStop(0, 'navy');     // Start with dark blue
        gradient.addColorStop(0.25, 'royalblue');     // Transition to royal blue
        gradient.addColorStop(0.5, 'mediumorchid');    // Transition to medium orchid
        gradient.addColorStop(0.75, 'violet');   // Transition to violet
        gradient.addColorStop(1, 'hotpink');        // End with hot pink

        // Set the gradient as the fill style for the cue stick
        ctx.fillStyle = gradient;

        // Draw the cue stick as a rectangle
        noStroke(); 
        rect(-this.length * 0.62, -this.width / 2, this.length, this.width); // Draw cue stick
        pop();

        // Display the current force in the top-left corner for UI clarity
        fill(255);
        textSize(25);
        textAlign(LEFT);
        text(`Force: ${(this.force * 1000).toFixed(1)}`, 50, 45);
    }

    drawTrajectory(cueBall) {
        const pos = cueBall.body.position; // Get cue ball position
        const trajectoryLength = 230; // Length of the trajectory line
        const dotSpacing = 10; // Distance between each dot

        // Calculate the direction of the trajectory
        const dx = cos(this.angle) * dotSpacing;
        const dy = sin(this.angle) * dotSpacing;

        // Draw dotted line by iterating along the trajectory
        push();
        stroke(255); // White color for the dots
        strokeWeight(2);

        for (let i = 0; i < trajectoryLength; i += dotSpacing * 2) {
            const startX = pos.x + i * dx / dotSpacing;
            const startY = pos.y + i * dy / dotSpacing;
            const endX = startX + dx;
            const endY = startY + dy;

            line(startX, startY, endX, endY); // Draw each short segment
        }
        pop();
    }

    rotateCue(mouseX, mouseY, cueBall) {
        // Calculate the angle between the cue ball and the mouse pointer
        const pos = cueBall.body.position;
        this.angle = atan2(mouseY - pos.y, mouseX - pos.x);
    }

    adjustForce(increase) {
        // Adjust the force based on user input
        if (increase) {
            this.force = constrain(this.force + this.forceStep, this.minForce, this.maxForce);
        } else {
            this.force = constrain(this.force - this.forceStep, this.minForce, this.maxForce);
        }
    }

    hitCueBall(cueBall) {
        // Apply force to the cue ball
        const forceX = this.force * cos(this.angle);
        const forceY = this.force * sin(this.angle);
        Matter.Body.applyForce(cueBall.body, { x: cueBall.body.position.x, y: cueBall.body.position.y }, { x: forceX, y: forceY });

        // Reset the force after the hit
        this.force = this.minForce;
    }
}

window.CueStick = CueStick;
