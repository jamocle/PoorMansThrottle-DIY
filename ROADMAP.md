# Poor Man's Throttle

![Build Difficulty](https://img.shields.io/badge/build-difficulty%3A%20beginner-green)
![Platform](https://img.shields.io/badge/platform-ESP32-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)

**Poor Man's Throttle is a $21 DIY wireless throttle that lets a smartphone control a model locomotive using simple open hardware.**

It works for both **dead-rail battery locomotives** and **traditional DC transformer layouts**.  
For DC layouts, it acts as a **PWM motor controller** (Pulse Width Modulation), allowing your transformer to run at full power while the throttle hardware precisely controls the motor.

This eliminates the **low-speed hum and weak torque** common with inexpensive DC transformers and allows **smooth creeping speeds with strong pulling power** — while adding **wireless smartphone control** at the same time.

---

## Why This Project Exists

Many hobbyists want wireless control for their trains, but most commercial systems are expensive and complicated.

Poor Man's Throttle was created to provide a simple alternative:

• **Affordable** — about $21 in hardware  
• **Simple** — built from common off-the-shelf parts  
• **Flexible** — works with battery or DC layouts  
• **Powerful** — PWM motor control for smooth low-speed operation  
• **Wireless** — control your trains from a smartphone  

The goal is simple:

> **Make wireless model train control accessible to anyone who wants to build it.**

A low-cost **Bluetooth wireless throttle system** for model trains.

The **Poor Man's Throttle** allows a smartphone to control a locomotive motor using inexpensive off-the-shelf electronics and a simple wiring setup built around an **ESP32 controller** and an **IBT-2 motor driver**.

The system is designed primarily for **G-scale dead-rail battery locomotives**, but it can also be used with **traditional DC model railroad transformers**.

The goal of the project is to provide a **simple, inexpensive wireless throttle system** that hobbyists can build with commonly available parts.

---

# Project Status

The Poor Man's Throttle project is actively being developed.

Current status:

* Core hardware architecture completed
* ESP32 control system implemented
* ESP32 PWM firmware completed
* Documentation completed
* iPhone App completed in TestFlight

Planned improvements:

* Android throttle application
* Multiple locomotive control
* Locomotive consisting (tying multiple locomotives to a single throttle)
* Expanded troubleshooting guides
* Peripheral control via app

Community testing and feedback are welcome.

---

# Demo

Example of the Poor Man's Throttle in action. **Coming Soon**

```
[Photo: Smartphone controlling locomotive]

[Photo: ESP32 + motor driver installed in locomotive]

[Video or GIF of locomotive moving]
```


Hardware projects benefit greatly from visual demonstrations. Photos and videos will be added as the project evolves.

---

# System Overview

```
           Smartphone App
                 │
             Bluetooth
                 │
                 ▼
           ESP32 Controller
                 │
        Motor Control Signals
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

1. The [**smartphone app**](https://testflight.apple.com/join/VQwjRQUk) sends throttle commands over Bluetooth.

2. The **ESP32 controller** receives those commands.

3. The ESP32 sends control signals to the **IBT-2 motor driver**.

4. The motor driver adjusts the **power going to the locomotive motor**.

5. The locomotive moves **forward, reverse, faster, or slower, etc** based on throttle input or other controls.

All control is wireless so operators can walk around the layout while running trains.

---

# Key Features

• Bluetooth wireless control from a smartphone  
• Works with **battery-powered locomotives (dead-rail-no power on tracks)**  
• Works with **traditional DC model railroad transformers**  
• Uses inexpensive off-the-shelf electronics  
• Beginner-friendly wiring  
• Expandable for multiple locomotives  
• Future support planned for **consisting**  

---

# Estimated Build Cost

Typical hardware cost per locomotive:

| Component               | Approx Cost | Purpose                                     |
| ----------------------- | ----------- |---------------------------------------------|
| ESP32 development board | $6          |Logic processor                              |
| IBT-2 motor driver      | $10         | H-Bridge Motor Driver                       |
| 5V power module         | $5          | Powers the ESP32 **(not the motor driver)** |

Typical total:

**~$21 per locomotive**

Optional components may add a few dollars.

| Optional Component | Purpose                                                                             |
| ------------------ | ----------------------------------------------------------------------------------- |
| Buck converter     | Reduce motor voltage for battery installs down to your individual locomotiove needs |
| Capacitors         | Reduce electrical noise                                                             |
| Ferrite core       | Reduce motor interference                                                           |

---

# Hardware Compatibility

The Poor Man's Throttle works with ALL **DC model locomotives**.

Typical compatible scales:

• G scale  
• O scale  
• S scale  
• HO scale  
• N scale  
• Large scale garden railways
• Custom battery conversions

Motor requirements:

• Brushed DC motor
• Typical voltage range: **6V – 24V**

The **IBT-2 motor driver** supports high current loads (48 amps) and works well with most G-scale locomotives.

### Not Compatible With

This system does **not directly support**:

• DCC decoder locomotives
• AC motors
• Digital command control systems

Those systems require different control hardware.

---

# Power Architecture

The system separates **motor power** and **logic power**.

Separating these supplies improves reliability and reduces electrical noise affecting the controller.

---

## Motor Power

Battery or DC supply powers the motor driver.

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

The buck converter is **optional** and mainly used when battery voltage is higher than desired motor voltage.

Common battery brands used by builders:

• DeWalt  
• Milwaukee  
• Ryobi  
• Rigid  
• other compatible tool batteries  
• other model hobbyist batteries (LiPo, Lithuim Ion, NiMH, Lead Acid, Alkaline) 

A compatible **battery adapter** is required for battery installations.

---

## Logic Power (Controller Power)

The ESP32 controller (logic processor) is powered by a dedicated 5V module.

```
Battery / DC Rail
        │
   5V Power Module
        │
     ESP32 USB-C
```

Separating motor power and controller power helps keep the ESP32 stable and protected from motor noise.

---

# Quick Start

The fastest way to try the Poor Man's Throttle.

### 1. Gather Parts

Minimum hardware:

• ESP32 development board  
• IBT-2 motor driver  
• 5V power module  (Powers the ESP32 Logic Processor **not** motor driver)
• Power source ((Tool/ LIon) battery or DC transformer)  

Full parts list:

👉 [**docs/03_bill_of_materials.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/03_bill_of_materials.md)

---

### 2. Install Firmware

Upload firmware to the ESP32.

Instructions:

👉 [**docs/09_firmware_installation.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/05_firmware_installation.md)

---

### 3. Wire the System

Follow the wiring diagrams in:

👉 [**docs/05_build_guide.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/06_build_guide.md)

---

### 4. First Power Test

Run the safe power-up procedure:

👉 [**docs/07_first_power_test.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/08_first_power_test.md)

You should now be able to control the locomotive from the smartphone app.

---

# Control Features

The smartphone app provides simple locomotive controls.

Available controls:

• Throttle speed  
• Forward direction  
• Reverse direction  
• Stop  
• Other controls  


Multiple locomotives can be controlled individually.

Future versions will support **consisting**, allowing multiple locomotives to move together.

---

# Example Installation Options

Electronics can be installed in several locations depending on the locomotive.

Common options:

• Inside the locomotive body  
• Inside a tender  
• Inside a battery car  
• Inside a small electronics enclosure  

The system is flexible so builders can adapt it to their locomotives.

---

# Example Hardware Configurations

The Poor Man's Throttle supports **two common power configurations**.

---

## Battery Installation (Dead-Rail)

Used for **battery-powered locomotives**.

| Component                      | Description                        |
| ------------------------------ | -----------------------------------|
| ESP32-WROOM-32 USB-C dev board | Main controller                    |
| IBT-2 BTS7960 motor driver     | High current motor driver          |
| 5V power module                | Powers the ESP32 (Logic processor) |
| Battery adapter                | Connects cordless tool batteries   |

Optional components:

• Adjustable buck converter  
• Noise suppression capacitors  
• Ferrite core  

---

## DC Transformer Installation

Used for **traditional DC model railroad layouts**.

| Component                      | Description               |
| ------------------------------ | ------------------------- |
| ESP32-WROOM-32 USB-C dev board | Main controller           |
| IBT-2 BTS7960 motor driver     | High current motor driver |
| 5V power module                | Powers the ESP32          |
| DC model railroad transformer  | Layout power source       |

Optional components:

• Noise suppression capacitors  
• Ferrite core  

Battery adapters and buck converters are **Unnecessary** for DC Transformer installations.

---

# Getting Started

If this is your first build:

1. Read [**Quick Overview**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/01_quick_overview.md)
2. Review [**Tools and Safety**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/04_tools_and_safety.md)
3. Follow the [**Build Guide**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/06_build_guide.md)

Start here:

👉 [**docs/00_Why_Poor_Mans_Throttle.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/00_Why_Poor_Mans_Throttle.md)

---

# Documentation

Full documentation is located in the [**/docs**](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs) folder.

### Documentation Index

| Document                     | Description                    |
| ---------------------------- | ------------------------------ |
| [00_Why_Poor_Mans_Throttle.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/00_Why_Poor_Mans_Throttle.md) | Elevatror Pitch                |
| [01_quick_overview.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/01_quick_overview.md)         | Introduction to the system     |
| [02_system_architecture.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/02_system_architecture.md)    | System diagrams and power flow |
| [03_bill_of_materials.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/03_bill_of_materials.md)      | Parts list                     |
| [04_tools_and_safety.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/04_tools_and_safety.md)       | Tools and safety guidance      |
| [05_firmware_installation.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/05_firmware_installation.md)  | Installing firmware            |
| [06_build_guide.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/06_build_guide.md)            | Step-by-step hardware assembly |
| [07_installation_options.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/07_installation_options.md)   | Installation methods           |
| [08_first_power_test.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/08_first_power_test.md)       | Safe first power-up            |
| [09_troubleshooting.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/09_troubleshooting.md)        | Common issues                  |
| [appendix_traditional_transformer_layout_benefits.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_traditional_transformer_layout_benefits.md) | Why Poor Man’s Throttle is Better for Traditional DC Layouts         |
| [appendix_wiring_reference.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_wiring_reference.md) | Complete wiring tables         |

---

# Repository Structure


[/docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
    00_Why_Poor_Mans_Throttle.md
    01_quick_overview.md
    02_system_architecture.md
    03_bill_of_materials.md
    04_tools_and_safety.md
    05_firmware_installation.md
    06_build_guide.md
    07_installation_options.md
    08_first_power_test.md
    09_troubleshooting.md
    appendix_wiring_reference.md

[/firmware](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/firmware)
    (ESP32 firmware)

[/Installer](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/Installer)
    (app or firmware installer)

/.github
    (repository configuration)

README.md
[ROADMAP.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/ROADMAP.md)
[SUPPORT.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/SUPPORT.md)
[CHANGELOG_App.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/CHANGELOG_App.md)
[CHANGELOG_Firmware.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/CHANGELOG_Firmware.md)
[LICENSE](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/LICENSE)


---

# Builder Skill Level

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

Always follow these safety guidelines when building the system.

• Always use a fuse
• Verify polarity before connecting power
• Disconnect power before changing wiring
• Adjust buck converters before connecting electronics
• Avoid short circuits

Full safety guidance is available in:

👉 [**docs/04_tools_and_safety.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/04_tools_and_safety.md)

---

# Photo Placeholders

**Coming Soon**

```
[Photo: ESP32 Wiring]

[Photo: Buck Converter Adjustment]

[Photo: Motor Driver Wiring]
```

---

# Support

If you need help:

See [**SUPPORT.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/SUPPORT.md) for support information.

---

# License

This project is released under the **MIT License**.

See [**LICENSE**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/LICENSE) for full details.

---

# Contributing

Community improvements and documentation corrections are welcome.

Pull requests, issue reports, and build feedback help improve the project for other hobbyists.


# Next Step

[**00_Why_Poor_Mans_Throttle.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/00_Why_Poor_Mans_Throttle.md)


[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
