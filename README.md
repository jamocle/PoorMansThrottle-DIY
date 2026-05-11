# Poor Man's Throttle

![Build Difficulty](https://img.shields.io/badge/build-difficulty%3A%20beginner-green)
![Platform](https://img.shields.io/badge/platform-ESP32-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)

## Open-Source Wireless Train Control Platform

Poor Man’s Throttle is an open-source wireless control platform for DC and dead-rail model railroads using ESP32 controllers, smartphone-based throttles, and low-cost off-the-shelf hardware.

The system provides smooth PWM motor control, wireless Bluetooth operation, multiple locomotive support, and flexible installation options for both battery-powered locomotives and traditional DC transformer layouts.

---

# Key Features

* Wireless Bluetooth smartphone control
* Smooth PWM low-speed motor control
* Dead-rail battery locomotive support
* Traditional DC transformer compatibility
* Multiple locomotive support
* Locomotive consisting support
* Peripheral control through the mobile app
* Battery management and telemetry support
* Configurable firmware variables
* Expandable modular hardware architecture
* Low-cost DIY hardware platform
* ESP32-based open firmware

---

# System Capabilities

| Capability | Supported |
|---|---|
| Bluetooth smartphone control | Yes |
| Dead-rail operation | Yes |
| Traditional DC layouts | Yes |
| PWM motor control | Yes |
| Multiple locomotives | Yes |
| Locomotive consisting | Yes |
| Peripheral control | Yes |
| Battery telemetry | Yes |
| Configuration variables | Yes |
| BLE command protocol | Yes |
| Firmware updates | Yes |
| ESP32 platform | Yes |

---

# Why Poor Man’s Throttle Is Different

Traditional DC transformers reduce motor voltage to control speed.

At low speeds this often causes:

* Weak motor torque
* Poor crawling performance
* Motor hum
* Stalling
* Inconsistent operation

Poor Man’s Throttle uses PWM (Pulse Width Modulation) motor control instead.

This allows the transformer or battery source to remain at full power while the throttle precisely controls the motor electronically.

Benefits include:

* Smooth creeping speeds
* Strong low-speed pulling power
* Reduced motor hum
* Better slow-speed control
* Improved responsiveness
* Wireless walk-around operation

---

# What Poor Man’s Throttle Is

Poor Man’s Throttle is:

* An open-source wireless locomotive control platform
* A Bluetooth-based smartphone throttle system
* A PWM motor controller for DC locomotives
* A dead-rail compatible control system
* A modular ESP32 hardware platform

---

# What Poor Man’s Throttle Is NOT

Poor Man’s Throttle is not:

* DCC command control
* Track signal encoding
* A proprietary commercial throttle system

The system uses direct onboard PWM motor control with wireless Bluetooth communication.

---

# Supported Installation Types

Poor Man’s Throttle supports multiple installation methods.

## Dead-Rail Battery Installations

For onboard battery-powered locomotives using:

* Tool batteries
* Lithium-ion battery packs
* Hobby battery systems

## Traditional DC Transformer Layouts

For conventional DC layouts using:

* Existing model railroad transformers
* Existing track wiring
* Existing DC locomotives

## Physical Installation Options

Electronics may be installed:

* Inside the locomotive body
* Inside a tender
* Inside a battery car
* Inside a portable enclosure

---

# Mobile App Features

The smartphone application provides wireless locomotive control using Bluetooth communication.

Supported app capabilities include:

* Throttle speed control
* Forward and reverse direction
* Stop and braking control
* Multiple locomotive control
* Locomotive consisting
* Peripheral control
* Battery telemetry support
* Configuration management
* Wireless walk-around operation

---

# Project Status

The Poor Man’s Throttle project is actively developed and operational.

Current project status includes:

* ESP32 firmware platform completed
* PWM motor control implemented
* Mobile applications available
* Bluetooth communication implemented
* Multiple locomotive support
* Consisting support
* Expanded troubleshooting documentation
* Configuration variable system
* Command protocol documentation
* Battery management module support
* Peripheral control support
* Full hardware build documentation

Community testing and feedback are welcome.

---

# System Overview

```text
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
      Supported Motor Driver
                 │
                 ▼
           Locomotive Motor
```

The ESP32 receives wireless commands from the smartphone application and converts them into motor control signals for the locomotive motor driver.

---

# Hardware Architecture

The system is built around:

| Component | Purpose |
|---|---|
| ESP32 Controller | Main control processor |
| Supported Motor Driver | Motor power control |
| 5V Logic Power Module | Powers the ESP32 |
| Battery or DC Supply | Motor power source |
| Smartphone App | Wireless throttle interface |

The IBT-2/BTS7960 is one commonly used supported motor driver, though the platform supports multiple compatible motor drivers.

---

# Hardware Compatibility

Poor Man’s Throttle supports DC model locomotives using brushed DC motors.

Typical supported scales include:

* G scale
* O scale
* S scale
* HO scale
* N scale
* Large scale garden railways
* Custom battery conversions

Typical motor voltage range:

* 6V–24V DC

---

# Power Architecture

The system separates logic power and motor power for improved reliability and reduced electrical noise.

## Motor Power

Motor power may come from:

* Tool batteries
* Lithium battery systems
* DC transformers
* Other compatible DC supplies

Optional components include:

* Buck converters
* Noise suppression capacitors
* Ferrite cores

## Logic Power

The ESP32 controller uses a dedicated regulated 5V supply.

Separating logic power from motor power improves controller stability and helps protect the ESP32 from motor noise.

---

# Quick Start

## 1. Gather Hardware

Minimum required hardware:

* ESP32 development board
* Supported motor driver
* 5V power module
* Battery or DC transformer power source

Full parts list:

👉 [docs/03_bill_of_materials.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/03_bill_of_materials.md)

---

## 2. Install Firmware

Upload firmware to the ESP32 controller.

👉 [docs/05_firmware_installation.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/05_firmware_installation.md)

---

## 3. Build and Wire the System

Follow the build and wiring instructions.

👉 [docs/06_build_guide.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/06_build_guide.md)

👉 [appendix_wiring_reference.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_wiring_reference.md)

---

## 4. Perform First Power Test

Run the safe startup verification procedure.

👉 [docs/08_first_power_test.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/08_first_power_test.md)

---

# Advanced Features

Advanced platform capabilities include:

* BLE command protocol support
* Configuration variable system
* Telemetry support
* Battery management module integration
* Peripheral control support
* Multiple locomotive management
* Expandable firmware architecture
* ESP32 GPIO configuration support

---

# Battery Management and Telemetry

Optional battery management support includes:

* Battery voltage monitoring
* Current monitoring
* Battery telemetry
* Battery protection integration

See:

👉 [appendix_battery_management_module.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_battery_management_module.md)

---

# Developer Resources

Advanced technical documentation includes:

| Document | Purpose |
|---|---|
| appendix_Command_Protocol_Reference.md | BLE protocol reference |
| appendix_Configuration_Variables.md | Firmware configuration variables |
| appendix_ESP32_GPIO_Pins.md | ESP32 GPIO mapping |
| appendix_wiring_reference.md | Wiring reference |
| appendix_troubleshooting_a_bad_IBT_board.md | IBT driver diagnostics |

---

# Documentation

Full documentation is available in the `/docs` directory.

## Getting Started

| Document | Description |
|---|---|
| 01_quick_overview.md | System introduction |
| 03_bill_of_materials.md | Hardware parts list |
| 05_firmware_installation.md | Firmware installation |
| 06_build_guide.md | Hardware assembly |
| 07_installation_options.md | Installation methods |
| 08_first_power_test.md | Safe startup procedure |

---

## System Architecture

| Document | Description |
|---|---|
| 02_system_architecture.md | System architecture |
| appendix_wiring_reference.md | Wiring reference |
| appendix_ESP32_GPIO_Pins.md | GPIO reference |

---

## Advanced Technical Reference

| Document | Description |
|---|---|
| appendix_Command_Protocol_Reference.md | BLE protocol |
| appendix_Configuration_Variables.md | Configuration variables |
| appendix_battery_management_module.md | Battery telemetry |
| appendix_traditional_transformer_layout_benefits.md | PWM transformer benefits |

---

## Troubleshooting

| Document | Description |
|---|---|
| 09_troubleshooting.md | General troubleshooting |
| appendix_troubleshooting_a_bad_IBT_board.md | IBT driver diagnostics |

---

# Wigand — Poor Man’s Throttle Technical Assistant

Poor Man’s Throttle includes an AI technical assistant named **Wigand** (pronounced **Vee-gaand**).

Wigand has access to:

* Project documentation
* Firmware architecture
* Hardware documentation
* Mobile application behavior
* Wiring references
* Troubleshooting procedures
* Configuration variables
* BLE command protocol documentation

Wigand is designed to help builders, testers, and developers troubleshoot and understand the Poor Man’s Throttle platform.

Typical topics Wigand can assist with:

* ESP32 firmware questions
* Wiring assistance
* IBT-2 troubleshooting
* Power architecture questions
* Battery management setup
* Mobile app behavior
* Configuration variable tuning
* Bluetooth connection troubleshooting
* Installation guidance
* System architecture explanations

Access Wigand here:

👉 https://chatgpt.com/g/g-69b6b9e2de288191b93ca08de865a365-wigand-your-poor-man-s-throttle-troubleshooter

---

# Repository Structure

```text
/docs            Documentation
/firmware        ESP32 firmware
/Installer       App and firmware installer
/.github         Repository configuration
```

Additional repository files:

* README.md
* ROADMAP.md
* SUPPORT.md
* CHANGELOG_App.md
* CHANGELOG_Firmware.md
* LICENSE

---

# Builder Skill Levels

## Beginner Builders

Suitable for:

* Jumper wire builds
* Breadboard prototyping
* Minimal soldering

## Advanced Builders

Suitable for:

* Soldered installations
* Custom enclosures
* Perfboard assembly
* Advanced locomotive integration

---

# Safety Reminder

Always follow proper electrical safety procedures.

* Always use a fuse
* Verify polarity before powering electronics
* Disconnect power before rewiring
* Adjust buck converters before connecting electronics
* Avoid short circuits

Additional safety guidance:

👉 [docs/04_tools_and_safety.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/04_tools_and_safety.md)

---

# Installation Hub

Documentation, installers, and setup resources:

👉 https://jamocle.github.io/PoorMansThrottle-DIY/Installer/

---

# Support

Support information:

👉 [SUPPORT.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/SUPPORT.md)

---

# License

Released under the MIT License.

👉 [LICENSE](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/LICENSE)

---

# Contributing

Community feedback, testing, pull requests, and documentation improvements are welcome.

Builder feedback helps improve compatibility, documentation quality, and future platform features.

---

# Next Step

Start here:

👉 [00_Why_Poor_Mans_Throttle.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/00_Why_Poor_Mans_Throttle.md)

---

[<< Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)