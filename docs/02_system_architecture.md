# System Architecture

This document explains how the hardware in the Poor Man's Throttle system works together.

The system is intentionally simple and uses only a few major components.

---

# System Overview

The smartphone sends commands to the locomotive.

The ESP32 controller receives those commands and adjusts the motor speed and direction.

```
Smartphone
     │
Bluetooth
     │
ESP32 Controller
     │
Motor Control Signals
     │
IBT-2 Motor Driver
     │
Locomotive Motor
```

---

# Main System Components

| Component | Role |
|----------|------|
| Smartphone | Sends throttle commands |
| ESP32 | Central controller |
| IBT-2 Motor Driver | High current motor control |
| Power System | Supplies electricity |
| Motor | Drives the locomotive |

---

# Power Architecture

The system uses **two separate power paths**.

• Motor Power  
• Logic Power

Separating these improves reliability and reduces electrical noise.

---

# Motor Power Path

Motor power provides energy to move the locomotive.

```
Battery Adapter or DC Transformer
            │
       (Optional for Battery Unnecessary for DC power))
     Buck Converter
            │
           Fuse
            │
      IBT-2 Motor Driver
            │
            Motor
```

## Optional Buck Converter

The buck converter reduces voltage from high-voltage batteries.

Example:

20V battery → reduced to about 15V. (for a 15V motor spec)

This can help protect smaller locomotive motors.

The buck converter is **optional**.

---

# Logic Power Path

The ESP32 controller uses a dedicated 5V power module.

```
Battery / DC Rail
        │
   5V Power Module
        │
     ESP32 USB-C
```

This provides a stable voltage for the controller.

---

# Control Wiring

The ESP32 sends control signals to the IBT-2 motor driver.

```
ESP32 GPIO Pins
        │
        │
     IBT-2 Inputs
        │
     IBT-2 Motor Driver
```

The IBT-2 motor driver converts these signals into motor power.

---

# Noise Reduction (Optional)

Electric motors can produce electrical noise.

Optional components can help reduce this noise.

Examples:

| Component | Purpose |
|----------|---------|
| 470µF capacitor | Stabilizes motor driver power |
| 220µF capacitor | Stabilizes 5V supply |
| Ferrite core | Reduces interference from motor wires |

These components are **optional but recommended**.

---

# Typical Installation Layout

The electronics can be installed in different locations.

Common installations include:

• inside the locomotive  
• inside a tender  
• inside a battery car  
• inside a small electronics enclosure

---

# Next Step

Continue to:

This document lists the parts required to build the system.

https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/03_bill_of_materials.md