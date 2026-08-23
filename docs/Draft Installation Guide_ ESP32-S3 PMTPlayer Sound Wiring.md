# Draft Installation Guide: ESP32-S3 PMTPlayer Sound Wiring

## Purpose

This guide explains how to wire the sound-only hardware for an ESP32-S3 Poor Man’s Throttle sound setup using the default GPIOs in the firmware.

This guide covers only the sound hardware:

- ESP32-S3 controller
- MAX98357 I2S audio power amplifier module
- WWZMDiB Micro SD / TF Card Adapter Mini Reader Module
- Speaker connection to the amplifier

This guide does not cover PWM motor wiring, throttle motor outputs, lighting outputs, INA219 wiring, or function outputs.

---

## Hardware Used

### ESP32-S3 board

The ESP32-S3 is the main controller. It reads audio files from the microSD card and sends digital audio to the MAX98357 amplifier using I2S.

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

### MAX98357 Audio Power Amplifier Module, I2S

The MAX98357 board receives digital I2S audio from the ESP32-S3 and converts it into amplified speaker output.

The I2S signals are:

- BCLK
- LRCLK / WS / LRC
- DIN

The MAX98357 board must be powered from **5V**, not 3.3V.

Do not power the MAX98357 board from the ESP32-S3 3.3V pin.

---

## Critical MAX98357 Wiring Warning

The MAX98357 non-power signal leads are:

- BCLK
- LRCLK / WS / LRC
- DIN

These wires must be as short as possible. Typically, each of these wires should be **less than 1 inch long**.

If you hear clicking, uneven sound, broken sound, or unstable audio, the most likely cause is that the MAX98357 non-power signal wires are too long. The wires here are too long. Shorten the BCLK, LRCLK / WS / LRC, and DIN wires first before changing firmware settings.

The MAX98357 power wires are:

- 5V / VIN / VCC
- GND

The speaker wires are separate and go from the MAX98357 speaker output terminals to the speaker.

---

## Default Firmware GPIOs for ESP32-S3 Sound

The firmware defaults for the ESP32-S3 sound wiring are:

| Function | ESP32-S3 GPIO | Firmware CV |
|---|---:|---:|
| microSD CS | GPIO10 | CV403 |
| microSD SCK / CLK | GPIO11 | CV404 |
| microSD MISO / DO | GPIO8 | CV405 |
| microSD MOSI / DI | GPIO9 | CV406 |
| MAX98357 I2S BCLK | GPIO12 | CV407 |
| MAX98357 I2S LRCLK / WS / LRC | GPIO13 | CV408 |
| MAX98357 I2S DIN | GPIO14 | CV409 |

If you use these default pins, you do not need to change these GPIO CVs.

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

## Wiring Table: ESP32-S3 to MAX98357 I2S Amplifier

Wire the MAX98357 module as follows:

| MAX98357 pin | Connects to ESP32-S3 / power | Firmware default | CV to change if different |
|---|---|---:|---:|
| VIN / VCC / 5V | 5V power | — | — |
| GND | GND | — | — |
| BCLK | GPIO12 | GPIO12 | CV407 |
| LRC / LRCLK / WS | GPIO13 | GPIO13 | CV408 |
| DIN | GPIO14 | GPIO14 | CV409 |

The MAX98357 must use **5V power**. Do not connect the MAX98357 VIN / VCC pin to 3.3V.

Keep the MAX98357 BCLK, LRCLK / WS / LRC, and DIN wires as short as possible, typically less than 1 inch.

---

## Wiring Table: MAX98357 to Speaker

Wire the speaker directly to the MAX98357 speaker output.

| MAX98357 speaker output | Connects to |
|---|---|
| Speaker + | Speaker positive terminal |
| Speaker - | Speaker negative terminal |

Do not connect the speaker directly to the ESP32-S3.

The ESP32-S3 only sends a digital audio signal to the amplifier. The MAX98357 drives the speaker.

---

## Grounding

All boards must share a common ground.

Connect the grounds together:

| Device | Ground connection |
|---|---|
| ESP32-S3 | GND |
| Micro SD adapter | GND |
| MAX98357 amplifier | GND |

A missing common ground can cause the SD card or amplifier to behave unpredictably.

---

## Recommended Wiring Order

1. Power everything off.
2. Connect all GND wires first.
3. Wire the microSD adapter.
4. Wire the MAX98357 amplifier.
5. Keep the MAX98357 BCLK, LRCLK / WS / LRC, and DIN wires under 1 inch if possible.
6. Connect the speaker to the MAX98357 speaker output.
7. Insert the prepared microSD card.
8. Power on the ESP32-S3.

---

## If You Do Not Use the Default GPIOs

If you wire the SD card or MAX98357 to different GPIOs, update the matching CVs.

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

### MAX98357 I2S GPIO CVs

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

### MAX98357

| Signal | ESP32-S3 GPIO / Power |
|---|---:|
| BCLK | GPIO12 |
| LRCLK / WS / LRC | GPIO13 |
| DIN | GPIO14 |
| VIN / VCC | 5V |
| GND | GND |

Again: the MAX98357 BCLK, LRCLK / WS / LRC, and DIN wires must be very short. If the sound clicks, stutters, or sounds uneven, shorten these three wires first.

---

## Basic Troubleshooting

| Symptom | First thing to check |
|---|---|
| No sound | Confirm MAX98357 VIN / VCC is connected to 5V, not 3.3V |
| Clicking or uneven sound | MAX98357 BCLK, LRCLK / WS / LRC, and DIN wires are too long |
| SD card not detected | Check CS, SCK, MISO, MOSI wiring |
| Audio starts but breaks up | Shorten I2S wiring and check common ground |
| Speaker silent | Confirm speaker is connected to MAX98357 speaker output, not ESP32-S3 |
| Works on bench, fails when moved | Check loose jumper wires or breadboard contacts |

---

## Final Pre-Power Checklist

- [ ] ESP32-S3 GND, SD adapter GND, and MAX98357 GND are connected together.
- [ ] MAX98357 VIN / VCC is connected to 5V.
- [ ] MAX98357 is not powered from 3.3V.
- [ ] SD adapter VCC is connected to 3.3V.
- [ ] SD CS is wired to GPIO10 unless CV403 was changed.
- [ ] SD SCK is wired to GPIO11 unless CV404 was changed.
- [ ] SD MISO is wired to GPIO8 unless CV405 was changed.
- [ ] SD MOSI is wired to GPIO9 unless CV406 was changed.
- [ ] MAX98357 BCLK is wired to GPIO12 unless CV407 was changed.
- [ ] MAX98357 LRCLK / WS / LRC is wired to GPIO13 unless CV408 was changed.
- [ ] MAX98357 DIN is wired to GPIO14 unless CV409 was changed.
- [ ] MAX98357 BCLK, LRCLK / WS / LRC, and DIN wires are as short as possible, typically less than 1 inch.
- [ ] Speaker is connected only to the MAX98357 speaker output.