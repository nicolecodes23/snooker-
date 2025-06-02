// Commentary 

/** This snooker application is structured using OOP principles to ensure modularity, maintainability, and cohesion. 
 * The poolTable.js file defines table boundaries and pockets, while poolBalls.js manages ball properties and physics interactions.
 * The cueStick.js file handles player interactions, including rotation, trajectory, and force application. 
 * Creative mode in creativeMode.js introduces dynamic effects using hotSpot.js for water and lava interactions. 
 * Game modes in ballModes.js ensure flexible setups. Matter.js is used to integrate these components seamlessly, ensuring realistic gameplay.

/** The decision to use mouse interaction for placing the cue ball in the "D" zone and key-based interaction for cue stick controls stems from a focus on user experience
 * and technical considerations. Mouse-based placement allows intuitive control, mimicking the natural drag-and-drop action familiar in digital environment. 
 * This enables precise positioning within the restricted "D" zone, ensuring that players can visually align the cue ball while adhering to snooker rules. 
 * Conversely, cue stick actions like hitting the ball or toggling its visibility rely on key-based interaction for ergonomic
 * efficiency and to prevent accidental actions during gameplay. Keys offer discrete input for force adjustment (e.g., 'W' and 'S') and striking the ball (e.g., 'Spacebar'), 
 * ensuring consistent and deliberate player actions. This design balances precision and responsiveness, adhering to usability principles while utilizing the 
 * technical strengths of both interaction methods.
 */ 

/** In ball mode 2, random placement algorithm is used to position all red balls on the table,excluding the cue ball.
 * This mode enhances gameplay variability and unpredictabiltiy. The choice of random placement is driven by the idea to maintain special constraints while ensuring the random red balls do not overlap, which is crucial for snooker gameplay dynamics.
 * The implementation utilizes a bounded randomization approach, leveraging a pseudo- random number generator to calculate positions within the pool table area. Each ball's position is validated using collision-checking function that calculates
 * the squared distance between potential placement points and existing ball positions. This avoids overloading the CPU with square root operations while also ensuring accurate overlap detections. 
 * If a valid position is not found within a minimum number of tries, the algorithm moves to the next ball, preventing infinite loops.
 */

/** The Creative Mode extension, "Water vs Lava," introduces a novel and dynamic gameplay element that enhances both challenge and engagement.
 * In this mode, randomly spawning hotspots simulate water and lava effects, creating unique interactions with the balls. 
 * Water slows down ball motion, simulating a whirlpool effect, while lava gradually decreases ball opacity, leading to ball removal and respawning. 
 * These mechanics are achieved through Perlin noise animations and physics-based force application, synchronized with sound effects for an immersive experience. 
 * This extension adds unpredictability, requiring players to adapt their strategies and skillfully navigate hazards, thus elevating the challenge beyond traditional snooker rules.
 * By merging aesthetic visuals with interactive physics, this extension offers a fresh twist on classic gameplay, appealing to both casual players and competitive enthusiasts. */