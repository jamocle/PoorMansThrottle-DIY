# Poor Man's Throttle

![Build Difficulty](https://img.shields.io/badge/build-difficulty%3A%20beginner-green)

Low-cost Bluetooth wireless throttle for battery-powered and DC model locomotives.

The **Poor Man's Throttle** allows a smartphone to control a locomotive motor using a simple hardware setup built around an ESP32 controller and an IBT-2 motor driver.

The system is designed for **G-scale model trains**, especially **dead-rail battery conversions**, but it can also be used with traditional **DC model railroad transformers**.

The goal of the project is to provide a **simple, inexpensive wireless throttle system** that hobbyists can build with commonly available parts.
---

# Hero System Diagram

```
           Smartphone App
                 │
                 │ Bluetooth
                 ▼
           ESP32 Controller
                 │
          Motor Control Signal
                 │
                 ▼
         IBT-2 Motor Driver
                 │
                 ▼
           Locomotive Motor
```

The ESP32 receives commands from the smartphone and converts them into motor control signals that drive the locomotive.

---

# How It Works in 30 Seconds

1. Your **smartphone app** sends throttle commands over Bluetooth.

2. The **ESP32 controller** receives those commands.

3. The ESP32 sends control signals to the **IBT-2 motor driver**.

4. The motor driver adjusts the **power going to the locomotive motor**.

5. The locomotive moves **forward, reverse, faster, or slower** based on the throttle input.

All control is wireless, so you can walk around the layout while operating the train.

---

# Key Features

• Bluetooth wireless control from a smartphone  
• Supports battery-powered dead-rail locomotives  
• Works with traditional DC transformers  
• Uses inexpensive off-the-shelf electronics  
• Beginner-friendly wiring  
• Expandable to multiple locomotives  

---

# Estimated Build Cost

Typical total hardware cost:

| Component | Approx Cost |
|----------|-------------|
| ESP32 development board | $6 |
| IBT-2 motor driver | $10 |
| 5V power module | $5 |

Typical total:

**$21 per locomotive**

Optional components may add a few dollars.

| Optional Component | Purpose |
|--------------------|--------|
| Buck converter | Reduce motor voltage for battery installs |
| Capacitors | Reduce electrical noise |
| Ferrite core | Reduce motor interference |

---

# Power Architecture

The system separates **motor power** and **logic power**.

Motor power drives the locomotive motor, while logic power runs the ESP32 controller.
## Motor Power

Battery or DC supply powers the motor driver.

An optional buck converter may be used with battery systems to reduce voltage.

```
Battery Adapter or DC Transformer
           │
(Optional) Buck Converter
           │
          Fuse
           │
     IBT-2 Motor Driver
           │
           Motor
```

The buck converter is **optional** and mainly used to limit voltage when using high-voltage batteries.

---

## Logic Power

```
Battery / DC Rail
        │
   5V Power Module
        │
     ESP32 USB-C
```

This keeps the controller stable and isolated from motor noise.

---

# Control Features

The Poor Man's Throttle smartphone app provides simple locomotive controls.

Available controls:

• Throttle speed  
• Forward direction  
• Reverse direction  
• Stop  

Multiple locomotives can be controlled individually.

Future versions will support **consisting**, allowing multiple locomotives to move together.

---

# Example Installation

Electronics can be installed in several locations depending on the locomotive.

Common options:

• inside the locomotive body  
• inside a tender  
• inside a battery car  
• inside a small electronics enclosure  

The system is flexible so builders can adapt it to their locomotives.

---


# Getting Started

If you are building the system for the first time, start here:

1. Read **Quick Overview**
2. Review **Tools and Safety**
3. Follow the **Build Guide**

Recommended starting document:

```
docs/01_quick_overview.md
```

---

# Example Hardware

The Poor Man's Throttle supports **two common power configurations**.

---

## Battery Installation Example

Used for **dead-rail battery powered locomotives**.

| Component | Description |
|----------|-------------|
| ESP32-WROOM-32 USB-C dev board | Main controller |
| IBT-2 BTS7960 motor driver | High current motor driver |
| 5V power module | Powers the ESP32 |
| Battery adapter | Connects cordless tool batteries |

Optional components:

• adjustable buck converter  
• noise suppression capacitors  
• ferrite core  

---

## DC Transformer Installation Example

Used for **traditional DC model railroad layouts**.

| Component | Description |
|----------|-------------|
| ESP32-WROOM-32 USB-C dev board | Main controller |
| IBT-2 BTS7960 motor driver | High current motor driver |
| 5V power module | Powers the ESP32 |
| DC model railroad transformer | Layout power source |

Optional components:

• noise suppression capacitors  
• ferrite core  
Battery adapters and buck converters are **not required** for DC installations.

---

# Documentation

Full documentation is located in the **/docs** folder.

| Document | Description |
|--------|-------------|
| 01_quick_overview.md | Quick introduction |
| 02_system_architecture.md | System diagrams and power flow |
| 03_bill_of_materials.md | Parts list |
| 04_tools_and_safety.md | Tools and safety guidance |
| 05_build_guide.md | Step-by-step build instructions |
| 06_installation_options.md | Installation methods |
| 07_first_power_test.md | Safe first power-up |
| 08_troubleshooting.md | Common issues |
| 09_firmware_installation.md | Installing firmware |
| appendix_wiring_reference.md | Complete wiring tables |

---

# Getting Started

If this is your first build:

1. Read **Quick Overview**
2. Review **Tools and Safety**
3. Follow the **Build Guide**

Start here:

```
docs/01_quick_overview.md
```

---

# Skill Level

The project supports two types of builders.

### Beginner Builders

• jumper wires  
• breadboard-style connections  
• minimal soldering

### Advanced Builders

• soldered wiring  
• heat shrink  
• perfboard mounting  
• enclosure installs

---

# Safety Reminder

Always follow these safety guidelines when building the system:

• Always use a fuse  
• Verify polarity before connecting power  
• Disconnect power before changing wiring  
• Adjust buck converters before connecting electronics  
• Avoid short circuits

More safety information is available in:

```
docs/04_tools_and_safety.md
```

---

# Photo Placeholders

Future documentation will include build photos.

```
[Photo: ESP32 Wiring]

[Photo: Buck Converter Adjustment]

[Photo: Motor Driver Wiring]
```

---

# License

This project documentation may be used and shared for hobby and educational purposes.

---

# Contributing

Community improvements and documentation corrections are welcome.

Pull requests and issue reports help improve the project for other hobbyists.