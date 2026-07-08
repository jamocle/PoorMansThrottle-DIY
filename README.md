# Poor Man's Throttle

![Build Difficulty](https://img.shields.io/badge/build-difficulty%3A%20beginner-green)
![Platform](https://img.shields.io/badge/platform-ESP32-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)

## Open-Source Wireless Model Railroad Control

**Poor Man's Throttle** is an open-source wireless control platform for DC and dead-rail model railroads using ESP32 controllers, a smartphone app, and low-cost off-the-shelf hardware.

At its core, PMT lets a phone control an ESP32-based locomotive controller over **Bluetooth Low Energy (BLE)**. The controller then drives a DC motor driver using **PWM motor control**, giving hobbyists smooth wireless control without expensive proprietary throttle hardware.

The project has also grown beyond a single locomotive throttle. The same app and firmware foundation can support PMT-compatible module devices, including **Poor Man's Turbine**.

Documentation, installers, videos, and setup resources:

👉 https://jamocle.github.io/PoorMansThrottle-DIY/Installer/

---

# Key Features

* Wireless smartphone control using BLE
* Optional Wi-Fi / WebSocket backup control path for supported setups
* Smooth PWM low-speed motor control
* Dead-rail battery locomotive support
* Traditional DC transformer compatibility
* Multiple locomotive support
* App-managed MU / consist operation
* Lighting and accessory function outputs
* Battery telemetry and low-voltage behavior with optional INA219 hardware
* Configurable firmware variables through the PMT app terminal/configuration tools
* Scheduled operation for supported firmware
* PMT module-style device support
* Poor Man's Turbine support for ESC-style turbine / blower output
* Multilingual and accessibility-friendly smartphone app improvements
* Low-cost DIY hardware platform
* ESP32-based open firmware

---

# System Capabilities

| Capability | Supported |
|---|---|
| BLE smartphone control | Yes |
| Optional Wi-Fi / WebSocket control | Yes |
| Dead-rail operation | Yes |
| Traditional DC layouts | Yes |
| PWM motor control | Yes |
| Multiple locomotives | Yes |
| App-managed MU / consisting | Yes |
| Lighting / function outputs | Yes |
| Battery telemetry | Yes, with optional INA219 hardware |
| Low-voltage warning / limiting / shutdown behavior | Yes, when configured |
| Scheduling / autonomous operation | Yes, for supported firmware |
| PMT module devices | Yes |
| Poor Man's Turbine | Yes |
| Configuration variables | Yes |
| Firmware updates | Yes |
| ESP32 platform | Yes |

---

# Why Poor Man's Throttle Is Different

Traditional DC transformers reduce motor voltage to control speed.

At low speeds this often causes:

* weak motor torque
* poor crawling performance
* motor hum
* stalling
* inconsistent operation

Poor Man's Throttle uses **PWM** motor control instead.

This allows the transformer or battery source to provide steady power while the PMT controller regulates the motor electronically.

Benefits include:

* smooth creeping speeds
* stronger low-speed pulling power
* reduced motor hum
* better slow-speed control
* improved responsiveness
* wireless walk-around operation

---

# What Poor Man's Throttle Is

Poor Man's Throttle is:

* an open-source wireless model railroad control platform
* a smartphone-based throttle system
* a PWM motor-control system for DC locomotives
* a dead-rail compatible control system
* a modular ESP32 hardware and firmware platform
* a foundation for PMT-compatible accessory/module devices

---

# What Poor Man's Throttle Is NOT

Poor Man's Throttle is not:

* DCC command control
* track signal encoding
* a proprietary commercial throttle ecosystem

The main locomotive throttle design uses direct onboard PWM motor control with wireless communication from the smartphone app.

---

# Supported PMT Device Types

The PMT platform now supports more than one firmware/device style.

| Device Type | Purpose |
|---|---|
| Poor Man's Throttle | Locomotive speed, direction, braking, lighting, telemetry, and configuration |
| Poor Man's Module | Shared PMT module foundation for accessory-style devices |
| Poor Man's Turbine | ESC-style turbine / blower output control and configuration |

The standard build documents focus on the **Poor Man's Throttle locomotive controller** unless another device type is specifically named.

---

# Supported Installation Types

Poor Man's Throttle supports multiple installation methods.

## Dead-Rail Battery Installations

For onboard battery-powered locomotives using:

* tool batteries
* lithium-ion battery packs
* LiPo packs
* hobby battery systems
* other appropriate DC battery sources

## Traditional DC Transformer Layouts

For conventional DC layouts using:

* existing model railroad transformers
* existing track wiring
* existing DC locomotives

## Physical Installation Options

Electronics may be installed:

* inside the locomotive body
* inside a tender
* inside a battery car
* inside a portable enclosure
* inside an accessory/module project box

---

# Smartphone App Features

The PMT smartphone app provides the user interface for operating and configuring PMT devices.

Supported app capabilities include:

* throttle speed control
* forward and reverse direction
* stop and braking control
* multiple locomotive control
* app-managed MU / consist operation
* lighting and function control
* battery telemetry display
* configuration management
* terminal access for advanced commands
* known-device and connection assistance
* optional WebSocket diagnostics
* schedule configuration for supported firmware
* module and turbine control screens
* wireless walk-around operation
* multilingual and screen-reader-friendly behavior

---

# Project Status

The Poor Man's Throttle project is actively developed and operational.

Current project status includes:

* ESP32 firmware platform implemented
* smartphone app implemented
* BLE communication implemented
* optional Wi-Fi / WebSocket communication supported
* PWM motor control implemented
* multiple motor-driver modes supported
* multiple locomotive support
* app-managed consisting support
* configuration variable system
* command protocol documentation
* battery telemetry and low-voltage behavior support
* lighting / function output support
* schedule support
* Poor Man's Module foundation
* Poor Man's Turbine support
* expanded troubleshooting and build documentation

Community testing and feedback are welcome.

---

# System Overview

## Locomotive Throttle Control

```text
           Smartphone App
                 │
          BLE or WebSocket
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

The ESP32 receives wireless commands from the smartphone app and converts them into control signals for the locomotive motor driver.

## Module / Turbine Control

```text
           Smartphone App
                 │
          BLE or WebSocket
                 │
                 ▼
           ESP32 Controller
                 │
        Device Output Signal
                 │
                 ▼
       Module, Accessory, or ESC
```

Module-style firmware uses the same PMT connection and configuration foundation, but the output hardware depends on the device being built.

---

# Hardware Architecture

The standard locomotive throttle system is built around:

| Component | Purpose |
|---|---|
| ESP32 Controller | Main control processor running PMT firmware |
| Supported Motor Driver | Converts ESP32 control signals into motor power |
| 5V Logic Power Module | Powers the ESP32 |
| Battery or DC Supply | Motor power source |
| Smartphone App | Wireless throttle and configuration interface |

The **IBT-2 / BTS7960** is one commonly used motor driver for the default locomotive build, but the platform supports multiple compatible motor-driver styles.

---

# Hardware Compatibility

Poor Man's Throttle supports DC model locomotives using brushed DC motors.

Typical supported scales include:

* G scale
* O scale
* S scale
* HO scale
* N scale
* large-scale garden railways
* custom battery conversions

Typical motor voltage range:

* 6V-24V DC, depending on the locomotive, motor driver, and power system used

Builders are responsible for choosing components rated appropriately for their locomotive, current draw, battery, and installation.

---

# Power Architecture

The system separates logic power and motor power for improved reliability and reduced electrical noise.

## Motor Power

Motor power may come from:

* tool batteries
* lithium battery systems
* DC transformers
* other compatible DC supplies

Optional components include:

* buck converters
* fuses
* noise suppression capacitors
* ferrite cores
* INA219 voltage/current telemetry modules

## Logic Power

The ESP32 controller uses a dedicated regulated 5V supply.

Separating logic power from motor power improves controller stability and helps protect the ESP32 from motor noise and voltage dips.

---

# Quick Start

## 1. Understand the Project

Start with the project overview:

👉 [docs/00_Why_Poor_Mans_Throttle.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/00_Why_Poor_Mans_Throttle.md)

Then read the quick overview:

👉 [docs/01_quick_overview.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/01_quick_overview.md)

---

## 2. Gather Hardware

Minimum hardware for a standard locomotive throttle build:

* ESP32 development board
* supported motor driver
* 5V power module
* battery or DC transformer power source
* fuse and wiring

Full parts list:

👉 [docs/03_bill_of_materials.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/03_bill_of_materials.md)

---

## 3. Install Firmware

Upload firmware to the ESP32 controller.

👉 [docs/05_firmware_installation.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/05_firmware_installation.md)

---

## 4. Build and Wire the System

Follow the build and wiring instructions.

👉 [docs/06_build_guide.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/06_build_guide.md)

👉 [docs/appendix_wiring_reference.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_wiring_reference.md)

---

## 5. Perform First Power Test

Run the safe startup verification procedure.

👉 [docs/08_first_power_test.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/08_first_power_test.md)

---

## 6. Connect with the Smartphone App

Use the PMT app to scan for the controller, connect, verify configuration, and test throttle behavior gently before running under load.

---

# Advanced Features

Advanced platform capabilities include:

* BLE command protocol support
* optional Wi-Fi / WebSocket support
* configuration variable system
* telemetry support
* battery management and low-voltage behavior
* lighting / function output support
* multiple locomotive management
* app-managed MU / consist operation
* scheduled operation
* PMT module and turbine support
* expandable firmware architecture
* ESP32 GPIO configuration support

---

# Battery Management and Telemetry

Optional battery management support includes:

* battery voltage monitoring
* current monitoring
* power telemetry
* battery-connected / disconnected state reporting
* low-voltage warning behavior
* low-voltage output limiting
* shutdown behavior when configured

See:

👉 [docs/appendix_battery_management_module.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_battery_management_module.md)

---

# Developer and Advanced Resources

Advanced technical documentation includes:

| Document | Purpose |
|---|---|
| docs/appendix_Command_Protocol_Reference.md | BLE / WebSocket command protocol reference |
| docs/appendix_Configuration_Variables.md | Firmware configuration variables |
| docs/appendix_ESP32_GPIO_Pins.md | ESP32 GPIO mapping |
| docs/appendix_wiring_reference.md | Wiring reference |
| docs/appendix_troubleshooting_a_bad_IBT_board.md | IBT driver diagnostics |

---

# Documentation

Full documentation is available in the `/docs` directory.

## Getting Started

| Document | Description |
|---|---|
| 00_Why_Poor_Mans_Throttle.md | Why the project exists |
| 01_quick_overview.md | System introduction |
| 02_system_architecture.md | System architecture |
| 03_bill_of_materials.md | Hardware parts list |
| 04_tools_and_safety.md | Tools and safety guidance |
| 05_firmware_installation.md | Firmware installation |
| 06_build_guide.md | Hardware assembly |
| 07_installation_options.md | Installation methods |
| 08_first_power_test.md | Safe startup procedure |

---

## Advanced Technical Reference

| Document | Description |
|---|---|
| appendix_Command_Protocol_Reference.md | BLE / WebSocket command protocol |
| appendix_Configuration_Variables.md | Configuration variables |
| appendix_battery_management_module.md | Battery telemetry and low-voltage behavior |
| appendix_ESP32_GPIO_Pins.md | GPIO reference |
| appendix_wiring_reference.md | Wiring reference |
| appendix_traditional_transformer_layout_benefits.md | PWM transformer benefits |

---

## Troubleshooting

| Document | Description |
|---|---|
| 09_troubleshooting.md | General troubleshooting |
| appendix_troubleshooting_a_bad_IBT_board.md | IBT driver diagnostics |

---

# Wigand — Poor Man's Throttle Technical Assistant

Poor Man's Throttle includes an AI technical assistant named **Wigand** (pronounced **Vee-gaand**).

Wigand is designed to help builders, testers, and developers troubleshoot and understand the Poor Man's Throttle platform.

Typical topics Wigand can assist with:

* ESP32 firmware questions
* wiring assistance
* IBT-2 troubleshooting
* power architecture questions
* battery management setup
* mobile app behavior
* configuration variable tuning
* Bluetooth connection troubleshooting
* installation guidance
* system architecture explanations

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

* jumper-wire builds
* breadboard prototyping
* minimal soldering
* standard documented builds

## Advanced Builders

Suitable for:

* soldered installations
* custom enclosures
* perfboard assembly
* advanced locomotive integration
* module/turbine experimentation

---

# Safety Reminder

Always follow proper electrical safety procedures.

* Always use a fuse.
* Verify polarity before powering electronics.
* Disconnect power before rewiring.
* Adjust buck converters before connecting electronics.
* Avoid short circuits.
* Use components rated for your voltage and current requirements.
* Treat batteries, chargers, and battery chemistries with appropriate care.

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

👉 [docs/00_Why_Poor_Mans_Throttle.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/00_Why_Poor_Mans_Throttle.md)
