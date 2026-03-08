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

---

# Visual Inspection

Carefully inspect the wiring.

Check for:

• exposed wires touching metal  
• reversed connections  
• loose connectors

Correct any issues before continuing.

---

# Power-Up Procedure

Follow these steps in order.

### Step 1

Connect the power source.

Examples:

• battery adapter  
• DC transformer

---

### Step 2

Observe the ESP32.

Expected result:

• ESP32 powers on, Red LED turns on (if the firmware is installed the Blue LED blinks as well)

---

### Step 3

Verify motor driver power.

The motor driver should receive power through the fuse.

---

### Step 4

Open the smartphone throttle app.

Connect to the locomotive.

---

### Step 5

Slowly increase the throttle.

Expected behavior:

• locomotive motor begins to rotate

---

# If the Motor Runs Backward

Simply swap the motor wires.

```
Motor Driver M+ ↔ Motor Driver M-
```

---

# If Nothing Happens

Turn off power immediately.

Check:

• fuse  
• wiring connections  
• ESP32 power module

Troubleshooting steps are covered in the next document.

---

# Next Step

Continue to:

This document explains how to diagnose common problems.

https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/09_troubleshooting.md


[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
