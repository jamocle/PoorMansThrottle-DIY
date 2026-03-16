Below is the **complete updated documentation** reflecting the **actual behavior and capabilities of firmware v1.7.2** from the code you provided, including:

* correct firmware version
* all implemented CVs
* WiFi / WebSocket configuration
* BLE priority behavior
* IP discovery via `IP?`
* handshake requirement
* CV behavior exceptions
* floor/ceiling throttle mapping

---

# Poor Man's Throttle (PMT) – CV Configuration Reference

**Firmware Version:** 1.7.2
**Platform:** ESP32 BLE Heavy-Train Throttle Controller

---

# Overview

The Poor Man's Throttle firmware supports **Configuration Variables (CVs)** that allow operators to configure hardware behavior, throttle characteristics, communication settings, and system behavior.

CVs are **read and modified using commands entered into the Terminal inside the PMT (Poor Man's Throttle) application**.

These settings are **persisted in ESP32 NVS storage**, meaning they remain saved even after power loss.

**Exception:**
CV8 is a reset trigger and is **not persisted**.

---

# Using the PMT Terminal

All commands are entered through the **Terminal window inside the PMT application**.

## Steps

1. Open the **PMT application**
2. Connect to the throttle via **BLE**
3. Perform the **connection handshake**
4. Open the **Terminal**
5. Enter the desired command
6. Press **Send**

The throttle will respond with the current value or confirmation.

---

# CV Command Format

## Query a CV

To read a CV value:

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

To modify a CV:

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

* All CV commands require a **successful handshake (`I,<token>`)**
* Invalid values return:

```
ERR:<command>
```

* Most CV changes are **saved automatically to non-volatile storage after a short delay**

* **CV8 is not stored** and only triggers a reset action

* Some CV changes **restart internal services** (WiFi or WebSocket)

* CV commands can be sent over **BLE or WebSocket**

---

# CV Configuration Table

| CV        | Purpose                  | Possible Values (Default)                                       | Description                                                                               |
| --------- | ------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **CV1**   | Motor Driver Mode        | `DUAL_PWM`, `PWM_DIR` (**Default: DUAL_PWM**)                   | Selects motor driver interface type.                                                      |
| **CV2**   | Minimum Start (Floor)    | `0 – 100` (**Default: 0**)                                      | Minimum hardware throttle output when non-zero throttle is commanded.                     |
| **CV3**   | Maximum Output (Ceiling) | `0 – 100` (**Default: 100**)                                    | Caps the maximum motor output. `0` behaves the same as `100`.                             |
| **CV4**   | Train Name               | Alphanumeric + spaces                                           | Sets the BLE advertised device name.                                                      |
| **CV5**   | Direction Inversion      | `0`, `1` (**Default: 0**)                                       | Reverses motor direction logic.                                                           |
| **CV6**   | Async Notify (Steady)    | `50 – 10000 ms` (**Default: 10000**)                            | State update interval when throttle is stable.                                            |
| **CV7**   | Async Notify (Changing)  | `50 – 10000 ms` (**Default: 500**)                              | State update interval during ramps or speed changes.                                      |
| **CV8**   | Reset Trigger            | `8`                                                             | Writing `CV8=8` wipes configuration and reboots the controller. Query always returns `0`. |
| **CV9**   | Kick Configuration       | `<thr>,<ms>,<rampDownMs>,<maxApply>` (**Default: `0,0,80,15`**) | Configures start-assist kick used when starting from stop at low throttle.                |
| **CV10**  | WiFi Enable              | `0`, `1` (**Default: 0**)                                       | Enables WiFi and WebSocket control interface.                                             |
| **CV11**  | WiFi SSID                | Text                                                            | WiFi network SSID. Changing triggers reconnect if WiFi enabled.                           |
| **CV12**  | WiFi Password            | Text                                                            | WiFi password. Query returns `ERR` for security.                                          |
| **CV13**  | WebSocket Port           | `1 – 65535` (**Default: 81**)                                   | WebSocket server port.                                                                    |
| **CV100** | Dual PWM Forward Pin     | `0 – 39` (**Default: 25**)                                      | Forward PWM pin for `DUAL_PWM` mode.                                                      |
| **CV101** | Dual PWM Reverse Pin     | `0 – 39` (**Default: 26**)                                      | Reverse PWM pin for `DUAL_PWM` mode.                                                      |
| **CV102** | Dual PWM Enable A        | `0 – 39` (**Default: 27**)                                      | Enable pin A.                                                                             |
| **CV103** | Dual PWM Enable B        | `0 – 39` (**Default: 33**)                                      | Enable pin B.                                                                             |
| **CV104** | PWM_DIR PWM Pin          | `0 – 39` (**Default: 25**)                                      | PWM pin used in `PWM_DIR` mode.                                                           |
| **CV105** | PWM_DIR Direction Pin    | `0 – 39` (**Default: 26**)                                      | Direction pin used in `PWM_DIR` mode.                                                     |

---

# WiFi and WebSocket Control

When **CV10=1**, the throttle enables a **secondary control interface over WiFi using WebSockets**.

This interface allows remote command control using the same protocol as BLE.

However, **BLE remains the primary control connection**.

---

# Control Priority

The firmware treats connections with the following priority:

**1. BLE (Primary Control)**
**2. WebSocket (Secondary / Failover)**

Behavior rules:

* If **BLE is connected**, BLE commands take priority
* If **BLE disconnects**, WebSocket control can take over
* If **only WebSocket is connected**, the throttle operates normally
* Both transports use the **same command protocol and handshake**

This allows WiFi control to act as a **backup or remote interface**.

---

# WiFi Configuration

WiFi is configured using:

| CV   | Purpose        |
| ---- | -------------- |
| CV10 | Enable WiFi    |
| CV11 | WiFi SSID      |
| CV12 | WiFi password  |
| CV13 | WebSocket port |

Example:

```
CV10=1
CV11=MyNetwork
CV12=MyPassword
```

---

# Obtaining the Device IP Address

After WiFi connects, the throttle obtains an IP address from the network.

You can retrieve it using:

```
IP?
```

Response:

```
IP:<address>
```

Example:

```
IP:192.168.1.50
```

This address can be used to connect to the WebSocket server.

Example:

```
ws://192.168.1.50:81
```

---

# WebSocket Behavior

* WebSocket uses the **same command protocol as BLE**
* The same **handshake requirement** applies
* Up to **two WebSocket clients** may connect simultaneously
* Changing **CV11, CV12, or CV13** while WiFi is enabled **restarts the service**
* If WiFi disconnects, the firmware waits for reconnection

---

# Supported Motor Driver Boards

The firmware supports **two motor driver control interfaces**.

---

# DUAL_PWM Motor Drivers

Typical control pins:

```
RPWM
LPWM
R_EN
L_EN
```

Common compatible boards:

* IBT-2
* IBT-20
* BTS7960 modules
* BTN7960 modules
* Cytron MDD series
    * Cytron MDD10A
    * Cytron MDD20A
    * Cytron MDD30A
* Monster Moto Shield (VNH2SP30)
* VNH5019 driver boards
* VNH3SP30 modules
* Sabertooth drivers (PWM mode)
* Roboclaw drivers (PWM mode)

These are typically used for **high-current model train motors**.

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

These drivers are commonly used in **robotics or smaller motors**.

---

# Floor and Ceiling Behavior

Throttle commands use **mapped values from 0–100**.

The firmware converts these into **actual hardware output** using CV2 and CV3.

Example configuration:

```
CV2 = 20
CV3 = 70
```

| Command | Hardware Output |
| ------- | --------------- |
| FWD 1   | 20              |
| FWD 50  | ~45             |
| FWD 100 | 70              |

Benefits:

* Immediate locomotive movement
* Smooth ramp behavior
* Defined maximum speed
* Better throttle resolution

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

* Set **CV2** so the locomotive **just begins to move**
* Use **CV3** to limit unsafe top speeds
* Use **CV6 and CV7** to tune UI responsiveness
* Configure motor pins only when stopped
* Enable WiFi (**CV10**) only when needed
* Use **CV8** if hardware configuration changes
