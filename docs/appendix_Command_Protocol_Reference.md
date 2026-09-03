# Poor Man's Throttle (PMT) – Command Protocol Reference

**Firmware Version:** 3.0.0
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

PMT firmware 3.0.0 uses a shared protocol foundation across more than one device type.

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
| Debug / SD logging control | Yes | Yes | Yes |
| Async state notify control | Yes | Yes | Yes |
| Grace shutdown runtime override | Yes | Yes | Yes |
| Persist-only CV staging (`PS`) | Yes | Yes | Yes |
| Throttle motion commands | Yes | No | No |
| Hardware/stored throttle state query | Yes | No | No |
| Periodic throttle debug commands | Yes | No | No |
| Function / FX commands | Yes | No | No |
| Audio record / diagnostic commands | Yes | No | No |
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
ACK:V3.0.0
```

`V` is ACK-wrapped. The firmware revision is not included in the `V` reply.

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

## Debug and SD Logging

Enable debug and persist the debug startup override:

```text
D1
```

Enable debug and request SD logging:

```text
D2
```

Disable debug/logging and clear the persisted startup overrides:

```text
D0
```

Responses are ACK-wrapped, for example:

```text
ACK:D1
ACK:D2
ACK:D0
```

Notes:

* `D1` keeps debug enabled across reboot until `D0` clears the startup override.
* `D2` enables debug immediately and requests SD logging. The SD-log startup override is persisted only when the logger is actually usable/writable.
* A build/runtime resource guard can deny the SD logging portion of `D2`; debug event generation remains enabled.
* `D0` disables runtime debug/SD logging and clears their persisted startup overrides.
* `D0`, `D1`, and `D2` are allowed before the identity handshake.

---

## Persist-Only CV Staging

Query staging mode:

```text
PS?
```

Response:

```text
A:PS=0
```

or:

```text
A:PS=1
```

Enable persist-only staging:

```text
PS1
```

Disable persist-only staging:

```text
PS0
```

Notes:

* `PS1` is runtime-only. Subsequent CV writes are validated and persisted but are **not applied live**.
* Staged CV values require reboot before they become the live configuration.
* `PS0` does not retroactively apply staged values. If staged writes are pending, reboot is still required.
* `CV8` retains its reset/restart trigger semantics rather than behaving as a normal staged CV.
* `PS?`, `PS0`, and `PS1` require the identity handshake.

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
* `G0` / `G1` require the identity handshake.

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

* Function/FX configuration is controlled by the function CV block starting at `CV150`.
* Numeric patterns `1..99` are physical/LED patterns; `100..199` are audio patterns.
* Bell/Horn/Cab-Chatter audio patterns do not require a physical function GPIO. Custom audio patterns `103`/`104` reuse the function pin CV as a PMTPlayer track number `1..9999`.
* Direction-gated functions can be forced off automatically when the active direction does not match their configured direction rule.

---

## Audio Track-Length Recording

Throttle firmware supports:

```text
A?
```

and an explicit track list:

```text
A? N=202,211,212,213
```

Track numbers in `N=` must be comma-separated integers from `1..9999`. Without `N=`, the firmware selects its current backend/application manifest.

The command requires audio to be enabled and the active audio service to provide BUSY-signal support. Recording is asynchronous. Completion includes:

```text
AR:DONE
ACK:A?
```

Errors use both an `AR:ERR` line and an `ERR:A?` line, for example `BUSY`, `AUDIO-OFF`, `BUSY-PIN`, `FORMAT`, or `START`.

This command requires the identity handshake.

## Audio Diagnostic Marker

```text
AM
```

Alias:

```text
AUDIOMARK
```

The command emits an audio diagnostic marker when the active backend/service supports it and returns an ACK for the original command. It requires the identity handshake.

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

CV commands require authorization. Under normal mode they apply to live runtime and persistence as implemented by the owning CV handler. When `PS1` is active, set commands are persisted without live apply and require reboot.

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
| `CV31` | INA219 SDA pin | board-profile runtime pin; default Classic `16`, S3 `17` |
| `CV32` | INA219 SCL pin | board-profile runtime pin; default Classic `17`, S3 `18` |
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
| `CV301` | Weekday bitmask | `0..127`; `0` stores no selected days |
| `CV302` | Schedule ON time | strict `HH:MM` on the CV14-adjusted firmware clock |
| `CV303` | Schedule OFF time | strict `HH:MM` on the CV14-adjusted firmware clock |
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

* `CV302` and `CV303` must use strict 24-hour `HH:MM` time. Firmware first applies `CV14` to the received UTC epoch and then evaluates the schedule against that adjusted runtime clock; `CV14=0` therefore behaves as raw UTC.
* The schedule does not support crossing midnight.
* Schedule validation requires schedule enabled, at least one day selected, valid ON/OFF times, `ON < OFF`, and non-empty ON/OFF commands.
* Scheduled commands are executed through the same command pipeline as external commands.
* The configured ON/OFF commands are allowed to run internally for autonomous schedule execution.

---

## Shared Audio CVs

CV400–CV429 are accepted and persisted by the shared CV handler on Throttle, Module, and Turbine. **Locomotive audio runtime behavior is Throttle-owned**; storing these values on Module/Turbine does not by itself create locomotive audio playback.

| CV | Purpose | Values / effective default |
|---:|---|---|
| `CV400` | Audio enable | `0/1` / `0` |
| `CV401` | Backend | `0=None`, `2=PMTPlayer Diesel`, `3=PMTPlayer Steam` / `2` |
| `CV402` | Master volume | `0..30` / `15` |
| `CV403` | PMTPlayer SD CS | Classic `21`, S3 `10` before sound-mode preset changes |
| `CV404` | PMTPlayer SD SCK | Classic default `-1` **means Arduino/core default SCK, effective GPIO18**; S3 default `11` |
| `CV405` | PMTPlayer SD MISO | Classic default `-1` **means Arduino/core default MISO, effective GPIO19**; S3 default `8` |
| `CV406` | PMTPlayer SD MOSI | Classic default `-1` **means Arduino/core default MOSI, effective GPIO23**; S3 default `9` |
| `CV407` | PMTPlayer I2S BCLK | Classic `13`, S3 `12` |
| `CV408` | PMTPlayer I2S LRCLK / WS | Classic `12`, S3 `13` |
| `CV409` | PMTPlayer I2S DIN | `14` on both current board profiles |
| `CV410` | Default priority | `0..100` / `30` |
| `CV411` | Conflict policy | configure `0..2` / `1`; `0=IgnoreLowerPriority`, `1=InterruptThenResume`, `2=ReplaceSameGroup` |
| `CV412` | Startup delay ms | `0..10000` / `0` |
| `CV413` | Shutdown delay ms | `0..10000` / `0` |
| `CV414` | Amp enable pin | `-1` or valid output / `-1` |
| `CV415` | Amp mute pin | `-1` or valid output / `-1` |
| `CV416` | Amp standby pin | `-1` or valid output / `-1` |
| `CV417` | Audio fault input pin | `-1` or valid input / `-1` |
| `CV418` | PMTAudio profile | `0..3` / `3`; 0 Conservative, 1 Balanced, 2 Loud, 3 Explicit |
| `CV419` | PMTAudio WAV gain | `1..12` / `1` |
| `CV420` | Output headroom % | `50..100` / `100` |
| `CV421` | Limiter/loudness mode | `0..10` / `10` |
| `CV422` | Speaker size profile | `0..2` / `2`; setting it also refreshes CV421 (`0→3`, `1/2→10`) |
| `CV423` | Max active voices | `0..255`; `0` resolves to board default; default Classic `3`, S3 `13` |
| `CV424` | Overlap mode | effective `0..2` / `1` |
| `CV425` | Async overlap start | `0/1` / `1` |
| `CV426` | Start prime bytes | `0..16384` / `12288` |
| `CV427` | Overlap prime bytes | `0..16384` / `0` |
| `CV428` | Mixer attenuation % | `25..100` / `100` |
| `CV429` | Clip telemetry | `0/1`; effective `0` in normal builds, verbose-audio-diagnostics only |

Backend selection order matters: Selecting `2`/`3` from a non-PMTPlayer backend applies the PMTPlayer preset. Switching between `2` and `3` while already in the PMTPlayer family preserves PMTPlayer-family pin/tuning CVs. Select `CV401` **before** custom backend-specific CV403–CV409 values.

Writing any advanced PMTAudio CV from CV419 through CV429 moves CV418 to `3` (Explicit).

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
| `CV43` | Locomotive background audio enable | `0/1`, default `0` |
| `CV90` | Motor PWM frequency curve | 2, 4, 6, or 12 digits; `01..40` kHz per value; default `202020202020` |
| `CV98` | Steam chuff-rate low anchors | 12 digits; default `010510152025` |
| `CV99` | Steam chuff-rate high anchors | 12 digits; default `355065809000` |

Example `CV9`:

```text
CV9=25,300,80,15
```

CV98/CV99 are PMTPlayer-Steam moving-chuff **cadence** curves only. CV98 maps speeds `1,5,10,15,20,25`; CV99 maps `35,50,65,80,90,100`. Each anchor is two digits: `01..99` = 1..99%, `00` = 100%. Firmware linearly interpolates the anchors and accepts non-monotonic curves. These CVs do not change locomotive speed.

### CV90 Motor PWM Frequency Curve

CV90 controls the motor PWM switching frequency across effective mapped-throttle anchors `1,10,25,50,75,100%`.

Each value is a two-digit frequency in kHz from `01` through `40`. The canonical stored/readback form contains six values:

```text
CV90=AABBCCDDEEFF
```

Default:

```text
CV90=202020202020
```

Accepted shorthand forms are expanded before storage:

```text
CV90=20
-> CV90=202020202020

CV90=2030
-> CV90=202020303030

CV90=203040
-> CV90=202030304040
```

Expansion rules:

```text
A           -> A A A A A A
A B         -> A A A B B B
A B C       -> A A B B C C
A B C D E F -> A B C D E F
```

Only numeric values with lengths `2`, `4`, `6`, or `12` are accepted. Every two-digit frequency must be `01..40`.

Firmware linearly interpolates frequency between the six anchors. CV90 changes PWM **frequency only**; motor PWM resolution remains 10 bits and existing throttle/duty behavior continues to be governed by the normal motion logic, CV2/CV3 mapping, CV9 start assist, and safety limits.

A CV90 write can be applied while the motor is active. CV90 query/readback always returns the canonical 12-digit form.

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

* Classic defaults: CV100/101/102/103=`25/26/27/33`, CV104/105=`25/26`, CV106/107/108=`25/27/33`.
* S3 defaults: CV100/101/102/103=`6/7/4/5`, CV104/105=`6/7`, CV106/107/108=`6/4/5`.
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

| Numeric | Meaning | Legacy text accepted |
|---:|---|---|
| `0` | None | — |
| `1` | LED solid | `SOLID`, `LED_SOLID` |
| `2` | LED double blink | `DBL_BLNK`, `LED_DBL_BLNK` |
| `3` | FRED | `FRED`, `LED_FRED` |
| `4` | LED blink+ | `BLINK+`, `LED_BLINK+` |
| `5` | LED blink- | `BLINK-`, `LED_BLINK-` |
| `100` | Audio bell | `AUDIO_BELL` |
| `101` | Audio horn | `AUDIO_HORN` |
| `102` | Audio cab chatter | `AUDIO_CAB_CHATTER` and accepted aliases |
| `103` | Audio custom one-shot | `AUDIO_CUSTOM`, `CUSTOM` |
| `104` | Audio custom replay/loop | `AUDIO_CUSTOM_REPLAY` and accepted aliases |

Values `1..99` are reserved for physical/LED patterns and `100..199` for audio FX. Queries return numeric values. Physical patterns use the pin CV as GPIO. Bell/Horn/Cab-Chatter do not require a function GPIO. Custom audio `103/104` uses the pin CV as a PMTPlayer track number `1..9999`.

Direction values:

* `BOTH`
* `FWD`
* `REV`

App flags:

* unsigned 32-bit integer
* range `0..4294967295`

Default function notes:

* FX1 default name is `Headlight`, direction `FWD`, pin Classic `4` / S3 `15`.
* FX2 default name is `ReverseLgt`, direction `REV`, pin Classic `5` / S3 `16`.
* FX3..FX12 default to direction `BOTH` and pin `0`.
* Every FX pattern defaults to `0` (None), so default FX1/FX2 pin assignments are inactive until a pattern is configured.

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
| `CV100` | ESC PWM output pin | valid runtime-capable pin | Classic `25`; S3 `6` |

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

A schedule is considered active when the **CV14-adjusted firmware clock** is within the configured operating window for an enabled day. Firmware applies CV14 to the received UTC epoch before schedule evaluation.

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
| `D1` | Shared | Debug on + persist debug startup override |
| `D2` | Shared | Debug on + request SD logging |
| `D0` | Shared | Debug/logging off + clear startup overrides |
| `PS?` | Shared | Query persist-only staging mode |
| `PS1` | Shared | Enable persist-only CV staging for this runtime |
| `PS0` | Shared | Disable persist-only staging; staged values still require reboot |
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
| `FX<n>=0/1` | Throttle | Function / FX off/on |
| `A?` | Throttle | Record track lengths using current default manifest |
| `A? N=<list>` | Throttle | Record lengths for explicit track IDs `1..9999` |
| `AM` / `AUDIOMARK` | Throttle | Emit audio diagnostic marker |
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

# Current 3.0.0 rev215 Reconciliation

This reference is reconciled to PMT firmware **3.0.0**.

Key current-source additions reflected here include:

* exact pre-handshake command gating, including `D2`
* persist-only CV staging commands `PS?`, `PS1`, `PS0`
* persistent debug startup override behavior and SD logging request semantics
* CV43 locomotive background audio
* CV98/CV99 steam moving-chuff cadence curves
* shared audio CV400–CV429 and backend-preset behavior
* numeric LED/audio FX patterns, including custom PMTPlayer track patterns
* Throttle `A?` track-length recording and `AM` / `AUDIOMARK`
* board-profile pin/default differences for Classic ESP32-WROOM and ESP32-S3-WROOM-1-N16R8
* schedule evaluation against the CV14-adjusted firmware clock
