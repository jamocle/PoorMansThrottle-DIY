# Poor Man's Throttle (PMT) – Command Protocol Reference

**Firmware Version:** 2.0.0  
**Platform:** ESP32 PMT device family: Throttle, Module, and Turbine

---

# Purpose of This Reference

This appendix documents the **text command protocol** used by PMT firmware.

It is intended for:

* the PMT smartphone app
* diagnostic tools
* terminal users
* advanced builders
* compatible third-party control software

This is a protocol reference, not a beginner setup guide. It intentionally documents command syntax, response formats, CVs, and device-specific command availability.

---

# Device Types Covered

PMT firmware 2.0.0 uses a shared protocol foundation across more than one device type.

| Device type | Purpose | Protocol scope |
|---|---|---|
| **Poor Man's Throttle** | Locomotive motor controller | Full throttle/motion protocol, function outputs, shared configuration, schedule, INA219 telemetry/protection |
| **Poor Man's Module** | General PMT module foundation | Shared identity, BLE, Wi-Fi/WebSocket, schedule, INA219, debug, and configuration protocol |
| **Poor Man's Turbine** | ESC-style turbine / fan / blower controller | Turbine output protocol, turbine configuration CVs, shared configuration, schedule, INA219 telemetry/protection |

Commands and CVs in this document are marked as **Shared**, **Throttle-only**, or **Turbine-only** where needed.

---

# Transport Overview

PMT commands are ASCII text commands sent over supported control transports.

Supported transports:

* **BLE** — primary control and discovery path
* **Wi-Fi / WebSocket** — optional secondary / backup path when enabled and configured

Both transports feed the same command parser for a given firmware image.

Command characteristics:

* Commands are case-insensitive.
* Leading/trailing whitespace and CR/LF are ignored.
* Numeric throttle/output values are generally clamped or validated in the `0..100` domain, depending on the command.
* CV commands require authorization first.

---

# Device Availability Summary

| Command family | Throttle | Module | Turbine |
|---|---:|---:|---:|
| Identity / authorization | Yes | Yes | Yes |
| Version query | Yes | Yes | Yes |
| Connection status | Yes | Yes | Yes |
| IP query | Yes | Yes | Yes |
| Time query / set | Yes | Yes | Yes |
| Debug on/off | Yes | Yes | Yes |
| Async state notify control | Yes | Yes | Yes |
| Grace shutdown runtime override | Yes | Yes | Yes |
| Throttle motion commands | Yes | No | No |
| Hardware/stored throttle state query | Yes | No | No |
| Periodic throttle debug commands | Yes | No | No |
| Function output commands | Yes | No | No |
| Turbine output commands | No | No | Yes |
| Shared CVs | Yes | Yes | Yes |
| Throttle CVs | Yes | No | No |
| Turbine CVs | No | No | Yes |

---

# Response Types

Most commands return one of:

```text
ACK:<command>
ERR:<command>
```

CV commands return:

```text
A:CV<n>=<value>
```

Some commands return raw lines without an `ACK:` or `ERR:` wrapper.

Common raw response examples:

```text
I:CONNECTED
CONN B1 S0 W1
IP:192.168.1.50
T:1720000000
F:25
HW-FWD M40 HW60
```

Asynchronous runtime messages may also be sent without being directly requested.

---

# Authorization / Identity Handshake

CV commands require a successful authorization handshake.

Before authorization, the firmware allows only a limited set of safe commands such as identity, version, connection status, async-notify control, debug control, state queries where supported, IP query, and time query/set.

If a protected command is attempted before authorization succeeds, the firmware returns:

```text
ERR:InvalidCMD
```

Authorization remains active until the firmware reboots.

---

## Request Device Identity

```text
I
```

Response:

```text
I:<device-id>
```

---

```

Backup WebSocket connection:

```text
IB,<token>
```

Successful response:

```text
I:CONNECTED
```

Failure response:

```text
ERR:ConnFailed
```

Notes:

* `I,<token>` authorizes a normal control connection.
* `IB,<token>` authorizes and marks the current socket connection as a backup connection.
* Only one backup socket connection is allowed.
* If authorization already succeeded earlier in the boot session, a valid identity command can still return `I:CONNECTED`.

---

## Verify Authorization State

```text
I?
```

Responses:

```text
ACK:Connected
```

or:

```text
ERR:ConnFailed
```

---

# Shared Runtime Commands

These commands are part of the shared PMT firmware foundation.

## Firmware Version

```text
V
```

Example response:

```text
ACK:V2.0.0
```

`V` is ACK-wrapped.

---

## Connection Status

```text
C?
```

Example response:

```text
CONN B1 S0 W1
```

Fields:

| Field | Meaning |
|---|---|
| `B` | BLE connected |
| `S` | At least one tracked WebSocket client connected |
| `W` | Wi-Fi connected |

This is a raw response.

---

## IP Address Query

```text
IP?
```

Example response:

```text
IP:192.168.1.50
```

The default WebSocket endpoint is then:

```text
ws://192.168.1.50:81
```

The WebSocket port is configurable with `CV13`.

---

## Current Time Query

```text
T?
```

Successful response:

```text
T:<unix-time>
```

Example:

```text
T:1720000000
```

If time has not been established:

```text
ERR:No NTP
```

---

## Manual Time Set

```text
T=<unix-time>
```

Example:

```text
T=1720000000
```

Successful response:

```text
T:<unix-time>
```

Invalid values return:

```text
ERR:T=<value>
```

Notes:

* The value must be a positive Unix timestamp.
* The firmware accepts values up to `2147483647`.
* `CV14` controls the configured UTC offset used by the firmware's time handling.

---

## Debug Logging

Enable debug:

```text
D1
```

Disable debug:

```text
D0
```

Responses:

```text
ACK:D1
ACK:D0
```

---

## Async State Notify Control

Enable async state notifications:

```text
A1
```

Disable async state notifications:

```text
A0
```

Responses:

```text
ACK:A1
ACK:A0
```

Notes:

* `A1` / `A0` control `A:` state-notification publishing.
* INA219 telemetry lines such as `TV:`, `TI:`, `TP:`, and `TF:` are not controlled by `A1` / `A0`.

---

## Grace Shutdown Runtime Override

Enable grace shutdown:

```text
G1
```

Disable grace shutdown:

```text
G0
```

Responses:

```text
ACK:G1
ACK:G0
```

Notes:

* This is runtime-only.
* Reboot restores the default grace behavior.
* `G0` clears any active grace countdown.
* These commands are shared across supported firmware images, but the visible effect depends on the device's disconnect behavior.

---

# Throttle-Only Commands

These commands apply to **Poor Man's Throttle** locomotive firmware.

---

## Motion Commands

Throttle values range from `0..100`.

Forward momentum ramp:

```text
F<n>
```

Reverse momentum ramp:

```text
R<n>
```

Forward quick ramp:

```text
FQ<n>
```

Reverse quick ramp:

```text
RQ<n>
```

Examples:

```text
F40
RQ60
```

Responses:

```text
ACK:F40
ACK:RQ60
```

Notes:

* `CV2` controls minimum start / floor.
* `CV3` controls maximum output / ceiling.
* `CV41` can cap throttle when low-voltage limiting is active.
* Direction changes while moving are handled as stop-first direction changes.

---

## Stop and Brake

Quick stop:

```text
S
```

Brake stop:

```text
B
```

Variable brake:

```text
B<n>
```

Release variable brake:

```text
B0
```

Examples:

```text
B35
B0
```

Responses:

```text
ACK:S
ACK:B
ACK:B35
ACK:B0
```

---

## Hardware State Query

```text
?
```

Example responses:

```text
HW-FWD M40 HW60
HW-STOPPED M0 HW0
```

Fields:

| Field | Meaning |
|---|---|
| `HW-FWD` / `HW-REV` / `HW-STOPPED` | Hardware direction/state |
| `M<n>` | Mapped throttle |
| `HW<n>` | Actual hardware output percentage |

---

## Stored State Query

```text
??
```

Example response:

```text
FWD M40 HW60
```

This reports the stored/logical state rather than direct hardware state.

---

## Periodic Debug Logging

Print only mismatches:

```text
P0
```

Print every period:

```text
P1
```

Responses:

```text
ACK:P0
ACK:P1
```

---

## Function Output Commands

The throttle firmware supports 12 configurable function outputs.

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

* Function output configuration is controlled by the function CV block starting at `CV150`.
* Direction-gated functions can be forced off automatically when the active direction does not match their configured direction rule.

---

# Turbine-Only Commands

These commands apply to **Poor Man's Turbine** firmware.

The turbine firmware controls an ESC-style PWM output using a percentage command domain.

---

## Turbine Output Query

```text
F?
```

Response:

```text
F:<requested-output>
```

Example:

```text
F:25
```

---

## Turbine Normal Output

Ramp to requested output:

```text
F<n>
```

Immediate output change:

```text
F<n>*
```

Where `n` is `0..100`.

Examples:

```text
F25
F0
F75*
```

Responses:

```text
ACK:F25
ACK:F0
ACK:F75*
```

Notes:

* Normal `F<n>` commands ramp using the configured turbine ramp behavior.
* `F<n>*` bypasses the normal ramp and applies the requested value immediately.
* `CV2` and `CV3` define the physical output scale used by normal turbine output.

---

## Turbine Quick Output

```text
FQ100
```

Response:

```text
ACK:FQ100
```

Behavior:

* Temporarily applies the configured turbine quick output.
* The quick-blast duration is 2000 ms.
* After the quick blast, the firmware returns to the previously requested `F<n>` output.

Notes:

* `FQ100` is the only valid turbine quick-output command.
* Other `FQ<n>` values return `ERR:<original-command>`.
* `CV5` controls the configured quick output percentage.

---

# Module Firmware Commands

Poor Man's Module firmware supports the shared PMT command set and shared CV blocks.

It does **not** implement locomotive throttle commands or turbine output commands.

Use module firmware for PMT-compatible devices that need the shared foundation:

* BLE identity and authorization
* Wi-Fi / WebSocket transport
* debug commands
* time commands
* schedule commands
* shared device name
* INA219 telemetry/protection configuration
* LED timing configuration

---

# Asynchronous Runtime Updates

The firmware can send unsolicited runtime updates.

There are two main categories:

1. `A:` state updates
2. INA219 telemetry/protection updates using `TV:`, `TI:`, `TP:`, and `TF:`

---

## Async `A:` State Updates

Format:

```text
A:<state>
```

Throttle example:

```text
A:HW-FWD M30 HW50
```

Notes:

* Controlled by `A1` / `A0`.
* Disabled by default on boot.
* Throttle firmware uses `CV6` and `CV7` for steady/changing state intervals.

---

## INA219 Async Telemetry Updates

When INA219 support is enabled and telemetry publishing is active, the firmware can emit:

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

`TF` bit order:

| Position | Meaning |
|---:|---|
| 1 | `LED` — low-voltage LED subscription active |
| 2 | `BAT` — battery connected |
| 3 | `WARN` — low-voltage warning active |
| 4 | `LIM` — low-voltage limiting active |
| 5 | `SD` — shutdown active |

Notes:

* These telemetry lines are unsolicited.
* They are not controlled by `A1` / `A0`.
* If INA219 measurement data is invalid, voltage/current/power telemetry can report `0` until valid samples resume.

---

# CV Command Format

CV commands require authorization.

Query:

```text
CV<n>?
```

Set:

```text
CV<n>=<value>
```

Successful response:

```text
A:CV<n>=<value>
```

Invalid syntax or invalid values return:

```text
ERR:<original-command>
```

---

# Shared CVs

These CVs are available across supported PMT firmware images.

## Shared Device CVs

| CV | Purpose | Value format | Notes |
|---|---|---|---|
| `CV4` | Device / component name | letters, digits, spaces | Used for device identity / advertising name where applicable |
| `CV8` | Factory reset trigger | set-only value `8` | Query returns `ERR`; successful set reboots after wiping persisted settings |

---

## Wi-Fi / WebSocket / Time CVs

| CV | Purpose | Value format |
|---|---|---|
| `CV10` | Wi-Fi enable | `0` or `1` |
| `CV11` | Wi-Fi SSID | string |
| `CV12` | Wi-Fi password | set-only string; query returns `ERR` |
| `CV13` | WebSocket port | `1..65535` |
| `CV14` | UTC offset | signed hour value such as `0`, `-5`, `+5.5`, `9` |

Notes:

* Changing Wi-Fi CVs can restart or stop network services.
* `CV14` stores a UTC offset in hours. One decimal place is accepted, where each tenth represents 6 minutes.
* `CV14=-5` means UTC minus 5 hours.

---

## LED Timing CV

| CV | Purpose | Value format |
|---|---|---|
| `CV20` | Shared blink timing | `<phasePeriodMs>,<onMs>` |

Example:

```text
CV20=1000,250
```

Valid range:

* `phasePeriodMs`: `1..60000`
* `onMs`: `1..phasePeriodMs`

---

## INA219 Telemetry / Protection CVs

| CV | Purpose | Value format |
|---|---|---|
| `CV30` | INA219 enable | `0` or `1` |
| `CV31` | INA219 SDA pin | valid runtime-capable pin |
| `CV32` | INA219 SCL pin | valid runtime-capable pin |
| `CV33` | INA219 I2C address | `64..79` decimal (`0x40..0x4F`) |
| `CV34` | Sample interval ms | `50..60000` |
| `CV35` | Publish interval ms | `100..60000` |
| `CV36` | Warning threshold mV | `0..50000` |
| `CV37` | Limit threshold mV | `0..50000` |
| `CV38` | Shutdown threshold mV | `0..50000` |
| `CV39` | Recovery threshold mV | `0..50000`; `0` disables automatic recovery |
| `CV40` | Battery disconnect threshold mV | `0..50000` |
| `CV42` | Low-voltage LED pin | `0` or valid runtime-capable pin |

Notes:

* The INA219 is used as a sensor; firmware derives warning, limiting, shutdown, recovery, and telemetry behavior from its readings.
* Pin CVs reject duplicate SDA/SCL/LED pin assignments.
* Threshold `0` generally disables the associated protection behavior.

---

## Schedule CVs

| CV | Purpose | Value format |
|---|---|---|
| `CV300` | Schedule enable | `0` or `1` |
| `CV301` | Weekday bitmask | `0..127` |
| `CV302` | Schedule ON time | UTC `HH:MM` |
| `CV303` | Schedule OFF time | UTC `HH:MM` |
| `CV304` | Schedule ON command | non-empty command string |
| `CV305` | Schedule OFF command | non-empty command string |

Weekday bit mapping:

| Bit | Day |
|---:|---|
| 0 | Sunday |
| 1 | Monday |
| 2 | Tuesday |
| 3 | Wednesday |
| 4 | Thursday |
| 5 | Friday |
| 6 | Saturday |

Notes:

* `CV302` and `CV303` must use strict 24-hour `HH:MM` time.
* The schedule does not support crossing midnight.
* Schedule validation requires schedule enabled, at least one day selected, valid ON/OFF times, `ON < OFF`, and non-empty ON/OFF commands.
* Scheduled commands are executed through the same command pipeline as external commands.
* The configured ON/OFF commands are allowed to run internally for autonomous schedule execution.

---

# Throttle-Specific CVs

These CVs apply to **Poor Man's Throttle** locomotive firmware.

## Core Throttle CVs

| CV | Purpose | Value format |
|---|---|---|
| `CV1` | Motor driver type | `DUAL_PWM`, `PWM_DIR`, `PWM_BIDIR`, `DUAL_INPT` |
| `CV2` | Minimum start / floor | `0..100` |
| `CV3` | Ceiling / max output | `0..100` |
| `CV5` | Direction invert | `0` or `1` |
| `CV6` | Async state interval when steady | `50..10000` ms |
| `CV7` | Async state interval while changing | `50..10000` ms |
| `CV9` | Kick config | `<throttle>,<ms>,<rampDownMs>,<maxApply>` |
| `CV41` | Low-voltage throttle cap percent | `0..100` |

Example `CV9`:

```text
CV9=25,300,80,15
```

---

## Throttle Motor Pin CVs

### DUAL_PWM Pins

| CV | Purpose |
|---|---|
| `CV100` | DUAL_PWM forward / RPWM pin |
| `CV101` | DUAL_PWM reverse / LPWM pin |
| `CV102` | DUAL_PWM enable A / R_EN pin |
| `CV103` | DUAL_PWM enable B / L_EN pin |

### PWM_DIR / DUAL_INPT Pins

| CV | Purpose |
|---|---|
| `CV104` | Two-pin A / PWM pin |
| `CV105` | Two-pin B / direction or alternate input pin |

### PWM_BIDIR Pins

| CV | Purpose |
|---|---|
| `CV106` | PWM_BIDIR PWM / enable pin |
| `CV107` | PWM_BIDIR forward logic pin |
| `CV108` | PWM_BIDIR reverse logic pin |

Notes:

* Invalid GPIO assignments return `ERR:<original-command>`.
* Runtime pin changes place outputs in a safe state and reinitialize the selected driver interface.

---

## Function Configuration CV Blocks

Throttle firmware exposes 12 function configuration blocks starting at `CV150`.

Each function uses a stride of 7 CV numbers.

For function index `n` (`1..12`):

```text
base = 150 + ((n - 1) * 7)
```

| Offset | Meaning |
|---:|---|
| `+0` | Function name |
| `+1` | Function output pin |
| `+2` | Function pattern |
| `+3` | Function direction mode |
| `+4` | Function app flags |

Examples:

| Function | Name CV | Pin CV | Pattern CV | Direction CV | App flags CV |
|---|---:|---:|---:|---:|---:|
| FX1 | 150 | 151 | 152 | 153 | 154 |
| FX2 | 157 | 158 | 159 | 160 | 161 |
| FX3 | 164 | 165 | 166 | 167 | 168 |
| FX12 | 227 | 228 | 229 | 230 | 231 |

Pattern values:

* `SOLID`
* `DBL_BLNK`
* `FRED`
* `BLINK+`
* `BLINK-`

Direction values:

* `BOTH`
* `FWD`
* `REV`

App flags:

* unsigned 32-bit integer
* range `0..4294967295`

Default function notes:

* FX1 default name is `Headlight`, direction `FWD`.
* FX2 default name is `ReverseLgt`, direction `REV`.
* FX3..FX12 default to direction `BOTH`.

---

# Turbine-Specific CVs

These CVs apply to **Poor Man's Turbine** firmware.

Some CV numbers overlap with throttle firmware, but the meaning is device-specific.

| CV | Turbine purpose | Value format | Default |
|---|---|---|---:|
| `CV2` | Minimum output percent | `0..100`, must be <= `CV3` | `0` |
| `CV3` | Full output percent | `1..100`, must be >= `CV2` | `100` |
| `CV5` | Quick output percent for `FQ100` | `0..100` | `0` |
| `CV9` | Ramp-to-full-output duration | `100..60000` ms | `4000` |
| `CV41` | Low-voltage limit cap percent | `0..100` | `25` |
| `CV100` | ESC PWM output pin | valid runtime-capable pin | `25` |

Notes:

* Turbine output uses a 50 Hz ESC-style PWM signal.
* The ESC pulse range is 1000–2000 μs.
* Changing `CV100` reconfigures the output pin and forces output back to a safe stopped state.
* When shutdown is active from INA219 policy, turbine output is forced off.
* When limit is active from INA219 policy, output is capped by `CV41`.

---

# WebSocket Operation

When Wi-Fi is enabled with:

```text
CV10=1
```

The firmware starts the configured Wi-Fi/WebSocket service.

Defaults:

```text
Port: 81
Max tracked WebSocket clients: 2
```

Notes:

* A third simultaneous socket client is rejected.
* A backup socket can use `IB,<token>`.
* WebSocket text payloads are processed through the same command handler as BLE.
* When Wi-Fi connects, firmware can emit an unsolicited `IP:<address>` line.

---

# Scheduling / Autonomous Mode

When a valid schedule is configured and system time is valid, supported firmware can enter autonomous schedule mode.

A schedule is considered active when current UTC time is within the configured operating window for an enabled day.

Important behavior:

* `CV304` fires at the configured `CV302` ON boundary.
* `CV305` fires at the configured `CV303` OFF boundary.
* Replies are suppressed for internally scheduled command execution.
* The ON/OFF commands still execute through the normal command pipeline.
* Device-specific commands must match the firmware image. For example, throttle firmware can schedule `F40` or `S`; turbine firmware can schedule `F50` or `F0`.

---

# Control Transport Priority

Priority behavior:

* If BLE is connected, BLE is the preferred async/control path.
* If BLE is not connected and a WebSocket client is connected, socket control can operate.
* Both transports share the same command parser for the active firmware image.

---

# Disconnect / Recovery Behavior

The shared firmware foundation includes disconnect and recovery behavior intended to keep PMT devices predictable after communication loss.

For throttle firmware, this is especially important because the controller may be driving a locomotive.

Typical behavior:

1. A qualifying disconnect can start a grace period.
2. If no control connection returns before grace expires, the device can force a safe stop behavior.
3. BLE advertising recovery is attempted automatically.
4. When needed, hard recovery is deferred until safe conditions are reached.
5. Active WebSocket control can suppress BLE-only hard recovery paths.
6. Autonomous schedule mode can suppress disconnect grace behavior while scheduled operation is active.

Runtime override:

* `G1` enables grace shutdown for the current runtime.
* `G0` disables grace shutdown for the current runtime.

---

# Command Summary

| Command | Availability | Purpose |
|---|---|---|
| `I` | Shared | Identity reply |
| `I?` | Shared | Authorization status |
| `I,<token>` | Shared | Authorize normal connection |
| `IB,<token>` | Shared | Authorize backup socket connection |
| `V` | Shared | Firmware version |
| `C?` | Shared | Connection status |
| `IP?` | Shared | IP address query |
| `T?` | Shared | Current time query |
| `T=<unix>` | Shared | Manual time set |
| `D1` | Shared | Debug on |
| `D0` | Shared | Debug off |
| `A1` | Shared | Enable async `A:` state updates |
| `A0` | Shared | Disable async `A:` state updates |
| `G1` | Shared | Enable grace shutdown for this boot |
| `G0` | Shared | Disable grace shutdown for this boot |
| `F<n>` | Throttle | Forward momentum ramp |
| `R<n>` | Throttle | Reverse momentum ramp |
| `FQ<n>` | Throttle | Forward quick ramp |
| `RQ<n>` | Throttle | Reverse quick ramp |
| `S` | Throttle | Quick stop |
| `B` | Throttle | Brake stop |
| `B<n>` | Throttle | Variable brake |
| `?` | Throttle | Hardware state query |
| `??` | Throttle | Stored state query |
| `P0` | Throttle | Periodic mismatch debug only |
| `P1` | Throttle | Periodic debug always |
| `FX<n>=0/1` | Throttle | Function output off/on |
| `F?` | Turbine | Requested turbine output query |
| `F<n>` | Turbine | Ramp turbine output |
| `F<n>*` | Turbine | Immediate turbine output |
| `FQ100` | Turbine | Temporary quick turbine output |
| `CV<n>?` | Device-specific | Query CV |
| `CV<n>=<value>` | Device-specific | Set CV |

---

# Async Telemetry Summary

These are not commands. They may appear asynchronously at runtime.

| Line prefix | Meaning |
|---|---|
| `A:` | General runtime state |
| `TV:` | INA219 bus voltage in mV |
| `TI:` | INA219 current in mA |
| `TP:` | INA219 power in mW |
| `TF:` | INA219 compact status flags |
| `IP:` | Wi-Fi IP announcement |

---

# What Changed from the Older 1.12.x Reference

This reference has been updated for the current PMT 2.0.0 firmware family.

Major documentation changes:

* Updated the document from throttle-only to the PMT device family.
* Added Poor Man's Module protocol scope.
* Added Poor Man's Turbine commands and CVs.
* Added backup socket authorization with `IB,<token>`.
* Added current time query/set documentation with `T?` and `T=<unix-time>`.
* Added `CV14` UTC offset documentation.
* Clarified that some CV numbers are device-specific and can mean different things on throttle vs turbine firmware.
* Corrected the identity flow so `I` requests identity and `I?` checks authorization state.
* Clarified shared vs throttle-only vs turbine-only command availability.
