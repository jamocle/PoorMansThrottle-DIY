# Draft Installation Guide: ESP32-S3 PMTPlayer Sound Wiring

**Firmware source baseline:** PMT `3.0.0`

## Purpose

This guide explains how to wire the sound-only hardware for an ESP32-S3 Poor Man’s Throttle sound setup using the default GPIOs in the firmware.

This guide covers only the sound hardware:

- ESP32-S3 controller
- MAX98357A I2S audio power amplifier module
- WWZMDiB Micro SD / TF Card Adapter Mini Reader Module
- Speaker connection to the amplifier

This guide does not cover PWM motor wiring, throttle motor outputs, lighting outputs, INA219 wiring, or function outputs.

---

## Hardware Used

### ESP32-S3 board

The ESP32-S3 is the main controller. It reads audio files from the microSD card and sends digital audio to the MAX98357A amplifier using I2S.

The firmware default GPIOs in this guide are for the ESP32-S3 build profile.

---

### WWZMDiB Micro SD TF Card Adapter Mini Reader Module

The microSD adapter holds the sound files. The ESP32-S3 talks to this module using SPI.

The SPI signals are:

- CS
- SCK
- MISO
- MOSI

---

### MAX98357A Audio Power Amplifier Module, I2S

The MAX98357A board receives digital I2S audio from the ESP32-S3 and converts it into amplified speaker output.

The I2S signals are:

- BCLK
- LRCLK / WS / LRC
- DIN

The MAX98357A board must be powered from **5V**, not 3.3V.

Do not power the MAX98357A board from the ESP32-S3 3.3V pin.

---

## Critical MAX98357A Wiring Warning

The MAX98357A non-power signal leads are:

- BCLK
- LRCLK / WS / LRC
- DIN

These wires must be as short as possible. Typically, each of these wires should be **less than 1 inch long**.

If you hear clicking, uneven sound, broken sound, or unstable audio, first check the three I2S signal wires. If BCLK, LRCLK / WS / LRC, or DIN is longer than about 1 inch, shorten it before changing firmware settings.

The MAX98357A power wires are:

- 5V / VIN / VCC
- GND

The speaker wires are separate and go from the MAX98357A speaker output terminals to the speaker.

---

## Default Firmware GPIOs for ESP32-S3 Sound

The firmware defaults for the ESP32-S3 sound wiring are:

| Function | ESP32-S3 GPIO | Firmware CV |
|---|---:|---:|
| microSD CS | GPIO10 | CV403 |
| microSD SCK / CLK | GPIO11 | CV404 |
| microSD MISO / DO | GPIO8 | CV405 |
| microSD MOSI / DI | GPIO9 | CV406 |
| MAX98357A I2S BCLK | GPIO12 | CV407 |
| MAX98357A I2S LRCLK / WS / LRC | GPIO13 | CV408 |
| MAX98357A I2S DIN | GPIO14 | CV409 |

If you use these default pins, you do not need to change these GPIO CVs.

### Select the PMTPlayer Sound Mode Before Changing Pins

`CV401` selects the PMTPlayer sound mode:

| CV401 | Sound mode |
|---:|---|
| `0` | None |
| `2` | PMTPlayer Diesel |
| `3` | PMTPlayer Steam |

For this ESP32-S3 PMTPlayer wiring, select `CV401=2` for Diesel or `CV401=3` for Steam **before** manually changing `CV403` through `CV409`.

When you select PMTPlayer for the first time, the firmware loads the board-profile PMTPlayer pin defaults. That can overwrite custom pin values you entered earlier. Select `CV401` first, then make any custom `CV403..CV409` changes. Switching later between Diesel (`2`) and Steam (`3`) preserves the existing PMTPlayer pin/tuning values.

Recommended configuration order:

```text
CV400=0
CV401=2    # Diesel; use CV401=3 for Steam
# If needed, apply custom CV403..CV409 values here.
CV400=1
```

Audio is disabled by default (`CV400=0`).

---

## Wiring Table: ESP32-S3 to Micro SD Adapter

Wire the WWZMDiB Micro SD TF Card Adapter Mini Reader Module as follows:

| Micro SD adapter pin | Connects to ESP32-S3 | Firmware default | CV to change if different |
|---|---|---:|---:|
| VCC | 3.3V | — | — |
| GND | GND | — | — |
| CS | GPIO10 | GPIO10 | CV403 |
| SCK / CLK | GPIO11 | GPIO11 | CV404 |
| MISO / DO | GPIO8 | GPIO8 | CV405 |
| MOSI / DI | GPIO9 | GPIO9 | CV406 |

Use short, clean wiring for the SD card signals. The SD module uses high-speed SPI signals, so loose jumper wires, poor breadboard contacts, or long wires can cause card read failures.

---

## Wiring Table: ESP32-S3 to MAX98357A I2S Amplifier

Wire the MAX98357A module as follows:

| MAX98357A pin | Connects to ESP32-S3 / power | Firmware default | CV to change if different |
|---|---|---:|---:|
| VIN / VCC / 5V | 5V power | — | — |
| GND | GND | — | — |
| BCLK | GPIO12 | GPIO12 | CV407 |
| LRC / LRCLK / WS | GPIO13 | GPIO13 | CV408 |
| DIN | GPIO14 | GPIO14 | CV409 |

The MAX98357A must use **5V power**. Do not connect the MAX98357A VIN / VCC pin to 3.3V.

Keep the MAX98357A BCLK, LRCLK / WS / LRC, and DIN wires as short as possible, typically less than 1 inch.

---

## Wiring Table: MAX98357A to Speaker

Wire the speaker directly to the MAX98357A speaker output.

| MAX98357A speaker output | Connects to |
|---|---|
| Speaker + | Speaker positive terminal |
| Speaker - | Speaker negative terminal |

Do not connect the speaker directly to the ESP32-S3.

The ESP32-S3 only sends a digital audio signal to the amplifier. The MAX98357A drives the speaker.

---

## Grounding

All boards must share a common ground.

Connect the grounds together:

| Device | Ground connection |
|---|---|
| ESP32-S3 | GND |
| Micro SD adapter | GND |
| MAX98357A amplifier | GND |

A missing common ground can cause the SD card or amplifier to behave unpredictably.

---

## Recommended Wiring Order

1. Power everything off.
2. Connect all GND wires first.
3. Wire the microSD adapter.
4. Wire the MAX98357A amplifier.
5. Keep the MAX98357A BCLK, LRCLK / WS / LRC, and DIN wires under 1 inch if possible.
6. Connect the speaker to the MAX98357A speaker output.
7. Insert the prepared microSD card.
8. Power on the ESP32-S3.

---

## If You Do Not Use the Default GPIOs

If you wire the SD card or MAX98357A to different GPIOs, first select the intended PMTPlayer sound mode with `CV401=2` (Diesel) or `CV401=3` (Steam), then update the matching pin CVs. Selecting the sound mode first prevents its default pin preset from replacing your later custom pin values.

### SD Card GPIO CVs

| CV | Meaning | Default ESP32-S3 GPIO |
|---:|---|---:|
| CV403 | PMTPlayer SD CS | GPIO10 |
| CV404 | PMTPlayer SD SPI SCK | GPIO11 |
| CV405 | PMTPlayer SD SPI MISO | GPIO8 |
| CV406 | PMTPlayer SD SPI MOSI | GPIO9 |

Example:

```text
CV403=10
CV404=11
CV405=8
CV406=9
```

### MAX98357A I2S GPIO CVs

| CV | Meaning | Default ESP32-S3 GPIO |
|---:|---|---:|
| CV407 | PMTPlayer I2S BCLK | GPIO12 |
| CV408 | PMTPlayer I2S LRCLK / WS / LRC | GPIO13 |
| CV409 | PMTPlayer I2S DIN | GPIO14 |

Example:

```text
CV407=12
CV408=13
CV409=14
```

Only change these CVs if your wiring does not match the defaults.

---

## Quick Default Wiring Summary

### Micro SD Adapter

| Signal | ESP32-S3 GPIO |
|---|---:|
| CS | GPIO10 |
| SCK | GPIO11 |
| MISO | GPIO8 |
| MOSI | GPIO9 |
| VCC | 3.3V |
| GND | GND |

### MAX98357A

| Signal | ESP32-S3 GPIO / Power |
|---|---:|
| BCLK | GPIO12 |
| LRCLK / WS / LRC | GPIO13 |
| DIN | GPIO14 |
| VIN / VCC | 5V |
| GND | GND |

Again: the MAX98357A BCLK, LRCLK / WS / LRC, and DIN wires must be very short. If the sound clicks, stutters, or sounds uneven, shorten these three wires first.

---

## Basic Troubleshooting

| Symptom | First thing to check |
|---|---|
| No sound | Confirm MAX98357A VIN / VCC is connected to 5V, not 3.3V |
| Clicking or uneven sound | MAX98357A BCLK, LRCLK / WS / LRC, and DIN wires are too long |
| SD card not detected | Check CS, SCK, MISO, MOSI wiring |
| Audio starts but breaks up | Shorten I2S wiring and check common ground |
| Speaker silent | Confirm speaker is connected to MAX98357A speaker output, not ESP32-S3 |
| Works on bench, fails when moved | Check loose jumper wires or breadboard contacts |

---

## Final Pre-Power Checklist

- [ ] ESP32-S3 GND, SD adapter GND, and MAX98357A GND are connected together.
- [ ] MAX98357A VIN / VCC is connected to 5V.
- [ ] MAX98357A is not powered from 3.3V.
- [ ] SD adapter VCC is connected to 3.3V.
- [ ] SD CS is wired to GPIO10 unless CV403 was changed.
- [ ] SD SCK is wired to GPIO11 unless CV404 was changed.
- [ ] SD MISO is wired to GPIO8 unless CV405 was changed.
- [ ] SD MOSI is wired to GPIO9 unless CV406 was changed.
- [ ] MAX98357A BCLK is wired to GPIO12 unless CV407 was changed.
- [ ] MAX98357A LRCLK / WS / LRC is wired to GPIO13 unless CV408 was changed.
- [ ] MAX98357A DIN is wired to GPIO14 unless CV409 was changed.
- [ ] MAX98357A BCLK, LRCLK / WS / LRC, and DIN wires are as short as possible, typically less than 1 inch.
- [ ] Speaker is connected only to the MAX98357A speaker output.