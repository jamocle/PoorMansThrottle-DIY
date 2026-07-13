# Poor Man's Throttle (PMT) – CV Configuration Reference

**Firmware Version:** 2.0.0  
**Platform:** ESP32 PMT device firmware: Throttle, Module, and Turbine

---

# Overview

Poor Man's Throttle firmware uses **Configuration Variables (CVs)** to store device settings such as device name, Wi-Fi/WebSocket settings, battery telemetry, low-voltage behavior, schedules, throttle motor-driver settings, function outputs, and turbine output settings.

CVs are read and modified through the **Terminal** inside the PMT application. They can be sent over the active command transport, such as **BLE** or **Wi-Fi/WebSocket**, when that transport is connected and the device accepts commands.

Most CV values are persisted in ESP32 non-volatile storage, so they survive power-off and reboot.

**Exception:** `CV8` is a factory-reset trigger. It is not stored as a normal setting.

---

# Device Scope

PMT firmware 2.0.0 is shared across more than one device type. Some CVs are shared, while others only apply to a specific firmware image.

| Device Type | Meaning |
| --- | --- |
| **Throttle** | Locomotive throttle controller firmware. Controls a motor driver and optional function outputs. |
| **Module** | Shared PMT module firmware foundation. Uses the shared communication, identity, Wi-Fi, schedule, and telemetry configuration foundation. |
| **Turbine** | ESC-style output firmware for turbine, fan, smoke, blower, or similar accessory output. |

**Important:** The same CV number can have a different meaning in different firmware images. For example, `CV5` is direction inversion on a Throttle, but quick-output percentage on a Turbine. Always use the table for the firmware installed on that ESP32.

---

# Using the PMT Terminal

1. Open the **PMT application**.
2. Connect to the PMT device.
3. Let the app complete the normal device handshake.
4. Open the **Terminal**.
5. Enter the desired command.
6. Press **Send**.

The device will respond with either the current value, a confirmation, or an error.

---

# CV Command Format

## Query a CV

```text
CV<number>?
```

Example:

```text
CV2?
```

Typical response:

```text
A:CV2=0
```

---

## Set a CV

```text
CV<number>=<value>
```

Example:

```text
CV2=25
```

Typical response:

```text
A:CV2=25
```

---

# Important Notes

* Invalid CV values return `ERR:<command>`.
* Most CV changes are saved automatically after a short delay.
* Some CV changes reinitialize network services, telemetry services, outputs, or pins.
* Pin CVs accept only the firmware's allowed runtime GPIO list.
* Wi-Fi password `CV12` is **set-only**. Querying it returns `ERR`.
* Querying unset schedule values such as `CV302?`, `CV303?`, `CV304?`, or `CV305?` can return `ERR` until those values are configured.
* `CV8=8` wipes saved configuration and reboots the device.
* Use the app configuration screens when available. The terminal is best for advanced setup, recovery, diagnostics, and features not exposed in the UI.

---

# Availability Legend

| Availability | Meaning |
| --- | --- |
| **All** | Shared CV available on Throttle, Module, and Turbine firmware. |
| **Throttle** | Available only on locomotive throttle firmware. |
| **Turbine** | Available only on PoorMansTurbine firmware. |
| **Module** | Available only on module firmware. In 2.0.0, Module uses the shared CV set and has no module-specific CVs in this appendix. |

---

# Shared CVs

These CVs are part of the shared PMT firmware foundation.

| CV | Availability | Purpose | Values / Default | Description |
| ---: | --- | --- | --- | --- |
| **CV4** | All | Device / Component Name | Text / blank | Sets the device name used for identity and advertising. For a throttle, this is normally the train name shown by the app. |
| **CV8** | All | Factory Reset Trigger | Must write `8` | `CV8=8` wipes saved configuration and reboots the ESP32. Not persisted as a normal setting. |
| **CV10** | All | Wi-Fi Enable | `0`, `1` / `0` | Enables or disables Wi-Fi/WebSocket service when configured. |
| **CV11** | All | Wi-Fi SSID | Text / blank | Wi-Fi network name. |
| **CV12** | All | Wi-Fi Password | Text / blank | Set-only from the terminal. Query returns `ERR`. |
| **CV13** | All | WebSocket Port | `1 – 65535` / `81` | WebSocket server port. |
| **CV14** | All | UTC Offset | `-24` to `+24` hours / `0` | Stored time offset from UTC. Supports whole hours and one decimal place, such as `-5`, `+1`, or `+5.5`. |
| **CV20** | All | LED Blink Timing | `<periodMs>,<onMs>` / `1000,250` | Blink timing used by `BLINK+` and `BLINK-` style LED outputs. `periodMs` must be `1 – 60000`; `onMs` must be `1 – periodMs`. |
| **CV30** | All | INA219 Enable | `0`, `1` / `0` | Enables or disables optional INA219 battery telemetry. Disabled by default. |
| **CV31** | All where pin adapter exists | INA219 SDA Pin | Allowed runtime GPIO / `21` | I²C SDA pin used by the INA219. |
| **CV32** | All where pin adapter exists | INA219 SCL Pin | Allowed runtime GPIO / `22` | I²C SCL pin used by the INA219. |
| **CV33** | All | INA219 I²C Address | `64 – 79` / `64` | Decimal I²C address. `64` corresponds to `0x40`. |
| **CV34** | All | INA219 Sample Interval | `50 – 60000 ms` / `500` | How often the firmware samples INA219 measurements. |
| **CV35** | All | INA219 Publish Interval | `100 – 60000 ms` / `10000` | How often battery telemetry is published while enabled. |
| **CV36** | All | Low-Voltage Warn Threshold | `0 – 50000 mV` / `0` | Warning threshold. `0` disables this threshold. |
| **CV37** | All | Low-Voltage Limit Threshold | `0 – 50000 mV` / `0` | Threshold that activates output limiting. `0` disables this threshold. |
| **CV38** | All | Low-Voltage Shutdown Threshold | `0 – 50000 mV` / `0` | Threshold that forces shutdown/stop behavior. `0` disables this threshold. |
| **CV39** | All | Recovery Threshold | `0 – 50000 mV` / `0` | Hysteresis threshold used to recover from low-voltage states. `0` disables automatic recovery. |
| **CV40** | All | Disconnect Threshold | `0 – 50000 mV` / `1000` | Threshold used to infer a disconnected or collapsed battery/supply. `0` disables this threshold. |
| **CV42** | All where pin adapter exists | Low-Voltage LED Pin | Allowed runtime GPIO or `0` / `0` | Optional LED output used to indicate low-voltage state. `0` means unassigned. |
| **CV300** | All | Schedule Enable | `0`, `1` / `0` | Enables or disables scheduled operation. |
| **CV301** | All | Schedule Weekday Bitmask | `1 – 127` / `0` | Day mask using Sunday=`1`, Monday=`2`, Tuesday=`4`, Wednesday=`8`, Thursday=`16`, Friday=`32`, Saturday=`64`. |
| **CV302** | All | Schedule ON Time | Strict `HH:MM` UTC / unset | Scheduled ON boundary time. Query returns `ERR` when unset. |
| **CV303** | All | Schedule OFF Time | Strict `HH:MM` UTC / unset | Scheduled OFF boundary time. Query returns `ERR` when unset. |
| **CV304** | All | Schedule ON Command | Command text / blank | Command executed at the scheduled ON boundary. Query returns `ERR` when blank. |
| **CV305** | All | Schedule OFF Command | Command text / blank | Command executed at the scheduled OFF boundary. Query returns `ERR` when blank. |

---

# Throttle-Specific CVs

These CVs apply to **Poor Man's Throttle locomotive controller firmware**.

| CV | Purpose | Values / Default | Description |
| ---: | --- | --- | --- |
| **CV1** | Motor Driver Mode | `DUAL_PWM`, `PWM_DIR`, `PWM_BIDIR`, `DUAL_INPT` / `DUAL_PWM` | Selects the motor-driver control style. |
| **CV2** | Minimum Start / Floor | `0 – 100` / `0` | Minimum hardware output when a non-zero mapped throttle is commanded. |
| **CV3** | Maximum Output / Ceiling | `0 – 100` / `100` | Caps maximum motor output. `0` means no ceiling cap, which behaves as `100`. |
| **CV5** | Direction Inversion | `0`, `1` / `0` | Reverses motor direction logic. |
| **CV6** | Async Notify, Steady | `50 – 10000 ms` / `10000` | State update interval when throttle is steady. |
| **CV7** | Async Notify, Changing | `50 – 10000 ms` / `500` | State update interval while throttle is changing or ramping. |
| **CV9** | Kick Configuration | `<throttle>,<ms>,<rampDownMs>,<maxApply>` / `0,0,80,15` | Start-assist kick used when starting from stop at low throttle. |
| **CV41** | Low-Voltage Throttle Cap | `0 – 100` / `25` | Maximum allowed mapped throttle while low-voltage limiting is active. |
| **CV100** | Dual PWM Forward Pin | Allowed runtime GPIO / `25` | Forward PWM pin for `DUAL_PWM`. |
| **CV101** | Dual PWM Reverse Pin | Allowed runtime GPIO / `26` | Reverse PWM pin for `DUAL_PWM`. |
| **CV102** | Dual PWM Enable A | Allowed runtime GPIO / `27` | Enable pin A for `DUAL_PWM`. |
| **CV103** | Dual PWM Enable B | Allowed runtime GPIO / `33` | Enable pin B for `DUAL_PWM`. |
| **CV104** | Two-Pin A | Allowed runtime GPIO / `25` | Shared two-pin control input A. Used as PWM in `PWM_DIR` and as input A in `DUAL_INPT`. |
| **CV105** | Two-Pin B | Allowed runtime GPIO / `26` | Shared two-pin control input B. Used as direction in `PWM_DIR` and as input B in `DUAL_INPT`. |
| **CV106** | PWM_BIDIR PWM / Enable Pin | Allowed runtime GPIO / `25` | PWM/enable pin for `PWM_BIDIR`. |
| **CV107** | PWM_BIDIR Forward Pin | Allowed runtime GPIO / `26` | Forward logic pin for `PWM_BIDIR`. |
| **CV108** | PWM_BIDIR Reverse Pin | Allowed runtime GPIO / `27` | Reverse logic pin for `PWM_BIDIR`. |

---

# Turbine-Specific CVs

These CVs apply to **PoorMansTurbine firmware**. They are not locomotive motor-driver CVs.

| CV | Purpose | Values / Default | Description |
| ---: | --- | --- | --- |
| **CV2** | Minimum Turbine Output | `0 – 100` / `0` | Minimum physical output percentage used by turbine output mapping. Must not exceed `CV3`. |
| **CV3** | Full Turbine Output | `1 – 100` / `100` | Physical output percentage used when requested output is full. Must not be lower than `CV2`. |
| **CV5** | Quick Output | `0 – 100` / `0` | Output percentage used by the `FQ100` quick-blast command. |
| **CV9** | Ramp to Full Output Time | `100 – 60000 ms` / `4000` | Time used to ramp from zero to full output. |
| **CV41** | Low-Voltage Output Cap | `0 – 100` / `25` | Maximum turbine output while low-voltage limiting is active. |
| **CV100** | ESC PWM Pin | Allowed runtime GPIO / `25` | PWM signal pin for ESC-style output. |

## Turbine Runtime Commands

Turbine output is controlled with `F` commands, not locomotive throttle commands.

| Command | Meaning |
| --- | --- |
| `F?` | Query requested turbine output. |
| `F<n>` | Ramp turbine output to `0 – 100`. |
| `F<n>*` | Immediately set requested turbine output to `0 – 100`. |
| `FQ100` | Run a timed quick-blast using the configured quick output, then return to the requested output. |

---

# Module-Specific CVs

In firmware 2.0.0, **PoorMansModule** uses the shared CV foundation and does not add its own separate module-specific CV block in this appendix.

Use the **Shared CVs** table for Module configuration.

---

# Allowed GPIOs for Runtime Pin Assignment

The firmware does **not** accept every ESP32 GPIO for runtime pin assignment.

The currently allowed runtime output/PWM GPIO list is:

```text
0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33
```

If a pin value outside the allowed list is written to a pin CV, the firmware returns `ERR:<command>`.

**Builder note:** Even if firmware allows a pin, confirm the physical ESP32 development board exposes that pin safely for your hardware. Some ESP32 pins have boot, flash, serial, or board-specific behavior.

---

# INA219 Telemetry and Protection

The optional INA219 subsystem can provide:

* bus-voltage measurement
* current measurement
* power measurement
* battery-disconnected detection
* low-voltage warning
* output limiting
* shutdown and recovery behavior
* compact telemetry publishing to the app

The INA219 is the **sensor**. The warning, limiting, shutdown, recovery, and LED behavior are firmware policy built around the sensor readings.

## INA219 Defaults

| Setting | Default |
| --- | ---: |
| INA219 enabled | `0` / disabled |
| SDA | `21` |
| SCL | `22` |
| I²C address | `64` (`0x40`) |
| Sample interval | `500 ms` |
| Publish interval | `10000 ms` |
| Warn threshold | `0` |
| Limit threshold | `0` |
| Shutdown threshold | `0` |
| Recovery threshold | `0` |
| Disconnect threshold | `1000 mV` |
| Low-voltage output cap | `25%` on Throttle/Turbine where supported |
| Low-voltage LED pin | `0` / unassigned |

## INA219 Async Telemetry Format

When telemetry publishing is active, firmware can emit compact telemetry lines:

```text
TV:<millivolts>
TI:<milliamps>
TP:<milliwatts>
TF:<LED><BAT><WARN><LIM><SD>
```

Status bit order in `TF:` is:

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

These are **starting-point recommendations**, not absolute battery-protection rules. Actual safe thresholds depend on battery chemistry, cell count, wiring loss under load, BMS behavior, and voltage sag under real locomotive load.

| Battery / Supply Type | Typical Pack Range | CV36 Warn | CV37 Limit | CV38 Shutdown | CV39 Recovery | CV40 Disconnect | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 3S Li-ion / LiPo | 12.6V full, ~9.0V near empty | `10200` | `9600` | `9300` | `10500` | `6000` | Starting point for small 12V-class lithium packs. |
| 4S Li-ion / LiPo | 16.8V full, ~12.0V near empty | `13600` | `12800` | `12400` | `14000` | `8000` | Common for 16V / 18V-class packs. |
| 5S Li-ion / LiPo | 21.0V full, ~15.0V near empty | `17000` | `16000` | `15500` | `17500` | `10000` | Useful for higher-voltage tool-battery style packs. |
| 4S LiFePO4 | 14.6V full, ~10.0V near empty | `12400` | `12000` | `11600` | `12800` | `8000` | LiFePO4 holds voltage flat; field tuning is important. |
| 12V SLA / AGM / Gel | ~12.7V full, ~11.0V very low | `11800` | `11400` | `11100` | `12300` | `9000` | Conservative starting point for sealed lead-acid packs. |
| 12-cell NiMH | ~16.8V fresh, ~12.0V under load late in discharge | `12600` | `11800` | `11000` | `13200` | `8000` | NiMH sag varies with load, age, and temperature. |
| Bench / regulated DC supply | Fixed supply | `0` | `0` | `0` | `0` | `0` | Leave policy thresholds off unless you specifically want telemetry-based behavior. |

## Suggested Tuning Order

1. Start with **CV36** warning only.
2. Add **CV37** limiting if you want reduced output before shutdown.
3. Add **CV38** shutdown only after validating behavior under real train or turbine load.
4. Set **CV39** above shutdown if you want automatic recovery hysteresis.
5. Leave **CV39=0** if you do not want automatic recovery.
6. Add **CV40** only after you understand your pack's worst-case voltage sag.

---

# Scheduling / Autonomous Operation

The schedule subsystem allows supported firmware to run configured commands at configured UTC times on selected days.

## Schedule Requirements

A schedule is considered fully configured only when all of the following are true:

* `CV300=1`
* `CV301` contains at least one enabled day bit
* `CV302` is a valid UTC `HH:MM`
* `CV303` is a valid UTC `HH:MM`
* `CV302` is earlier than `CV303`
* `CV304` is non-empty
* `CV305` is non-empty

Schedules that cross midnight are not supported in this firmware generation.

## Weekday Bitmask

| Day | Bit Value |
| --- | ---: |
| Sunday | `1` |
| Monday | `2` |
| Tuesday | `4` |
| Wednesday | `8` |
| Thursday | `16` |
| Friday | `32` |
| Saturday | `64` |

Example:

```text
CV301=62
```

Meaning: Monday through Friday.

## Example Throttle Schedule

```text
CV300=1
CV301=62
CV302=08:00
CV303=17:00
CV304=F50
CV305=FQ0
```

In this example:

* schedule is enabled Monday through Friday
* `F50` runs at 08:00 UTC
* `FQ0` runs at 17:00 UTC

## Example Turbine Schedule

```text
CV300=1
CV301=65
CV302=10:00
CV303=10:30
CV304=F75
CV305=F0
```

In this example:

* schedule is enabled Saturday and Sunday
* turbine output ramps to 75 at 10:00 UTC
* turbine output ramps to 0 at 10:30 UTC

---

# Function Output CVs (Throttle Only)

Throttle firmware supports **12 function outputs** with per-function configuration.

Each function uses a 7-CV block. In firmware 2.0.0, the first five CVs in each block are implemented.

| Function | Name CV | Pin CV | Pattern CV | Direction CV | AppFlags CV |
| --- | ---: | ---: | ---: | ---: | ---: |
| **FX1** | 150 | 151 | 152 | 153 | 154 |
| **FX2** | 157 | 158 | 159 | 160 | 161 |
| **FX3** | 164 | 165 | 166 | 167 | 168 |
| **FX4** | 171 | 172 | 173 | 174 | 175 |
| **FX5** | 178 | 179 | 180 | 181 | 182 |
| **FX6** | 185 | 186 | 187 | 188 | 189 |
| **FX7** | 192 | 193 | 194 | 195 | 196 |
| **FX8** | 199 | 200 | 201 | 202 | 203 |
| **FX9** | 206 | 207 | 208 | 209 | 210 |
| **FX10** | 213 | 214 | 215 | 216 | 217 |
| **FX11** | 220 | 221 | 222 | 223 | 224 |
| **FX12** | 227 | 228 | 229 | 230 | 231 |

The remaining two offsets inside each 7-CV block are reserved and return `ERR`.

## Function Name CVs

Examples:

```text
CV150=Headlight
CV157=ReverseLgt
CV164=CabLight
```

Factory defaults:

* FX1 = `Headlight`
* FX2 = `ReverseLgt`
* FX3 through FX12 = `FX3` through `FX12`

## Function Pin CVs

Examples:

```text
CV151=4
CV158=5
```

Pin `0` means **unassigned**.

## Function Pattern CVs

Allowed values:

```text
SOLID
DBL_BLNK
FRED
BLINK+
BLINK-
```

`BLINK+` and `BLINK-` use the timing configured by `CV20`.

## Function Direction CVs

Allowed values:

```text
BOTH
FWD
REV
```

Factory defaults:

* FX1 direction = `FWD`
* FX2 direction = `REV`
* FX3 through FX12 direction = `BOTH`

## AppFlags CVs

AppFlags values are stored as unsigned 32-bit integers.

Examples:

```text
CV154=0
CV161=1
CV168=32
```

The firmware stores and reports AppFlags. Any app-side meaning depends on how the PMT app chooses to use those flags.

## Function Runtime Commands

Function outputs are turned on and off with `FX` commands, not CV commands.

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

* valid function numbers are `1 – 12`
* `FXn=1` activates the function
* `FXn=0` deactivates the function
* activation requires a non-zero pin, valid pattern, valid GPIO, and no conflicting active use of the pin

**Electrical note:** ESP32 GPIO pins are low-current logic outputs. Use appropriate resistors, drivers, transistors, MOSFETs, or LED modules for your load. Do not assume a GPIO pin can safely power an LED, lamp, relay, smoke unit, or accessory directly.

---

# Wi-Fi and WebSocket Control

When `CV10=1`, supported PMT firmware enables Wi-Fi/WebSocket service using the saved SSID, password, and port.

Wi-Fi/WebSocket uses the same command-processing path as BLE. It is a second transport layer, not a separate command language.

## Wi-Fi Setup Example

```text
CV10=1
CV11=MyNetwork
CV12=MyPassword
CV13=81
```

## Query Device IP Address

```text
IP?
```

Example response:

```text
IP:192.168.1.50
```

## Query Connection State

```text
C?
```

Example response:

```text
CONN B1 S0 W1
```

Meaning:

* `B1` = BLE connected
* `S0` = no active WebSocket client
* `W1` = Wi-Fi connected

---

# Time Commands

Schedules depend on device time.

## Query Current Time

```text
T?
```

If time is not established, the device can return:

```text
ERR:No NTP
```

## Manually Set Current Time

```text
T=<unixTime>
```

Example:

```text
T=1767225600
```

The value is a positive Unix timestamp. `CV14` is used as the stored offset from UTC.

---

# Resetting Configuration

```text
CV8=8
```

This will:

1. Stop or safe the device as appropriate for the installed firmware.
2. Clear saved configuration.
3. Reboot the ESP32.

Use this after major hardware changes, incorrect pin assignments, or when you need to return the device to factory defaults.

---

# Best Practices

* Use the app configuration screens first when they cover the setting you need.
* Confirm which firmware is installed before changing CVs.
* Do not apply Throttle CV meanings to Turbine firmware or Turbine CV meanings to Throttle firmware.
* Change pin CVs carefully. Wrong pin settings can make hardware appear dead or behave unexpectedly.
* Configure one feature at a time, then test it.
* For throttle builds, set `CV2` so the locomotive just begins to move and set `CV3` to limit unsafe top speed.
* For turbine builds, calibrate and verify the ESC/output behavior before using high output values.
* For INA219 battery protection, start with warning only before enabling limit or shutdown behavior.
* For scheduled operation, verify time first using `T?` and avoid schedules that cross midnight.
* For function outputs, use appropriate external components for the load being controlled.
