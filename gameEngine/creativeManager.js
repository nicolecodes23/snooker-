class CreativeModeManager {
    constructor() {
        this.hotspots = [];
        this.timer = 0;
        this.switchInterval = 10000; // 10 seconds
    }

    setup() {
        this.createRandomHotspot();
    }

    createRandomHotspot() {
        let type = random(["water", "lava"]);
        let x = random(200, width - 200); // Avoid edges
        let y = random(200, height - 200);
        let radius = random(50, 100);
        this.hotspots = [new Hotspot(type, x, y, radius)]; // Replace old hotspots
    }

    update() {
        if (!isCreativeMode) return; // Skip updates if creative mode is inactive
        this.timer += deltaTime;
        if (this.timer > this.switchInterval) {
            this.createRandomHotspot();
            this.timer = 0; // Reset timer
        }
    }

    draw() {
        if (!isCreativeMode) return; // Skip rendering if creative mode is inactive
        for (let hotspot of this.hotspots) {
            hotspot.draw();
        }
    }

    checkCollisions(balls) {
        if (!isCreativeMode) return; // Skip rendering if creative mode is inactive
        for (let hotspot of this.hotspots) {
            for (let ball of balls) {
                hotspot.checkCollision(ball);
            }
        }
    }
    clearHotspots() {
        this.hotspots = []; // Clear all hotspots
    }
}
