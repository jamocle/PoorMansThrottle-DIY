# Build Guide

This guide walks through the complete hardware assembly of the Poor Man's Throttle.

The build process follows these steps:

1. Prepare the power system  
2. Configure the buck converter (optional)  
3. Wire the ESP32 controller  
4. Connect the IBT-2 motor driver  
5. Install optional noise suppression  
6. Connect the locomotive motor  
7. Perform the first power test

Beginner and advanced builders can follow the same steps.

---

# System Wiring Overview

```
Tool (e.g. DeWalt) Battery Adapter or DC Transformer
           │
      (Optional for Battery (Not necessary for DC))
    Buck Converter
           │
          Fuse
           │
    IBT-2 Motor Driver
           │
         Motor



Battery / DC Rail
        │
   5V Power Module for Logic Processor
        │
     ESP32 USB-C
```

---

# Step 1 — Prepare the Power System

The power system supplies electricity to the IBT-2 motor driver and ESP32.

Power sources supported:

• cordless tool battery  
• DC model railroad transformer

---

## Battery Power Setup

```
Tool Battery Adapter
       │
  (Optional)
Buck Converter
       │
      Fuse
       │
 IBT-2 Motor Driver
       |
Locomotive Motor
```

---

## DC Transformer Setup

```
DC Transformer
      │
     Fuse
      │
 IBT-2 Motor Driver
      |
Track Connector
```

No Tool battery adapter is required for DC installations.

---

## Step 1 Wiring Table

### Battery Power

#### No Buck Converter
| From | To | Purpose |
|-----|----|--------|
| Tool Battery Adapter + | Fuse Input | Overcurrent protection |
| Fuse Output | IBT-2 Motor Driver B+ | Motor power |
| Tool Battery Adapter - | IBT-2 Motor Driver B- | Ground connection |

#### With OPTIONAL Buck Converter
| From | To | Purpose |
|-----|----|--------|
| Tool Battery Adapter + | Buck Converter Input + | 20V->15V |
| Tool Battery Adapter - | Buck Converter Input - | Ground |
| Buck Converter Output + | Fuse Input | Overcurrent protection |
| Fuse Output | IBT-2 Motor Driver B+ | Motor power |
| Buck Converter Output - | IBT-2 Motor Driver B- | Ground connection |

### DC Power Transformer

| From | To | Purpose |
|-----|----|--------|
| Transformer + | Fuse Input | Overcurrent protection |
| Fuse Output | IBT-2 Motor Driver B+ | Motor power |
| Transformer - | IBT-2 Motor Driver B- | Ground connection |


---

# Step 2 — Configure Buck Converter (Optional)

This step is only required if a **buck converter** is used.

The buck converter reduces battery voltage.

Example:

20V battery → about **15V output**

---

## Adjusting the Buck Converter

1. Connect the buck converter to the battery adapter.
2. Measure the output voltage using a multimeter.
3. Turn the adjustment screw until the desired voltage is reached.

Do **not connect the IBT-2 motor driver yet**.

---

## Step 2 Wiring Table

| From | To | Purpose |
|-----|----|--------|
| Battery Adapter + | Buck Converter Input + | Power input |
| Battery Adapter - | Buck Converter Input - | Ground |
| Buck Converter Output + | Fuse Input | Reduced voltage supply |
| Buck Converter Output - | IBT-2 Motor Driver B- | Ground |

---

```
[Photo: Buck Converter Adjustment]
```

---

# Step 3 — Wire the ESP32 Controller

The ESP32 controls the IBT-2 motor driver.

A separate **5V power module** powers the ESP32.

From this point the Power source will be simply referred to as Power + and -.  The concepts is the same for Battery power and DC power.  If you are powering with Battery power the Power + and - will refer to either the Battery +- or the Buck Converter Output +-.  If you are powering with a DC transformer the Power + and - will refer to the Transformer +-.

```
      Power
        │
   5V Power Module for the logic processor
        │
     ESP32 USB-C
```

---

## 5V Power Module, ESP32, and IBT-2 Motor Driver Wiring

| 5V Power Module Wire | IBT-2 Motor Driver Connection |
|----------------------|-------------------------------|
| Red                  | B+                            |
| Black                | B-                            |
| USB-C Male           | ESP32 USB-C Female            |

---

## ESP32 Control Connections

| ESP32 Pin | IBT-2 Motor Driver Pin |
|-----------|------------------------|
| GPIO25    | RPWM                   |
| GPIO26    | LPWM                   |
| GPIO27    | R_EN                   |
| GPIO33    | L_EN                   |
| 5V / VIN  | VCC                    |
| GND       | GND                    |

---

## Step 3 Wiring Table

| From                       | To            | Purpose                        |
|----------------------------|---------------|--------------------------------|
| 5V Power Module Red Wire   | IBT-2 B+      | 5V Power Module Source Power + |
| 5V Power Module Black Wire | IBT-2 B-      | 5V Power Module Source Power - |
| 5V Power Module Output     | ESP32 USB-C   | Controller power               |
| ESP32 GPIO25 | IBT-2 RPWM  | Motor control |
| ESP32 GPIO26 | IBT-2 LPWM  | Motor control |
| ESP32 GPIO27 | IBT-2 R_EN  | Enable signal |
| ESP32 GPIO33 | IBT-2 L_EN  | Enable signal |
| ESP32 GND                  | IBT-2 GND     | Shared ground                  |

---

```
[Photo: ESP32 Wiring]
```

---

# Step 4 — Connect the IBT-2 Motor Driver to the Locomotive Motor

The IBT-2 motor driver controls the locomotive motor.

```
ESP32
  │
Control Signals
  │
IBT-2 Motor Driver
  │
 Motor
```

---

## IBT-2 Motor Driver Power Connections

| IBT-2 Motor Driver Terminal | Connection                                  |
|-----------------------------|---------------------------------------------|
| B+                          | Power input (Battery or tansformer Power)   |
| B-                          | Ground                                      |
| M+                          | Motor lead **OR** Track Power Lead          |
| M-                          | Motor lead **OR** Track Power Lead          |

---

## Step 4 Wiring Table

| From                  | To                                     |  Purpose                              |
|-----------------------|----------------------------------------|---------------------------------------|
| Fuse Output           | IBT-2 Motor Driver B+                  | Motor power                           |
| Power Ground          | IBT-2 Motor Driver B-                  | Ground                                |
| IBT-2 Motor Driver B+ | 5V Power Module Red                    | + Power source to the 5V Power Module |
| IBT-2 Motor Driver B- | 5V Power Module Black                  | - Power source to the 5V Power Module |
| IBT-2 Motor Driver M+ | Motor lead **OR** Track Power Lead     | Motor output                          |
| IBT-2 Motor Driver M- | Motor lead **OR** Track Power Lead     | Motor output                          |

---

```
[Photo: Motor Driver Wiring]
```

---

# Step 5 — Install Noise Suppression (Optional)

Noise suppression components can improve reliability.

Optional components:

• 470µF capacitor  
• 220µF capacitor  
• ferrite core

---

## Optional Installation

| Component       | Installation                          |
|-----------------|---------------------------------------|
| 470µF capacitor | Across IBT-2 motor driver power input |
| 220µF capacitor | Across 5V supply near ESP32           |
| Ferrite core    | Around motor wires                    |

These components are **optional but recommended**.

---

# Step 6 — Connect the Motor

Connect the locomotive motor to the IBT-2 motor driver outputs.

```
IBT-2 Motor Driver M+
        │
      Motor
        │
IBT-2 Motor Driver M-
```

If the locomotive runs backward, simply swap the motor wires.

---

## Step 6 Wiring Table

| From | To | Purpose |
|-----|----|--------|
| IBT-2 Motor Driver M+ | Motor lead **OR** Track Power Lead | Motor output |
| IBT-2 Motor Driver M- | Motor lead **OR** Track Power Lead | Motor output |

---

# Step 7 — First Power Test

Before applying power:

Check the following:

• wiring is secure  
• fuse installed  
• polarity correct  
• no exposed wires touching

Then power the system.

---

## Expected Result

• ESP32 powers on (Red Light turns on.  If Firmware is Loaded the Blue light will blink as well)  

**NOTE**: Firmware installation instructions are in 09_firmware_installation.md

---

# Build Complete

You have completed the basic hardware build.

Next document:

```
07_installation_options.md
```

This section explains different ways to install the system inside locomotives.