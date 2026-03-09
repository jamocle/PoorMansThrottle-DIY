# Quick Overview

The **Poor Man's Throttle** is a low-cost wireless throttle system for model locomotives.

A smartphone connects to the locomotive using Bluetooth.  
The smartphone app controls the locomotive speed and direction.

This system works with:

• battery-powered locomotives (dead-rail)  
• traditional DC model railroad transformers

---

# What the System Does

The system converts commands from a smartphone into motor power for a locomotive.

The main components are:

| Component | Purpose |
|----------|---------|
| Smartphone App | Sends throttle commands |
| ESP32 Controller | Receives commands and controls the motor driver |
| IBT-2 Motor Driver | Provides high current motor control |
| Power System | Provides electricity for the motor and electronics |
| Locomotive Motor | Drives the train |

---

# Basic Control Flow

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

The smartphone controls the locomotive wirelessly.

---

# Supported Power Sources

The Poor Man's Throttle can use two types of power sources.

## Battery Powered (Dead-Rail)

Cordless tool batteries are commonly used.

Examples:

• DeWalt  
• Milwaukee  
• Ryobi  
• Rigid   
• other compatible tool batteries  
• other model hobbyist batteries (LiPo, Lithuim Ion, NiMH, Lead Acid, Alkaline)  

Battery adapters allow these batteries to power the locomotive electronics.

An optional **buck converter** can reduce the voltage for the motor.

---

## DC Transformer Powered

Traditional model railroad DC transformers can also power the system.

In this setup the transformer provides motor power instead of a battery.

No battery adapter is required.

---

# Major Hardware Components

Typical hardware used in the system:

| Component | Description |
|----------|-------------|
| ESP32-WROOM-32 USB-C Development Board | Main controller |
| IBT-2 BTS7960 Motor Driver | High current motor driver |
| 5V Power Module | Powers the ESP32 |
| Fuse Holder and Blade Fuse | Electrical protection |
| Wiring | Connects the components |

Optional components:

• adjustable buck converter  
• capacitors for noise reduction  
• ferrite core for motor wires

---

# Why Two Power Systems Are Used

The locomotive motor and the ESP32 controller have different power needs.

The motor requires higher voltage and higher current.

The ESP32 requires a stable **5V supply**.

Separating these power paths improves reliability.

---

# Example System Layout

```
Battery Adapter or DC Transformer
            │
       (Optional for Battery (Unnecessary for DC))
     Buck Converter
            │
           Fuse
            │
      IBT-2 Motor Driver
            │
            Motor

Battery / DC Rail
        │
   5V Power Module
        │
     ESP32 USB-C
```

---

# Who This Project Is For

This project is designed for hobbyists who want:

• wireless locomotive control  
• inexpensive electronics  
• simple installation  
• flexible battery options

The documentation supports both:

Beginner builders  
and  
Advanced builders.

---

# Next Step

Continue to:

This document explains how the system components work together.

[**01_quick_overview.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/02_system_architecture.md)


[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
