let isCreativeMode = false; // Global flag
let creativeModeManager; // Manager for creative mode logic

function creativeMode() {
    console.log("Creative Mode Activated!");

    // Reset the table
    setStartingPositions();

    // Initialize the creative mode manager
    creativeModeManager = new CreativeModeManager();
    creativeModeManager.setup();

    // Set the flag to indicate creative mode is active
    isCreativeMode = true;
}

function drawCreativeMode() {
    if (creativeModeManager) {
        creativeModeManager.update(); // Update timers and effects
        creativeModeManager.draw(); // Draw hotspots and effects
        creativeModeManager.checkCollisions([...redBalls, ...coloredBalls, cueBall]); // Handle collision detection
    }
}
