# Poor Man's Throttle
### Wireless Control for Model Trains — Without the High Cost

## The Problem

Wireless throttle systems for model trains can be expensive, closed, and harder to justify for hobbyists who simply want reliable wireless control.

Many builders converting locomotives to **battery power (dead-rail)** want a practical way to control their trains from a phone without investing hundreds of dollars in proprietary hardware.

At the same time, hobbyists using **traditional DC transformers** often run into familiar low-speed problems:

* locomotive hum at low speeds  
* weak starting torque  
* jerky slow-speed operation  

These issues are common when speed is controlled mainly by lowering voltage instead of controlling motor power more effectively.

---

## The Solution

**Poor Man's Throttle** is a low-cost wireless throttle system that lets a smartphone control a model locomotive using an **ESP32** and an inexpensive **DC motor driver**.

At its core, the firmware receives wireless commands and converts them into **PWM motor control** (Pulse Width Modulation) for the locomotive motor. The primary control path is **Bluetooth Low Energy (BLE)**, and the firmware also supports an optional **Wi-Fi / WebSocket** control path as a secondary or failover connection when enabled and configured.

That gives builders an affordable path to smooth motor control, flexible hardware choices, and walk-around wireless operation from a smartphone.

Go here for docs, videos, and installation help: [Installation Hub](https://jamocle.github.io/PoorMansThrottle-DIY/Installer/)

---

## What It Does

Poor Man's Throttle allows a smartphone to control:

* locomotive speed  
* forward direction  
* reverse direction  
* stop  
* quick stop and momentum-style changes  
* feathered / variable brake behavior  
* lighting and auxiliary function outputs  
* additional configuration and status features  

Depending on how a builder configures the installation, the system can also support:

* multiple supported motor driver control styles  
* configurable train naming for easier identification  
* optional Wi-Fi / WebSocket access  
* optional voltage telemetry and low-voltage protection features  

All control is designed to be wireless, allowing the operator to walk around the layout while controlling the train.

---

# A Huge Upgrade for Traditional DC Layouts

Poor Man's Throttle is especially useful on **traditional DC transformer** layouts.

Instead of using the transformer as the main speed control, the transformer is typically set to provide steady power.

The Poor Man's Throttle hardware then uses **PWM motor control** to regulate the locomotive speed.

```text
DC Transformer (set to full power)
            │
            │
     Poor Man's Throttle
      PWM Motor Control
            │
            │
      Locomotive Motor
```

This provides several major benefits.

### Smooth Low-Speed Operation

PWM control can produce smoother low-speed movement than basic voltage-only throttling.

### Stronger Starts

The motor still receives controlled power pulses, which can help the locomotive start more confidently at low speed.

### Reduced Low-Speed Hum Issues

Because the transformer is not being relied on as the fine speed-control device at very low voltage, the humming and buzzing common with inexpensive DC throttles can be reduced.

### Wireless Operation

The system also adds **smartphone wireless control** to traditional DC layouts.

That combination of **PWM motor control** and **wireless walk-around operation** is a major upgrade over many low-cost DC setups.

---

## Designed for Dead-Rail

The system is also well suited to **dead-rail locomotives** powered by onboard batteries.

It can be used with common cordless tool battery ecosystems such as:

* DeWalt  
* Milwaukee  
* Ryobi  
* Ridgid  
* other compatible tool batteries  
* other hobby battery types such as **LiPo, lithium-ion, NiMH, lead-acid, and alkaline** when used appropriately for the installation  

This gives hobbyists the freedom to build around batteries that are affordable, familiar, and widely available.

---

## Flexible Hardware Choices

Poor Man's Throttle is not limited to a single motor driver style.

The current firmware supports several common control patterns used by hobby DC motor drivers, including:

* **DUAL_PWM**  
* **PWM_DIR**  
* **PWM_BIDIR**  
* **DUAL_INPT**  

That flexibility helps the project work with more than one hardware approach instead of locking builders into only one exact driver board.

---

## Typical Hardware Cost

A basic build can still be very inexpensive.

A common entry-level example is around:

**$21 per locomotive**

Example parts:

| Component | Typical Cost |
|---------------------------------------|------|
| ESP32 Development Board               | ~$6  |
| IBT-2 Motor Driver (or other driver)  | ~$10 |
| 5V ESP32 Logic Processor Power Module | ~$5  |

Total: **about $21**

Actual cost depends on the motor driver, battery setup, protection parts, and optional accessories chosen for a specific installation.

---

## Who This Is For

This project is designed for:

* model railroad hobbyists  
* dead-rail builders  
* traditional DC layout operators  
* DIY electronics enthusiasts  
* makers and tinkerers  

It supports both:

**Beginner builders** using simple hardware combinations  
and  
**Advanced builders** creating more customized or permanent installations.

---

## The Goal

The goal of Poor Man's Throttle is simple:

**Make wireless model train control accessible to anyone who wants to build it.**

No expensive proprietary hardware.  
No unnecessary complexity.  
Just a practical, open, affordable throttle system that hobbyists can actually build and use.

---

# Next Step

Continue to:

This document is a quick overview of what Poor Man's Throttle is and why it exists.

[**01_quick_overview.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/01_quick_overview.md)

[<< Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
