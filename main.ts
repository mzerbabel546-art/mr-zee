// This code is written for the microbit.org MakeCode editor using the Hummingbird extension.
// IMPORTANT: You must add the Hummingbird extension for this code to run.

// --- ASSUMED HARDWARE CONFIGURATION ---
// Wheels (Continuous Rotation Motors): Motor Port 1 (Left) and Motor Port 2 (Right)
// Steering (Position Servo): Servo Port 1 (S1)
// Distance Sensor: Sensor Port 2 (S2) - Assumes a distance sensor that returns centimeters.
// Headlights (LEDs): LED Port 1 and LED Port 2

let currentSteeringAngle = 90; // Center position for the steering servo (0-180 degrees)

// --- FUNCTION DEFINITIONS ---

/**
 * Sets the speed for both wheels to control forward/backward motion.
 * Speed is a percentage: -100 (full reverse) to 100 (full forward).
 */
function set_drive_speed(speed: number) {
    // Motor 1 (Left) and Motor 2 (Right) are set to the same speed for straight motion.
    // The direction might need to be inverted based on how the motors are wired/mounted.
    hummingbird.setmotor(HummingbirdMotor.Motor1, speed);
    hummingbird.setmotor(HummingbirdMotor.Motor2, speed);
}

/**
 * Sets the steering angle (Position Servo).
 * Angle: 0 (Full Left), 90 (Straight), 180 (Full Right).
 */
function set_steering(angle: number) {
    // Assuming the steering servo is connected to Servo 1
    hummingbird.setServo(HummingbirdServo.Servo1, angle);
    currentSteeringAngle = angle;
}

/**
 * Stops the truck and makes it "shout" and play sound.
 * This is the interactive moment for the learners.
 */
function shout_and_look_around() {
    // 1. Stop Movement
    set_drive_speed(0);

    // 2. Headlights Flash
    hummingbird.setLED(HummingbirdLED.LED1, 0); // Off
    hummingbird.setLED(HummingbirdLED.LED2, 0); // Off

    // 3. "Shout" the message (Display on Micro:bit screen)
    basic.showString("Hello who can play with?");

    // 4. Play a cheerful melody (Sound output for blind learners)
    music.playMelody("C D E F G A B C5", 120);

    // 5. Simulate "looking around" with the steering servo
    set_steering(30); // Look Left
    basic.pause(500);
    set_steering(150); // Look Right
    basic.pause(500);
    set_steering(90); // Return to Center

    // 6. Resume headlights
    hummingbird.setLED(HummingbirdLED.LED1, 100);
    hummingbird.setLED(HummingbirdLED.LED2, 100);
}


// --- MAIN PROGRAM START ---

// Setup Block: Runs once when the Micro:bit starts.
basic.forever(function () {
    // 1. Initialize Connection (optional, but good practice)
    hummingbird.startHummingbird();

    // 2. Turn on Headlights
    hummingbird.setLED(HummingbirdLED.LED1, 100); // Full brightness
    hummingbird.setLED(HummingbirdLED.LED2, 100); // Full brightness

    // 3. Set Initial Steering (Straight)
    set_steering(90);

    // 4. Start Moving Forward
    set_drive_speed(30); // Slow cruising speed

    // This loop handles the continuous logic of movement and sensing
    while (true) {
        // Read the distance sensor (assuming it's connected to SENSOR 2)
        // Note: The specific function may vary based on sensor type. We assume 'Distance' sensor returning cm.
        let distance_cm = hummingbird.getSensor(HummingbirdSensor.Sensor2);

        // --- Sensor Logic for Blind Learners ---
        // If the sensor reading is less than 20 cm, stop and interact.
        if (distance_cm > 0 && distance_cm < 20) {
            shout_and_look_around();
            // After interacting, pause for a moment before starting to move again.
            basic.pause(2000);
            set_drive_speed(30); // Resume forward motion
        }

        // --- Autonomous Movement (Wandering) ---
        // Randomly adjust steering slightly to make the movement less predictable.
        // This makes the 'toy' feel more alive and encourages interaction.

        // Create a small random adjustment between -15 and 15 degrees
        let adjustment = Math.randomRange(-15, 15);
        let newAngle = currentSteeringAngle + adjustment;

        // Keep the angle within safe limits (30 to 150)
        newAngle = Math.max(30, Math.min(150, newAngle));

        set_steering(newAngle);

        // Wait a short time before the next loop cycle and random adjustment
        basic.pause(500);
    }
})
