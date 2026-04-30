# System Architecture

This document explains how the hardware in the Poor Man's Throttle system works together.

The system is centered around an **ESP32-WROOM-32** controller running Poor Man's Throttle firmware.  
In firmware **v1.12.1**, the controller supports a **primary BLE control path** and an optional **Wi-Fi / WebSocket secondary control path**. It also supports multiple motor driver interface styles, optional telemetry and low-voltage protection hardware, and configurable function outputs for lighting or accessories.

---

# System Overview

At a high level, a throttle app sends commands to the locomotive controller.

The ESP32 receives those commands, applies throttle and direction logic, and then drives the selected motor driver hardware.

## Primary Architecture

```text
Smartphone App
      │
      │  BLE (custom service)
      │
ESP32 Controller
      │
Motor Control Signals
      │
Configured Motor Driver
      │
Locomotive Motor
```

## Optional Secondary / Failover Architecture

When Wi-Fi is enabled and configured in firmware, the controller can also expose a WebSocket control path. This uses the same internal command handling path as BLE.

```text
Smartphone App
      │
      │  Wi-Fi / WebSocket
      │
ESP32 Controller
      │
Motor Control Signals
      │
Configured Motor Driver
      │
Locomotive Motor
```

## Combined View

```text
                      ┌──────────────────────┐
                      │   Smartphone App     │
                      └───────┬───────┬──────┘
                              │       │
                         BLE  │       │  Wi-Fi / WebSocket
                              │       │
                              └──┬─┬──┘
                                 │ │
                         ┌───────▼─▼────────┐
                         │  ESP32 Controller │
                         │  PMT Firmware     │
                         └───────┬───────────┘
                                 │
                         Motor control outputs
                                 │
                      ┌──────────▼──────────┐
                      │   Motor Driver      │
                      └──────────┬──────────┘
                                 │
                                 ▼
                         Locomotive Motor
```

---

# Main System Components

| Component | Role |
|----------|------|
| Smartphone App | Sends throttle, stop, brake, configuration, and function commands |
| ESP32-WROOM-32 | Central controller running PMT firmware |
| Motor Driver | Converts ESP32 control signals into motor power |
| Power System | Supplies motor power and logic power |
| Optional INA219 Module | Monitors voltage, current, and power |
| Motor | Drives the locomotive |
| Optional Function Outputs | Drive headlights, reverse lights, or other accessories |

---

# Control Architecture

## BLE Control Path

BLE is the primary control path in the current firmware.

The firmware exposes a **custom BLE service** with:
- one RX characteristic for incoming commands
- one TX characteristic for outbound notifications and replies

BLE is also used for device discovery and controller identity. The advertised controller name can come from the configured train name.

## Wi-Fi / WebSocket Control Path

Wi-Fi / WebSocket is an optional secondary control path.

When enabled in configuration, the ESP32:
- joins a Wi-Fi network in station mode
- starts a WebSocket server
- accepts command traffic using the same command-processing path used by BLE

This means BLE and WebSocket are not separate control systems. They are two transport layers feeding the same control logic.

## Connection Resilience

The firmware contains connection-handling logic intended to keep control behavior predictable:
- BLE disconnects can start a grace period
- if control is not restored, the controller can force a stop
- BLE advertising recovery is attempted automatically
- Wi-Fi / WebSocket can remain a valid control path while BLE recovery is occurring

This makes the architecture more fault-tolerant than a simple one-link controller design.

---

# Motor Driver Architecture

The firmware does **not** support only one motor driver board.

It supports **four motor driver interface modes**, allowing the same controller design to work with different hardware families.

## Supported Driver Modes

| Mode | Control Model | Typical Hardware |
|------|---------------|------------------|
| DUAL_PWM | Separate forward and reverse PWM outputs, with optional enable pins | IBT-2, BTS7960 |
| PWM_DIR | One PWM pin plus one direction pin | Cytron MD10C, Cytron MDD10A |
| PWM_BIDIR | One PWM/enable pin plus separate forward and reverse logic pins | L298N, L293D |
| DUAL_INPT | Two-input H-bridge style control, with PWM applied to the active side | DRV8833, TB6612FNG, MX1508 |

## What This Means Physically

The wiring between the ESP32 and the motor driver depends on the selected motor driver mode.

Examples:
- In **DUAL_PWM**, the ESP32 drives separate forward and reverse PWM paths.
- In **PWM_DIR**, the ESP32 outputs PWM for speed and a digital direction signal.
- In **PWM_BIDIR**, the ESP32 drives an enable/speed signal plus separate forward/reverse logic lines.
- In **DUAL_INPT**, the ESP32 switches which side receives PWM based on direction.

Because of this, the system architecture should be understood as **ESP32 + configured driver interface**, not just **ESP32 + IBT-2**.

---

# Motion Control Architecture

The ESP32 does more than simply set raw motor speed.

The firmware includes layered motion behavior that sits between user commands and motor output.

## Motion Behaviors Present in Firmware

- instant throttle changes
- quick-ramp throttle changes
- momentum-based throttle changes
- stop handling
- brake handling
- variable brake behavior
- stop-first reversing with a direction-change delay
- optional start assist ("kick") for getting a locomotive moving from rest

This means the ESP32 acts as a **motion controller**, not only a signal bridge.

---

# Power Architecture

The system uses **two separate power paths**:

- **Motor Power**
- **Logic Power**

Separating these improves reliability and helps reduce electrical noise reaching the controller.

## Motor Power Path

Motor power provides the energy used to move the locomotive.

Typical architecture:

```text
Battery Pack or DC Supply
          │
(Optional for Battery Unnecessary for DC power)
          ▼
   Buck Converter
          │
         Fuse
          │
    Motor Driver
          │
        Motor
```

### Optional Buck Converter

A buck converter is used when the incoming supply voltage is higher than the motor or driver should receive.

Example:

```text
20V battery → buck converter → about 15V motor supply
```

This is optional and depends on the locomotive motor, the motor driver's limits, and the supply being used.

## Logic Power Path

The ESP32 requires a stable low-voltage logic supply, separate from raw motor power.

Typical architecture:

```text
Battery / DC Supply
        │
   5V Logic Supply
        │
     ESP32 Power Input
```

In practice, this can be fed through the board's USB-C connection or another suitable regulated 5V input path, depending on the controller board arrangement.

---

# Telemetry and Protection Architecture (Optional)

Firmware v1.12.1 includes optional support for an **INA219** current and voltage monitoring module.

When installed and enabled, this adds a telemetry and protection layer to the system.

## INA219 Role

The INA219 can be used to measure:
- bus voltage
- current
- calculated power

## Protection-Related Behaviors

The firmware also supports configuration for:
- low-voltage warning thresholds
- throttle limiting at low voltage
- shutdown thresholds
- recovery thresholds
- battery-disconnect detection
- an optional low-voltage indicator LED output

This means the architecture can optionally include monitoring and protection logic, not just open-loop motor control.

## Optional Telemetry Layer

```text
Power Source ───────────────► Motor Driver / Motor
      │
      └────────► INA219 Sensor ───────► ESP32
                                      │
                                      ├─ status / telemetry reporting
                                      └─ protection responses
```

---

# Function Output Architecture

The firmware includes support for **12 configurable function outputs**.

These can be used for locomotive accessories such as:
- headlight
- reverse light
- additional lighting effects
- other switched accessory outputs

## Function Behavior

Each function can be configured with:
- a name
- an assigned GPIO pin
- an output pattern
- a direction rule

## Supported Output Patterns

The firmware includes these output pattern types:
- solid
- double blink
- FRED-style pattern
- blink plus
- blink minus

## Direction Awareness

Function outputs can also be gated by locomotive direction:
- forward only
- reverse only
- both directions

This makes the architecture capable of supporting more realistic lighting and accessory behavior than a simple always-on output design.

---

# Controller Status Indicators

## Onboard Status LED

The firmware uses the onboard LED on **GPIO2** as a controller status indicator.

Its behavior changes based on connection state:
- disconnected: search-style blink pattern
- grace period active: alternate warning-style pattern
- any active control connection: solid on
- RX/TX activity while connected: brief dip off

This makes the onboard LED part of the control/status architecture, not just a power indicator.

## Optional Additional LED Outputs

The firmware can also manage additional LED-style outputs using its subscribed output and function systems.

---

# Configuration Architecture

The firmware stores persistent configuration in **ESP32 NVS / Preferences**.

That means the controller can retain its behavior after reboot.

Examples of configuration areas present in firmware include:
- train name
- motor driver mode
- motor driver pin assignments
- min-start and ceiling mapping
- direction inversion
- motion timing values
- Wi-Fi enable / credentials / WebSocket port
- INA219 settings
- function output definitions

This persistent configuration layer is an important part of the real architecture because the same hardware can behave differently depending on its stored setup.

---

# Typical Installation Layout

The electronics can be installed in several physical layouts depending on locomotive size and power strategy.

Common installations include:
- inside the locomotive
- inside a tender
- inside a battery car
- inside a separate electronics enclosure

A typical full installation may include:
- ESP32 controller board
- motor driver board
- fuse
- regulated 5V logic supply
- optional buck converter
- optional INA219 sensor
- optional lighting / function wiring

---

# Practical Summary

The current system should not be described only as:

```text
Smartphone → Bluetooth → ESP32 → IBT-2 → Motor
```

That is still a valid **example installation**, but it is not the full supported architecture in firmware v1.12.1.

A more accurate summary is:

```text
Smartphone App
   │
   ├─ BLE (primary)
   └─ Wi-Fi / WebSocket (optional secondary / failover)
        │
        ▼
ESP32-WROOM-32 Controller
   │
   ├─ Motion control logic
   ├─ Persistent configuration
   ├─ Optional telemetry / protection
   └─ Function / lighting control
        │
        ▼
Configured Motor Driver Interface
   │
   ▼
Locomotive Motor and Optional Accessory Outputs
```

---

# Next Step

Continue to:

This document lists the parts required to build the system.

[**03_bill_of_materials.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/03_bill_of_materials.md)

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
