# Poor Man's Throttle (PMT) – Command Protocol Reference

**Firmware Version:** 1.12.2  
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
- **Asynchronous unsolicited telemetry/status lines** for runtime state reporting

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
```

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
```

Notes:

* `V` is **not** a RAW-response command in this firmware version
* `V` returns an ACK-wrapped response in the form `ACK:V<firmware-version>`

---

# Motion Commands

Throttle values range from **0–100**.

Values are in the **mapped throttle domain** and are converted to hardware output using:

* **CV2** = floor / minimum start
* **CV3** = ceiling / maximum output

When INA219 low-voltage throttle limiting is active, the firmware applies an effective cap centrally before output is sent to the motor driver.

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
ACK:V1.12.2
```

This is an **ACK-wrapped response**, not a RAW response.

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

# Asynchronous Runtime Updates

The firmware can send automatic unsolicited runtime updates.

There are now **two categories** of async runtime lines:

1. **State updates** using the `A:` prefix
2. **INA219 telemetry / protection updates** using the `TV:`, `TI:`, `TP:`, and `TF:` prefixes

These messages are transport-selected the same way as the rest of the firmware:

* If **BLE is connected**, BLE is the preferred async path
* If BLE is not connected and a WebSocket client is connected, socket async messages can be used
* Async publishing does **not** change command/reply semantics

---

## Async `A:` State Updates

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

## INA219 Async Telemetry Updates

When INA219 support is enabled and telemetry publishing is active, the firmware emits compact unsolicited telemetry lines:

```text
TV:<millivolts>
TI:<milliamps>
TP:<milliwatts>
TF:<LED><BAT><WARN><LIM><SD>
```

Example:

```text
TV:18120
TI:410
TP:742
TF:01000
```

`TF` bit order is fixed:

1. `LED`
2. `BAT`
3. `WARN`
4. `LIM`
5. `SD`

Bit meanings:

* `LED=1` → low-voltage LED subscription is active
* `BAT=1` → battery connected
* `BAT=0` → battery disconnected
* `WARN=1` → low-voltage warning active
* `LIM=1` → low-voltage throttle limiting active
* `SD=1` → shutdown active

Notes:

* These telemetry lines are **unsolicited**
* They are **not controlled by `A1` / `A0`**
* Telemetry can publish on interval and also immediately when important INA219 status changes occur
* If INA219 measurement data is invalid, `TV`, `TI`, and `TP` report `0` until valid samples resume
* Firmware policy derived from INA219 includes battery disconnect detection, low-voltage warning, throttle limiting, shutdown, recovery, and low-voltage LED behavior

---

# INA219 Telemetry / Protection

The INA219 is used as a **sensor only**. The firmware derives the higher-level protection behavior from its measurements.

Measured values:

* Bus voltage
* Current
* Power

Firmware behaviors derived from those measurements:

* Battery disconnected detection
* Low-voltage warning
* Low-voltage throttle limiting
* Shutdown
* Recovery threshold / hysteresis behavior
* Low-voltage LED output behavior
* Compact async telemetry publishing

Important implementation notes:

* Thresholds default to 0, which disables the associated protection behavior until configured. For CV39, a value of 0 disables automatic recovery.
* The low-voltage LED active mode is internal firmware policy and is fixed to **BLINK+**
* INA219 async telemetry enable is internal runtime policy, not a documented CV
* On sensor read failure, the firmware preserves the last known protection state and keeps retrying INA219 setup

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
| `CV1` | Motor driver type                       | `DUAL_PWM`, `PWM_DIR`, `PWM_BIDIR`, `DUAL_INPT` |
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

| CV     | Purpose        | Value Format     |
| ------ | -------------- | ---------------- |
| `CV10` | WiFi enable    | `0` or `1`       |
| `CV11` | WiFi SSID      | free-form string |
| `CV12` | WiFi password  | set-only string  |
| `CV13` | WebSocket port | `1..65535`       |

Notes:

* Querying `CV12?` returns `ERR:<original-command>`
* Changing `CV10`, `CV11`, `CV12`, or `CV13` can affect runtime WiFi/WebSocket behavior
* When WiFi connects, the firmware may emit an unsolicited:

```text
IP:<address>
```

---

## LED Timing CVs

| CV     | Purpose             | Value Format             |
| ------ | ------------------- | ------------------------ |
| `CV20` | Blink timing config | `<phasePeriodMs>,<onMs>` |

### CV20 Example

```text
CV20=1000,250
```

Response:

```text
A:CV20=1000,250
```

Notes:

* `CV20` controls firmware LED blink timing behavior
* Changing `CV20` can affect runtime LED timing behavior

---

## INA219 CVs

| CV     | Purpose                               | Value Format         |
| ------ | ------------------------------------- | -------------------- |
| `CV30` | INA219 enable                         | `0` or `1`           |
| `CV31` | INA219 SDA pin                        | `0..39`              |
| `CV32` | INA219 SCL pin                        | `0..39`              |
| `CV33` | INA219 I²C address                    | `64..79`             |
| `CV34` | INA219 sample interval (ms)           | `50..60000`          |
| `CV35` | INA219 publish interval (ms)          | `100..60000`         |
| `CV36` | Low-voltage warning threshold (mV)    | `0..50000`           |
| `CV37` | Low-voltage limit threshold (mV)      | `0..50000`           |
| `CV38` | Low-voltage shutdown threshold (mV)   | `0..50000`           |
| `CV39` | Low-voltage recovery threshold (mV)   | `0..50000`           |
| `CV40` | Battery disconnect threshold (mV)     | `0..50000`           |
| `CV41` | Low-voltage throttle cap (%)          | `0..100`             |
| `CV42` | Low-voltage LED pin                   | `0..39`              |

Default INA219 values:

* `CV30=0`
* `CV31=21`
* `CV32=22`
* `CV33=64` (`0x40`)
* `CV34=500`
* `CV35=10000`
* `CV36=0`
* `CV37=0`
* `CV38=0`
* `CV39=0`
* `CV40=0`
* `CV41=25`
* `CV42=0`

Notes:

* Thresholds set to `0` leave the associated protection policy inactive
* Changing INA219 pin or address settings can trigger INA219 reinitialization
* `CV42` configures the low-voltage LED **pin** only; the active pattern is internal firmware policy

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
| `+4`   | Function app flags      |

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

### Function app flags values

* Unsigned 32-bit integer
* Range: `0..4294967295`

Examples:

* `CV150` = FX1 name
* `CV151` = FX1 pin
* `CV152` = FX1 pattern
* `CV153` = FX1 direction
* `CV154` = FX1 app flags
* `CV157` = FX2 name
* `CV158` = FX2 pin
* `CV159` = FX2 pattern
* `CV160` = FX2 direction
* `CV161` = FX2 app flags

Default function names/directions/app flags:

* `FX1` default name: `Headlight`, default direction: `FWD`, default app flags: `0`
* `FX2` default name: `ReverseLgt`, default direction: `REV`, default app flags: `0`
* `FX3..FX12` default direction: `BOTH`, default app flags: `0`

Notes:

* Function app flags are persisted in NVS
* Query/set uses the normal CV reply format: `A:CV<n>=<value>`

---

## Scheduling / Autonomous Mode CVs

The firmware exposes a scheduling block starting at **CV300**.

| CV      | Purpose                         | Value Format |
| ------- | ------------------------------- | ------------ |
| `CV300` | Schedule enable                 | `0` or `1` |
| `CV301` | Weekday bitmask                 | `0..127` |
| `CV302` | Schedule ON time (UTC)          | `HH:MM` |
| `CV303` | Schedule OFF time (UTC)         | `HH:MM` |
| `CV304` | Schedule ON command             | free-form command string |
| `CV305` | Schedule OFF command            | free-form command string |

Notes:

* `CV302` and `CV303` use strict **UTC** `HH:MM` 24-hour format
* Schedule validation requires:
  * schedule enabled
  * at least one enabled weekday bit
  * valid ON/OFF times
  * `ON < OFF`
  * non-empty ON/OFF commands
* The current implementation does **not** support schedules that cross midnight
* `CV301` uses the firmware's UTC weekday mapping from `tm_wday`:
  * bit `0` = Sunday
  * bit `1` = Monday
  * bit `2` = Tuesday
  * bit `3` = Wednesday
  * bit `4` = Thursday
  * bit `5` = Friday
  * bit `6` = Saturday

---

# Scheduling / Autonomous Mode

When the schedule is valid and system time is valid, the firmware can enter **autonomous mode** based on UTC weekday and UTC time.

Autonomous mode becomes active only when all of the following are true:

* schedule is enabled and fully configured
* current UTC weekday is enabled by `CV301`
* current UTC time is between:
  * `CV302 - 2 minutes`
  * `CV303 + 2 minutes`

Important distinction:

* the **±2 minute extension** is used only to decide whether autonomous mode is active
* the scheduled ON/OFF commands themselves still fire only at the exact configured boundary times

## Scheduled Command Execution

At runtime, the firmware continuously evaluates the schedule using UTC time.

Boundary behavior:

* the ON command in `CV304` is fired when the firmware crosses the exact configured `CV302` minute
* the OFF command in `CV305` is fired when the firmware crosses the exact configured `CV303` minute
* boundary execution occurs only on enabled UTC weekdays
* replies are suppressed for internally scheduled command execution

Operational notes:

* scheduled commands execute through the same internal command pipeline as external commands
* this means the configured schedule commands should be valid runtime commands such as motion or stop commands
* only the exact configured ON/OFF commands gain the autonomous pre-handshake exception described earlier

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

Autonomous-mode exception:

* If **autonomous mode** is active, disconnect grace does **not** start
* If autonomous mode becomes active while a deferred disconnect/reboot path is pending, that deferred reboot path is canceled
* When autonomous mode later exits while still disconnected and authorization had already happened, grace can begin again

---

# BLE Advertising Recovery Behavior

When a BLE client disconnects, the firmware first attempts a normal BLE advertising restart so the controller becomes discoverable again.

Recovery behavior:

1. On BLE disconnect, advertising restart is requested
2. The firmware retries advertising restart on a timed loop
3. After **10 seconds** disconnected, an advertising watchdog can force another recovery attempt if scanability has not returned
4. After **12 seconds** disconnected, if BLE still has not recovered, the firmware can escalate to a **hard recovery**
5. Hard recovery forces a **quick stop**, then defers controller reboot until the train is safely stopped
6. If a WebSocket control session is active, this BLE hard-recovery reboot path is canceled

Notes:

* This recovery behavior is automatic
* It is intended to restore BLE scanability safely
* Reboot is deferred until motion has safely stopped rather than occurring immediately while running
* While **autonomous mode** is active, BLE hard-recovery escalation is suppressed

---

# Command Summary

| Command         | Purpose                                |
| --------------- | -------------------------------------- |
| `I?`            | Verify authorization                   |
| `F<n>`          | Forward momentum ramp                  |
| `R<n>`          | Reverse momentum ramp                  |
| `FQ<n>`         | Forward quick ramp                     |
| `RQ<n>`         | Reverse quick ramp                     |
| `S`             | Quick stop                             |
| `B`             | Brake stop                             |
| `B<n>`          | Variable brake                         |
| `B0`            | Release variable brake                 |
| `?`             | Hardware state query                   |
| `??`            | Stored state query                     |
| `V`             | Firmware version                       |
| `C?`            | Connection status                      |
| `IP?`           | IP address query                       |
| `D1`            | Debug ON                               |
| `D0`            | Debug OFF                              |
| `P0`            | Debug periodic mismatches only         |
| `P1`            | Debug periodic always                  |
| `A1`            | Enable async `A:` state notifications  |
| `A0`            | Disable async `A:` state notifications |
| `FX<n>=0`       | Turn function output off               |
| `FX<n>=1`       | Turn function output on                |
| `CV<n>?`        | Query CV value                         |
| `CV<n>=<value>` | Set CV value                           |

---

# Async Telemetry Summary

These are **not commands**, but they may appear asynchronously at runtime:

| Line Prefix | Meaning                         |
| ----------- | ------------------------------- |
| `A:`        | General runtime state           |
| `TV:`       | INA219 bus voltage in mV        |
| `TI:`       | INA219 current in mA            |
| `TP:`       | INA219 power in mW              |
| `TF:`       | INA219 compact status bitfield  |
