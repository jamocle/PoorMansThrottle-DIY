# Quick Overview

## Before You Start: Test Your IBT-2 Motor Driver

The IBT-2 motor driver boards commonly sold online can have inconsistent quality.

If you plan to use an **IBT-2 / BTS7960** board, test it before starting the project.

We have had very good success when the wiring is correct and the motor driver board is healthy.  
If your locomotive only runs in one direction, behaves unpredictably, or does not respond correctly, first verify your wiring and power assumptions, then verify that the IBT-2 board itself is not defective.

[Check Your IBT-2 Board Before You Start](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_troubleshooting_a_bad_IBT_board.md)

Go here for docs, videos, and installation resources: [Installation Hub](https://jamocle.github.io/PoorMansThrottle-DIY/Installer/)

---

# What Is This For?

**Poor Man's Throttle** is a low-cost wireless throttle system for model locomotives.

A smartphone connects to the locomotive controller wirelessly.  
The firmware primarily uses **Bluetooth Low Energy (BLE)** and can also support **optional Wi-Fi / WebSocket control** when configured.

The smartphone app sends throttle and control commands, and the ESP32-based controller converts those commands into motor power for the locomotive.

This system can be used with:

* battery-powered locomotives (dead-rail)
* traditional DC-powered model railroad installations

---

# What the System Does

The system converts wireless control commands into motor power for a locomotive.

At a basic level, the system includes:

| Component | Purpose |
|----------|---------|
| Smartphone App | Sends throttle and control commands |
| ESP32 Controller | Receives commands and manages motor, configuration, and optional accessory features |
| Motor Driver | Converts controller signals into motor power |
| Power System | Provides power for the motor and electronics |
| Locomotive Motor | Drives the train |

The firmware also supports optional advanced capabilities such as:

* multiple motor driver interface styles
* configurable momentum, braking, and stop behavior
* optional lighting / function outputs
* optional battery-voltage monitoring and protection features
* persistent configuration storage inside the controller

---

# Basic Control Flow

## Typical BLE Control Path

```text
Smartphone App
       │
Bluetooth Low Energy (BLE)
       │
ESP32 Controller
       │
Motor Control Signals
       │
Motor Driver
       │
Locomotive Motor
```

## Optional Wi-Fi / WebSocket Control Path

```text
Smartphone App or Compatible Client
       │
Wi-Fi / WebSocket
       │
ESP32 Controller
       │
Motor Control Signals
       │
Motor Driver
       │
Locomotive Motor
```

BLE is the primary control method.  
Wi-Fi / WebSocket is an optional secondary control path for supported setups.

---

# Supported Power Sources

The Poor Man's Throttle can work with two common power approaches.

## Battery Powered (Dead-Rail)

Cordless tool batteries are commonly used.

Examples:

* DeWalt
* Milwaukee
* Ryobi
* Ridgid
* other compatible tool batteries
* other hobby batteries such as LiPo, lithium-ion, NiMH, sealed lead-acid, or similar packs

Battery adapters allow these batteries to power the locomotive electronics.

Depending on the locomotive, an optional **buck converter** may be used to reduce the voltage supplied to the motor or electronics.

---

## DC Transformer Powered

Traditional model railroad DC transformers can also power the system.

In this setup, the transformer provides the track or motor power instead of a battery pack.

No battery adapter is required.

---

# Major Hardware Components

Typical hardware used in the system:

| Component | Description |
|----------|-------------|
| ESP32-WROOM-32 Development Board | Main controller running the firmware |
| Motor Driver | The motor power stage used by the locomotive |
| 5V Power Module or Regulator | Powers the ESP32 from the locomotive power source |
| Fuse Holder and Blade Fuse | Electrical protection |
| Wiring | Connects power, controller, motor driver, and accessories |

Common motor driver examples include:

* **IBT-2 / BTS7960** for higher-current applications
* other supported driver types that match the firmware's supported control modes

Optional components may include:

* adjustable buck converter
* capacitors for noise reduction
* ferrite core for motor wires
* external LEDs or function outputs
* INA219 voltage/current monitor for battery telemetry and low-voltage protection

---

# Motor Driver Support

The project is commonly built with an **IBT-2 / BTS7960**, but the firmware is not limited to that one driver.

The firmware supports multiple motor-driver interface styles, which makes the system more flexible for different locomotive builds and current requirements.

Examples of supported driver interface styles include:

* dual-PWM drivers
* PWM plus direction drivers
* PWM-bidirectional drivers
* dual-input H-bridge drivers

That means the exact motor driver hardware can vary depending on your build.

---

# Why Two Power Paths Are Often Used

The locomotive motor and the ESP32 controller have different electrical needs.

The motor usually requires higher voltage and higher current.

The ESP32 requires a stable low-voltage supply, typically **3 - 5V** into the development board power input.

Keeping the logic/controller power path separate from the motor power path improves reliability and helps protect the controller from motor noise and voltage dips.

---

# Example System Layout

```text
Battery Adapter or DC Transformer
            │
(Optional for Battery (Unnecessary for DC))
     Buck Converter
            │
           Fuse
            │
       Motor Driver
            │
           Motor

Battery / DC Supply
        │
   5V Power Module
        │
     ESP32 Controller
```

Actual wiring can vary depending on:

* motor driver type
* battery voltage
* whether a buck converter is needed
* whether optional accessories such as lights or telemetry are installed

---

# Extra Built-In Firmware Features

Even though this page is only a quick overview, it helps to know that the firmware can do more than simple speed control.

Depending on configuration, the controller can also support:

* configurable train/device naming for wireless identification
* saved settings that persist after power-off
* configurable lighting and function outputs
* momentum, quick-ramp, brake, and stop behaviors
* optional battery telemetry, low-voltage warning, throttle limiting, and shutdown behavior
* onboard status LED behavior that shows connection state

These advanced features are explained in later documentation.

---

# Who This Project Is For

This project is designed for hobbyists who want:

* wireless locomotive control
* inexpensive electronics
* flexible hardware choices
* support for battery-powered or DC-powered builds
* a system that can start simple and expand later

The documentation supports both:

Beginner builders  
and  
Advanced builders.

---

# Next Step

Continue to:

[**02_system_architecture.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/02_system_architecture.md)

This next document explains how the major system components work together in more detail.

[<< Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
