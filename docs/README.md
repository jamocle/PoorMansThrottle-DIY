# Poor Man's Throttle

Low-cost Bluetooth wireless throttle for battery-powered and DC model locomotives.

The **Poor Man's Throttle** allows a smartphone to control a locomotive motor using a simple hardware setup built around an ESP32 controller and an IBT-2 motor driver.

The system is designed for **G-scale model trains**, especially **dead-rail battery conversions**, but it can also be used with traditional **DC model railroad transformers**.

The goal of the project is to provide a **simple, inexpensive wireless throttle system** that hobbyists can build with commonly available parts.

---

# Key Features

• Bluetooth wireless control from a smartphone  
• Supports battery-powered dead-rail locomotives  
• Works with traditional DC transformers  
• Uses inexpensive off-the-shelf electronics  
• Beginner-friendly wiring  
• Expandable to multiple locomotives  

---

# System Overview

The smartphone app communicates with the locomotive using Bluetooth.

The ESP32 controller converts throttle commands into motor control signals that drive the locomotive motor.

```
Smartphone App
       │
Bluetooth Low Energy
       │
ESP32 Controller
       │
PWM Motor Control
       │
IBT-2 Motor Driver
       │
Train Motor
```

---

# Power Architecture

The system separates **motor power** and **logic power**.

Motor power drives the locomotive motor, while logic power runs the ESP32 controller.

## Motor Power Flow

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

## Logic Power Flow

The ESP32 is powered by a separate 5V power module.

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

The electronics can be installed in several ways:

• inside the locomotive body  
• inside a tender  
• inside a battery car  
• inside a small electronics enclosure  

The system is flexible so builders can adapt it to their locomotives.

---

# Documentation

Full documentation is located in the **/docs** folder.

| Document | Description |
|--------|-------------|
| 01_quick_overview.md | Quick introduction to the system |
| 02_system_architecture.md | System diagrams and power flow |
| 03_bill_of_materials.md | Parts list and component descriptions |
| 04_tools_and_safety.md | Required tools and safety guidance |
| 05_build_guide.md | Step-by-step hardware build instructions |
| 06_installation_options.md | Different ways to install the system |
| 07_first_power_test.md | Safe first power-up procedure |
| 08_troubleshooting.md | Common issues and solutions |
| 09_firmware_installation.md | Installing firmware on the ESP32 |
| appendix_wiring_reference.md | Complete wiring reference tables |

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

Main hardware used in this project:

| Component | Description |
|----------|-------------|
| ESP32-WROOM-32 USB-C dev board | Main controller |
| IBT-2 BTS7960 motor driver | High current motor driver |
| 5V power module | Powers the ESP32 |
| Battery adapter | Connects cordless tool batteries |
| ATC fuse holder | Protects wiring and electronics |

Optional components:

• adjustable buck converter  
• noise suppression capacitors  
• ferrite core  

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

More safety information is provided in:

```
docs/04_tools_and_safety.md
```

---

# Photo Placeholders

The documentation will include build photos in future revisions.

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
