# System Architecture

This document explains how the hardware and app pieces in the Poor Man's Throttle system work together.

The system is centered around a smartphone app and ESP32-based firmware. The same project now supports multiple PMT device types:

* **Poor Man's Throttle** for locomotive motor control
* **Poor Man's Module** for PMT-compatible accessory / module-style control
* **Poor Man's Turbine** for ESC-style turbine output control

**More modules coming quickly**

The throttle firmware supports a primary **Bluetooth Low Energy (BLE)** control path and an optional **Wi-Fi / WebSocket** secondary control path. It also supports multiple motor driver interface styles, optional telemetry and low-voltage protection hardware, configurable function outputs for lighting or accessories, scheduled operation, and persistent configuration.

---

# System Overview

At a high level, the smartphone app discovers a PMT device, connects to it, sends control or configuration commands, and receives status updates back from the firmware.

For a locomotive throttle installation, the ESP32 receives app commands, applies throttle and direction logic, and drives the configured motor driver hardware.

For a module or turbine installation, the ESP32 still uses the same general app-to-firmware architecture, but the physical output is different. Instead of driving a locomotive motor driver, the firmware may drive accessory-style outputs or an ESC-style turbine signal.

## Primary Throttle Architecture

```text
Smartphone App
      │
     BLE
      │
ESP32 Controller
      │
Throttle / Motion Logic
      │
Configured Motor Driver
      │
Locomotive Motor
```

## Optional Wi-Fi / WebSocket Architecture

When Wi-Fi is enabled and configured, the controller can also expose a WebSocket control path. This gives the app or another compatible client a secondary way to communicate with the device.

```text
Smartphone App or Compatible Client
      │
      │  Wi-Fi / WebSocket
      │
ESP32 Controller
      │
Shared Command Handling
      │
Device Output
```

## Combined Device View

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
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
             Motor Driver   Function /    ESC-style
              Interface     Module I/O   Turbine Output
                    │            │            │
                    ▼            ▼            ▼
             Locomotive   Lights / Aux   Turbine / ESC
                Motor       Outputs
                   |
                   ▼
               Engine Lights
```

---

# Main System Components

| Component | Role |
|----------|------|
| Smartphone App | Discovers PMT devices, sends control commands, opens throttle/module/turbine screens, manages configuration, and displays telemetry/status |
| ESP32-WROOM-32 | Main controller running PMT firmware |
| PMT Firmware | Receives commands, applies device behavior, stores configuration, reports state, and controls the selected outputs |
| Motor Driver | Converts ESP32 control signals into motor power for locomotive throttle builds |
| ESC / Turbine Output | Produces ESC-style output for Poor Man's Turbine builds |
| Power System | Supplies motor/output power and logic power |
| Optional INA219 Module | Monitors voltage, current, and power for telemetry and protection features |
| Optional Function Outputs | Drive headlights, reverse lights, or other accessory outputs |
| Locomotive Motor or Accessory Load | The physical thing being controlled by the PMT device |

---

# App Architecture

The smartphone app is the customer-facing control center for the system.

From the user's point of view, the app provides:

* BLE device discovery
* known-device handling for previously configured devices
* throttle control screens
* module-style device screens
* turbine control and calibration screens
* configuration screens
* terminal / diagnostic tools
* telemetry display
* scheduled-run setup
* app-managed MU / consist operation
* multilingual and accessibility support

The app does not replace the safety behavior in the firmware. The app sends commands and coordinates user workflows, while each connected ESP32 device remains responsible for its own local output behavior, configuration, and protection responses.

---

# Control Architecture

## BLE Control Path

BLE is the primary control path for PMT devices.

The firmware exposes a PMT BLE service with separate paths for incoming commands and outbound replies or notifications. BLE is also used for discovery and identity, so the app can find nearby PMT devices and show user-friendly device names.

For locomotive throttle builds, the advertised name can come from the configured train name.

## Wi-Fi / WebSocket Control Path

Wi-Fi / WebSocket is an optional secondary communication path.

When enabled and configured, the ESP32 can join a Wi-Fi network and accept WebSocket command traffic. The important architectural point is that BLE and WebSocket feed the same general command handling model. They are different transport paths, not completely separate control systems.

This allows the app to support better connection behavior for configured devices, especially when a known device can be reached over the network.

## Connection Resilience

The firmware and app both contribute to connection resilience.

Firmware-side behavior can include:

* BLE disconnect grace handling
* forced stop behavior when control is not restored
* BLE advertising recovery
* safe recovery behavior before rebooting when recovery is needed
* continued WebSocket control when a valid socket session is active

App-side behavior can include:

* known-device tracking
* BLE and WebSocket connection assistance
* diagnostics for connection troubleshooting
* user settings for auto-connect and disconnected-throttle handling

Together, this is more fault-tolerant than a simple one-link Bluetooth controller.

---

# Device-Type Architecture

## Poor Man's Throttle

Poor Man's Throttle is the locomotive motor-control device.

In this mode, the ESP32 behaves as a motion controller. It receives throttle, direction, stop, brake, function, and configuration commands, then drives a configured motor driver interface.

Typical output:

```text
ESP32 → Motor Driver → Locomotive Motor
```

## Poor Man's Module

Poor Man's Module uses the same PMT app/firmware communication foundation but is oriented toward module-style control instead of locomotive throttle output.

Architecturally, this means the app can discover and open a PMT-compatible device that is not necessarily a train motor throttle.

Typical output:

```text
ESP32 → Configured Module / Accessory Outputs
```

## Poor Man's Turbine

Poor Man's Turbine adds ESC-style turbine control to the PMT ecosystem.

In this mode, the app provides turbine-specific control and guided calibration, while the firmware manages the output signal and related configuration.

Typical output:

```text
Smartphone App → ESP32 → ESC-style Output → Turbine / ESC
```

The turbine architecture is related to the throttle architecture because it uses the same general PMT app-to-firmware idea, but it should not be described as a locomotive motor driver installation.

---

# Motor Driver Architecture

The throttle firmware does **not** support only one motor driver board.

It supports multiple motor driver interface modes, allowing the same controller design to work with different hardware families.

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

* In **DUAL_PWM**, the ESP32 drives separate forward and reverse PWM paths.
* In **PWM_DIR**, the ESP32 outputs PWM for speed and a digital direction signal.
* In **PWM_BIDIR**, the ESP32 drives an enable/speed signal plus separate forward/reverse logic lines.
* In **DUAL_INPT**, the ESP32 switches which side receives PWM based on direction.

Because of this, the system architecture should be understood as **ESP32 + configured driver interface**, not just **ESP32 + IBT-2**.

---

# Motion Control Architecture

For throttle builds, the ESP32 does more than simply set raw motor speed.

The firmware includes layered motion behavior between user commands and motor output.

## Motion Behaviors Present in Firmware

* instant throttle changes
* quick-ramp throttle changes
* momentum-based throttle changes
* stop handling
* brake handling
* variable brake behavior
* stop-first reversing with a direction-change delay
* optional start assist / kick behavior for getting a locomotive moving from rest

This means the ESP32 acts as a **motion controller**, not only a wireless signal bridge.

---

# Consist Architecture

MU / consist operation is **app-managed**.

The smartphone app coordinates multiple connected throttle controllers so the user can operate them together. Each firmware device still handles its own local throttle, direction, connection, output, and safety behavior.

A simplified consist view is:

```text
                  ┌──────────────────────┐
                  │   Smartphone App     │
                  │  App-managed consist │
                  └───────┬───────┬──────┘
                          │       │
                          ▼       ▼
                    Throttle A  Throttle B
                    Firmware    Firmware
                          │       │
                          ▼       ▼
                    Motor A     Motor B
```

This distinction matters: the firmware supports the device behavior needed for consist operation, but the consist coordination logic lives in the app.

---

# Scheduled Operation Architecture

The system can support scheduled operation for configured devices.

At a high level:

* the app lets the user configure schedule settings
* the firmware stores schedule settings persistently
* the firmware can run configured ON and OFF actions at scheduled times
* schedules require valid setup before autonomous behavior is allowed

For locomotive throttle builds, this can allow scheduled start/stop behavior without a controller remaining actively connected for the whole window.

Scheduled operation should be treated as a higher-level automation layer on top of the normal command system.

---

# Power Architecture

The system commonly uses **two separate power paths**:

* **Motor / Output Power**
* **Logic Power**

Separating these improves reliability and helps reduce electrical noise reaching the controller.

## Motor or Output Power Path

Motor/output power provides the energy used to move the locomotive or drive the external output device.

Typical throttle architecture:

```text
Battery Pack or DC Supply
          │
(Optional Buck Converter)
          │
         Fuse
          │
    Motor Driver
          │
        Motor
```

### Optional Buck Converter

A buck converter is used when the incoming supply voltage is higher than the motor, driver, ESC, or accessory output should receive.

Example:

```text
20V battery → buck converter → about 15V motor supply
```

This is optional and depends on the locomotive motor, output device, driver limits, and supply being used.

## Logic Power Path

The ESP32 requires a stable low-voltage logic supply, separate from raw motor/output power.

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

PMT firmware includes optional support for an **INA219** current and voltage monitoring module.

When installed and enabled, this adds a telemetry and protection layer to the system.

## INA219 Role

The INA219 can be used to measure:

* bus voltage
* current
* calculated power

## Protection-Related Behaviors

Depending on the device type and configuration, firmware can support:

* low-voltage warning thresholds
* throttle or output limiting at low voltage
* shutdown thresholds
* recovery thresholds
* battery-disconnect detection
* optional low-voltage indicator output

This means the architecture can optionally include monitoring and protection logic, not just open-loop output control.

## Optional Telemetry Layer

```text
Power Source ───────────────► Motor Driver / ESC / Output Load
      │
      └────────► INA219 Sensor ───────► ESP32
                                      │
                                      ├─ status / telemetry reporting
                                      └─ protection responses
```

---

# Function / FX Architecture

The throttle firmware includes **12 configurable FX slots**. An FX slot can represent a physical output such as a light, or an audio action.

Typical uses include:

* headlight
* reverse light
* additional lighting effects
* bell, horn, or cab-chatter audio
* user-selected custom PMTPlayer audio
* other switched accessory outputs

## Function Behavior

Each function can be configured with:

* a name
* a pin/track field
* a numeric pattern
* a direction rule
* app flags

The meaning of the pin/track field depends on the pattern. For physical LED patterns, it is a GPIO. For `AUDIO_CUSTOM` / `AUDIO_CUSTOM_REPLAY`, the same CV stores a PMTPlayer track number from `1..9999`. Bell, horn, and cab-chatter audio patterns do not require a physical function GPIO.

## Supported Pattern Families

Current pattern values are:

| Value | Meaning |
|---:|---|
| `0` | None / unconfigured |
| `1` | LED solid |
| `2` | LED double blink |
| `3` | FRED |
| `4` | LED blink+ |
| `5` | LED blink- |
| `100` | Audio bell |
| `101` | Audio horn |
| `102` | Audio cab chatter |
| `103` | Audio custom one-shot |
| `104` | Audio custom replay / loop |

Values `1..99` are reserved for physical/LED patterns and `100..199` for audio patterns. Legacy text aliases such as `SOLID`, `DBL_BLNK`, `AUDIO_BELL`, and `AUDIO_HORN` are still accepted, but CV queries report numeric values.

## Direction Awareness

FX behavior can also be gated by locomotive direction:

* forward only
* reverse only
* both directions

For physical patterns, activation additionally requires a valid non-conflicting output GPIO. Audio FX instead use the active audio configuration and, for custom patterns, the configured track number.

---

# Controller Status Indicators

## Onboard Status LED

The firmware uses the ESP32 onboard status LED as a controller status indicator when supported by the board configuration.

Its behavior changes based on connection state, such as:

* disconnected / searching
* grace period active
* active control connection
* receive/transmit activity

This makes the onboard LED part of the control/status architecture, not just a power indicator.

## Optional Additional LED Outputs

The firmware can also manage additional LED-style outputs using its function and low-voltage indicator features.

---

# Configuration Architecture

The firmware stores persistent configuration in ESP32 non-volatile storage.

That means the controller can retain its behavior after reboot or power loss.

Examples of configuration areas include:

* device / train name
* motor driver mode
* motor driver pin assignments
* min-start and ceiling mapping
* direction inversion
* motion timing values
* Wi-Fi enablement, credentials, and WebSocket port
* INA219 settings
* function output definitions
* schedule settings
* turbine output settings, when using Poor Man's Turbine firmware

This persistent configuration layer is an important part of the architecture because the same hardware can behave differently depending on its stored setup.

The smartphone app provides customer-friendly screens for many of these settings, while lower-level configuration remains available through diagnostic and terminal workflows when needed.

---

# Typical Installation Layout

The electronics can be installed in several physical layouts depending on locomotive size, power strategy, and device type.

Common installations include:

* inside the locomotive
* inside a tender
* inside a battery car
* inside a separate electronics enclosure
* in a layout-side accessory or module box

A typical throttle installation may include:

* ESP32 controller board
* motor driver board
* fuse
* regulated 5V logic supply
* optional buck converter
* optional INA219 sensor
* optional lighting / function wiring

A typical turbine or module installation may use a different output device, but the same basic idea remains:

```text
Smartphone App → ESP32 Firmware → Configured Output Hardware
```

---

# Practical Summary

The current system should not be described only as:

```text
Smartphone → Bluetooth → ESP32 → IBT-2 → Motor
```

That is still a valid **example throttle installation**, but it is not the full supported architecture.

A more accurate summary is:

```text
Smartphone App
   │
   ├─ BLE primary control
   └─ Optional Wi-Fi / WebSocket control
        │
        ▼
ESP32-WROOM-32 Controller
   │
   ├─ Shared command handling
   ├─ Persistent configuration
   ├─ Device-specific behavior
   ├─ Optional telemetry / protection
   ├─ Optional schedule automation
   └─ Optional function / lighting control
        │
        ▼
Configured Output Hardware
   │
   ├─ Locomotive motor driver
   ├─ Accessory / module outputs
   └─ ESC-style turbine output
```

The architecture is best understood as a flexible PMT app plus ESP32 firmware platform that can control locomotives, modules, and turbine-style outputs using low-cost, configurable hardware.

---

# Next Step

Continue to:

This document lists the parts required to build the system.

[**03_bill_of_materials.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/03_bill_of_materials.md)

[<< Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
