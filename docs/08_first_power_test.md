# First Power Test

This guide explains how to safely test the system after assembly.

Do not skip these checks before applying power.

---

# Pre-Power Checklist

Before connecting power verify the following:

| Check | Description |
|-----|-------------|
| Fuse installed | Protects electronics |
| Correct polarity | Positive and negative wiring verified |
| No loose wires | Prevents short circuits |
| Buck converter adjusted (if used) | Correct voltage output |
| Motor driver wiring checked | Motor outputs and control wiring verified |
| Drive wheels clear | Locomotive can move without falling or causing damage |

---

# Visual Inspection

Carefully inspect the wiring.

Check for:

* exposed wires touching metal
* reversed power connections
* loose connectors
* motor wires shorting together
* motor driver input and output wiring connected to the correct terminals

Correct any issues before continuing.

---

# What the Firmware Does at Startup

When power is applied, the firmware initializes the controller into a safe state before motion commands are accepted.

Expected startup behavior:

* the ESP32 powers on
* the motor outputs are forced safe and the throttle starts stopped
* BLE starts automatically
* the onboard status LED enters its disconnected search pattern until a control connection is made
* Wi-Fi/WebSocket control is optional and only starts if it has been enabled and configured in firmware settings

Notes:

* On many ESP32 boards, the board power LED may turn on as soon as power is present
* The firmware-controlled status LED behavior is a better indicator than a generic board LED because board LED colors can vary by hardware

---

# Power-Up Procedure

Follow these steps in order.

### Step 1

Connect the power source.

Examples:

* battery adapter
* DC transformer

---

### Step 2

Observe the controller for normal startup.

Expected result:

* the ESP32 powers up
* the locomotive should remain stopped at power-up
* the firmware status LED should blink its disconnected/search pattern while waiting for a connection

If the locomotive starts moving immediately, turn power off and inspect the wiring and motor driver configuration before continuing.

---

### Step 3

Verify motor driver power.

The motor driver should receive power through the fuse.

Also verify that the controller remains idle with no throttle applied.

---

### Step 4

Open the smartphone throttle app and connect over BLE.

Expected result:

* the locomotive appears as a BLE device
* if no custom train name has been configured, it may advertise with the default firmware name
* once connected, the onboard status LED changes from blinking to solid on

If Wi-Fi/WebSocket has been configured, that can act as a secondary control path, but it is not required for a first power test.

---

### Step 5

Slowly increase the throttle.

Expected behavior:

* the locomotive motor begins to rotate
* motion should begin gradually depending on firmware motion settings
* reversing direction while already moving may not happen instantly because the firmware can stop first before changing direction

Use a very low throttle for the first movement test.

---

# If the Motor Runs Backward

First check whether the installed motor driver and direction settings are configured as intended.

If the hardware is wired correctly but the motor direction is opposite of what you expect, swap the motor wires:

```text
Motor Driver M+ ↔ Motor Driver M-
```

---

# If Nothing Happens

Turn off power immediately if anything seems wrong.

Then check:

* fuse
* wiring connections
* ESP32 power module
* motor driver power input
* BLE connection to the controller
* motor driver type and pin configuration
* direction and throttle settings

If the controller powers up normally and connects, but the motor still does not move, continue with troubleshooting.

---

# Next Step

Continue to:

This document explains how to diagnose common problems.

[**09_troubleshooting.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/09_troubleshooting.md)

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
