# Poor Man's Throttle (PMT) – CV Configuration Reference

**Firmware Version:** 1.12.2  
**Platform:** ESP32 BLE Heavy-Train Throttle Controller

---

# Overview

The Poor Man's Throttle firmware supports **Configuration Variables (CVs)** that allow operators to configure motor behavior, communication settings, hardware pin assignments, LED behavior, function outputs, etc.

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

```text
CV<number>?
```

Example:

```text
CV2?
```

Response:

```text
A:CV2=0
```

---

## Set a CV

To modify a CV:

```text
CV<number>=<value>
```

Example:

```text
CV2=25
```

Response:

```text
A:CV2=25
```

---

# Important Notes

* Most motion commands require a **successful handshake** before they are accepted
* CV commands are handled by the same command-processing path used by BLE and WebSocket
* Invalid values return:

```text
ERR:<command>
```

* Most CV changes are **saved automatically to non-volatile storage after a short delay**
* **CV8 is not stored** and only triggers a reset action
* Some CV changes may reinitialize internal services or hardware
* Pin CVs accept only the firmware’s allowed runtime GPIO list, not every ESP32 GPIO number
* CV commands can be sent over **BLE or WebSocket**


---

# CV Configuration Table

| CV        | Purpose                        | Possible Values (Default)                                                    | Description |
| --------- | ------------------------------ | ---------------------------------------------------------------------------- | ----------- |
| **CV1**   | Motor Driver Mode              | `DUAL_PWM`, `PWM_DIR`, `PWM_BIDIR`, `DUAL_INPT` (**Default: DUAL_PWM**)      | Selects motor driver interface type. |
| **CV2**   | Minimum Start (Floor)          | `0 – 100` (**Default: 0**)                                                   | Minimum hardware throttle output when any non-zero mapped throttle is commanded. |
| **CV3**   | Maximum Output (Ceiling)       | `0 – 100` (**Default: 100**)                                                 | Caps maximum motor output. **`0` means no ceiling cap**, which behaves as `100`. |
| **CV4**   | Train Name                     | Letters, numbers, spaces (**Default: blank**)                                | Sets the train name used for BLE advertising. Leading/trailing spaces are trimmed. Stored value is constrained to fit a single BLE notify reply. The advertised BLE name is also clamped to a conservative length. |
| **CV5**   | Direction Inversion            | `0`, `1` (**Default: 0**)                                                    | Reverses motor direction logic. |
| **CV6**   | Async Notify (Steady)          | `50 – 10000 ms` (**Default: 10000**)                                         | State update interval when throttle is steady. |
| **CV7**   | Async Notify (Changing)        | `50 – 10000 ms` (**Default: 500**)                                           | State update interval while throttle is changing or ramping. |
| **CV8**   | Reset Trigger                  | `8`                                                                          | Writing `CV8=8` wipes saved configuration and reboots the ESP32. |
| **CV9**   | Kick Configuration             | `<thr>,<ms>,<rampDownMs>,<maxApply>` (**Default: `0,0,80,15`**)              | Configures start-assist kick used when starting from stop at low throttle. |
| **CV10**  | WiFi Enable                    | `0`, `1` (**Default: 0**)                                                    | Enables WiFi/WebSocket service when configured. |
| **CV11**  | WiFi SSID                      | Text (**Default: blank**)                                                    | WiFi network SSID. |
| **CV12**  | WiFi Password                  | Text (**Default: blank**)                                                    | WiFi password. **Set-only** from the command interface. Query returns `ERR`. |
| **CV13**  | WebSocket Port                 | `1 – 65535` (**Default: 81**)                                                | WebSocket server port. |
| **CV20**  | LED Blink Timing               | `<periodMs>,<onMs>` (**Default: `1000,250`**)                                | Controls phase-based blink timing used by subscribed LED outputs in `BLINK+` and `BLINK-` modes. `periodMs` must be `1 – 60000`; `onMs` must be `1 – periodMs`. |
| **CV30**  | INA219 Enable                  | `0`, `1` (**Default: 0**)                                                    | Enables or disables the INA219 subsystem. Disabled by default for safe rollout. |
| **CV31**  | INA219 SDA Pin                 | Allowed runtime GPIOs (**Default: 21**)                                      | I²C SDA pin used by the INA219 on ESP32. |
| **CV32**  | INA219 SCL Pin                 | Allowed runtime GPIOs (**Default: 22**)                                      | I²C SCL pin used by the INA219 on ESP32. |
| **CV33**  | INA219 I²C Address             | `64 – 79` (**Default: 64**)                                                  | Decimal I²C address for the INA219. `64` corresponds to `0x40`. |
| **CV34**  | INA219 Sample Interval         | `50 – 60000 ms` (**Default: 500**)                                           | How often the firmware samples INA219 measurements. |
| **CV35**  | INA219 Publish Interval        | `100 – 60000 ms` (**Default: 10000**)                                        | How often INA219 async telemetry is published while enabled. |
| **CV36**  | Low-Voltage Warn Threshold     | `0 – 50000 mV` (**Default: 0**)                                              | Bus-voltage threshold that activates low-voltage warning behavior. `0` disables the threshold. |
| **CV37**  | Low-Voltage Limit Threshold    | `0 – 50000 mV` (**Default: 0**)                                              | Bus-voltage threshold that activates throttle limiting. `0` disables the threshold. |
| **CV38**  | Shutdown Threshold             | `0 – 50000 mV` (**Default: 0**)                                              | Bus-voltage threshold that forces shutdown/stop behavior. `0` disables the threshold. |
| **CV39**  | Recovery Threshold             | `0 – 50000 mV` (**Default: 0**)                                              | Recovery threshold used for hysteresis after warn/limit/shutdown conditions. `0` disables automatic recovery. |
| **CV40**  | Disconnect Threshold           | `0 – 50000 mV` (**Default: 0**)                                              | Bus-voltage threshold used to infer battery disconnected or collapsed supply. `0` disables the threshold. |
| **CV41**  | Low-Voltage Throttle Cap       | `0 – 100` (**Default: 25**)                                                  | Maximum allowed mapped throttle percentage while low-voltage limiting is active. |
| **CV42**  | Low-Voltage LED Pin            | Allowed runtime GPIOs or `0` (**Default: 0**)                                | Optional dedicated LED output pin used to indicate low-voltage-related states. `0` means unassigned. |
| **CV100** | Dual PWM Forward Pin           | Allowed PWM GPIOs (**Default: 25**)                                          | Forward PWM pin for `DUAL_PWM` mode. |
| **CV101** | Dual PWM Reverse Pin           | Allowed PWM GPIOs (**Default: 26**)                                          | Reverse PWM pin for `DUAL_PWM` mode. |
| **CV102** | Dual PWM Enable A              | Allowed output GPIOs (**Default: 27**)                                       | Enable pin A for `DUAL_PWM` mode. |
| **CV103** | Dual PWM Enable B              | Allowed output GPIOs (**Default: 33**)                                       | Enable pin B for `DUAL_PWM` mode. |
| **CV104** | Two-Pin A                      | Allowed PWM GPIOs (**Default: 25**)                                          | Shared two-pin control input A. Used as the PWM pin in `PWM_DIR`, and as input A in `DUAL_INPT`. |
| **CV105** | Two-Pin B                      | Allowed output GPIOs (**Default: 26**)                                       | Shared two-pin control input B. Used as the direction pin in `PWM_DIR`, and as input B in `DUAL_INPT`. |
| **CV106** | PWM_BIDIR PWM/Enable Pin       | Allowed PWM GPIOs (**Default: 25**)                                          | PWM/enable pin used in `PWM_BIDIR` mode. |
| **CV107** | PWM_BIDIR Forward Pin          | Allowed output GPIOs (**Default: 26**)                                       | Forward logic pin used in `PWM_BIDIR` mode. |
| **CV108** | PWM_BIDIR Reverse Pin          | Allowed output GPIOs (**Default: 27**)                                       | Reverse logic pin used in `PWM_BIDIR` mode. |
| **CV300** | Schedule Enable                | `0`, `1` (**Default: 0**)                                                    | Enables or disables the Scheduling / Autonomous Mode subsystem. |
| **CV301** | Schedule Weekday Bitmask       | `1 – 127` bitmask (**Default: 0**)                                           | UTC weekday enable mask. Uses firmware `tm_wday` bit positions: Sunday=`1`, Monday=`2`, Tuesday=`4`, Wednesday=`8`, Thursday=`16`, Friday=`32`, Saturday=`64`. `0` means no enabled days and is treated as not configured. |
| **CV302** | Schedule ON Time (UTC)         | Strict `HH:MM` (**Default: blank / unset**)                                  | UTC start time for the scheduled ON boundary. Must be exactly two digits, colon, two digits, such as `08:30`. Internally stored as minute-of-day. |
| **CV303** | Schedule OFF Time (UTC)        | Strict `HH:MM` (**Default: blank / unset**)                                  | UTC stop time for the scheduled OFF boundary. Must be exactly two digits, colon, two digits, such as `17:45`. Internally stored as minute-of-day. |
| **CV304** | Schedule ON Command            | Command text (**Default: blank**)                                            | Exact command string executed internally at the scheduled ON boundary. During autonomous mode, this exact normalized command can also bypass pre-handshake blocking. |
| **CV305** | Schedule OFF Command           | Command text (**Default: blank**)                                            | Exact command string executed internally at the scheduled OFF boundary. During autonomous mode, this exact normalized command can also bypass pre-handshake blocking. |
---

# Allowed GPIOs for Runtime CV Pin Assignment

The firmware does **not** accept every ESP32 pin number for runtime CV pin assignment.

This allowed list applies to motor/output pin CVs and also to the INA219 pin-related CVs such as **CV31**, **CV32**, and **CV42**.

The allowed runtime output/PWM GPIOs are:

```text
0, 1, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33
```

If a pin value outside the allowed list is written to a pin CV, the firmware returns `ERR:<command>`.

---

# INA219 Telemetry and Protection

Firmware **1.12.1** includes an optional **INA219** subsystem for:

* bus-voltage measurement
* current measurement
* power measurement
* battery disconnected detection
* low-voltage warning
* throttle limiting
* shutdown and recovery behavior
* compact async telemetry publishing

The INA219 is the **sensor only**. Higher-level behavior such as warning state, throttle limiting, shutdown, recovery, and LED indication is implemented in firmware policy.

## INA219 Defaults

Factory defaults for the INA219 subsystem are:

* disabled
* SDA = `21`
* SCL = `22`
* address = `64` (`0x40`)
* sample interval = `500 ms`
* publish interval = `10000 ms`
* warn / limit / shutdown / disconnect thresholds = `0` (inactive until configured)
* recovery threshold = `0` (automatic recovery disabled)
* low-voltage throttle cap = `25%`
* low-voltage LED pin = `0` (unassigned)

## INA219 Async Telemetry Format

When INA219 telemetry publishing is active, the firmware emits compact unsolicited telemetry lines:

```text
TV:<millivolts>
TI:<milliamps>
TP:<milliwatts>
TF:<LED><BAT><WARN><LIM><SD>
```

Status bit order in `TF:` is fixed:

1. `LED`
2. `BAT`
3. `WARN`
4. `LIM`
5. `SD`

Battery bit meaning:

* `BAT=1` = battery connected
* `BAT=0` = battery disconnected

Example:

```text
TV:18120
TI:410
TP:742
TF:01000
```

Meaning:

* `LED=0`
* `BAT=1`
* `WARN=0`
* `LIM=0`
* `SD=0`

## INA219 Suggested Starting Values by Battery Type

These are **starting-point recommendations**, not absolute battery-protection rules. Actual safe thresholds depend on pack chemistry, cell count, wiring loss under load, BMS behavior, and how much voltage sag your locomotive causes during startup or heavy pull.

For a **generic firmware build**, the shipped defaults remaining at `0` are still appropriate. Use the table below when tuning for a **known battery type**.

| Battery / Supply Type | Typical Pack Range | CV36 Warn | CV37 Limit | CV38 Shutdown | CV39 Recovery | CV40 Disconnect | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 3S Li-ion / LiPo | 12.6V full, ~9.0V near empty | `10200` | `9600` | `9300` | `10500` | `6000` | Good starting point for small 12V-class lithium packs. |
| 4S Li-ion / LiPo | 16.8V full, ~12.0V near empty | `13600` | `12800` | `12400` | `14000` | `8000` | Common for “16V / 18V-class” packs. |
| 5S Li-ion / LiPo | 21.0V full, ~15.0V near empty | `17000` | `16000` | `15500` | `17500` | `10000` | Useful for higher-voltage handheld-tool style packs. |
| 4S LiFePO4 | 14.6V full, ~10.0V near empty | `12400` | `12000` | `11600` | `12800` | `8000` | LiFePO4 tends to hold voltage flat, so field tuning is important. |
| 12V SLA / AGM / Gel | ~12.7V full, ~11.0V very low | `11800` | `11400` | `11100` | `12300` | `9000` | Good conservative starting point for sealed lead-acid packs. |
| 12-cell NiMH | ~16.8V fresh, ~12.0V under load late in discharge | `12600` | `11800` | `11000` | `13200` | `8000` | NiMH sag varies a lot with load, age, and temperature. |
| Bench / regulated DC supply | Fixed supply | `0` | `0` | `0` | `0` | `0` | Leave all battery policies off unless you specifically want telemetry-based limits. |

### Suggested Tuning Order

1. Start with **CV36** (warn) only.
2. Add **CV37** (limit) if you want reduced speed before shutdown.
3. Add **CV38** (shutdown) only after validating under real train load.
4. Set **CV39** above shutdown if you want automatic recovery hysteresis. Leave `CV39=0` to disable automatic recovery.
5. Add **CV40** only after you understand your pack’s worst-case voltage sag.

## INA219 Behavior Notes

* All INA219 measurement values are integer-based
* Default threshold values of `0` keep the measurement subsystem additive while leaving warn/limit/shutdown/disconnect protection inactive until configured; `CV39=0` disables automatic recovery
* The low-voltage LED pin is configurable through **CV42**
* The low-voltage LED active behavior is fixed internally to **BLINK+**
* INA219 telemetry enable is an internal runtime policy, not a CV
* On INA219 read failure, the firmware marks telemetry invalid, keeps the last known protection state, and retries sensor setup

---

# Scheduling / Autonomous Mode (CV300–CV305)

Firmware **1.12.2** includes a **Scheduling / Autonomous Mode** feature block beginning at **CV300**.

This subsystem allows the throttle to:

* become **autonomous** during a configured UTC schedule window
* suppress normal BLE disconnect-grace and BLE hard-recovery escalation while autonomous mode is active
* fire an internally configured **ON command** at the exact schedule start time
* fire an internally configured **OFF command** at the exact schedule stop time

## Schedule CV Defaults

Factory defaults for the schedule subsystem are effectively:

* schedule disabled
* no enabled weekdays
* ON time unset
* OFF time unset
* ON command blank
* OFF command blank

Until all required values are configured, the schedule is treated as **not configured** and autonomous mode will not activate.

## Schedule Time Format

**CV302** and **CV303** use a strict UTC `HH:MM` format.

Valid examples:

```text
CV302=08:30
CV303=17:45
```

Rules:

* exactly two digits for hour
* exactly two digits for minute
* `00:00` through `23:59`
* values are evaluated in **UTC**, not local time
* the current firmware requires **start time < end time**
* schedules that **cross midnight are not supported**

If the time string is malformed, the firmware returns `ERR:<command>`.

## Weekday Bitmask Format

**CV301** is a bitmask based on the firmware's UTC `tm_wday` numbering:

| Day | Bit Value |
| --- | ---: |
| Sunday | `1` |
| Monday | `2` |
| Tuesday | `4` |
| Wednesday | `8` |
| Thursday | `16` |
| Friday | `32` |
| Saturday | `64` |

Examples:

```text
CV301=62
```

Meaning:

* Monday through Friday enabled
* Sunday and Saturday disabled

```text
CV301=65
```

Meaning:

* Sunday and Saturday enabled
* Monday through Friday disabled

## Schedule Configuration Requirements

The firmware considers the schedule fully configured only when all of the following are true:

* **CV300=1**
* **CV301** contains at least one enabled day bit
* **CV302** is a valid UTC `HH:MM`
* **CV303** is a valid UTC `HH:MM`
* start time is **earlier than** stop time
* **CV304** is non-empty
* **CV305** is non-empty

If any of these checks fail, the schedule is considered invalid and autonomous mode will stay off.

## Autonomous Mode Window

Autonomous mode is reevaluated using current **UTC** system time.

It activates only when:

* system time is valid
* the schedule is fully configured
* the current UTC weekday is enabled in **CV301**
* the current UTC minute-of-day is within:

  * `CV302 - 2 minutes`
  * through `CV303 + 2 minutes`

This means autonomous mode uses a small **±2 minute extension window** around the configured ON/OFF times.

Important distinction:

* the **autonomous-mode eligibility window** uses the ±2 minute extension
* the configured **ON/OFF commands themselves** still fire only at the **exact configured boundary minute**

## Scheduled Command Execution

The firmware continuously evaluates schedule boundaries in the main loop using **UTC** time.

When a boundary is crossed on an enabled weekday:

* the command stored in **CV304** is executed at the exact ON boundary
* the command stored in **CV305** is executed at the exact OFF boundary

Scheduled commands are executed through the normal command-processing pipeline, but:

* replies are suppressed during internally scheduled execution
* scheduled execution is marked internally so the firmware can distinguish it from external user commands

## BLE / Disconnect Behavior During Autonomous Mode

While autonomous mode is active:

* BLE disconnect grace countdown does not start
* BLE grace processing exits early
* BLE hard-recovery escalation is suppressed
* a deferred reboot after safe stop is canceled if autonomous mode becomes active

When autonomous mode exits, normal disconnected grace behavior can resume if the system is disconnected and a handshake had previously been established.

## Example Schedule

Example: weekdays, 08:00 UTC start, 17:00 UTC stop, forward at start and quick-stop at end.

```text
CV300=1
CV301=62
CV302=08:00
CV303=17:00
CV304=F50
CV305=FQ
```

In this example:

* the schedule is active Monday through Friday
* autonomous mode becomes eligible from **07:58 UTC** through **17:02 UTC**
* `F50` is executed at exactly **08:00 UTC**
* `FQ` is executed at exactly **17:00 UTC**


---

# Function Output CVs (CV150+)

The firmware supports **12 function outputs** with per-function configuration.

Each function occupies a **7-CV block**. In firmware **1.12.1**, the first **five** CVs in each block are implemented:

| Function | Name CV | Pin CV | Pattern CV | Direction CV | AppFlags CV |
| -------- | ------- | ------ | ---------- | ------------ | ----------- |
| **FX1**  | CV150   | CV151  | CV152      | CV153        | CV154       |
| **FX2**  | CV157   | CV158  | CV159      | CV160        | CV161       |
| **FX3**  | CV164   | CV165  | CV166      | CV167        | CV168       |
| **FX4**  | CV171   | CV172  | CV173      | CV174        | CV175       |
| **FX5**  | CV178   | CV179  | CV180      | CV181        | CV182       |
| **FX6**  | CV185   | CV186  | CV187      | CV188        | CV189       |
| **FX7**  | CV192   | CV193  | CV194      | CV195        | CV196       |
| **FX8**  | CV199   | CV200  | CV201      | CV202        | CV203       |
| **FX9**  | CV206   | CV207  | CV208      | CV209        | CV210       |
| **FX10** | CV213   | CV214  | CV215      | CV216        | CV217       |
| **FX11** | CV220   | CV221  | CV222      | CV223        | CV224       |
| **FX12** | CV227   | CV228  | CV229      | CV230        | CV231       |

The remaining two offsets inside each 7-CV block currently return `ERR`.

**NOTE**: When a pin is turned on with an FX command it will output a constant (Non-PWM) ~3.3v. If you are hooking an LED to it you will **NOT** need a resistor inline with the LED. If your LED is dim check for an inline resistor and remove it.

---

# Function CV Field Definitions

## Name CVs

Examples:

```text
CV150=Headlight
CV157=ReverseLgt
CV164=CabLight
```

These store the function label.

**Factory defaults:**

* FX1 = `Headlight`
* FX2 = `ReverseLgt`
* FX3 = `FX3`
* FX4 = `FX4`
* FX5 = `FX5`
* FX6 = `FX6`
* FX7 = `FX7`
* FX8 = `FX8`
* FX9 = `FX9`
* FX10 = `FX10`
* FX11 = `FX11`
* FX12 = `FX12`

---

## Pin CVs

Examples:

```text
CV151=4
CV158=5
```

Pin `0` means **unassigned**.

The pin must be in the firmware’s allowed runtime GPIO list.

---

## Pattern CVs

Allowed values:

```text
SOLID
DBL_BLNK
FRED
BLINK+
BLINK-
```

Examples:

```text
CV152=SOLID
CV159=FRED
CV166=BLINK+
```

Notes:

* If a function pattern has **not yet been configured**, querying that pattern CV returns `ERR`
* `BLINK+` and `BLINK-` use the blink timing defined by **CV20**
* `SOLID`, `DBL_BLNK`, and `FRED` use firmware-defined timing/pattern behavior

---

## Direction CVs

Allowed values:

```text
BOTH
FWD
REV
```

Examples:

```text
CV153=FWD
CV160=REV
CV167=BOTH
```

**Factory defaults:**

* FX1 direction = `FWD`
* FX2 direction = `REV`
* FX3..FX12 direction = `BOTH`

Direction gating follows the locomotive direction state. When direction does not match, an active function output is forced off until direction becomes valid again.

---

## AppFlags CVs

Each function now has an **AppFlags** CV.

These are stored as an **unsigned 32-bit integer**.

Examples:

```text
CV154=0
CV161=1
CV168=32
```

Notes:

* Default value is `0` for all functions
* AppFlags values are persisted in NVS along with the other function settings
* The firmware accepts only valid unsigned 32-bit integer input for these CVs
* The firmware currently stores and reports AppFlags, but any app-side meaning depends on how the PMT application chooses to use those flag bits

---

# Function Runtime Commands

Function outputs are turned on and off with `FX` commands, not CV commands.

Format:

```text
FX<number>=0
FX<number>=1
```

Examples:

```text
FX1=1
FX1=0
FX2=1
```

Rules:

* Valid function numbers are `1 – 12`
* `FXn=1` activates the function
* `FXn=0` deactivates the function
* Activation fails unless the function has:

  * a non-zero assigned pin
  * a valid configured pattern
  * a runtime-valid output GPIO
  * a pin that is not already in use by another active function
  * a pin that is not the onboard status LED pin

If activation fails, the firmware returns `ERR:<command>`.

---

# WiFi and WebSocket Control

When **CV10=1**, the throttle enables a **secondary control interface over WiFi using WebSockets**.

This interface uses the **same command-processing path** as BLE.

BLE remains available independently, and the firmware tracks both BLE and socket connectivity.

---

# Control Priority / Connection Model

The firmware tracks control connections using:

* **BLE connected / disconnected**
* **WebSocket connected / disconnected**
* **WiFi connected / disconnected**

You can query connection status with:

```text
C?
```

Response format:

```text
CONN B<0|1> S<0|1> W<0|1>
```

Example:

```text
CONN B1 S0 W1
```

Meaning:

* `B1` = BLE connected
* `S0` = no active WebSocket client
* `W1` = WiFi connected

The firmware supports up to **two WebSocket client slots**.

---

# BLE Recovery / Disconnect Behavior

The current firmware includes a stronger BLE recovery path when the controller becomes disconnected and advertising does not recover correctly.

Behavior summary:

* After a BLE disconnect, the firmware still attempts normal advertising restart/recovery
* If the controller remains disconnected and advertising still has not recovered after the watchdog/retry logic, a **hard recovery escalation** can occur
* Hard recovery escalation forces a **quick stop** and defers reboot until the locomotive is safely stopped
* If a valid control connection returns before the stop completes, the deferred reboot is canceled
* If a **WebSocket control connection** is active, the firmware does **not** force a BLE hard-recovery reboot
* If **autonomous mode** is active, BLE disconnect grace and BLE hard-recovery escalation are suppressed until autonomous mode ends

This behavior is intended to make the throttle more resilient when BLE fails to resume normal advertising after a disconnect, while also allowing scheduled autonomous operation to continue without unnecessary recovery escalation.

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

```text
CV10=1
CV11=MyNetwork
CV12=MyPassword
CV13=81
```

---

# Obtaining the Device IP Address

After WiFi connects, the throttle obtains an IP address from the network.

You can retrieve it using:

```text
IP?
```

Response:

```text
IP:<address>
```

Example:

```text
IP:192.168.1.50
```

This address can be used to connect to the WebSocket server.

Example:

```text
ws://192.168.1.50:81
```

---

# WebSocket Behavior

* WebSocket is a **secondary / failover control path**
* WebSocket uses the **same command-processing path as BLE**
* Up to **two WebSocket clients** may be tracked
* WiFi/WebSocket startup uses **CV10**, **CV11**, **CV12**, and **CV13**
* `IP?` and `C?` can be used to inspect runtime network state

---

# Supported Motor Driver Boards

The firmware supports **four motor driver control interfaces**.

**Important:** Select the driver mode based on the board's control pins, not just the board family name.

---

# DUAL_PWM Motor Drivers

Typical control pins:

```text
RPWM
LPWM
R_EN
L_EN
```

Common compatible boards:

* IBT-2
* IBT-20
* BTS7960 modules
* BTS7960B modules
* BTN7960 / BTS7960 style dual-PWM drivers
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

```text
PWM
DIR
```

Compatible boards include:

* Cytron MD10C
* Cytron MD13S
* Cytron MD30C
* Cytron MDS40A

These drivers use a **single PWM speed input plus a dedicated direction pin**.

---

# PWM_BIDIR Motor Drivers

Typical control pins:

```text
EN / PWM
IN1
IN2
```

Compatible boards include:

* L298N
* L293D
* TB6612FNG
* DRV8871
* DRV8876
* MC33926
* MX1508
* SN754410

These drivers use **one PWM/enable pin plus separate forward/reverse logic pins**.

---

# DUAL_INPT Motor Drivers

Typical control pins:

```text
IN1
IN2
```

Compatible boards include:

* DRV8833

These drivers use **two motor-control inputs**, with the firmware swapping which input receives PWM based on direction.

---

# Wiring Summary

Choose the motor driver mode based on the board's control interface:

* `DUAL_PWM` = separate forward and reverse PWM inputs
* `PWM_DIR` = one PWM pin and one direction pin
* `PWM_BIDIR` = one PWM/enable pin and separate forward/reverse logic pins
* `DUAL_INPT` = two H-bridge inputs, with PWM applied to input A in one direction and input B in the other

---

# Floor and Ceiling Behavior

Throttle commands use **mapped values from 0–100**.

The firmware converts these into **actual hardware output** using CV2 and CV3.

Important behavior details:

* `CV2` sets the **hardware floor**
* `CV3` sets the **hardware ceiling**
* `CV3=0` means **no ceiling cap**, which behaves the same as `100`
* If floor equals ceiling, any non-zero mapped throttle produces a fixed hardware output at that level
* The firmware maps **mapped throttle 1..100** into **hardware output floor..ceiling**

Example configuration:

```text
CV2=20
CV3=70
```

Approximate result:

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

```text
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
* Use **CV20** when tuning phase-based auxiliary light blinking
* Configure function outputs with **pin + pattern + direction** before trying `FXn=1`
* Set **AppFlags** CVs only if your PMT app build uses them
* Configure motor pins only with allowed runtime GPIOs
* For `DUAL_INPT`, wire the driver to **CV104** and **CV105**
* Use **CV300–CV305** only after system UTC time is being maintained correctly
* Choose **CV304** and **CV305** carefully, because only those exact normalized commands are allowed without handshake during autonomous mode
* Do not configure schedules that need to cross midnight; the current firmware requires `CV302 < CV303`
* Enable WiFi (**CV10**) only when needed
* Use **CV8** after major hardware or configuration changes
