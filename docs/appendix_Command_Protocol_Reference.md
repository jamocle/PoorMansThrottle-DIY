# Poor Man's Throttle (PMT) – Command Protocol Reference

**Firmware Version:** 3.3.0  
**Firmware Revision:** 248  
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

This is a protocol reference, not a beginner setup guide. It intentionally focuses on command syntax, response formats, command behavior, and device-specific command availability.

Detailed CV definitions, ranges, defaults, GPIO mappings, audio tuning, and function-pattern configuration are maintained in `appendix_Configuration_Variables.md`. This document references CVs only where they directly affect command behavior.

---

# Device Types Covered

PMT firmware 3.3.0 uses a shared protocol foundation across more than one device type.

| Device type | Purpose | Protocol scope |
|---|---|---|
| **Poor Man's Throttle** | Locomotive motor controller | Full throttle/motion protocol, function outputs, shared script management, shared configuration, schedule, INA219 telemetry/protection, and throttle audio diagnostics |
| **Poor Man's Module** | General PMT module foundation | Shared identity, BLE, Wi-Fi/WebSocket, script management, schedule, INA219, debug, and configuration protocol |
| **Poor Man's Turbine** | ESC-style turbine / fan / blower controller | Turbine output protocol, shared script management, shared configuration, schedule, and INA219 telemetry/protection |

Commands in this document are marked as **Shared**, **Throttle-only**, or **Turbine-only** where needed.

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
* Persist-only CV staging commands, shared script-management commands, and throttle audio diagnostic commands require authorization in normal external use.

---

# Device Availability Summary

| Command family | Throttle | Module | Turbine |
|---|---:|---:|---:|
| Identity / authorization | Yes | Yes | Yes |
| Version queries (`V` / `VV`) | Yes | Yes | Yes |
| PX/1 bulk-transfer capability (`XFER?`) | Yes | Yes | Yes |
| Connection status | Yes | Yes | Yes |
| IP query | Yes | Yes | Yes |
| Time query / set | Yes | Yes | Yes |
| Debug control (`D0` / `D1` / `D2`) | Yes | Yes | Yes |
| Async state notify control | Yes | Yes | Yes |
| OTA capability/update (`OTA?` / `OTA`) | S3 throttle only | No | No |
| Grace shutdown runtime override | Yes | Yes | Yes |
| Persist-only CV staging (`PS?` / `PS1` / `PS0`) | Yes | Yes | Yes |
| Shared script record/playback/delete/timing adjustment (`SR` / `SR0` / `SRX` / `SP...` / `SS?` / `SD=` / `SA=`) | Yes* | Yes* | Yes* |
| Throttle motion commands | Yes | No | No |
| Hardware/stored throttle state query | Yes | No | No |
| Periodic throttle debug commands | Yes | No | No |
| Function output commands | Yes | No | No |
| Audio analysis / diagnostic commands | Yes | No | No |
| Sound `.set` get/set (`ST`) | Yes | No | No |
| Turbine output commands | No | No | Yes |
| Shared CV commands | Yes | Yes | Yes |
| Throttle CV commands | Yes | No | No |
| Turbine CV commands | No | No | Yes |

`*` The shared script-management command family is present in all three firmware images, but SD-backed operations require an **active PMT SD filesystem**. The set of recordable control commands is device-specific. The generic Module image currently has no module-specific recordable control commands.

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
I:<id>
I:CONNECTED
CONN B1 S0 W1
IP:192.168.1.50
T:1720000000
F:25
HW-FWD M40 HW60
A:PS=1
```

Throttle audio analysis also emits command-generated `AR:` progress/result lines.

Asynchronous runtime messages may also be sent without being directly requested.

---

# Authorization / Identity Handshake

CV commands require a successful authorization handshake.

Before authorization, firmware allows a limited safe command set including identity, version/revision, connection status, `A0` / `A1`, `D0` / `D1` / `D2`, supported state queries, IP query, and time query/set. Exact configured autonomous schedule commands may also be accepted while autonomous schedule mode is active.

`PS?`, `PS1`, `PS0`, `A?`, `AudioMark`, and `AM` are not part of the normal pre-authorization allow-list.

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

The returned ID is used by the client to compute the connection token.

---

## Send Connection Token

Primary connection:

```text
I,<token>
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

Semantic version only:

```text
V
```

Example response:

```text
ACK:V3.3.0
```

Semantic version plus firmware build revision:

```text
VV
```

Example response for revision 248:

```text
ACK:V3.3.0.248
```

Both `V` and `VV` are shared commands for Throttle, Module, and Turbine firmware and are ACK-wrapped. `VV` is useful when two firmware builds share the same semantic version but have different build revisions.

## PX/1 Bulk-Transfer Capability

The existing text protocol is also used to discover whether the firmware supports the separate PX/1 binary bulk-transfer data plane:

```text
XFER?
```

Successful response:

```text
A:XFER=1
```

`XFER?` is a text command. The bulk transfer itself is **not** carried as ordinary text commands:

* BLE uses the dedicated PX bulk RX/TX characteristics.
* WebSocket uses binary frames rather than the normal text-command path.
* PX/1 uses transfer IDs, byte offsets, frame integrity checks, whole-resource CRC32 validation, ACK/retry, resume, and transport rebind/failover semantics.

Current PX/1 script resources are:

| Resource | Value | Access | Contents |
|---|---:|---|---|
| `Script` | `1` | Read / Write | Exact bytes of `/scripts/<name>.pmt` |
| `ScriptList` | `2` | Read only | Snapshot of saved logical script names, UTF-8, one name per line, without `.pmt` |

An empty script directory returns a valid zero-byte `ScriptList`. The list is a snapshot for the lifetime of the transfer so its announced length and CRC remain stable. Directory enumeration order is not defined; clients may sort the returned names for display.

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

`CV10` controls Wi-Fi enablement and `CV13` configures the WebSocket port. See `appendix_Configuration_Variables.md` for configuration details.

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

Notes:

* `T?` returns the firmware's current system-clock epoch.
* When firmware establishes its clock, it applies the configured `CV14` offset to the UTC source epoch. Therefore the returned epoch represents the **CV14-adjusted firmware clock**, not an untouched raw UTC source value.

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

* The supplied value must be a positive Unix timestamp.
* The firmware accepts values up to `2147483647`.
* Firmware treats the supplied timestamp as the UTC source value, applies the configured `CV14` offset, then establishes the firmware system clock.
* Changing `CV14` while time is established shifts the firmware clock by the offset difference.
* Schedule boundaries are evaluated against this CV14-adjusted firmware clock.

---

## Debug Logging

### Persistent debug enable

```text
D1
```

Response:

```text
ACK:D1
```

Behavior:

* Enables debug event generation.
* Persists the debug startup override.
* Debug remains enabled across reboot until `D0` clears the override.

### Debug with SD logging request

```text
D2
```

Response:

```text
ACK:D2
```

Behavior:

* Enables debug event generation.
* Requests SD-backed debug logging.
* The ACK is sent before the firmware waits for the SD log file to become writable/open.
* If SD logging becomes operational, the firmware persists the SD-log startup override.
* If SD logging cannot be activated, debug event generation remains enabled and the command can operate as serial-debug-only.
* Runtime resource policy can prevent SD logging on hardware/configurations where the logging path is not allowed.
* `D0` disables logging and clears the persistent debug/logging overrides.

### Disable debug/logging

```text
D0
```

Response:

```text
ACK:D0
```

Behavior:

* Clears the persistent debug startup override.
* Disables SD logging and clears its persisted startup behavior.
* Disables debug event generation.

`D0`, `D1`, and `D2` are available before authorization.

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

* `A1` / `A0` control normal `A:` state-notification publishing.
* OTA progress lines (`A:OTA 0`, `A:OTA 10`, ... `A:OTA 100`) are not controlled by `A1` / `A0`.
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
* `G1` enables grace shutdown. If a disconnect starts the grace countdown while a firmware script is running, script playback continues normally during the countdown.
* If a connection returns before grace expires, the active grace countdown is cancelled and the running script continues without being restarted.
* If grace actually expires, firmware stops active script playback before continuing with the device's existing grace-expiry shutdown behavior.
* `G0` disables grace shutdown and clears any active grace countdown. It does **not** stop an active script.
* These commands are shared across supported firmware images, but the visible shutdown effect depends on the device's disconnect behavior.

---

## Persist-Only CV Staging

These commands control a runtime-only CV staging mode. They require authorization.

### Query staging mode

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

### Enable persist-only staging

```text
PS1
```

Response:

```text
ACK:PS1
```

Behavior:

* Valid CV writes are applied to persisted configuration without applying their normal live runtime side effects.
* Staged values require a reboot before they become the active runtime configuration.
* The staging mode itself is runtime-only and is not persisted.

### Leave persist-only staging

```text
PS0
```

Response:

```text
ACK:PS0
```

Behavior:

* Leaves persist-only staging mode.
* Values already staged still require a reboot before they take effect.
* After staged writes exist, the firmware continues tracking the pending-reboot condition.

Important exception:

* `CV8` is a hardware-control CV rather than ordinary persisted configuration. Its restart/factory-reset behavior is not suppressed or staged by `PS1`.

---

# Shared Script Recording / Playback / Timing Adjustment

Firmware 3.3 adds a shared SD-backed script service for recording eligible control commands with timing, playing saved scripts once or repeatedly, checking script state, stopping playback, deleting saved scripts, and adjusting a script's total pause time.

The management commands are shared across PMT firmware images. Actual recordable control commands remain device-specific.

## Storage and File Naming

Firmware scripts are stored as:

```text
/scripts/<name>.pmt
```

Name rules:

* The base name is limited to **16 characters**.
* Allowed characters are lowercase `a-z`, digits `0-9`, underscore `_`, and hyphen `-`.
* Input is normalized to lowercase.
* An optional `.pmt` suffix may be supplied in the command; firmware removes it before building the stored path.
* Saving a recording to an existing name overwrites that script.
* The `/scripts` directory is created when required for recording.
* Script files are limited to **32 KiB**.

All SD-backed script operations require an active PMT SD filesystem. If no active SD storage is available, the command returns `ERR:SD`.

## Start Recording

```text
SR
```

Successful response:

```text
ACK:SR
```

Behavior:

* Recording is observational: eligible external control commands still execute normally while they are being recorded.
* Internally scheduled commands are not recorded.
* Playback-generated commands are not re-recorded.
* The first recorded control command is written immediately; firmware does **not** add a leading pause from `SR` to that first command.
* Between recorded control commands, firmware inserts `PAUSE <milliseconds>` using the elapsed time between those commands.
* If recording is already active, a stopped recording is pending save (`SAVE`), or playback is running, `SR` returns `ERR:BUSY`.
* Starting recording requires active SD storage so the `/scripts` directory can be verified or created.

## Stop Recording and Wait for a Name

```text
SR0
```

Successful response:

```text
ACK:SR0
```

Behavior:

* `SR0` immediately stops an active recording.
* If at least one control command was recorded, firmware measures the elapsed time from the **last recorded control command to `SR0`** and appends that as the final `PAUSE`.
* The completed recording remains in memory and is not yet written to SD.
* Script status changes to `A:SS=SAVE`.
* While `SAVE` is active, starting another recording or playback, deleting a script, and other conflicting script operations return `ERR:BUSY`.
* If no recording is active, `SR0` returns `ERR:STATE`.
* If the recording exceeded the 32 KiB in-memory limit, stopping returns `ERR:FULL` and the failed recording is discarded.

## Save the Recording

```text
SR=<name>
```

Example:

```text
SR=yard1
```

Successful response:

```text
ACK:SR
```

Behavior:

* In the normal app workflow, `SR=<name>` is sent while status is `SAVE` and writes the pending recording as `/scripts/<name>.pmt`.
* The time spent choosing or typing the name after `SR0` is **not** added to the script. The final recorded pause was already captured when `SR0` stopped recording.
* For backward compatibility, `SR=<name>` may also be sent directly while recording. In that case it stops the recording, measures the trailing pause at the `SR=<name>` command, and saves immediately.
* `SR=<name>` itself is not written into the script.
* If no eligible control commands were captured, an empty script file can be saved; attempting to play that file returns `ERR:EMPTY`.
* If neither recording nor `SAVE` is active, `SR=<name>` returns `ERR:STATE`.
* If saving fails while status is `SAVE`, the pending recording remains available so the save can be retried or discarded.

## Discard a Pending Recording

```text
SRX
```

Successful response:

```text
ACK:SRX
```

Behavior:

* `SRX` is valid only while `SS?` reports `A:SS=SAVE`.
* It discards the unsaved recording buffer and returns script state to `IDLE`.
* It does not create or overwrite a `.pmt` file.
* If no pending recording exists, `SRX` returns `ERR:STATE`.

Example recording using the current stop-then-name workflow:

```text
SR
F40
PAUSE 9910
FX4=1
PAUSE 1110
FX4=0
PAUSE 90
B
...wait 10 seconds...
SR0
SR=yard1
```

The final pause after `B` is captured at `SR0`; the time spent entering `yard1` is not part of the script.

## Play Once

```text
SP1=<name>
```

Successful response:

```text
ACK:SP1
```

Behavior:

* Loads and validates the script from SD.
* Runs the script once.
* The file is loaded into memory and closed before playback begins.
* Playback is non-blocking; `PAUSE` delays are serviced from the normal firmware loop.

## Repeat Playback

```text
SPR=<name>
```

Successful response:

```text
ACK:SPR
```

Behavior:

* Loads and validates the script from SD.
* Repeats from the beginning after the final line completes.
* A trailing `PAUSE` recorded when the recording is stopped (`SR0`, or direct `SR=<name>`) is honored before the next repetition begins.
* Playback uses an absolute logical timeline. Normal command-processing time or loop jitter does not shift later pause deadlines, so small lateness does not accumulate as repeat-cycle drift.
* At a repeat boundary, firmware rewinds the script content without resetting the logical timeline to the current time.

## Adjust Script Timing

Firmware revision 242 adds the `SA` (**Script Adjust**) command. It changes the script's total pause time, saves the adjusted script automatically, and preserves the order of non-pause commands.

Named-script forms:

```text
SA=<name>,-<milliseconds>
SA=<name>,+<milliseconds>
```

Examples:

```text
SA=yard1,-1000
SA=yard1,+500
```

Current-playback forms:

```text
SA=-<milliseconds>
SA=+<milliseconds>
```

Successful response:

```text
ACK:SA
```

Meaning:

* A **negative** adjustment shortens the script by reducing its total `PAUSE` time.
* A **positive** adjustment lengthens the script by increasing its total `PAUSE` time.
* The adjustment must include an explicit `+` or `-` sign.
* The magnitude must be from **1 through 2147483647 ms**. Zero, an omitted sign, invalid decimal text, or a larger magnitude returns `ERR:VALUE`.
* `SA=<name>,...` adjusts the named saved script.
* `SA=...` without a name is valid only while a script is currently playing and targets that active script. If no script is playing, it returns `ERR:STATE`.
* While playback is active, a named `SA=<name>,...` request must name the active script. Trying to adjust a different script returns `ERR:BUSY`.

Pause normalization:

* Firmware calculates the script's existing total pause time and redistributes the new target pause total **proportionally across the existing positive `PAUSE` positions**.
* Existing `PAUSE 0` positions remain zero while positive pause time still exists elsewhere.
* If a reduction is equal to or greater than the script's total pause time, every existing pause position is written as **`PAUSE 0`**. The pause lines are deliberately retained rather than removed.
* Retaining `PAUSE 0` positions allows a later positive adjustment to restore time at those same positions.
* When every existing pause position is `PAUSE 0`, a positive adjustment is distributed as evenly as possible across those saved pause positions.
* If the script has no `PAUSE` lines at all, a positive adjustment adds the requested time as a trailing pause. A negative adjustment leaves the timing unchanged.
* If an adjusted pause must exceed the maximum single parsed pause value, firmware splits it into multiple valid `PAUSE` lines.
* The adjusted file must remain within the existing **32 KiB** script limit.

Saving and active playback:

* The adjusted script is committed to SD automatically using the firmware's protected temporary/backup replacement path.
* If the script is not running, the saved file changes immediately.
* If the script is currently running **once**, the current pass continues unchanged; the saved adjustment is used the next time that script starts.
* If the script is currently **repeating**, the current cycle continues unchanged. The adjusted content is swapped in at the **next repeat boundary**.
* Adjusting a script does not stop active playback.

Example:

```text
F20
PAUSE 1000
FX4=1
PAUSE 3000
FX4=0
```

After:

```text
SA=<name>,-5000
```

the pause positions remain present as:

```text
F20
PAUSE 0
FX4=1
PAUSE 0
FX4=0
```

A later:

```text
SA=<name>,+1000
```

restores the available delay across those retained positions.

## Stop Playback

```text
SP0
```

Successful response:

```text
ACK:SP0
```

If no script is running:

```text
ERR:STATE
```

## Script Status

```text
SS?
```

Possible responses:

```text
A:SS=IDLE
A:SS=REC
A:SS=SAVE
A:SS=PLAY
A:SS=REPEAT
```

## Delete a Saved Script

```text
SD=<name>
```

Example:

```text
SD=yard1
```

Successful response:

```text
ACK:SD
```

Behavior:

* Deletes `/scripts/<name>.pmt`.
* The same name normalization and validation rules used by playback and recording are applied.
* Deletion is blocked while recording, pending save (`SAVE`), or playback is active and returns `ERR:BUSY`.
* A missing script returns `ERR:NOFILE`.
* A filesystem delete failure returns `ERR:DELETE`.

## Firmware `.pmt` Script Syntax

Firmware-resident `.pmt` scripts intentionally use a restricted command set:

```text
<recordable device control command>
PAUSE <milliseconds>
```

A bare:

```text
PAUSE
```

is also accepted and means 1000 ms.

The maximum single parsed pause value is `2147483647` ms. Very long recorded intervals can be split across multiple `PAUSE` lines.

Firmware `.pmt` playback is **not** the same as the app's general-purpose terminal script runner. App-only script directives are not accepted in firmware `.pmt` files. A firmware script must contain only blank lines, valid `PAUSE` lines, and commands classified as recordable controls by the active firmware image.

## Recordable Commands by Device

### Throttle

The current throttle classifier accepts:

```text
S
B
B0..100
F0..100
R0..100
FQ0..100
RQ0..100
FX1..12=0/1
```

### Turbine

The current turbine classifier accepts:

```text
F0..100
F0..100*
FQ100
```

### Module

The generic Module firmware currently has no module-specific physical control commands classified as recordable. Script-management commands are present, but a recording with no eligible controls produces an empty script and later playback returns `ERR:EMPTY`.

## Playback Command Gating

While a script is running:

* Script-generated control commands are re-entered through the existing device command handlers.
* Externally received recordable control commands are suppressed so they cannot override the active script.
* Firmware-internal and scheduled control commands are **not** suppressed by script playback; they continue to apply through their existing command paths.
* Non-control management/configuration commands continue through the normal command path unless that specific command rejects the current script state.
* `SP0` remains available to stop playback.
* `SA=+<ms>` / `SA=-<ms>` remains available while playback is active and adjusts the currently playing script without interrupting the current pass.
* A named `SA=<name>,...` is also allowed during playback only when `<name>` is the currently playing script; naming another script returns `ERR:BUSY`.
* Starting another recording or playback, or deleting a script, returns `ERR:BUSY` while playback is active. The same conflicting operations are also blocked while a stopped recording is pending save (`A:SS=SAVE`).

### `S` During Playback

The throttle `S` command has origin-sensitive behavior:

* An **external/app-originated `S`** stops script playback first, then continues through the throttle's normal `S` handling so the train stops as it does outside script mode.
* An **`S` read from the running script** executes the normal train-stop behavior but does **not** terminate script playback. The script continues with the following `PAUSE` or command.
* Firmware-internal/scheduled commands continue to apply while the script is running.

### Grace Shutdown During Playback

`G0` and `G1` change grace-shutdown state; they do not pause the script timeline:

* `G1` enables grace shutdown. If a disconnect starts a grace countdown, script playback continues during that countdown.
* Reconnection before expiry cancels the countdown and the script continues normally.
* Actual grace expiry stops active script playback, then the firmware continues with its existing grace-expiry shutdown behavior.
* `G0` disables grace shutdown and clears an active grace countdown. `G0` does not stop the script.

## Script Errors

| Response | Meaning |
|---|---|
| `ERR:BUSY` | Recording, pending-save (`SAVE`), or playback state prevents the requested operation; during playback, named `SA=` may only target the active script |
| `ERR:SD` | Active SD storage is unavailable |
| `ERR:MEM` | Required script buffer memory could not be reserved |
| `ERR:STATE` | Requested state transition is invalid, such as `SP0` while idle, `SR0` when not recording, `SRX` when not in `SAVE`, `SR=<name>` when neither recording nor `SAVE` is active, or unnamed `SA=...` when no script is playing |
| `ERR:NAME` | Script name is empty, too long, or contains invalid characters |
| `ERR:VALUE` | `SA` adjustment is missing an explicit sign, is zero, is not a valid decimal value, or exceeds 2147483647 ms |
| `ERR:FULL` | Recording exceeded the 32 KiB script limit |
| `ERR:WRITE` | Script data could not be written or safely replaced on SD |
| `ERR:NOFILE` | Requested script file does not exist |
| `ERR:READ` | Script file could not be read completely |
| `ERR:SIZE` | Script file or adjusted script result exceeds the 32 KiB limit |
| `ERR:EMPTY` | Script contains no executable content |
| `ERR:SCRIPT` | Script contains an invalid line or unsupported command |
| `ERR:DELETE` | Script file could not be deleted |

## BLE Command-Length Constraint

The 16-character script-name limit keeps the longest management commands within the minimum 20-byte BLE payload:

```text
SP1=<16-character-name>
SPR=<16-character-name>
```

Each is at most 20 ASCII bytes before any transport framing.

## Authorization

Shared script-management commands follow the normal externally authorized command path. They are not part of the pre-authorization command set.

---

# Throttle-Only Commands

These commands apply to **Poor Man's Throttle** locomotive firmware.

---

## ESP32-S3 OTA Capability and Firmware Update

These OTA commands apply to supported **Poor Man's Throttle ESP32-S3 N16R8 and N8R8** firmware. OTA is not available on the Classic ESP32-WROOM throttle.

Both commands require the normal authorization handshake.

### Query OTA capability

```text
OTA?
```

Responses:

```text
ACK:OTA
```

Supported S3 throttle with Wi-Fi connected.

```text
ERR:NO WIFI
```

Supported S3 throttle without an active Wi-Fi connection.

```text
ERR:NS
```

Classic ESP32 throttle; OTA is not supported.

`OTA?` is a query only. It does not stop the throttle, enter the OTA LED state, fetch the manifest, or start an update.

### Start OTA

```text
OTA
```

On an authorized supported S3 throttle with Wi-Fi connected, the command is accepted with:

```text
ACK:OTA
```

The firmware then invokes the existing `S` stop behavior, waits until the throttle is fully stopped, obtains private OTA validation time, reads the firmware catalog, selects the exact S3 board target, and installs that target's `latest` firmware image.

OTA does not accept a requested firmware version. The catalog `versions[]` list and `dropdownDefault` value are for USB installer selection and are not OTA version selectors.

`CV15` controls whether OTA may install a catalog `latest` version that is older than the semantic firmware version currently running:

* `CV15=0` (default) rejects a catalog downgrade and the OTA attempt fails with `ERR:OTA`.
* `CV15=1` allows OTA to install that board target's catalog `latest` even when it is older than the running semantic version.

`CV15` does not turn OTA into a historical-version selector. OTA still installs only the detected board target's catalog `latest`. Use the USB installer for recovery or when a specific firmware version must be selected.

During the actual firmware image transfer/write phase, the initiating transport receives:

```text
A:OTA 0
A:OTA 10
A:OTA 20
A:OTA 30
A:OTA 40
A:OTA 50
A:OTA 60
A:OTA 70
A:OTA 80
A:OTA 90
A:OTA 100
```

Progress rules:

* Progress is emitted in exact 10% buckets without intentionally skipping a bucket.
* `A:OTA 0` means the firmware image transfer/write phase has begun. NTP acquisition and manifest processing occur before this point.
* `A:OTA 100` means the firmware image transfer/write completed successfully. The device then reboots; no additional success packet is required.
* OTA progress is sent to the transport that initiated OTA.
* OTA progress is not controlled by the normal `A1` / `A0` async-state setting.
* `OTA?` never produces OTA progress lines.

Failure responses:

```text
ERR:NO WIFI
ERR:OTA
```

`ERR:NO WIFI` is used when Wi-Fi is unavailable when OTA is requested or is lost while OTA is active. Other OTA failures return `ERR:OTA`.

While OTA is active, motion commands are prevented from restarting motion. On supported S3 hardware, the onboard RGB LED alternates GREEN/PURPLE every 300 ms for the complete OTA lifecycle and this indication overrides the normal `CV21` LED output gate.

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
* Detailed CV semantics are in `appendix_Configuration_Variables.md`.

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
HW-REV M25 HW35
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

* Function behavior is configured by the function CV blocks in the `CV150–CV231` range.
* Direction-gated functions can be forced off automatically when the active direction does not match their configured direction rule.
* Function CV layouts, patterns, pin/track semantics, defaults, and reserved positions are documented only in `appendix_Configuration_Variables.md`.

---

## Audio Track-Length Analysis

These commands require authorization and are available only on Throttle firmware.

### Analyze the default audio manifest

```text
A?
```

Behavior:

* Starts track-length recording/analysis for the firmware-selected default audio manifest for the active backend.
* `CV400` audio must be enabled.
* The active audio backend must expose the required BUSY/track-length recording capability.
* The operation emits `AR:` progress/result lines.

### Analyze an explicit track list

```text
A? N=<track>[,<track>...]
```

Example:

```text
A? N=202,211,212
```

Rules:

* Each explicit track value must be numeric and in the range `1..9999`.
* A malformed list produces an audio-analysis format error.
* A second analysis request while one is active is rejected as busy.

Typical command-generated replies include:

```text
AR:START N=<count>
AR:T<track> START
AR:T<track> L=<ms>
AR:DONE
ACK:A?
```

Failure examples include:

```text
AR:ERR AUDIO-OFF
ERR:A? AUDIO-OFF
```

Other verified failure reasons include `BUSY`, `BUSY-PIN`, `FORMAT`, and `START`.

---

## Audio Diagnostic Marker

Long form:

```text
AudioMark
```

Short alias:

```text
AM
```

Responses:

```text
ACK:AudioMark
ACK:AM
```

Behavior:

* Requests a manual audio diagnostic marker from the active audio service.
* The command is acknowledged after the marker attempt.
* This is a diagnostic/logging command; it does not configure an audio CV.

---

## Sound `.set` Field Get / Set (`ST`)

The implemented `ST` command reads or writes one field in a sound `.set` file.

Set:

```text
ST<set-id>.<field-id>=<value>
```

Query:

```text
ST<set-id>.<field-id>?
```

Successful set response:

```text
ACK:ST<set-id>.<field-id>=<value>
```

Successful query response:

```text
ACK:ST<set-id>.<field-id>=<value>
```

Invalid syntax, target IDs, field IDs, values, unavailable targets, or persistence failures return an `ERR:` response using the normal PMT error style.

### Addressing Rules

`<set-id>` is hexadecimal with no `0x` prefix.

`<field-id>` is decimal.

The hexadecimal target namespace is:

| Set ID | Target |
|---|---|
| `0001`–`270F` | Custom WAV `1`–`9999` in the firmware's active sound root |
| `2A01` | `prime.set` |
| `2A02` | `horn.set` |
| `2A03` | `bell.set` |
| `2A04` | `cab.set` |
| `2A05` | `brake.set` |
| `2A06` | `steamfx.set` |
| `2A07` | `chuff.set` |
| `2A08` | `steambg.set` |

Custom WAV IDs are the WAV's decimal track number represented in hexadecimal.

Examples:

```text
9999 decimal = 270F hex
1234 decimal = 04D2 hex
```

Leading zeroes are not required on the wire, so custom WAV `1234.wav` may be addressed as:

```text
ST4D2.1=25
```

The firmware already knows whether the active sound root is steam or diesel. Therefore the custom-WAV `set-id` does **not** encode steam/diesel.

For example, with custom WAV `9999.wav`:

```text
ST270F.1=25
ACK:ST270F.1=25

ST270F.1?
ACK:ST270F.1=25
```

The same command targets either `/steam/9999.set` or `/diesel/9999.set` according to the firmware's active sound root.

For `steamfx.set`:

```text
ST2A06.1=-20
ACK:ST2A06.1=-20

ST2A06.1?
ACK:ST2A06.1=-20
```

### Field IDs

Field IDs are stable numeric protocol identifiers. New `.set` properties can be added later without changing the `ST` command format.

Current field map:

| Field ID | `.set` property | Meaning |
|---:|---|---|
| `1` | `volumeOffsetPercent` | Signed percentage-point adjustment applied on top of existing firmware volume behavior |

Current `volumeOffsetPercent` range:

```text
-100..100
```

`0` is neutral.

Existing hard-coded firmware levels and dynamic curves remain authoritative baseline behavior. For example, the existing brake-squeal and steam-chuff relative percentages remain in code, and the `.set` value is additive to those values. The `0190` inverse-speed volume behavior also remains in code, with the applicable `.set` adjustment applied on top.

With all known `.set` values at `0` and no custom `.set` files present, volume behavior is required to remain equivalent to the existing firmware behavior.

### Runtime and Persistence Semantics

A successful set command must:

1. Validate the target, field, and value.
2. Apply the new value to the in-memory setting immediately so the runtime audio effect changes as soon as the applicable mixer/playback processing uses it.
3. Persist the same value to the corresponding `.set` file on the SD card.
4. Return `ACK:` only after the requested value is active in memory and persistence succeeds.

If persistence fails, the command must return `ERR:` and must not intentionally leave RAM and the persisted `.set` value inconsistent.

A query returns the current in-memory value. It does not require an SD-card reread.

### Known Category `.set` Files

For the known, non-custom category files, initialization behavior applies on both Classic and S3:

* If a known `.set` file is missing, firmware creates it with its default fields, currently including:

```text
version=1
volumeOffsetPercent=0
```

* After creation, the settings are loaded into memory.
* If the file already exists, firmware does not replace it; it loads the settings into memory.
* Runtime audio uses the in-memory values rather than repeatedly reading the SD card.

### Custom WAV `.set` Files

Custom WAV sidecars are different from known category files:

* They are not automatically created during normal initialization.
* If a custom `.set` file is missing, its effective adjustment is neutral (`0`).
* Querying a missing custom `.set` returns the neutral value without creating the file.
* Explicitly setting a custom field may create the custom `.set` file, then updates RAM and persists the requested value.

### Grouped Playback Versus Custom Playback

Playback context determines which `.set` applies.

When a WAV is played as part of a normal grouped sound, only the group's `.set` is used. Any individual `.set` file for a WAV inside that group is ignored.

Example:

```text
horn.set       volumeOffsetPercent=10
0211.set       volumeOffsetPercent=-25
```

If `0211.wav` is played as part of the normal horn function, `horn.set` applies and `0211.set` is ignored.

If that same `0211.wav` is selected and played as a custom individual sound, `0211.set` applies and `horn.set` is not inherited.

In short:

```text
Normal grouped playback
    -> group .set only
    -> individual WAV .set ignored

Custom individual playback
    -> individual WAV .set only
    -> normal group .set not inherited
```

### BLE MTU / Command-Length Constraint

The `ST` wire format is intentionally compact so commands and responses fit in a single BLE notification/write even when only the minimum 20-byte ATT payload is available.

With the planned two-digit future field-ID space, a long current-format response such as:

```text
ACK:ST2A06.99=-100
```

is 18 ASCII bytes before a line terminator and 19 bytes with a single newline.

The protocol should therefore preserve compact hexadecimal set IDs, decimal field IDs, and compact signed decimal values rather than replacing them with long property or filename strings.

### Authorization

`ST` commands use the normal externally authorized command path. They are not part of the pre-authorization command set.

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
* Detailed turbine CV values and board-specific defaults are maintained in `appendix_Configuration_Variables.md`.

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

Poor Man's Module firmware supports the shared PMT command set and shared CV handling.

It does **not** implement locomotive throttle commands or turbine output commands.

Use module firmware for PMT-compatible devices that need the shared foundation:

* BLE identity and authorization
* Wi-Fi / WebSocket transport
* debug commands
* time commands
* schedule/autonomous command execution
* persist-only CV staging
* shared configuration
* INA219 telemetry/protection
* shared LED timing

---

# Asynchronous Runtime Updates

The firmware can send unsolicited runtime updates.

There are two main categories:

1. `A:` state updates
2. INA219 telemetry/protection updates using `TV:`, `TI:`, `TP:`, and `TF:`

`AR:` lines are different: they are command-generated progress/result lines from the Throttle `A?` audio-analysis command.

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
* Configuration of INA219 CVs is documented in `appendix_Configuration_Variables.md`.

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

# Command-Relevant CV Cross-References

This command reference intentionally does **not** duplicate the full CV catalog. Use `appendix_Configuration_Variables.md` as the authoritative CV reference for definitions, ranges, defaults, GPIO validation, function patterns, board differences, and audio tuning.

The following CVs remain here only because they directly change command behavior:

| CV / bank | Scope | Command relevance |
|---|---|---|
| `CV8` | Shared | Operational restart/reset control. `CV8=0` requests a safe restart without wiping configuration. `CV8=8` wipes persisted configuration and reboots. Querying CV8 returns `ERR`. `PS1` does not stage/suppress CV8. |
| `CV10`, `CV13` | Shared | Control Wi-Fi enablement and WebSocket port used by the command transport. |
| `CV14` | Shared | Offset applied when establishing/adjusting the firmware clock; therefore affects `T?`, `T=<unix>`, and schedule evaluation. |
| `CV15` | Shared | OTA downgrade gate. `0` (default) rejects a catalog `latest` version older than the running semantic firmware version; `1` permits that catalog downgrade. OTA still selects only the board target's catalog `latest`. |
| `CV2`, `CV3`, `CV41` | Throttle | Affect effective motor output for throttle motion commands. |
| `CV6`, `CV7` | Throttle | Control steady/changing intervals for asynchronous `A:` state updates. |
| `CV150–CV231` | Throttle | Configure the 12 function outputs controlled by `FX<n>=0/1`. See the CV appendix for exact implemented positions and patterns. |
| `CV2`, `CV3`, `CV5` | Turbine | Affect turbine output mapping and the `FQ100` quick-output value. |
| `CV300–CV305` | Shared | Configure autonomous schedule operation and the commands executed at ON/OFF boundaries. |
| `CV400` | Audio / Throttle behavior | Audio must be enabled for Throttle `A?` track-length analysis. |

---

# Scheduling / Autonomous Mode

The schedule subsystem is configured with `CV300–CV305`. Full CV formats and defaults are in `appendix_Configuration_Variables.md`.

A schedule is valid only when the configured enable flag, weekday mask, ON/OFF times, and ON/OFF commands form a complete valid schedule. The ON time must be earlier than the OFF time; schedules that cross midnight are not supported.

Time behavior:

* `CV302` and `CV303` are evaluated against the **CV14-adjusted firmware clock**.
* The configured weekday is likewise derived from that adjusted firmware clock.
* `CV304` is the command executed at the ON boundary.
* `CV305` is the command executed at the OFF boundary.

Autonomous behavior:

* When system time is valid and the schedule is configured, the firmware can enter autonomous schedule mode around the configured operating window.
* The autonomous-mode window extends 2 minutes before the ON boundary and 2 minutes after the OFF boundary.
* The ON command still fires at the configured ON boundary.
* The OFF command still fires at the configured OFF boundary.
* Replies are suppressed for internally scheduled command execution.
* Internally scheduled commands execute through the normal command pipeline.
* If script playback is active, scheduled commands that classify as recordable controls are suppressed until playback stops.
* Device-specific commands must match the firmware image. For example, throttle firmware can schedule `F40` or `S`; turbine firmware can schedule `F50` or `F0`.
* While autonomous mode is active, the configured schedule's exact ON/OFF command strings can be allowed through the command gate even without a completed external handshake.

---

# WebSocket Operation

When Wi-Fi is enabled with `CV10=1`, firmware starts the configured Wi-Fi/WebSocket service.

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
* `CV13` configures the WebSocket port; detailed Wi-Fi/CV behavior is in `appendix_Configuration_Variables.md`.

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
| `V` | Shared | Firmware semantic version |
| `VV` | Shared | Firmware semantic version plus build revision |
| `XFER?` | Shared | Query PX/1 bulk-transfer capability; supported firmware replies `A:XFER=1` |
| `C?` | Shared | Connection status |
| `IP?` | Shared | IP address query |
| `T?` | Shared | Current adjusted firmware time query |
| `T=<unix>` | Shared | Set time from UTC source epoch and apply CV14 offset |
| `D1` | Shared | Enable and persist debug startup override |
| `D2` | Shared | Enable debug and request persistent SD logging |
| `D0` | Shared | Disable debug/logging and clear persistence |
| `A1` | Shared | Enable async `A:` state updates |
| `A0` | Shared | Disable async `A:` state updates |
| `OTA?` | S3 Throttle | Query OTA capability/readiness |
| `OTA` | S3 Throttle | Stop safely and install the board target's catalog `latest` firmware |
| `G1` | Shared | Enable grace shutdown for this boot |
| `G0` | Shared | Disable grace shutdown for this boot |
| `PS?` | Shared | Query persist-only CV staging mode |
| `PS1` | Shared | Enable persist-only CV staging |
| `PS0` | Shared | Leave persist-only CV staging |
| `SR` | Shared* | Start SD-backed control-command recording |
| `SR0` | Shared* | Stop recording and hold it in `SAVE` state for naming |
| `SRX` | Shared* | Discard the pending unsaved recording while in `SAVE` |
| `SR=<name>` | Shared* | Save the pending recording, or directly stop-and-save an active recording, as `/scripts/<name>.pmt` |
| `SP1=<name>` | Shared* | Play a saved firmware script once |
| `SPR=<name>` | Shared* | Repeat a saved firmware script |
| `SP0` | Shared | Stop active script playback |
| `SS?` | Shared | Query script state |
| `SD=<name>` | Shared* | Delete a saved firmware script |
| `SA=<name>,+<ms>` / `SA=<name>,-<ms>` | Shared* | Lengthen or shorten total pause time in a named script and save the adjusted script |
| `SA=+<ms>` / `SA=-<ms>` | Shared* | Lengthen or shorten the currently playing script; repeating playback uses the adjusted script at the next repeat boundary |
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
| `A?` | Throttle | Analyze default audio track manifest |
| `A? N=<tracks>` | Throttle | Analyze explicit audio track list |
| `AudioMark` / `AM` | Throttle | Emit manual audio diagnostic marker |
| `ST<set-id>.<field-id>=<value>` | Throttle | Set and persist a sound `.set` field |
| `ST<set-id>.<field-id>?` | Throttle | Query an in-memory sound `.set` field |
| `F?` | Turbine | Requested turbine output query |
| `F<n>` | Turbine | Ramp turbine output |
| `F<n>*` | Turbine | Immediate turbine output |
| `FQ100` | Turbine | Temporary quick turbine output |
| `CV<n>?` | Device-specific | Query CV |
| `CV<n>=<value>` | Device-specific | Set CV |

`*` SD-backed script operations require an active PMT SD filesystem.

---

# Runtime / Result Line Summary

OTA progress is reported as `A:OTA 0`, `A:OTA 10`, ... `A:OTA 100`. These OTA progress lines are independent of the normal `A1` / `A0` async-state setting.

Unsolicited runtime lines:

| Line prefix | Meaning |
|---|---|
| `A:` | General runtime state |
| `TV:` | INA219 bus voltage in mV |
| `TI:` | INA219 current in mA |
| `TP:` | INA219 power in mW |
| `TF:` | INA219 compact status flags |
| `IP:` | Wi-Fi IP announcement |

Command-generated script status lines:

| Line | Meaning |
|---|---|
| `A:SS=IDLE` | Script service is idle |
| `A:SS=REC` | Recording is active |
| `A:SS=SAVE` | Recording has stopped and is waiting to be named/saved or discarded |
| `A:SS=PLAY` | One-shot playback is active |
| `A:SS=REPEAT` | Repeating playback is active |

Command-generated audio-analysis lines:

| Line prefix | Meaning |
|---|---|
| `AR:START` | Track-length analysis started |
| `AR:T... START` | Analysis started for a track |
| `AR:T... L=...` | Track length measured |
| `AR:ERR ...` | Analysis failure |
| `AR:DONE` | Requested analysis completed |

---

# What Changed from the Older 1.12.x Reference

This reference documents the verified command behavior for PMT firmware 3.3.0.

Major documentation changes:

* Updated the document from throttle-only to the PMT device family.
* Added Poor Man's Module protocol scope.
* Added Poor Man's Turbine commands.
* Added backup socket authorization with `IB,<token>`.
* Added current time query/set documentation with `T?` and `T=<unix-time>`.
* Clarified the CV14-adjusted firmware clock behavior used by time and scheduling.
* Corrected the identity flow so `I` requests identity and `I?` checks authorization state.
* Clarified shared vs throttle-only vs turbine-only command availability.
* Added `D2` SD-debug logging behavior and clarified persistent `D1` / `D0` semantics.
* Added `PS?`, `PS1`, and `PS0` persist-only CV staging commands.
* Added Throttle `A?`, `A? N=<tracks>`, `AudioMark`, and `AM` audio diagnostic commands.
* Added the `AR:` audio-analysis result family.
* Added the firmware 3.3 shared SD-backed script recording/playback/status/delete command family, including trailing recording timing, `.pmt` validation, device-specific recordable controls, and playback command gating.
* Added the approved, implementation-pending `ST<set-id>.<field-id>` sound `.set` protocol design, including hexadecimal target IDs, future-proof field IDs, immediate in-memory application, SD persistence, Classic/S3 initialization semantics, custom-WAV handling, grouped-vs-custom precedence, and BLE MTU constraints.
* Reduced duplicated CV catalogs and retained only CV references that directly clarify command behavior.
