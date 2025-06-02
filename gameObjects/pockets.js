// code to check if ball is inside pocket and checks what type of ball 
(function () {
    class Pocket {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }

        isBallInPocket(ball) {
            const ballPos = ball.body.position;
            const distance = dist(ballPos.x, ballPos.y, this.x, this.y);
            return distance <= this.radius * 0.6;
        }
    }

    let pocketObjects = [];

    // Initialize pockets, converts pool table pocket positions into objects
    window.initializePockets = function (poolTable) {
        pocketObjects = poolTable.getPocketPositions().map(
            pocket => new Pocket(pocket.x, pocket.y, pocket.radius)
        );
    };

    // Check for pocketed balls
    window.checkPocketedBalls = function (balls) {
        for (let ball of balls) {
            for (let pocket of pocketObjects) {
                if (pocket.isBallInPocket(ball)) {
                    console.log(`Ball detected in pocket: Color=${ball.color}, Position=${ball.body.position.x}, ${ball.body.position.y}`);
                    handlePocketEvent(ball); // Delegate handling to code in scenarios.js
                    break;
                }
            }
        }
    };

})();
