# Build Guide

This guide walks through the complete **default IBT-2 / BTS7960 hardware assembly** of the Poor Man's Throttle.

This document is intentionally **hardware-first**. It shows the standard **ESP32-WROOM-32 + IBT-2** build path that matches the firmware's default **DUAL_PWM** motor-driver mode and default pin assignments.

The firmware also supports additional motor-driver interface types, but those alternate driver wiring patterns are **not** the main scope of this document. For this build guide, follow the IBT-2 wiring shown here unless you are intentionally building for a different supported driver type.

[How To Build the PMT Youtube Video](https://youtu.be/eJoxLKSB3KE)

[Do I have a bad IBT-2 Board - Test your IBT-2 Board before you start - Youtube Video](https://youtu.be/VNKrYldYAV4)


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
Tool Battery Adapter or DC Transformer
           │
      (Optional for battery power)
      Buck Converter
           │
          Fuse
           │
    IBT-2 Motor Driver
           │
     Motor or Track Feed



Main Power Source
        │
   5V Power Module for Logic Power
        │
     ESP32 USB-C
```

---

# Supported Hardware Scope for This Guide

This guide documents the **default firmware wiring path**:

- **Controller target:** ESP32-WROOM-32  
- **Default motor-driver mode:** DUAL_PWM  
- **Typical driver board:** IBT-2 / BTS7960 style dual-PWM driver  
- **Default control pins used by firmware:**  
  - GPIO25 → Forward PWM / RPWM  
  - GPIO26 → Reverse PWM / LPWM  
  - GPIO27 → R_EN  
  - GPIO33 → L_EN  

If you are using a different supported motor-driver type such as **PWM_DIR**, **PWM_BIDIR**, or **DUAL_INPT**, the firmware can support it, but the ESP32 wiring will differ from the IBT-2 example shown in this document.

---

# Step 1 — Prepare the Power System

The power system supplies electricity to the IBT-2 motor driver and to the separate 5V logic supply used for the ESP32.

Power sources supported for the main motor path:

- cordless tool battery  
- DC model railroad transformer

The ESP32 should still be powered from a **separate regulated 5V source** such as a 5V power module feeding the ESP32 through USB-C.

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
       │
Motor or Track Feed
```

---

## DC Transformer Setup

```
DC Transformer
      │
     Fuse
      │
 IBT-2 Motor Driver
      │
Motor or Track Feed
```

No tool battery adapter is required for DC transformer installations.

---

## Step 1 Wiring Table

### Battery Power

#### No Buck Converter
| From | To | Purpose |
|-----|----|--------|
| Tool Battery Adapter + | Fuse Input | Overcurrent protection |
| Fuse Output | IBT-2 Motor Driver B+ | Motor power |
| Tool Battery Adapter - | IBT-2 Motor Driver B- | Ground connection |

#### With Optional Buck Converter
| From | To | Purpose |
|-----|----|--------|
| Tool Battery Adapter + | Buck Converter Input + | Reduce battery voltage if desired |
| Tool Battery Adapter - | Buck Converter Input - | Ground |
| Buck Converter Output + | Fuse Input | Reduced-voltage motor supply |
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

This step is only required if a **buck converter** is used on the main motor-power path.

The buck converter reduces battery voltage before it reaches the motor driver.

Example:

20V battery → about **15V output**

Use the voltage that is appropriate for your locomotive, motor, and installation.

---

## Adjusting the Buck Converter

1. Connect the buck converter to the battery adapter.
2. Measure the output voltage using a multimeter.
3. Turn the adjustment screw until the desired voltage is reached.

Do **not** connect the IBT-2 motor driver yet while making the adjustment.

---

## Step 2 Wiring Table

| From | To | Purpose |
|-----|----|--------|
| Battery Adapter + | Buck Converter Input + | Power input |
| Battery Adapter - | Buck Converter Input - | Ground |
| Buck Converter Output + | Fuse Input | Reduced-voltage supply |
| Buck Converter Output - | IBT-2 Motor Driver B- | Ground |

---

```
[Photo: Buck Converter Adjustment]
```

---

# Step 3 — Wire the ESP32 Controller

The ESP32 sends control signals to the IBT-2 motor driver.

A separate **5V power module** powers the ESP32. This logic supply is separate from the higher-voltage motor-power path.

From this point, the main motor supply will be referred to simply as **Power +** and **Power -**.

- For battery installations, **Power + / -** means either the raw battery output or the buck-converter output.
- For DC transformer installations, **Power + / -** means the transformer output.

```
      Main Power
          │
   5V Power Module for the logic processor
          │
       ESP32 USB-C
```

---

## 5V Power Module, ESP32, and IBT-2 Motor Driver Wiring

| 5V Power Module Wire | Connection |
|----------------------|------------|
| Red                  | Main Power + |
| Black                | Main Power - |
| USB-C Male           | ESP32 USB-C Female |

A common way to pick up **Main Power + / -** is from the same power points feeding the IBT-2 motor driver.

---

## ESP32 to IBT-2 Default Control Connections

These are the **default firmware pin assignments** for the standard IBT-2 / DUAL_PWM build.

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

| From | To | Purpose |
|------|----|---------|
| 5V Power Module Red Wire | Main Power + | 5V module source power |
| 5V Power Module Black Wire | Main Power - | 5V module source ground |
| 5V Power Module Output | ESP32 USB-C | Controller power |
| ESP32 GPIO25 | IBT-2 RPWM | Forward PWM control |
| ESP32 GPIO26 | IBT-2 LPWM | Reverse PWM control |
| ESP32 GPIO27 | IBT-2 R_EN | Enable signal |
| ESP32 GPIO33 | IBT-2 L_EN | Enable signal |
| ESP32 5V / VIN | IBT-2 VCC | Driver logic supply |
| ESP32 GND | IBT-2 GND | Shared logic ground |

---

## Important Note About Other Supported Motor Drivers

The firmware supports additional motor-driver interface types besides the IBT-2-style DUAL_PWM build shown here:

- **DUAL_PWM** — typical IBT-2 / BTS7960 wiring  
- **PWM_DIR** — one PWM pin plus one direction pin  
- **PWM_BIDIR** — one PWM/enable pin plus separate forward/reverse logic pins  
- **DUAL_INPT** — two-input H-bridge style control  

If you are building with one of those alternate driver types, do **not** follow the IBT-2 control-pin table above blindly. Use the motor-driver mode and pin mapping that match your specific hardware.

---

```
[Photo: ESP32 Wiring]
```

---

# Step 4 — Connect the IBT-2 Motor Driver to the Locomotive Motor

The IBT-2 motor driver controls the locomotive motor or the track feed for installations where the throttle is driving track power instead of wiring directly to the locomotive motor.

```
ESP32
  │
Control Signals
  │
IBT-2 Motor Driver
  │
 Motor or Track Feed
```

---

## IBT-2 Motor Driver Power Connections

| IBT-2 Motor Driver Terminal | Connection |
|-----------------------------|------------|
| B+                          | Main motor-power input |
| B-                          | Main power ground |
| M+                          | Motor lead **or** track power lead |
| M-                          | Motor lead **or** track power lead |

---

## Step 4 Wiring Table

| From | To | Purpose |
|------|----|---------|
| Fuse Output | IBT-2 Motor Driver B+ | Motor power |
| Power Ground | IBT-2 Motor Driver B- | Ground |
| IBT-2 Motor Driver B+ or Power + | 5V Power Module Red | Feed the 5V module from the main supply |
| IBT-2 Motor Driver B- or Power - | 5V Power Module Black | Return for the 5V module |
| IBT-2 Motor Driver M+ | Motor lead **or** track power lead | Motor output |
| IBT-2 Motor Driver M- | Motor lead **or** track power lead | Motor output |

---

```
[Photo: Motor Driver Wiring]
```

---

# Step 5 — Install Noise Suppression (Optional)

Noise suppression components can improve reliability, especially with motors, long wire runs, and electrically noisy installations.

Optional components:

- 470µF capacitor  
- 220µF capacitor  
- ferrite core

---

## Optional Installation

| Component | Installation |
|----------|--------------|
| 470µF capacitor | Across the IBT-2 motor-driver power input |
| 220µF capacitor | Across the 5V supply near the ESP32 |
| Ferrite core | Around the motor wires |

These components are **optional but recommended**.

---

## Optional Build Add-On: INA219 Voltage / Current Monitoring

The firmware also supports an **optional INA219 sensor** for voltage, current, and protection-related monitoring.

Default firmware values for this optional add-on are:

- **INA219 disabled by default**
- **SDA default pin:** GPIO21
- **SCL default pin:** GPIO22
- **Default I2C address:** 0x40

This sensor is **not required** for the basic build in this document. If used, it should be wired as an optional add-on and configured in firmware/app settings.

A low-voltage indicator output is also supported by firmware when that feature is configured.

---

# Step 6 — Connect the Motor

Connect the locomotive motor or track feed to the IBT-2 motor-driver outputs.

```
IBT-2 Motor Driver M+
        │
   Motor or Track Feed
        │
IBT-2 Motor Driver M-
```

If the locomotive runs backward relative to your intended direction, you can:

- swap the motor leads, **or**
- correct the direction in configuration, depending on how you want the installation standardized

For this hardware guide, swapping the motor leads is the simplest hardware fix.

---

## Step 6 Wiring Table

| From | To | Purpose |
|-----|----|--------|
| IBT-2 Motor Driver M+ | Motor lead **or** track power lead | Motor output |
| IBT-2 Motor Driver M- | Motor lead **or** track power lead | Motor output |

---

# Step 7 — First Power Test

Before applying power, check the following:

- wiring is secure  
- fuse is installed  
- polarity is correct  
- no exposed wires are touching  
- the ESP32 is being fed by a regulated 5V logic supply  
- the motor-power path is separate from the ESP32 USB-C input

Then power the system.

---

## Expected Result

- The ESP32 powers on.
- The onboard status LED behavior will depend on firmware state and whether a control connection is present.
- After firmware is installed, use the app or configuration process to confirm the motor-driver mode and pin mapping match the hardware you built.

**Note:** Firmware installation instructions are in `09_firmware_installation.md`.

---

## Optional Hardware Expansion Notes

The firmware can also support hardware expansion beyond the basic build, including:

- alternate supported motor-driver interface types
- optional INA219 telemetry/protection wiring
- configurable function / lighting outputs on additional pins

Those items are outside the main scope of this default IBT-2 assembly guide, but they are relevant for advanced custom installations.

---

# Build Complete

You have completed the basic hardware build for the default **ESP32 + IBT-2** Poor Man's Throttle installation.

Next document:

This section explains different ways to install the system inside locomotives.

[**07_installation_options.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/07_installation_options.md)

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
