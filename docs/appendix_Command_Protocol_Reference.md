# Poor Man's Throttle (PMT) – Command Protocol Reference

**Firmware Version:** 1.10.4  
**Platform:** ESP32 BLE Heavy-Train Throttle Controller

---

# Overview

The throttle accepts **ASCII text commands** sent over either control interface:

- **BLE (Primary Control)**
- **WebSocket / WiFi (Secondary / failover control)**

Both interfaces use the **same command handling path**.

Command characteristics:

- Commands are **case-insensitive**
- Leading/trailing whitespace and CR/LF are **ignored**
- Throttle values are **clamped to 0–100**

Responses are returned as one of:

- `ACK:<command>`
- `ERR:<command>`
- `A:CV<n>=<value>` for CV queries/sets
- **RAW responses** (no `ACK:`/`ERR:` wrapper) for selected commands

---

# Connection Authorization

Before **CV commands** are accepted, the controller requires a **connection authorization handshake**.

Most status/debug/runtime commands can still be used before authorization, but CV access is blocked until authorization succeeds.

Authorization remains active until the device reboots.

---

## Step 1 — Request the Connection Authorization ID

Send:

```text
I
````

Response:

```text
I:<auth-id>
```

---

## Step 2 — Send Connection Authorization Token

The client must send a **connection authorization token**.

If the token is invalid:

```text
ERR:ConnFailed
```

Notes:

* If authorization was already completed earlier in the same boot session, the firmware still returns:

```text
I:CONNECTED
```

---

## Step 3 — Verify Authorization

```text
I?
```

Responses:

```text
ACK:Connected
```

or

```text
ERR:ConnFailed
```

Once authorization succeeds, it stays enabled until reboot.

---

# Command Response Types

Most commands return:

```text
ACK:<command>
```

or:

```text
ERR:<command>
```

CV commands are different. Successful CV reads/writes return:

```text
A:CV<n>=<value>
```

Some commands return **RAW responses** without `ACK:` or `ERR:` wrappers.

RAW-response commands include:

```text
?
??
C?
IP?
I
I,<token>   ; on success
V
```

---

# Motion Commands

Throttle values range from **0–100**.

Values are in the **mapped throttle domain** and are converted to hardware output using:

* **CV2** = floor / minimum start
* **CV3** = ceiling / maximum output

---

## Momentum Ramp Commands

Smooth acceleration and deceleration using the firmware momentum model.

Forward:

```text
F<n>
```

Reverse:

```text
R<n>
```

Example:

```text
F40
```

Successful response:

```text
ACK:F40
```

---

## Quick Ramp Commands

Faster acceleration profile than momentum ramps.

Forward quick ramp:

```text
FQ<n>
```

Reverse quick ramp:

```text
RQ<n>
```

Example:

```text
FQ60
```

Successful response:

```text
ACK:FQ60
```

---

# Stop and Brake Commands

## Quick Stop

```text
S
```

Rapid ramp down to stop.

Response:

```text
ACK:S
```

---

## Brake Stop

```text
B
```

Slower deceleration ramp.

Response:

```text
ACK:B
```

---

## Variable Brake

The firmware also supports a **variable brake level** form:

```text
B<n>
```

Where `n` is `1..100`.

Example:

```text
B35
```

Response:

```text
ACK:B35
```

Behavior:

* Applies a brake ramp scaled by the brake level
* Captures the currently commanded motion target so it can optionally be resumed later

### Release Variable Brake

```text
B0
```

Response:

```text
ACK:B0
```

Behavior:

* Releases variable brake mode
* If a motion target was remembered, the firmware replays it when motion is allowed

---

# Direction Change Behavior

If a direction change is requested while the train is moving, the firmware automatically performs:

1. Ramp down to zero
2. Wait the configured direction delay
3. Ramp up in the new direction

This prevents mechanical shock and protects motor drivers.

Notes:

* Direction-change delay is currently **2000 ms**
* Reverse sequencing uses a true stop before changing direction

---

# State Query Commands

These commands return **RAW responses**.

---

## Hardware State

```text
?
```

Example response:

```text
HW-FWD M40 HW60
```

Possible stopped example:

```text
HW-STOPPED M0 HW0
```

Fields:

| Field                              | Meaning                            |
| ---------------------------------- | ---------------------------------- |
| `HW-FWD` / `HW-REV` / `HW-STOPPED` | Hardware direction / stopped state |
| `M<n>`                             | Mapped throttle                    |
| `HW<n>`                            | Actual hardware output percentage  |

---

## Stored State

```text
??
```

Example:

```text
FWD M40 HW60
```

This reports the **stored/logical state** rather than raw hardware state.

---

# Firmware Version

```text
V
```

Example response:

```text
1.10.4
```

This is a **RAW response**.

---

# Connection Status

```text
C?
```

Example response:

```text
CONN B1 S0 W1
```

Fields:

| Field | Meaning                                         |
| ----- | ----------------------------------------------- |
| `B`   | BLE connected                                   |
| `S`   | At least one tracked WebSocket client connected |
| `W`   | WiFi connected                                  |

This is a **RAW response**.

---

# IP Address Query

When WiFi is enabled/configured, the IP can be retrieved with:

```text
IP?
```

Example response:

```text
IP:192.168.1.50
```

This is a **RAW response**.

The WebSocket endpoint then uses:

```text
ws://192.168.1.50:81
```

Notes:

* The default WebSocket port is **81**
* The port is configurable via **CV13**

---

# Debug Commands

Debug commands control serial logging.

---

## Enable Debug

```text
D1
```

Response:

```text
ACK:D1
```

Behavior:

* Enables serial debug logging
* Starts serial output at **115200 baud**

---

## Disable Debug

```text
D0
```

Response:

```text
ACK:D0
```

---

# Periodic Debug Logging

## Print only mismatches

```text
P0
```

Response:

```text
ACK:P0
```

This is the default behavior.

---

## Print every period

```text
P1
```

Response:

```text
ACK:P1
```

---

# Asynchronous State Updates

The firmware can send automatic unsolicited state updates in this format:

```text
A:<state>
```

Example:

```text
A:HW-FWD M30 HW50
```

Notes:

* These are **runtime-controlled**
* They are **disabled by default on every boot**
* They do **not** affect direct command replies

Update interval is controlled by:

* **CV6** = notify interval when throttle is steady
* **CV7** = notify interval while throttle is changing

---

## Enable Async State Updates

```text
A1
```

Response:

```text
ACK:A1
```

---

## Disable Async State Updates

```text
A0
```

Response:

```text
ACK:A0
```

---

# Function Output Commands

The firmware supports **12 function outputs**.

Runtime control uses:

```text
FX<n>=0
FX<n>=1
```

Where `n` is `1..12`.

Examples:

```text
FX1=1
FX2=0
FX12=1
```

Responses:

```text
ACK:FX1=1
ACK:FX2=0
```

or:

```text
ERR:FX<n>=<value>
```

Notes:

* A function can fail to activate if its configuration is incomplete or invalid
* Direction-gated functions may be forced off automatically when the current allowed direction does not match their configured direction mode

---

# CV Commands

CV commands require successful authorization first.

If a CV command is attempted before authorization succeeds, the firmware returns:

```text
ERR:InvalidCMD
```

---

## CV Query Format

```text
CV<n>?
```

Successful response format:

```text
A:CV<n>=<value>
```

Example:

```text
CV2?
```

Response:

```text
A:CV2=10
```

---

## CV Set Format

```text
CV<n>=<value>
```

Successful response format:

```text
A:CV<n>=<value>
```

Example:

```text
CV3=85
```

Response:

```text
A:CV3=85
```

Invalid CV syntax or invalid values return:

```text
ERR:<original-command>
```

---

# Implemented CVs

Only the CVs confirmed below are documented here.

## Core Motion / Identity CVs

| CV    | Purpose                                 | Value Format                              |
| ----- | --------------------------------------- | ----------------------------------------- |
| `CV1` | Motor driver type                       | `DUAL_PWM`, `PWM_DIR`, `PWM_BIDIR`        |
| `CV2` | Minimum start / floor                   | `0..100`                                  |
| `CV3` | Ceiling / max output                    | `0..100`                                  |
| `CV4` | Train name                              | ASCII letters, digits, spaces             |
| `CV5` | Direction invert                        | `0` or `1`                                |
| `CV6` | Async state interval when steady (ms)   | `50..10000`                               |
| `CV7` | Async state interval when changing (ms) | `50..10000`                               |
| `CV8` | Reserved / special handling             | query returns `0`                         |
| `CV9` | Kick config                             | `<throttle>,<ms>,<rampDownMs>,<maxApply>` |

### CV9 Example

```text
CV9=25,300,80,15
```

Response:

```text
A:CV9=25,300,80,15
```

---

## WiFi / WebSocket CVs

| CV     | Purpose             | Value Format             |
| ------ | ------------------- | ------------------------ |
| `CV10` | WiFi enable         | `0` or `1`               |
| `CV11` | WiFi SSID           | free-form string         |
| `CV12` | Blink timing config | `<phasePeriodMs>,<onMs>` |
| `CV13` | WebSocket port      | `1..65535`               |

### CV12 Example

```text
CV12=1000,250
```

Response:

```text
A:CV12=1000,250
```

Notes:

* Changing `CV10`, `CV11`, `CV12`, or `CV13` can affect runtime WiFi/WebSocket behavior
* When WiFi connects, the firmware may emit an unsolicited:

```text
IP:<address>
```

---

## Driver Pin CVs

### DUAL_PWM Pins

| CV      | Purpose                  |
| ------- | ------------------------ |
| `CV100` | DUAL_PWM forward PWM pin |
| `CV101` | DUAL_PWM reverse PWM pin |
| `CV102` | DUAL_PWM ENA pin         |
| `CV103` | DUAL_PWM ENB pin         |

### PWM_DIR Pins

| CV      | Purpose               |
| ------- | --------------------- |
| `CV104` | PWM_DIR PWM pin       |
| `CV105` | PWM_DIR direction pin |

### PWM_BIDIR Pins

| CV      | Purpose                     |
| ------- | --------------------------- |
| `CV106` | PWM_BIDIR PWM pin           |
| `CV107` | PWM_BIDIR forward logic pin |
| `CV108` | PWM_BIDIR reverse logic pin |

Notes:

* Pin CV values are validated
* Invalid pin values return `ERR:<original-command>`
* Runtime pin changes stop the motor, reconfigure outputs, and then reply with the CV value

---

## Function Configuration CV Blocks

The firmware exposes 12 function configuration blocks starting at **CV150**.

Each function uses a stride of **7 CV numbers**.

For function index `n` (`1..12`), the base CV is:

```text
CV150 + ((n - 1) * 7)
```

Documented fields in each block:

| Offset | Meaning                 |
| ------ | ----------------------- |
| `+0`   | Function name           |
| `+1`   | Function pin            |
| `+2`   | Function pattern        |
| `+3`   | Function direction mode |

### Function pattern values

* `SOLID`
* `DBL_BLNK`
* `FRED`
* `BLINK+`
* `BLINK-`

### Function direction values

* `BOTH`
* `FWD`
* `REV`

Examples:

* `CV150` = FX1 name
* `CV151` = FX1 pin
* `CV152` = FX1 pattern
* `CV153` = FX1 direction
* `CV157` = FX2 name
* `CV158` = FX2 pin
* `CV159` = FX2 pattern
* `CV160` = FX2 direction

Default function names/directions:

* `FX1` default name: `Headlight`, default direction: `FWD`
* `FX2` default name: `ReverseLgt`, default direction: `REV`
* `FX3..FX12` default direction: `BOTH`

---

# Control Transport Priority

The firmware supports two control transports.

## BLE

Primary control interface.

## WebSocket

Secondary / failover control interface.

Priority behavior:

* If **BLE is connected**, BLE is the preferred control path
* If BLE is not connected and a WebSocket client is connected, socket control can operate normally
* Both transports share the same command parser and response behavior

---

# WebSocket Operation

When WiFi is enabled using:

```text
CV10=1
```

The firmware starts WiFi/WebSocket service using the configured settings.

Defaults:

```text
Port: 81
Max tracked WebSocket clients: 2
```

Notes:

* If WiFi becomes connected, the firmware can emit:

```text
IP:<address>
```

* A third simultaneous socket client is rejected
* WebSocket text payloads are processed through the same command handler as BLE

---

# Graceful Disconnect Behavior

If all control connections are lost **after authorization has already succeeded**:

1. A **15-second grace timer** begins
2. If no control connection returns before the timer expires
3. The firmware performs a forced stop behavior equivalent to a stop ramp
4. If still disconnected after safe stop, the controller may reboot to recover BLE advertising

This behavior helps prevent runaway trains after loss of control connection.

---

# Command Summary

| Command          | Purpose                                |
| ---------------- | -------------------------------------- |
| `I?`             | Verify authorization                   |
| `F<n>`           | Forward momentum ramp                  |
| `R<n>`           | Reverse momentum ramp                  |
| `FQ<n>`          | Forward quick ramp                     |
| `RQ<n>`          | Reverse quick ramp                     |
| `S`              | Quick stop                             |
| `B`              | Brake stop                             |
| `B<n>`           | Variable brake                         |
| `B0`             | Release variable brake                 |
| `?`              | Hardware state query                   |
| `??`             | Stored state query                     |
| `V`              | Firmware version                       |
| `C?`             | Connection status                      |
| `IP?`            | IP address query                       |
| `D1`             | Debug ON                               |
| `D0`             | Debug OFF                              |
| `P0`             | Debug periodic mismatches only         |
| `P1`             | Debug periodic always                  |
| `A1`             | Enable async `A:` state notifications  |
| `A0`             | Disable async `A:` state notifications |
| `FX<n>=0`        | Turn function output off               |
| `FX<n>=1`        | Turn function output on                |
| `CV<n>?`         | Query CV value                         |
| `CV<n>=<value>`  | Set CV value                           |

