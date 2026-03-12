# Poor Man's Throttle (PMT) – CV Configuration Reference

**Firmware Version:** 1.7.1
**Platform:** ESP32 BLE Heavy-Train Throttle Controller

---

# Overview

The Poor Man's Throttle firmware supports **Configuration Variables (CVs)** that allow operators to configure hardware behavior, throttle characteristics, and system settings over BLE.

CVs are **read and modified using commands entered into the Terminal inside the PMT (Poor Man's Throttle) application.**

These settings are **persisted in ESP32 NVS storage**, meaning they remain saved even after power loss.

**Exception:** CV8 is a reset trigger and is **not persisted**.

---

# Using the PMT Terminal

All CV commands are entered using the **Terminal window inside the PMT application**.

## Steps

1. Open the **PMT application**
2. Connect to the throttle via **BLE**
3. Open the **Terminal**
4. Enter the desired command
5. Press **Send**

The throttle will respond with the current value or confirmation.

---

# CV Command Format

## Query a CV

To read a CV value, enter:

```
CV<number>?
```

Example:

```
CV2?
```

Response:

```
A:CV2=0
```

---

## Set a CV

To change a CV value:

```
CV<number>=<value>
```

Example:

```
CV2=25
```

Response:

```
A:CV2=25
```

---

# Important Notes

• All CV commands require a **successful BLE handshake**
• Values outside the allowed range will return:

```
ERR:<command>
```

• Most CV changes are **saved automatically to non-volatile memory** after a short delay
• **CV8 is not stored** and only triggers a reset action

---

# CV Configuration Table

| CV        | Purpose                       | Possible Values (Default)                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------- | ----------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CV1**   | Motor Driver Mode             | `DUAL_PWM`, `PWM_DIR` (**Default: DUAL_PWM**)                        | Selects the motor driver interface type used by the throttle controller. <br><br>**DUAL_PWM mode** uses two PWM outputs (forward and reverse) plus optional enable pins. Compatible boards include **IBT-2, IBT-20, BTS7960 modules, Cytron MDD series, VNH5019**, and other dual-PWM H-bridge drivers. <br><br>**PWM_DIR mode** uses a single PWM output and a direction pin. Compatible boards include **Cytron MD10C, MD13S, MD30C, L298N, L293D, TB6612FNG, DRV8871, MC33926**, and similar PWM+DIR drivers. |
| **CV2**   | Minimum Start (Floor)         | `0 – 100` (**Default: 0**)                                           | Defines the **minimum hardware throttle output** used when a non-zero throttle command is issued. This helps prevent motor stall when starting. **This value should normally be adjusted to the point where the locomotive wheels just begin to turn.** Setting CV2 correctly eliminates delays between throttle commands and actual train movement and prevents poor ramp behavior caused by low throttle values that cannot overcome static friction. A value of `0` disables the floor remap.                 |
| **CV3**   | Maximum Output (Ceiling)      | `0 – 100` (**Default: 100**)                                         | Caps the **maximum motor output**. When set below 100, full throttle commands are limited to the configured ceiling value. This effectively creates a **maximum speed limit** for the locomotive. By lowering the ceiling, throttle values **1–100 are redistributed across the reduced output range**, providing finer speed control and better granularity across the throttle scale. A value of `0` disables the ceiling limit and internally behaves the same as `100`.                                      |
| **CV4**   | Train Name                    | Alphanumeric + spaces (**Default: empty / firmware name**)           | Sets the **BLE advertised train name**. If empty, the device advertises using the firmware name.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **CV5**   | Direction Inversion           | `0`, `1` (**Default: 0**)                                            | Reverses motor direction logic. `0` = normal direction. `1` = inverted direction. Useful if motor wiring is reversed.                                                                                                                                                                                                                                                                                                                                                                                            |
| **CV6**   | Async State Notify (Steady)   | `50 – 10000 ms` (**Default: 10000 ms**)                              | Interval for automatic state updates when the throttle is **not changing speed**. Updates are sent to the PMT UI so it can display the current throttle state. **Lower values provide quicker UI feedback**, while higher values reduce BLE traffic.                                                                                                                                                                                                                                                             |
| **CV7**   | Async State Notify (Changing) | `50 – 10000 ms` (**Default: 500 ms**)                                | Interval for automatic state updates when the throttle **is ramping or changing speed**. **Lower values provide faster UI feedback during ramps**, while higher values reduce BLE update frequency.                                                                                                                                                                                                                                                                                                              |
| **CV8**   | Reset Trigger                 | `8` (**Query always returns: 0**)                                    | Writing `CV8=8` wipes all stored configuration and reboots the controller. This CV is **not persisted**.                                                                                                                                                                                                                                                                                                                                                                                                         |
| **CV9**   | Kick Configuration            | `<throttle>,<ms>,<rampDownMs>,<maxApply>` (**Default: `0,0,80,15`**) | Configures the **start assist kick** used when starting from stop at low throttle. Values represent **kick throttle**, **kick duration (ms)**, **kick ramp-down time (ms)**, and **maximum throttle where kick can be applied**.                                                                                                                                                                                                                                                                                 |
| **CV100** | Dual PWM Forward Pin          | `0 – 39` (**Default: 25**)                                           | GPIO pin used for **forward PWM output** when operating in `DUAL_PWM` driver mode.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **CV101** | Dual PWM Reverse Pin          | `0 – 39` (**Default: 26**)                                           | GPIO pin used for **reverse PWM output** when operating in `DUAL_PWM` driver mode.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **CV102** | Dual PWM Enable A             | `0 – 39` (**Default: 27**)                                           | Enable pin A used by dual-PWM motor drivers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **CV103** | Dual PWM Enable B             | `0 – 39` (**Default: 33**)                                           | Enable pin B used by dual-PWM motor drivers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **CV104** | PWM_DIR PWM Pin               | `0 – 39` (**Default: 25**)                                           | PWM output pin used when the motor driver operates in `PWM_DIR` mode.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **CV105** | PWM_DIR Direction Pin         | `0 – 39` (**Default: 26**)                                           | Direction control pin used when the motor driver operates in `PWM_DIR` mode.                                                                                                                                                                                                                                                                                                                                                                                                                                     |

---

# Supported Motor Driver Boards

The throttle firmware supports **two different motor driver control interfaces**.
The board you use determines which **CV1 mode** should be selected.

---

# DUAL_PWM Motor Drivers

Typical control pins:

```
RPWM
LPWM
R_EN
L_EN
```

Compatible boards include:

* IBT-2
* IBT-20
* BTS7960 modules
* BTN7960 modules
* Cytron MDD10A
* Cytron MDD20A
* Cytron MDD30A
* Monster Moto Shield (VNH2SP30)
* VNH5019 driver boards
* VNH3SP30 modules
* Sabertooth drivers (PWM mode)
* Roboclaw drivers (PWM mode)

These are typically used for **high-current motors** such as large model trains.

---

# PWM_DIR Motor Drivers

Typical control pins:

```
PWM
DIR
```

Compatible boards include:

* Cytron MD10C
* Cytron MD13S
* Cytron MD30C
* Cytron MDS40A
* L298N
* L293D
* TB6612FNG
* DRV8871
* DRV8876
* MC33926
* MX1508
* SN754410

These drivers are often used in **smaller robotics projects or lower current motors**.

---

# Floor and Ceiling Behavior

Throttle commands use **mapped throttle values from 0–100**.

The firmware converts these mapped values into **actual hardware output** based on CV2 and CV3.

Example configuration:

```
CV2 = 20
CV3 = 70
```

| Intent  | Hardware Output |
| ------- | --------------- |
| FWD 1   | 20              |
| FWD 50  | ~45             |
| FWD 100 | 70              |

This configuration provides:

• Immediate locomotive movement when throttle increases from zero
• Smooth ramp behavior
• A defined **maximum train speed**
• Improved **speed resolution across the throttle range**

---

# Resetting Configuration

```
CV8=8
```

This will:

1. Stop the motor
2. Clear all saved configuration
3. Reboot the ESP32

---

# Best Practices

• Set **CV2** so the locomotive **just begins to move**
• Use **CV3** to limit unsafe top speeds
• Use **CV6 and CV7** to tune **UI update responsiveness**
• Configure motor pins only when stopped
• Use **CV8** to reset configuration if hardware changes

