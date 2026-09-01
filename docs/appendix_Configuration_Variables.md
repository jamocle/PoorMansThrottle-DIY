# Poor Man's Throttle (PMT) – CV Configuration Reference

**Firmware Version:** 3.0.0
**Platform:** ESP32 PMT device firmware: Throttle, Module, and Turbine

---

# Overview

Poor Man's Throttle firmware uses **Configuration Variables (CVs)** to store device settings such as device name, Wi-Fi/WebSocket settings, battery telemetry, low-voltage behavior, schedules, throttle motor-driver settings, function outputs, and turbine output settings.

CVs are read and modified through the **Terminal** inside the PMT application. They can be sent over the active command transport, such as **BLE** or **Wi-Fi/WebSocket**, when that transport is connected and the device accepts commands.

Most CV values are persisted in ESP32 non-volatile storage, so they survive power-off and reboot.

**Exception:** `CV8` is a factory-reset trigger. It is not stored as a normal setting.

---

# Device Scope

PMT firmware 3.0.0 is shared across more than one device type. Some CVs are shared, while others only apply to a specific firmware image.

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
* `PS1` enables persist-only staging: valid CV writes are saved but not applied live. `PS0` leaves staging mode, but already staged values still require a reboot before they take effect. Use `PS?` to check the mode.
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
| **Module** | Available only on module firmware. In firmware 3.0.0, Module uses the shared CV set and has no module-specific CVs in this appendix. |

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
| **CV31** | All where pin adapter exists | INA219 SDA Pin | Classic `16`; S3 `17` | I²C SDA pin used by the INA219. |
| **CV32** | All where pin adapter exists | INA219 SCL Pin | Classic `17`; S3 `18` | I²C SCL pin used by the INA219. |
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
| **CV301** | All | Schedule Weekday Bitmask | `0 – 127` / `0` | Day mask using Sunday=`1`, Monday=`2`, Tuesday=`4`, Wednesday=`8`, Thursday=`16`, Friday=`32`, Saturday=`64`. |
| **CV302** | All | Schedule ON Time | Strict `HH:MM` / unset | Scheduled ON boundary on the **CV14-adjusted firmware clock**. Query returns `ERR` when unset. |
| **CV303** | All | Schedule OFF Time | Strict `HH:MM` / unset | Scheduled OFF boundary on the **CV14-adjusted firmware clock**. Query returns `ERR` when unset. |
| **CV304** | All | Schedule ON Command | Command text / blank | Command executed at the scheduled ON boundary. Query returns `ERR` when blank. |
| **CV305** | All | Schedule OFF Command | Command text / blank | Command executed at the scheduled OFF boundary. Query returns `ERR` when blank. |

## Shared Audio CVs

The `CV400–CV429` bank is stored by the shared CV layer. On a locomotive Throttle, these CVs configure PMTPlayer audio. Module and Turbine firmware can store the shared values, but that does not create locomotive sound playback.

| CV | Purpose | Values / Default | What it means |
| ---: | --- | --- | --- |
| **CV400** | Audio Enable | `0`, `1` / `0` | `0` disables audio; `1` enables it. |
| **CV401** | PMTPlayer Sound Mode | `0`, `2`, `3` / `2` | `0=None`, `2=Diesel`, `3=Steam`. For PMTPlayer, select `2` or `3` before changing custom audio pins or tuning values. |
| **CV402** | Master Volume | `0..30` / `15` | Overall PMTPlayer volume. |
| **CV403** | SD Chip Select (CS) | Classic `21`; S3 `10` | GPIO used for the microSD CS signal. |
| **CV404** | SD SCK | Classic `-1`; S3 `11` | **Classic `-1` means use the Arduino/core default SPI SCK, effective GPIO18.** |
| **CV405** | SD MISO | Classic `-1`; S3 `8` | **Classic `-1` means use the Arduino/core default SPI MISO, effective GPIO19.** |
| **CV406** | SD MOSI | Classic `-1`; S3 `9` | **Classic `-1` means use the Arduino/core default SPI MOSI, effective GPIO23.** |
| **CV407** | I2S BCLK | Classic `13`; S3 `12` | Bit-clock pin to the MAX98357A amplifier. |
| **CV408** | I2S LRCLK / WS | Classic `12`; S3 `13` | Left/right word-clock pin to the MAX98357A amplifier. |
| **CV409** | I2S DIN | `14` | Digital-audio data pin to the MAX98357A amplifier. |
| **CV410** | Default Audio Priority | `0..100` / `30` | Default priority for audio requests. |
| **CV411** | Conflict Policy | `0..2` / `1` | `0=IgnoreLowerPriority`, `1=InterruptThenResume`, `2=ReplaceSameGroup`. |
| **CV412** | Startup Delay | `0..10000 ms` / `0` | Delay after audio startup. |
| **CV413** | Shutdown Delay | `0..10000 ms` / `0` | Delay before audio shutdown completes. |
| **CV414** | Amplifier Enable Pin | `-1` or valid output GPIO / `-1` | Optional amplifier enable control. |
| **CV415** | Amplifier Mute Pin | `-1` or valid output GPIO / `-1` | Optional amplifier mute control. |
| **CV416** | Amplifier Standby Pin | `-1` or valid output GPIO / `-1` | Optional amplifier standby control. |
| **CV417** | Fault Input Pin | `-1` or valid input GPIO / `-1` | Optional amplifier fault/status input. |
| **CV418** | PMTPlayer Profile | `0..3` / `3` | `0=Conservative`, `1=Balanced`, `2=Loud`, `3=use the explicit advanced CV values below. |
| **CV419** | WAV Gain | `1..12` / `1` | PMTPlayer WAV gain. |
| **CV420** | Output Headroom | `50..100%` / `100` | Output headroom percentage. |
| **CV421** | Limiter / Loudness Mode | `0..10` / `10` | PMTPlayer limiter/loudness setting. |
| **CV422** | Speaker Size Profile | `0..2` / `2` | `0=large`, `1=medium`, `2=small`. |
| **CV423** | Maximum Active Voices | `0..255` / board default | `0` means use the board default; current defaults are Classic `3`, S3 `13`. |
| **CV424** | Overlap Mode | effective `0..2` / `1` | PMTPlayer overlap behavior. |
| **CV425** | Async Overlap Start | `0`, `1` / `1` | Enables asynchronous overlap start. |
| **CV426** | Start Prime Bytes | `0..16384` / `12288` | Initial audio-buffer priming target. |
| **CV427** | Overlap Prime Bytes | `0..16384` / `0` | Overlap-stream priming target. |
| **CV428** | Mixer Attenuation | `25..100%` / `100` | Mixer attenuation percentage. |
| **CV429** | Clip Telemetry | `0`, `1` / `1` stored | Diagnostic request. Normal non-verbose builds force the effective runtime behavior off. |

### Classic `-1` SPI sentinel behavior

For Classic ESP32-WROOM PMTPlayer, `CV404`, `CV405`, and `CV406` intentionally store `-1`. In `PmtCardReader`, explicit `SPI.begin(sck, miso, mosi, cs)` remapping occurs only when **all three values are non-negative**. With the Classic `-1/-1/-1` defaults, PMT leaves the global Arduino `SPI` bus on its core defaults and opens the SD card using the configured chip-select pin.

| CV | Stored Classic default | Effective Classic pin |
|---:|---:|---:|
| `CV404` | `-1` | SCK `GPIO18` |
| `CV405` | `-1` | MISO `GPIO19` |
| `CV406` | `-1` | MOSI `GPIO23` |

The `-1` values mean **use the Arduino/core default SPI mapping**, not “no SD connection.”

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
| **CV43** | Locomotive Background Audio | `0`, `1` / `0` | Enables automatic locomotive background sound such as prime-mover or steam background behavior when PMTPlayer audio is enabled. |
| **CV98** | Steam Chuff-Rate Curve, Low-Speed Anchors | 12 digits / `010510152025` | Six two-digit cadence values for speeds `1,5,10,15,20,25%`. `01..99` means 1..99%; `00` means 100%. |
| **CV99** | Steam Chuff-Rate Curve, High-Speed Anchors | 12 digits / `355065809000` | Six two-digit cadence values for speeds `35,50,65,80,90,100%`. Firmware interpolates between anchors. These values change chuff cadence, not locomotive speed. |
| **CV100** | Dual PWM Forward Pin | Classic `25`; S3 `6` | Forward PWM pin for `DUAL_PWM`. |
| **CV101** | Dual PWM Reverse Pin | Classic `26`; S3 `7` | Reverse PWM pin for `DUAL_PWM`. |
| **CV102** | Dual PWM Enable A | Classic `27`; S3 `4` | Enable pin A for `DUAL_PWM`. |
| **CV103** | Dual PWM Enable B | Classic `33`; S3 `5` | Enable pin B for `DUAL_PWM`. |
| **CV104** | Two-Pin A | Classic `25`; S3 `6` | Shared two-pin control input A. Used as PWM in `PWM_DIR` and as input A in `DUAL_INPT`. |
| **CV105** | Two-Pin B | Classic `26`; S3 `7` | Shared two-pin control input B. Used as direction in `PWM_DIR` and as input B in `DUAL_INPT`. |
| **CV106** | PWM_BIDIR PWM / Enable Pin | Classic `25`; S3 `6` | PWM/enable pin for `PWM_BIDIR`. |
| **CV107** | PWM_BIDIR Forward Pin | Classic `27`; S3 `4` | Forward logic pin for `PWM_BIDIR`. |
| **CV108** | PWM_BIDIR Reverse Pin | Classic `33`; S3 `5` | Reverse logic pin for `PWM_BIDIR`. |

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

In firmware 3.0.0, **PoorMansModule** uses the shared CV foundation and does not add its own separate module-specific CV block in this appendix.

Use the **Shared CVs** table for Module configuration.

---

# Allowed GPIOs for Runtime Pin Assignment

Runtime pin validation is **board-profile specific**. Do not copy a Classic pin list onto an S3 build.

**Classic ESP32-WROOM output-capable runtime list:**

```text
0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33
```

**ESP32-S3-WROOM-1-N16R8 output-capable runtime list:**

```text
1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 33, 34, 38, 39, 40, 41, 42, 47
```

Different CVs can use different validation rules. For example, an input CV may accept an input-capable pin that an output CV does not.

If a pin value is not valid for that CV and board profile, the firmware returns `ERR:<command>`.

**Builder note:** Firmware acceptance does not guarantee a pin is convenient or safe for every attached board. Check the wiring guide for the selected PMT board profile before moving hardware pins.

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

| Setting | Classic ESP32-WROOM | ESP32-S3-WROOM-1-N16R8 |
| --- | ---: | ---: |
| INA219 enabled | `0` / disabled | `0` / disabled |
| SDA (`CV31`) | GPIO16 | GPIO17 |
| SCL (`CV32`) | GPIO17 | GPIO18 |
| I²C address | `64` (`0x40`) | `64` (`0x40`) |
| Sample interval | `500 ms` | `500 ms` |
| Publish interval | `10000 ms` | `10000 ms` |
| Warn threshold | `0` | `0` |
| Limit threshold | `0` | `0` |
| Shutdown threshold | `0` | `0` |
| Recovery threshold | `0` | `0` |
| Disconnect threshold | `1000 mV` | `1000 mV` |
| Low-voltage output cap | `25%` on Throttle/Turbine where supported | `25%` on Throttle/Turbine where supported |
| Low-voltage LED pin | `0` / unassigned | `0` / unassigned |

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

The schedule subsystem allows supported firmware to run configured commands at selected times and days using the **CV14-adjusted firmware clock**.

## Schedule Requirements

A schedule is considered fully configured only when all of the following are true:

* `CV300=1`
* `CV301` contains at least one enabled day bit
* `CV302` is a valid 24-hour `HH:MM`
* `CV303` is a valid 24-hour `HH:MM`
* `CV302` is earlier than `CV303`
* `CV304` is non-empty
* `CV305` is non-empty

Schedules that cross midnight are not supported in this firmware generation.

**How CV14 affects schedule time:** The device receives/sets a UTC epoch, applies the offset stored in `CV14`, and then evaluates `CV302`/`CV303` against that adjusted clock. If `CV14=0`, schedule times behave as raw UTC. If `CV14=-5`, a schedule time of `08:00` means 08:00 on the firmware's UTC-5 adjusted clock.

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
* `F50` runs at 08:00 on the CV14-adjusted firmware clock
* `FQ0` runs at 17:00 on the CV14-adjusted firmware clock

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
* turbine output ramps to 75 at 10:00 on the CV14-adjusted firmware clock
* turbine output ramps to 0 at 10:30 on the CV14-adjusted firmware clock

---

# Function Output CVs (Throttle Only)

Throttle firmware supports **12 function outputs** with per-function configuration.

Each function uses a 7-CV block. In firmware 3.0.0 revision 215, the first five CVs in each block are implemented; the last two positions remain reserved.

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

## Function Pin / Track CVs

The meaning of the function's pin CV depends on the selected pattern.

For a physical/LED pattern (`1..99`), the value is a GPIO number. `0` means unassigned.

Examples:

```text
CV151=4
CV158=5
```

For custom PMTPlayer audio patterns `103` and `104`, the same CV stores a **track number from 1..9999** instead of a GPIO.

Bell, horn, and cab-chatter patterns (`100`, `101`, `102`) do not need a physical FX GPIO.

## Function Pattern CVs

Current pattern values:

| Value | Meaning | Legacy text accepted |
|---:|---|---|
| `0` | None / unconfigured | — |
| `1` | LED solid | `SOLID`, `LED_SOLID` |
| `2` | LED double blink | `DBL_BLNK`, `LED_DBL_BLNK` |
| `3` | FRED | `FRED`, `LED_FRED` |
| `4` | LED blink+ | `BLINK+`, `LED_BLINK+` |
| `5` | LED blink- | `BLINK-`, `LED_BLINK-` |
| `100` | Audio bell | `AUDIO_BELL` |
| `101` | Audio horn | `AUDIO_HORN` |
| `102` | Audio cab chatter | `AUDIO_CAB_CHATTER` and accepted aliases |
| `103` | PMTPlayer custom one-shot | `AUDIO_CUSTOM`, `CUSTOM` |
| `104` | PMTPlayer custom replay / loop | `AUDIO_CUSTOM_REPLAY` and accepted aliases |

Values `1..99` are reserved for physical/LED patterns. Values `100..199` are reserved for audio patterns. Queries return numeric values.

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
* physical patterns (`1..99`) require a valid non-conflicting GPIO; bell/horn/cab-chatter audio patterns do not require an FX GPIO; custom audio patterns `103/104` require a valid PMTPlayer track number `1..9999` in the pin/track CV

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
