# Poor Man's Throttle

A low-cost **Bluetooth wireless throttle system** for model trains.

The **Poor Man's Throttle** allows a smartphone to control a locomotive motor using inexpensive off-the-shelf electronics and a simple wiring setup built around an ESP32 controller.

The system is designed primarily for **G-scale dead-rail battery locomotives**, but it can also be used with **traditional DC model railroad transformers**.

---

# Quick Overview

The smartphone connects to the locomotive over Bluetooth.  
The ESP32 controller receives throttle commands and controls a motor driver that powers the locomotive motor.

```
Smartphone App
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

# Key Features

• Wireless throttle control from a smartphone  
• Works with battery-powered **dead-rail locomotives**  
• Works with **traditional DC transformers**  
• Uses inexpensive, widely available components  
• Simple wiring and beginner-friendly documentation  
• Supports multiple locomotives  

---

# Estimated Build Cost

Typical cost per locomotive:

| Component | Approx Cost |
|----------|-------------|
| ESP32 Development Board | $6 |
| IBT-2 Motor Driver | $10 |
| 5V Power Module | $5 |

Typical total:

**$21**

Optional parts such as buck converters or capacitors may add a few dollars.

---

# Power Options

The system supports **two power configurations**.

## Battery Installation (Dead-Rail)

```
Battery Adapter
       │
(Optional) Buck Converter
       │
      Fuse
       │
 IBT-2 Motor Driver
       │
      Motor
```

Common battery brands:

• DeWalt  
• Milwaukee  
• Ryobi  
• Ridgid  

A compatible **battery adapter** is required.

---

## DC Transformer Installation

```
DC Transformer
      │
     Fuse
      │
 IBT-2 Motor Driver
      │
      Motor
```

No battery adapter or buck converter is required.

---

# Controller Power

The ESP32 controller is powered by a dedicated 5V module.

```
Battery / DC Rail
        │
   5V Power Module
        │
     ESP32 USB-C
```

Separating motor power and controller power improves reliability.

---

# Documentation

Full build documentation is located in the **/docs** folder.

Start here:

👉 **[Quick Overview](docs/01_quick_overview.md)**

### Documentation Index

| Document | Description |
|--------|-------------|
| [01_quick_overview.md](docs/01_quick_overview.md) | Introduction to the system |
| [02_system_architecture.md](docs/02_system_architecture.md) | System diagrams and power flow |
| [03_bill_of_materials.md](docs/03_bill_of_materials.md) | Parts list |
| [04_tools_and_safety.md](docs/04_tools_and_safety.md) | Tools and safety guidelines |
| [05_build_guide.md](docs/05_build_guide.md) | Step-by-step hardware assembly |
| [06_installation_options.md](docs/06_installation_options.md) | Installation methods |
| [07_first_power_test.md](docs/07_first_power_test.md) | Safe first power-up |
| [08_troubleshooting.md](docs/08_troubleshooting.md) | Diagnosing common issues |
| [09_firmware_installation.md](docs/09_firmware_installation.md) | Installing firmware |
| [appendix_wiring_reference.md](docs/appendix_wiring_reference.md) | Complete wiring tables |

---

# Repository Structure

```
/docs
    01_quick_overview.md
    02_system_architecture.md
    03_bill_of_materials.md
    04_tools_and_safety.md
    05_build_guide.md
    06_installation_options.md
    07_first_power_test.md
    08_troubleshooting.md
    09_firmware_installation.md
    appendix_wiring_reference.md

/firmware
    (ESP32 firmware)

/Installer
    (app or firmware installer)

/.github
    (repository configuration)

README.md
SUPPORT.md
CHANGELOG.md
LICENSE
```

---

# Builder Skill Level

The project supports two builder styles.

### Beginner Builders

• jumper wires  
• screw terminals  
• minimal electronics experience  

### Advanced Builders

• soldered wiring  
• heat shrink  
• permanent installations  

---

# Safety Reminder

Always follow these safety practices when building the system.

• Always install a fuse  
• Verify polarity before applying power  
• Disconnect power before changing wiring  
• Adjust buck converters before connecting electronics  
• Avoid short circuits  

See **[Tools and Safety](docs/04_tools_and_safety.md)** for full details.

---

# Support

If you need help:

See **SUPPORT.md** for support information.

---

# License

This project is released under the license included in the repository.

Licensed under the MIT License. See **LICENSE** for details.

---

# Contributing

Community improvements and feedback are welcome.

Bug reports, documentation improvements, and hardware testing feedback all help improve the project for other hobbyists.