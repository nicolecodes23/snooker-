(function () {
    // Collision Notification Logic
    let collisionNotification = "";

    window.initializeCollisionNotifications = function (engine, cueBall, redBalls, coloredBalls, poolTable) {
        Matter.Events.on(engine, "collisionStart", (event) => {
            if (!firstHitComplete) return; // Skip notifications until the first hit is complete

            event.pairs.forEach(({ bodyA, bodyB }) => {
                const isCueBall = (body) => body === cueBall.body;
                const otherBody = isCueBall(bodyA) ? bodyB : isCueBall(bodyB) ? bodyA : null;

                if (otherBody) {
                    if (redBalls.some(ball => ball.body === otherBody)) {
                        collisionNotification = "Cue-Red Collision!";
                    } else if (coloredBalls.some(ball => ball.body === otherBody)) {
                        collisionNotification = "Cue-Colour Collision!";
                    } else if (poolTable.boundaries.includes(otherBody)) {
                        collisionNotification = "Cue-Cushion Collision!";
                    }
                }
            });
        });
    };

    window.displayCollisionNotification = function () {
        if (collisionNotification) {
            fill(255); // White text color
            textSize(25);
            textAlign(CENTER, BOTTOM);
            text(collisionNotification, width / 2, height - 40); // Display at the bottom
        }
    };
})();

(function () {
    // Rule Violation Logic
    let lastPocketedBalls = [];
    let ruleViolationNotification = "";

    function handlePocketEvent(ball) {
        if (ball === cueBall) {
            resetCueBall();
        } else if (redBalls.includes(ball)) {
            redBallFallSound.play(); // play sound for red ball pocketed
            processPocketedBall("red");
            removeRedBall(ball);
        } else if (coloredBalls.includes(ball)) {
            processPocketedBall(ball.color);
            removeColoredBall(ball);
        } else {
            console.log("Unknown ball type potted.");
        }
    }

    function resetCueBall() {
        console.log("Cue ball potted! Resetting to 'D' zone.");
        cueBallFallSound.play();
        const dZone = { x: 400, y: 500 }; // position for "D" zone center
        Matter.Body.setPosition(cueBall.body, dZone);
    }

    function removeRedBall(ball) {
        console.log("Red ball potted! Removing from play.");
        redBalls = redBalls.filter(redBall => redBall !== ball);
        Matter.World.remove(world, ball.body);
    }

    function removeColoredBall(ball) {
        console.log("Colored ball potted! Checking for red balls...");
        coloredBalls = coloredBalls.filter(coloredBall => coloredBall !== ball);
        Matter.World.remove(world, ball.body);

        if (redBalls.length > 0) {
            coloredBallSpotSound.play();
            const randomX = Math.random() * 700 + 100;
            const randomY = Math.random() * 400 + 300;
            const newBall = new PoolBall(randomX, randomY, ball.radius, ball.color);
            newBall.enableMovement();
            coloredBalls.push(newBall);
            console.log(`New ${ball.color} ball respawned at (${randomX.toFixed(2)}, ${randomY.toFixed(2)}).`);
        } else {
            console.log(`No red balls left! ${ball.color} ball removed without respawning.`);
        }
    }

    function processPocketedBall(color) {
        lastPocketedBalls.push(color);

        if (lastPocketedBalls.length > 2) {
            lastPocketedBalls.shift();
        }

        if (lastPocketedBalls.length === 2 &&
            lastPocketedBalls[0] !== "red" && lastPocketedBalls[1] !== "red") {
            showRuleViolationNotification();
        }
    }

    function showRuleViolationNotification() {
        ruleViolationNotification = "Follow red → colored → red rule!";
    }

    window.displayRuleViolationNotification = function () {
        if (ruleViolationNotification) {
            fill(255, 0, 0); // Red text color
            textSize(28);
            textAlign(CENTER, TOP);
            text(ruleViolationNotification, 280, 100); // Display at the top
        }
    };

    window.handlePocketEvent = handlePocketEvent;
})();

