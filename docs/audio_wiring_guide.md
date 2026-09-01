# Poor Man's Throttle PMTPlayer Audio Wiring Guide

**Firmware baseline:** 3.0.0, revision 215

## Purpose

This guide covers the **PMTPlayer** audio implementation used by Poor Man's Throttle.

PMTPlayer uses the ESP32 itself as the audio engine:

```text
microSD card
    |
    | SPI
    v
ESP32 / PMTPlayer
    |
    | I2S
    v
MAX98357A
    |
    v
Speaker
```

This guide covers:

- PMTPlayer Diesel and PMTPlayer Steam backend selection
- microSD SPI wiring
- MAX98357A I2S wiring
- Classic ESP32-WROOM defaults
- ESP32-S3-WROOM-1-N16R8 defaults
- PMTPlayer audio CVs
- audio-file location and naming
- bell, horn, and custom FX audio mapping
- recommended PMTPlayer bring-up and troubleshooting

This guide does not cover motor-driver wiring, INA219 wiring, or general lighting-output wiring.

---

## PMTPlayer backend selection

`CV401` selects the active PMTPlayer sound family:

| CV401 | Backend | Active sound root |
|---:|---|---|
| `2` | PMTPlayer Diesel | `/diesel` |
| `3` | PMTPlayer Steam | `/steam` |

The clean-reset firmware default is:

```text
CV400=0
CV401=2
```

so audio starts disabled and the default PMTPlayer family is Diesel.

### Set CV401 before custom PMTPlayer pin/tuning overrides

When the firmware changes from a non-PMTPlayer backend into PMTPlayer, selecting `CV401=2` or `CV401=3` applies the PMTPlayer board preset, including the PMTPlayer pin and tuning CVs.

Therefore, for a new setup:

1. disable audio with `CV400=0`
2. select Diesel or Steam with `CV401`
3. apply any custom `CV403..CV429` values
4. enable audio with `CV400=1`

Switching between `CV401=2` and `CV401=3` while already in the PMTPlayer family preserves the existing PMTPlayer CV values and changes the selected sound root.

---

# Default PMTPlayer wiring

## Classic ESP32-WROOM

| Function | CV | Stored default | Effective Classic connection |
|---|---:|---:|---:|
| microSD CS | `CV403` | `21` | GPIO21 |
| microSD SCK | `CV404` | `-1` | GPIO18 |
| microSD MISO | `CV405` | `-1` | GPIO19 |
| microSD MOSI | `CV406` | `-1` | GPIO23 |
| MAX98357A I2S BCLK | `CV407` | `13` | GPIO13 |
| MAX98357A I2S LRCLK / WS / LRC | `CV408` | `12` | GPIO12 |
| MAX98357A I2S DIN | `CV409` | `14` | GPIO14 |

### What `CV404=-1`, `CV405=-1`, and `CV406=-1` mean on Classic

The Classic `-1` values are intentional sentinel values. They do **not** mean the SD signals are unused.

`PmtCardReader` explicitly remaps SPI only when SCK, MISO, and MOSI are all non-negative. With the Classic defaults:

```text
CV404=-1
CV405=-1
CV406=-1
```

PMT leaves the global Arduino `SPI` object on the Classic ESP32 core defaults.

Therefore:

```text
CV404=-1  -> SCK  GPIO18
CV405=-1  -> MISO GPIO19
CV406=-1  -> MOSI GPIO23
```

`CV403` still explicitly supplies the SD chip-select pin:

```text
CV403=21 -> SD CS GPIO21
```

So the complete effective Classic PMTPlayer SD wiring is:

```text
SD CS    -> GPIO21
SD SCK   -> GPIO18
SD MISO  -> GPIO19
SD MOSI  -> GPIO23
```

---

## ESP32-S3-WROOM-1-N16R8

The S3 profile explicitly assigns all PMTPlayer SPI and I2S pins.

| Function | CV | S3 default |
|---|---:|---:|
| microSD CS | `CV403` | GPIO10 |
| microSD SCK | `CV404` | GPIO11 |
| microSD MISO | `CV405` | GPIO8 |
| microSD MOSI | `CV406` | GPIO9 |
| MAX98357A I2S BCLK | `CV407` | GPIO12 |
| MAX98357A I2S LRCLK / WS / LRC | `CV408` | GPIO13 |
| MAX98357A I2S DIN | `CV409` | GPIO14 |

Unlike Classic, the S3 defaults do not use `-1` for the SD bus.

---

# Wiring the microSD adapter

PMTPlayer reads WAV files from the SD card over SPI.

## Classic ESP32-WROOM

| SD adapter signal | Connect to |
|---|---:|
| CS | GPIO21 |
| SCK / CLK | GPIO18 |
| MISO / DO | GPIO19 |
| MOSI / DI | GPIO23 |
| GND | ESP32 GND |

The stored Classic CV values are:

```text
CV403=21
CV404=-1
CV405=-1
CV406=-1
```

Remember that the three `-1` values resolve to the effective Classic SPI pins GPIO18 / GPIO19 / GPIO23.

## ESP32-S3-WROOM-1-N16R8

| SD adapter signal | Connect to |
|---|---:|
| CS | GPIO10 |
| SCK / CLK | GPIO11 |
| MISO / DO | GPIO8 |
| MOSI / DI | GPIO9 |
| GND | ESP32-S3 GND |

The S3 CV values are:

```text
CV403=10
CV404=11
CV405=8
CV406=9
```

For the WWZMDiB Micro SD / TF Card Adapter Mini Reader Module documented in the PMT installation material, VCC is connected to **3.3V**.

Use short, clean wiring for the SD signals. Poor contacts, long jumper wires, and noisy shared return paths can destabilize SD reads.

---

# Wiring the MAX98357A

PMTPlayer sends PCM audio from the ESP32 to the MAX98357A over I2S.

## Classic ESP32-WROOM

| MAX98357A signal | Connect to |
|---|---:|
| BCLK | GPIO13 |
| LRC / LRCLK / WS | GPIO12 |
| DIN | GPIO14 |
| GND | ESP32 GND |
| VIN / VCC | 5V power |
| Speaker + | speaker positive |
| Speaker - | speaker negative |

The matching PMTPlayer CVs are:

```text
CV407=13
CV408=12
CV409=14
```

## ESP32-S3-WROOM-1-N16R8

| MAX98357A signal | Connect to |
|---|---:|
| BCLK | GPIO12 |
| LRC / LRCLK / WS | GPIO13 |
| DIN | GPIO14 |
| GND | ESP32-S3 GND |
| VIN / VCC | 5V power |
| Speaker + | speaker positive |
| Speaker - | speaker negative |

The matching PMTPlayer CVs are:

```text
CV407=12
CV408=13
CV409=14
```

The PMT installation material specifies **5V** power for the MAX98357A. Do not connect its power input to the ESP32 3.3V pin.

The speaker connects to the MAX98357A speaker output, not directly to the ESP32.

---

# I2S wiring length and grounding

The PMTPlayer hardware diagnostics identified the physical audio path as sensitive to wiring and ground-return layout.

Keep these MAX98357A signal wires very short:

- BCLK
- LRCLK / WS / LRC
- DIN

The existing PMTPlayer installation guide recommends keeping these signal leads typically **under 1 inch** where practical.

All modules still require a common electrical ground, but avoid routing the SD-card return current and MAX98357A return through the same long breadboard ground path.

The PMTPlayer hardware root-cause testing found audible popping from shared SD/amplifier ground-return coupling. The successful physical correction used a dedicated MAX98357A ground return to an ESP32 ground point while the SD subsystem retained its own return path.

Practical layout:

```text
ESP32 GND -------- SD adapter GND
     |
     +------------- MAX98357A GND
```

Keep the branches short and avoid daisy-chaining the amplifier ground through the SD-card breadboard return.

---

# PMTPlayer audio CVs

## Core PMTPlayer hardware and service CVs

| CV | Meaning | Valid / effective values | Clean PMTPlayer default |
|---:|---|---|---|
| `CV400` | Audio enable | `0=off`, `1=on` | `0` |
| `CV401` | PMTPlayer family | `2=Diesel`, `3=Steam` | `2` |
| `CV402` | Master volume | `0..30` | `15` |
| `CV403` | SD CS | board-specific | Classic `21`, S3 `10` |
| `CV404` | SD SCK | `-1` or valid output GPIO | Classic `-1` → GPIO18, S3 `11` |
| `CV405` | SD MISO | `-1` or valid input GPIO | Classic `-1` → GPIO19, S3 `8` |
| `CV406` | SD MOSI | `-1` or valid output GPIO | Classic `-1` → GPIO23, S3 `9` |
| `CV407` | I2S BCLK | backend-specific pin value | Classic `13`, S3 `12` |
| `CV408` | I2S LRCLK / WS | backend-specific pin value | Classic `12`, S3 `13` |
| `CV409` | I2S DIN | backend-specific pin value | `14` |
| `CV410` | Default audio priority | `0..100` | `30` |
| `CV411` | Conflict policy | effective `0..2` | `1` |
| `CV412` | Startup delay | `0..10000 ms` | `0` |
| `CV413` | Shutdown delay | `0..10000 ms` | `0` |
| `CV414` | Optional amp enable pin | `-1` or valid output GPIO | `-1` |
| `CV415` | Optional amp mute pin | `-1` or valid output GPIO | `-1` |
| `CV416` | Optional amp standby pin | `-1` or valid output GPIO | `-1` |
| `CV417` | Optional fault input pin | `-1` or valid input GPIO | `-1` |

Conflict-policy values are:

```text
0 = IgnoreLowerPriority
1 = InterruptThenResume
2 = ReplaceSameGroup
```

---

## PMTPlayer tuning CVs

| CV | Meaning | Accepted / effective range | Clean default |
|---:|---|---|---:|
| `CV418` | PMTPlayer profile | `0..3` | `3` |
| `CV419` | WAV gain | `1..12` | `1` |
| `CV420` | Output headroom | `50..100 %` | `100` |
| `CV421` | Limiter mode | `0..10` | `10` |
| `CV422` | Speaker size profile | `0=large`, `1=medium`, `2=small` | `2` |
| `CV423` | Maximum active voices | `0..255`; `0` resolves to board default | Classic `3`, S3 `13` |
| `CV424` | Overlap mode | effective `0..2` | `1` |
| `CV425` | Async overlap start | `0` or `1` | `1` |
| `CV426` | Start-prime bytes | `0..16384` | `12288` |
| `CV427` | Overlap-prime bytes | `0..16384` | `0` |
| `CV428` | Mixer attenuation | `25..100 %` | `100` |
| `CV429` | Clip telemetry request | `0` or `1` | `1` stored |

`CV418` profile meanings are:

| CV418 | Profile |
|---:|---|
| `0` | Conservative |
| `1` | Balanced |
| `2` | Loud |
| `3` | Explicit advanced CVs |

When `CV418` is `0`, `1`, or `2`, firmware applies the profile's related PMTPlayer settings. Writing an individual advanced PMTPlayer CV marks the profile explicit (`CV418=3`).

`CV423=0` means “board default.” The firmware resolves that to a non-zero value: Classic `3`, S3 `13`.

`CV424` effective modes are:

```text
0 = none
1 = selected-overlap
2 = general-loop
```

`CV429` is diagnostic. Normal non-verbose builds force its effective runtime behavior off even if the stored request is `1`.

---

# Sound-card directory and file naming

PMTPlayer builds a track path from the selected backend family.

For Diesel:

```text
/diesel/####.wav
```

For Steam:

```text
/steam/####.wav
```

The track number is formatted as four decimal digits.

Examples:

```text
/diesel/0202.wav
/steam/0202.wav
```

Changing `CV401` between Diesel and Steam changes the active root. The same logical track number therefore resolves under the selected family.

---

# Current PMTPlayer locomotive audio examples

The throttle layer owns locomotive sound meaning; PMTPlayer owns the actual WAV playback, mixing, transitions, and voice allocation.

Current source includes these PMTPlayer track roles:

| Sound | Track(s) |
|---|---:|
| Prime-mover startup | `0090` |
| Prime-mover shutdown | `0091` |
| Prime-mover idle | `0100` |
| Diesel notch family | starts at `0101` |
| Bell | `0202` |
| Horn intro | `0211` |
| Horn sustain | `0212` |
| Horn release | `0213` |
| Cab chatter range | starts at `0300` |

The current horn behavior is a managed three-part PMTPlayer lifecycle using intro, sustain, and release assets rather than a single horn file.

Steam has additional stationary-idle, moving-bed, chuff, and brake-squeal assets managed by the throttle audio scheduler.

---

# Function / FX audio mapping

Any FX slot can be assigned an audio pattern. The function number itself does not hard-code bell or horn behavior.

Current audio patterns are:

| Pattern | Meaning |
|---:|---|
| `100` | Audio Bell |
| `101` | Audio Horn |
| `102` | Audio Cab Chatter |
| `103` | Audio Custom one-shot |
| `104` | Audio Custom replay / loop |

Legacy text aliases such as `AUDIO_BELL` and `AUDIO_HORN` are accepted, but pattern queries return numeric values.

## Example: FX3 bell and FX4 horn

The throttle CV layout gives:

```text
FX3 pin/track CV = CV165
FX3 pattern CV   = CV166

FX4 pin/track CV = CV172
FX4 pattern CV   = CV173
```

For audio-only bell and horn:

```text
CV166=100
CV165=0

CV173=101
CV172=0
```

Then:

```text
FX3=1
FX3=0
FX4=1
FX4=0
```

drives the configured PMTPlayer bell/horn behavior.

Bell, horn, and cab-chatter patterns do not require a physical FX GPIO.

## Custom PMTPlayer audio

For pattern `103` or `104`, the function's pin CV is repurposed as the PMTPlayer track number.

Valid custom track numbers are:

```text
1..9999
```

Set the pattern **before** setting the track number because changing the pattern resets the same FX slot's pin/track value to `0`.

Example using FX5:

```text
CV180=103
CV179=450
```

This selects custom one-shot track `0450.wav` from the currently active PMTPlayer root:

```text
/diesel/0450.wav
```

or:

```text
/steam/0450.wav
```

depending on `CV401`.

---

# Recommended first-time PMTPlayer setup

## Classic ESP32-WROOM — Diesel

Set the backend first, then explicitly establish the Classic PMTPlayer pin values:

```text
CV400=0
CV401=2
CV402=15

CV403=21
CV404=-1
CV405=-1
CV406=-1

CV407=13
CV408=12
CV409=14

CV400=1
```

Effective Classic SD pins:

```text
CS   GPIO21
SCK  GPIO18
MISO GPIO19
MOSI GPIO23
```

I2S pins:

```text
BCLK  GPIO13
LRCLK GPIO12
DIN   GPIO14
```

For Steam, use the same hardware values and select:

```text
CV401=3
```

---

## ESP32-S3-WROOM-1-N16R8 — Diesel

```text
CV400=0
CV401=2
CV402=15

CV403=10
CV404=11
CV405=8
CV406=9

CV407=12
CV408=13
CV409=14

CV400=1
```

For Steam, use:

```text
CV401=3
```

---

# Verification commands

After configuration, query:

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
CV414?
CV415?
CV416?
CV417?
CV418?
CV419?
CV420?
CV421?
CV422?
CV423?
CV424?
CV425?
CV426?
CV427?
CV428?
CV429?
```

For Classic, it is correct for the terminal to report:

```text
CV404=-1
CV405=-1
CV406=-1
```

Those stored values still mean:

```text
SCK  = GPIO18
MISO = GPIO19
MOSI = GPIO23
```

---

# Basic bring-up sequence

1. Power the system off.
2. Connect the SD adapter to the correct board-profile SPI pins.
3. Connect MAX98357A BCLK, LRCLK/WS, and DIN to the correct I2S pins.
4. Connect all grounds, using a clean/dedicated amplifier ground return where practical.
5. Power the documented MAX98357A from 5V.
6. Connect the speaker to the MAX98357A speaker output.
7. Insert the prepared SD card.
8. Keep `CV400=0` while selecting and configuring the backend.
9. Set `CV401=2` for Diesel or `CV401=3` for Steam.
10. Set or verify the board-specific `CV403..CV409` values.
11. Set `CV400=1`.
12. Query the CVs to verify the stored configuration.
13. Test a configured bell, horn, or other PMTPlayer audio FX.
14. Test throttle audio behavior.

---

# Troubleshooting

## No sound

Check:

- `CV400=1`
- `CV401=2` or `CV401=3`
- `CV402` is not `0`
- SD wiring matches `CV403..CV406`
- I2S wiring matches `CV407..CV409`
- the SD card is present
- the selected `/diesel` or `/steam` directory contains the required WAV files
- MAX98357A has power
- speaker is connected to the MAX98357A output
- all devices share a valid ground reference

## Classic SD card is not detected

Confirm the distinction between stored CVs and effective wiring:

```text
CV403=21 -> CS GPIO21
CV404=-1 -> SCK GPIO18
CV405=-1 -> MISO GPIO19
CV406=-1 -> MOSI GPIO23
```

Do not interpret `-1` as “leave the wire disconnected.”

## S3 SD card is not detected

Verify:

```text
CV403=10
CV404=11
CV405=8
CV406=9
```

and confirm the physical wiring matches those values.

## Audio clicks, pops, or breaks up

Check the physical audio path before changing DSP settings:

- shorten BCLK, LRCLK/WS, and DIN wiring
- avoid long breadboard signal paths
- check MAX98357A power integrity
- check the common-ground topology
- avoid sharing a long SD/amplifier ground-return path
- inspect SD wiring and contacts

The PMTPlayer diagnostic history specifically identified shared SD/amplifier ground-return coupling as a real source of audible popping.

## Bell or horn command does nothing

Check the chosen FX pattern CV.

For the FX3/FX4 example:

```text
CV166=100
CV173=101
```

The audio behavior follows the pattern CV, not the FX number itself.

## Custom audio does not play

For patterns `103` and `104`:

- set the pattern first
- then set that function's pin/track CV
- use a track number from `1..9999`
- verify the corresponding four-digit WAV exists under the active `/diesel` or `/steam` root

---

# Quick wiring summary

## Classic ESP32-WROOM

```text
microSD
CS    -> GPIO21   CV403=21
SCK   -> GPIO18   CV404=-1  (Arduino/core default)
MISO  -> GPIO19   CV405=-1  (Arduino/core default)
MOSI  -> GPIO23   CV406=-1  (Arduino/core default)

MAX98357A
BCLK  -> GPIO13   CV407=13
LRCLK -> GPIO12   CV408=12
DIN   -> GPIO14   CV409=14
```

## ESP32-S3-WROOM-1-N16R8

```text
microSD
CS    -> GPIO10   CV403=10
SCK   -> GPIO11   CV404=11
MISO  -> GPIO8    CV405=8
MOSI  -> GPIO9    CV406=9

MAX98357A
BCLK  -> GPIO12   CV407=12
LRCLK -> GPIO13   CV408=13
DIN   -> GPIO14   CV409=14
```

## Backend selection

```text
CV401=2 -> PMTPlayer Diesel -> /diesel/####.wav
CV401=3 -> PMTPlayer Steam  -> /steam/####.wav
```

## Audio enable

```text
CV400=0 -> disabled
CV400=1 -> enabled
```
