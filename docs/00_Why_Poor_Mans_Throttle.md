# Poor Man's Throttle
### Wireless Control for Model Trains — Without the High Cost

Link: [https://jamocle.github.io/PoorMansThrottle-DIY/Installer/Info/index.html](https://jamocle.github.io/PoorMansThrottle-DIY/Installer/Info/index.html)

## The Problem

Wireless throttle systems for model trains can be expensive, closed, and harder to justify for hobbyists who simply want reliable wireless control.

Many builders converting locomotives to **battery power (dead-rail)** want a practical way to control their trains from a phone without investing hundreds of dollars in proprietary hardware.

At the same time, hobbyists using **traditional DC transformers** often run into familiar low-speed problems:

* locomotive hum at low speeds
* weak starting torque
* jerky slow-speed operation

These issues are common when speed is controlled mainly by lowering voltage instead of controlling motor power more effectively.

Poor Man's Throttle exists to solve that problem with parts that are inexpensive, available, and understandable.

---

## The Solution

**Poor Man's Throttle** is a low-cost wireless control system for model railroad hobbyists. It combines a smartphone app, ESP32-based firmware, and inexpensive control electronics to give builders practical wireless control without being locked into a proprietary throttle ecosystem.

For locomotives, the firmware receives wireless commands from the app and converts them into **PWM motor control** (Pulse Width Modulation) for the locomotive motor. The primary control path is **Bluetooth Low Energy (BLE)**, and the firmware can also use **Wi-Fi / WebSocket** as a secondary or backup connection when enabled and configured.

The project has also grown beyond a single throttle. The same app and firmware foundation can support PMT-compatible modules, including **Poor Man's Turbine**, so builders can control additional effects and accessories from the same smartphone-based system.

**More Modules coming Quickly**

Go here for docs, videos, and installation help: [Installation Hub](https://jamocle.github.io/PoorMansThrottle-DIY/Installer/)

---

## What It Does

Poor Man's Throttle allows a smartphone to control common locomotive functions such as:

* locomotive speed
* forward direction
* reverse direction
* stop
* quick stop and momentum-style speed changes
* feathered / variable brake behavior
* lighting and auxiliary function outputs
* configuration and status features

Depending on the firmware, hardware, and app configuration, the system can also support:

* multiple motor driver control styles
* app-managed MU / consist operation
* configurable train names for easier identification
* optional Wi-Fi / WebSocket backup control
* optional battery telemetry with voltage, current, and power reporting
* optional low-voltage warning, limiting, and shutdown behavior
* scheduled command (e.g. start / stop) operation for autonomous running
* module-style devices such as Poor Man's Turbine

All control is designed for walk-around wireless operation, allowing the operator to move around the layout while controlling the train or module from a phone.

---

## The Smartphone App

The PMT smartphone app is the main user interface for the system.

From the app, users can scan for nearby PMT devices, connect to a throttle or supported module, operate the device, and adjust configuration settings without needing to recompile firmware.

The app supports multiple throttle views, including simpler and more advanced operating screens. It also includes configuration screens, terminal access for advanced users, diagnostics, backup / restore tools, accessibility improvements, and multilingual support.

For supported firmware and hardware, the app can also manage advanced features such as battery management, schedules, known devices, Wi-Fi backup connection details, and app-managed consisting.

---

# A Huge Upgrade for Traditional DC Layouts

Poor Man's Throttle is especially useful on **traditional DC transformer** layouts.

Instead of using the transformer as the main speed control, the transformer is typically set to provide steady power.

The Poor Man's Throttle hardware then uses **PWM motor control** to regulate the locomotive speed.

```text
DC Transformer (set to steady (full) power)
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
* Rigid
* other compatible tool batteries
* other hobby battery types such as **LiPo, lithium-ion, NiMH, lead-acid, and alkaline** when used appropriately for the installation

This gives hobbyists the freedom to build around batteries that are affordable, familiar, and widely available.

With optional INA219 battery monitoring, compatible builds can also report battery voltage, current, and power to the app and can use configured low-voltage behavior to help protect the battery from over-discharge.

---

## Flexible Hardware Choices

Poor Man's Throttle is not limited to a single motor driver style.

The current throttle firmware supports several common control patterns used by hobby DC motor drivers, including:

* **DUAL_PWM**
* **PWM_DIR**
* **PWM_BIDIR**
* **DUAL_INPT**

That flexibility helps the project work with more than one hardware approach instead of locking builders into only one exact driver board.

---

## More Than a Throttle

Poor Man's Throttle is built around a reusable app and firmware foundation.

That foundation allows PMT-compatible devices to share the same general connection, configuration, battery, Wi-Fi, schedule, and terminal concepts while still providing device-specific controls.

For example, **Poor Man's Turbine** adds app and firmware support for controlling a turbine-style output, including turbine output control, ESC calibration, and turbine-specific configuration.

**More Modules coming Quickly**

This keeps the project expandable without losing the original goal: simple, affordable, phone-based control for model railroad builders.

---

## Typical Hardware Cost

A basic throttle build can still be very **inexpensive**.

A common entry-level example is around:

**$21 per locomotive**

Example parts:

| Component | Typical Cost |
|---------------------------------------|------|
| ESP32 Development Board               | ~$4  |
| IBT-2 Motor Driver (or other driver)  | ~$10 |
| 5V ESP32 Logic Processor Power Module | ~$5  |

Total: **about $19**

Actual cost depends on the motor driver, battery setup, protection parts, wiring, enclosure, sensors, and optional accessories chosen for a specific installation.

Module builds may use different output hardware depending on what the module is designed to control.  **The choice is yours**.

---

## Who This Is For

This project is designed for:

* model railroad hobbyists
* dead-rail builders
* traditional DC layout operators
* Any scale (especially G-scale) train builders
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
No vendor lock-in.

Just a practical, open, affordable control system that hobbyists can actually build, understand, modify, and use.

---

# Next Step

Continue to:

This document is a quick overview of what Poor Man's Throttle is and why it exists.

[**01_quick_overview.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/01_quick_overview.md)

[<< Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
