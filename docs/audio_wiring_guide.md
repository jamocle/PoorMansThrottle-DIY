# Poor Man's Throttle Audio Wiring Guide

## Purpose

This guide shows a **recommended first-time wiring setup** for the current audio implementation:

- **ESP32 throttle**
- **DFPlayer-style sound board**
- **optional external amplifier**
- **speaker(s)**

It also includes the audio CVs, function-output CVs, definitions, possible values, and recommended starting values.

---

## Current implementation summary

The current implementation supports:

- Shared audio board configuration through CVs
- DFPlayer backend
- Hard-coded locomotive audio track mapping in `PoorMansThrottle`
- Bell is shown using `FX3` in this guide
- Horn is shown using `FX4` in this guide
- Users may choose different FX numbers if they prefer

### Current hard-coded audio track map

| Function | Track(s) |
|---|---:|
| Prime mover idle | 1 |
| Prime mover notch 1..8 | 2..9 |
| Steam idle / hiss | 101 |
| Steam/chuff speed bands | 102..106 |
| Horn | 201 |
| Bell | 202 |

### Current function mapping

The firmware does not make `FX3` or `FX4` audio functions by command name alone. The link is the function **pattern CV**.

For this guide's example:

```text
CV166=AUDIO_BELL
CV173=AUDIO_HORN
```

That means:

```text
FX3 becomes bell because FX3's pattern CV, CV166, is AUDIO_BELL.
FX4 becomes horn because FX4's pattern CV, CV173, is AUDIO_HORN.
```

| Function command | Required pattern CV | Audio behavior | Track |
|---|---|---|---:|
| `FX3=1` | `CV166=AUDIO_BELL` | Bell on / loop bell | 202 |
| `FX3=0` | `CV166=AUDIO_BELL` | Bell off / stop bell group | 202 |
| `FX4=1` | `CV173=AUDIO_HORN` | Horn on / play or loop horn | 201 |
| `FX4=0` | `CV173=AUDIO_HORN` | Horn off / stop horn group | 201 |

### User-selectable FX choice

The FX choice is a user decision. The selected FX becomes bell or horn by setting that FX function's pattern CV.

This guide uses:

```text
FX3 = bell
FX4 = horn
```

as the recommended example because it leaves `FX1` and `FX2` available for other common functions such as lights.

However, users may choose different FX numbers for bell and horn if desired. The important rule is that the firmware/audio mapping and the user's terminal/app commands must agree.

Examples:

| User preference | Bell command | Bell pattern CV | Horn command | Horn pattern CV |
|---|---|---|---|---|
| Recommended example used in this guide | `FX3` | `CV166=AUDIO_BELL` | `FX4` | `CV173=AUDIO_HORN` |
| Use the first two functions | `FX1` | `CV152=AUDIO_BELL` | `FX2` | `CV159=AUDIO_HORN` |
| Keep lower functions for lights/accessories | `FX5` | `CV180=AUDIO_BELL` | `FX6` | `CV187=AUDIO_HORN` |
| Any other preferred pair | user-selected FX | chosen FX pattern CV = `AUDIO_BELL` | user-selected FX | chosen FX pattern CV = `AUDIO_HORN` |

If a chosen FX function should be audio-only, set that FX function's physical output pin CV to `0`.

For this document, all examples continue using:

```text
FX3 = bell
FX4 = horn
```


---

## Recommended first-time setup

This is the recommended simple bring-up configuration:

- DFPlayer backend
- No BUSY pin
- No MCU-controlled amp pins
- Bell shown on `FX3` for this example
- Horn shown on `FX4` for this example
- User may choose other FX numbers if desired
- UART pins:
  - `GPIO17` = ESP32 TX -> DFPlayer RX
  - `GPIO16` = ESP32 RX <- DFPlayer TX

### Recommended CV values

#### Shared audio CVs

| CV | Name | Meaning | Possible values | Suggested value |
|---:|---|---|---|---:|
| 400 | `AUDIO_ENABLE` | Enables audio subsystem | `0 = off`, `1 = on` | `0` during wiring, then `1` |
| 401 | `AUDIO_BACKEND_TYPE` | Selects audio backend | `0 = None`, `1 = DFPlayer` | `1` |
| 402 | `AUDIO_TX_PIN` | ESP32 TX pin used to send serial to sound board RX | `-1 = unused`, valid GPIO number otherwise | `17` |
| 403 | `AUDIO_RX_PIN` | ESP32 RX pin used to receive serial from sound board TX | `-1 = unused`, valid GPIO number otherwise | `16` |
| 404 | `AUDIO_BUSY_PIN` | Optional BUSY input from sound board | `-1 = unused`, valid GPIO number otherwise | `-1` |
| 405 | `AUDIO_VOLUME` | Global audio volume | `0..30` | `20` |
| 406 | `AUDIO_DEFAULT_PRIORITY` | Default priority for generic audio requests | `0..255` | `20` |
| 407 | `AUDIO_DEFAULT_CONFLICT_POLICY` | How single-stream conflicts are handled | `0 = IgnoreLowerPriority`, `1 = InterruptThenResume`, `2 = ReplaceSameGroup` | `1` |
| 408 | `AUDIO_STARTUP_DELAY_MS` | Delay after backend init | `0` or greater | `0` |
| 409 | `AUDIO_SHUTDOWN_DELAY_MS` | Delay before shutdown completes | `0` or greater | `0` |
| 410 | `AUDIO_AMP_ENABLE_PIN` | Optional amp enable control pin | `-1 = unused`, valid GPIO number otherwise | `-1` |
| 411 | `AUDIO_AMP_MUTE_PIN` | Optional amp mute control pin | `-1 = unused`, valid GPIO number otherwise | `-1` |
| 412 | `AUDIO_AMP_STANDBY_PIN` | Optional amp standby control pin | `-1 = unused`, valid GPIO number otherwise | `-1` |
| 413 | `AUDIO_FAULT_PIN` | Optional amp fault/status input pin | `-1 = unused`, valid GPIO number otherwise | `-1` |

#### Function CVs for bell and horn

The throttle function CVs are indexed. In the verified throttle layout, `FX3` physical output pin is `CV165`, `FX3` pattern is `CV166`, `FX4` physical output pin is `CV172`, and `FX4` pattern is `CV173`.

This guide uses function commands `FX3` and `FX4` as the example bell/horn pair. Users may choose different FX numbers. For a clean audio-only setup, whichever function outputs are chosen for bell/horn should not drive physical output pins unless you intentionally want that.

| CV | Name | Meaning | Possible values | Suggested value |
|---:|---|---|---|---:|
| 165 | `FX3_PIN` | Physical output pin for function 3 | `0 = no physical output`, valid GPIO number otherwise | `0` |
| 166 | `FX3_PATTERN` | Behavior pattern for function 3 | LED patterns or audio patterns such as `AUDIO_BELL` | `AUDIO_BELL` |
| 172 | `FX4_PIN` | Physical output pin for function 4 | `0 = no physical output`, valid GPIO number otherwise | `0` |
| 173 | `FX4_PATTERN` | Behavior pattern for function 4 | LED patterns or audio patterns such as `AUDIO_HORN` | `AUDIO_HORN` |

Suggested function use for this guide's example:

| Function | Purpose | Suggested physical pin CV | Required pattern CV |
|---|---|---:|---:|
| `FX3` | Bell audio | `CV165=0` | `CV166=AUDIO_BELL` |
| `FX4` | Horn audio | `CV172=0` | `CV173=AUDIO_HORN` |

> Note: `CV165` and `CV172` apply only to this guide's example choice of `FX3` and `FX4`. If you choose different FX numbers, use the physical output pin CVs for those chosen FX functions instead. Set the chosen function pin CVs to `0` for audio-only use, or assign valid output pins if you intentionally want the functions to also drive hardware outputs.

### Recommended first terminal setup

Enter these after wiring:

```text
CV400=0
CV401=1
CV402=17
CV403=16
CV404=-1
CV405=20
CV406=20
CV407=1
CV408=0
CV409=0
CV410=-1
CV411=-1
CV412=-1
CV413=-1
CV165=0
CV166=AUDIO_BELL
CV172=0
CV173=AUDIO_HORN
CV400=1
```

---

## Wiring overview

There are two common wiring paths.

### Option A - DFPlayer directly to a speaker

Use this for the simplest setup.

```text
ESP32                    DFPlayer                    Speaker
-----                    --------                    -------
GPIO17 (TX)   ---------> RX
GPIO16 (RX)   <--------- TX
GND           ---------> GND
5V supply     ---------> VCC

SPK1          -------------------------------------> Speaker terminal 1
SPK2          -------------------------------------> Speaker terminal 2
```

### Option B - DFPlayer to external amplifier to speaker

Use this when you want an external amplifier.

```text
ESP32                    DFPlayer                    Amplifier                   Speaker
-----                    --------                    ---------                   -------
GPIO17 (TX)   ---------> RX
GPIO16 (RX)   <--------- TX
GND           ---------> GND
5V supply     ---------> VCC

DAC_R or DAC_L --------> Audio IN
GND -------------------> Audio GND

Amp power + -----------> Amplifier VCC / VIN
Amp GND ---------------> Amplifier GND

Amplifier speaker OUT --> Speaker terminal 1
Amplifier speaker OUT --> Speaker terminal 2
```

---

## Important wiring notes

### 1. Common ground is required

The following grounds must be tied together:

- ESP32 ground
- DFPlayer ground
- amplifier ground if an amplifier is used
- power supply ground

### 2. Suggested UART wiring

For the current recommended setup:

- `CV402 = 17` means ESP32 `GPIO17` is used as audio TX
- `CV403 = 16` means ESP32 `GPIO16` is used as audio RX

That means:

```text
ESP32 GPIO17  -> DFPlayer RX
ESP32 GPIO16  <- DFPlayer TX
```

### 3. BUSY pin is optional

For first bring-up, do not wire BUSY.

Use:

```text
CV404=-1
```

### 4. Amplifier control pins are optional

For first bring-up, do not wire amp enable/mute/standby/fault pins.

Use:

```text
CV410=-1
CV411=-1
CV412=-1
CV413=-1
```

### 5. If using an external amplifier, start with no MCU control

The current recommended first setup is:

- Audio control handled by serial only
- Amplifier powered normally
- No amp enable/mute GPIO control from the ESP32

This keeps the first wiring and test sequence simple.

### 6. The chosen FX functions can be audio-only

This guide uses `FX3` and `FX4`. For audio-only bell and horn behavior with this example, configure:

```text
CV165=0
CV166=AUDIO_BELL
CV172=0
CV173=AUDIO_HORN
```

This keeps the example `FX3` and `FX4` functions from driving physical output pins while still allowing the audio logic to respond to:

```text
FX3=1
FX3=0
FX4=1
FX4=0
```

---

## Recommended wiring diagram using the suggested values

This diagram matches the recommended CV table above.

```text
Recommended CVs:
CV401=1
CV402=17
CV403=16
CV404=-1
CV405=20
CV407=1
CV410=-1
CV411=-1
CV412=-1
CV413=-1
CV165=0
CV166=AUDIO_BELL
CV172=0
CV173=AUDIO_HORN
```

### Recommended wiring with optional amplifier

```text
ESP32 Throttle Board
--------------------
GPIO17 (TX) -----------------------------------------> DFPlayer RX
GPIO16 (RX) <----------------------------------------- DFPlayer TX
GND -------------------------------------------------> DFPlayer GND
5V --------------------------------------------------> DFPlayer VCC

DFPlayer
--------
DAC_R or DAC_L -------------------------------------> Amplifier Audio IN
GND ------------------------------------------------> Amplifier Audio GND

Amplifier
---------
Power IN + -----------------------------------------> 5V or amplifier supply +
Power GND ------------------------------------------> Common GND
Speaker OUT + --------------------------------------> Speaker +
Speaker OUT - --------------------------------------> Speaker -

Common Ground
-------------
ESP32 GND
DFPlayer GND
Amplifier GND
Power Supply GND
All connected together
```

### Recommended wiring without amplifier

```text
ESP32 Throttle Board
--------------------
GPIO17 (TX) -----------------------------------------> DFPlayer RX
GPIO16 (RX) <----------------------------------------- DFPlayer TX
GND -------------------------------------------------> DFPlayer GND
5V --------------------------------------------------> DFPlayer VCC

DFPlayer Speaker Output
-----------------------
SPK1 ------------------------------------------------> Speaker +
SPK2 ------------------------------------------------> Speaker -
```

---

## Which output to use on the sound board

### If you are not using an external amplifier

Use the sound board's speaker output.

Typical DFPlayer labels are:

- `SPK1`
- `SPK2`

### If you are using an external amplifier

Use the sound board's line-level / DAC output, not the speaker output.

Typical DFPlayer labels may include:

- `DAC_R`
- `DAC_L`
- `GND`

For a mono amp, use one DAC channel and ground, according to the amplifier's input requirements.

### Do not do both at once

For initial setup, choose one path:

- either direct speaker output
- or line output into an amplifier

Do not feed a bridged speaker output into a line input amplifier.

---

## What to verify in the terminal

### 1. Confirm audio CV values

```text
CV400?
CV401?
CV402?
CV403?
CV404?
CV405?
CV406?
CV407?
CV408?
CV409?
CV410?
CV411?
CV412?
CV413?
```

### 2. Confirm function pin and pattern CV values for the chosen FX functions

```text
CV165?
CV166?
CV172?
CV173?
```

For this guide's `FX3`/`FX4` audio-only example, expected values are:

```text
CV165=0
CV166=AUDIO_BELL
CV172=0
CV173=AUDIO_HORN
```

### 3. Set the recommended values

```text
CV400=0
CV401=1
CV402=17
CV403=16
CV404=-1
CV405=20
CV406=20
CV407=1
CV408=0
CV409=0
CV410=-1
CV411=-1
CV412=-1
CV413=-1
CV165=0
CV166=AUDIO_BELL
CV172=0
CV173=AUDIO_HORN
CV400=1
```

### 4. Verify bell and horn commands

These commands use this guide's example mapping. This mapping requires `CV166=AUDIO_BELL` and `CV173=AUDIO_HORN`. If you chose different FX numbers, use your chosen FX commands and matching pattern CVs instead.

```text
FX3=1
FX3=0
FX4=1
FX4=0
```

Expected behavior:

- `FX3=1` -> bell track `202`
- `FX3=0` -> bell stops
- `FX4=1` -> horn track `201`
- `FX4=0` -> horn stops

### 5. Verify priority behavior

On a single DFPlayer, the current conflict model is:

- horn overrides bell
- bell overrides prime mover/chuff
- lower-priority desired sounds resume when higher-priority sounds end

Recommended priority test:

```text
FX3=1
FX4=1
FX4=0
FX3=0
```

Expected behavior:

- `FX3=1` -> bell starts
- `FX4=1` -> horn interrupts bell
- `FX4=0` -> bell resumes if still active
- `FX3=0` -> bell stops

### 6. Verify throttle audio behavior

As throttle increases, the throttle sketch should request:

- prime mover tracks `1..9`
- steam/chuff tracks `101..106`

---

## Suggested bring-up sequence

1. Wire ESP32 to DFPlayer UART and power.
2. Leave BUSY and amp control pins unconnected.
3. If using an external amp, wire DFPlayer line out to amp input.
4. If not using an amp, wire DFPlayer speaker output directly to a speaker.
5. Power the system.
6. In the terminal, configure the recommended CVs.
7. Confirm `CV165=0` and `CV172=0` for audio-only `FX3` and `FX4`.
8. Enable audio with `CV400=1`.
9. Test `FX3` and `FX4`.
10. Test throttle changes.

---

## Troubleshooting checklist

### No sound at all

Check:

- `CV400=1`
- `CV401=1`
- `CV402` and `CV403` match actual wiring
- `CV165=0` and `CV172=0` if using this guide's `FX3`/`FX4` audio-only example; use the matching function pin CVs if you chose different FX numbers
- `CV166=AUDIO_BELL` and `CV173=AUDIO_HORN` if using this guide's `FX3`/`FX4` example; use the matching pattern CVs if you chose different FX numbers
- common ground exists
- sound board has valid power
- SD card / audio files are present on the sound board
- speaker or amp wiring is correct

### Terminal commands work but no sound

Check:

- TX/RX wires are not reversed incorrectly
- DFPlayer has power
- audio files exist with the expected numbering
- volume is not set too low
- if using amp, verify the amp is powered
- if using amp, verify you used a line/DAC output instead of speaker output

### Distorted sound

Check:

- power supply quality
- speaker impedance and suitability for the chosen output path
- amplifier gain
- source output path selection
- grounding

### Unexpected audio priority behavior

Remember the current single-stream default is:

```text
CV407=1
```

Meaning:

- higher-priority sound interrupts lower-priority sound
- desired lower-priority sound resumes after the higher-priority sound ends

---

## Recommended first-time values summary

| Item | Suggested value |
|---|---|
| Backend | DFPlayer |
| Audio enable during wiring | `0` |
| Audio enable after wiring | `1` |
| ESP32 TX pin | `17` |
| ESP32 RX pin | `16` |
| Busy pin | `-1` |
| Volume | `20` |
| Default priority | `20` |
| Conflict policy | `1` |
| Startup delay | `0` |
| Shutdown delay | `0` |
| Amp enable pin | `-1` |
| Amp mute pin | `-1` |
| Amp standby pin | `-1` |
| Fault pin | `-1` |
| Bell function used in this guide | `FX3` |
| Horn function used in this guide | `FX4` |
| FX choice | User-selectable; this guide uses `FX3`/`FX4` as the example |
| Bell physical output pin | `CV165=0` |
| Bell pattern mapping | `CV166=AUDIO_BELL` |
| Horn physical output pin | `CV172=0` |
| Horn pattern mapping | `CV173=AUDIO_HORN` |
