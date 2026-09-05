# PMT IBT-2 Motor Driver Installation Guide
## Classic ESP32 and ESP32-S3

**For PMT firmware 3.0.0**

## Companion Video

Watch the companion installation video:

https://youtu.be/eJoxLKSB3KE

---

Use the wiring section for your ESP32 board.

---

# 1. Identify Your Board

There are two IBT-2 wiring profiles.

| Board | RPWM | LPWM | R_EN | L_EN |
|---|---:|---:|---:|---:|
| **Classic ESP32-WROOM-32 / WROOM-32E** | **GPIO25** | **GPIO26** | **GPIO27** | **GPIO33** |
| **ESP32-S3** | **GPIO6** | **GPIO7** | **GPIO4** | **GPIO5** |

Use the wiring for your board.

---

# 2. Power Connections — Read This First

Recommended converter: **DC 12V/24V to 5V USB-C Buck Converter, 3A / 15W**.

Use the converter only with a battery/source that is within the converter's stated input range.

The **battery is the main power source**.

The battery powers:

- the IBT-2 through **B+** and **B-**
- the **DC 12V/24V to 5V USB-C Buck Converter, 3A / 15W**

The buck converter powers the ESP32 through USB-C.

The ESP32 **5V pin** powers the IBT-2 **VCC** pin.

## Power wiring

```text
Battery +
   ├──> IBT-2 B+
   └──> Buck converter red wire

Battery -
   ├──> IBT-2 B-
   ├──> IBT-2 GND
   └──> Buck converter black wire

Buck converter USB-C cable
   └──> ESP32 USB-C port

IBT-2 VCC
   └──> ESP32 5V pin
```

**Before connecting the ESP32, adjust and verify the 5V USB-C buck converter output is 5.0V.**

Use a multimeter to check the 5V USB-C buck converter output before plugging its USB connection into the ESP32.

**Never connect Battery + directly to the ESP32 USB/5V input.**

**Never connect Battery + directly to the IBT-2 VCC pin. IBT-2 VCC connects to the ESP32 5V pin.**

The motor receives power through the IBT-2 `B+` and `B-` terminals, not through the ESP32.

---

# 3. Grounds MUST Be Common

**Battery -, IBT-2 B-, IBT-2 GND, and the buck converter black wire MUST all be connected together.**

Connect:

- **Battery -** → **IBT-2 B-**
- **Battery -** → **IBT-2 GND**
- **Battery -** → **buck converter black wire**

```text
Battery -
   ├──> IBT-2 B-
   ├──> IBT-2 GND
   └──> Buck converter black wire
```

**If these grounds are not common, the IBT-2 may not respond correctly to the ESP32.**

---

# 4. Complete IBT-2 Connections

| IBT-2 | Classic ESP32 | ESP32-S3 |
|---|---|---|
| **B+** | **Battery +** | **Battery +** |
| **B-** | **Battery -** | **Battery -** |
| **M+** | Motor wire 1 | Motor wire 1 |
| **M-** | Motor wire 2 | Motor wire 2 |
| **VCC** | **5V pin on the ESP32** | **5V pin on the ESP32-S3** |
| **GND** | **Common ground** | **Common ground** |
| **RPWM** | **GPIO25** | **GPIO6** |
| **LPWM** | **GPIO26** | **GPIO7** |
| **R_EN** | **GPIO27** | **GPIO4** |
| **L_EN** | **GPIO33** | **GPIO5** |
| **R_IS** | Leave unconnected | Leave unconnected |
| **L_IS** | Leave unconnected | Leave unconnected |

**Do not connect the motor to the ESP32.**

**Do not run motor current through an ESP32 pin, USB cable, or breadboard.**

Use the IBT-2 screw terminals for Battery +, Battery -, M+, and M-.

---

# 5. Classic ESP32

## ESP32 to IBT-2

| IBT-2 | Classic ESP32 |
|---|---:|
| **RPWM** | **GPIO25** |
| **LPWM** | **GPIO26** |
| **R_EN** | **GPIO27** |
| **L_EN** | **GPIO33** |
| **VCC** | **5V pin** |
| **GND** | **Common ground** |

## Classic quick check

- [ ] RPWM -> GPIO25
- [ ] LPWM -> GPIO26
- [ ] R_EN -> GPIO27
- [ ] L_EN -> GPIO33
- [ ] VCC -> ESP32 5V pin
- [ ] GND -> common ground
- [ ] B+ -> Battery +
- [ ] B- -> Battery -
- [ ] Motor -> M+ and M-
- [ ] R_IS and L_IS left unconnected
- [ ] Buck converter red wire -> Battery +
- [ ] Buck converter black wire -> Battery -
- [ ] ESP32 powered from the 5V USB-C buck converter
- [ ] **Battery -, IBT-2 B-, IBT-2 GND, and the buck converter black wire are common**

---

# 6. ESP32-S3

## ESP32-S3 to IBT-2

| IBT-2 | ESP32-S3 |
|---|---:|
| **RPWM** | **GPIO6** |
| **LPWM** | **GPIO7** |
| **R_EN** | **GPIO4** |
| **L_EN** | **GPIO5** |
| **VCC** | **5V pin** |
| **GND** | **Common ground** |

## ESP32-S3 quick check

- [ ] RPWM -> GPIO6
- [ ] LPWM -> GPIO7
- [ ] R_EN -> GPIO4
- [ ] L_EN -> GPIO5
- [ ] VCC -> ESP32-S3 5V pin
- [ ] GND -> common ground
- [ ] B+ -> Battery +
- [ ] B- -> Battery -
- [ ] Motor -> M+ and M-
- [ ] R_IS and L_IS left unconnected
- [ ] Buck converter red wire -> Battery +
- [ ] Buck converter black wire -> Battery -
- [ ] ESP32-S3 powered from the 5V USB-C buck converter
- [ ] **Battery -, IBT-2 B-, IBT-2 GND, and the buck converter black wire are common**

---

# 7. Recommended Wiring Order



1. Disconnect the battery.
2. Connect Battery - to the common ground wiring.
3. Connect Battery + and Battery - to the 5V USB-C buck converter input.
4. Adjust the 5V USB-C buck converter to **5.0V** and verify it with a multimeter.
5. Disconnect the battery again.
6. Connect the IBT-2 VCC to the **5V pin on the ESP32**.
7. Connect IBT-2 GND to common ground.
8. Connect RPWM, LPWM, R_EN, and L_EN using the table for your ESP32.
9. Connect the motor to IBT-2 M+ and M-.
10. Connect Battery + to IBT-2 B+.
11. Connect Battery - to IBT-2 B-.
12. Connect the 5V USB-C buck converter to the ESP32 through USB.
13. Recheck all common-ground connections.
14. Reconnect the battery.
15. Test the motor at a low throttle setting first.

---

# 8. First Motor Test

PMT uses the IBT-2-compatible **DUAL_PWM** motor-driver mode by default.

For a normal installation using the default pins above, no motor-driver GPIO changes are required.

Start with a low throttle setting.

Check:

- motor stops when commanded to stop
- motor runs smoothly
- forward and reverse both work
- ESP32 does not reset when the motor starts
- IBT-2 and wiring do not become unusually hot

---

# 9. Motor Runs the Wrong Direction

If Forward and Reverse are opposite of what you want, use the PMT direction-invert setting:

```text
CV5=1
```

To return to normal direction:

```text
CV5=0
```

You do not need to rewire RPWM and LPWM just to reverse the normal direction.

---

# 10. Troubleshooting

## Motor does not run

Check:

1. Battery + is connected to IBT-2 B+.
2. Battery - is connected to IBT-2 B-.
3. IBT-2 VCC is connected to the ESP32 5V pin.
4. IBT-2 GND is connected to common ground.
5. RPWM, LPWM, R_EN, and L_EN match your board table.
6. Motor is connected to M+ and M-.
7. Battery -, IBT-2, 5V USB-C buck converter, and ESP32 grounds are common.

## Motor only runs in one direction

Check:

- both RPWM and LPWM wires
- both R_EN and L_EN wires
- correct GPIO table for your ESP32 board

## Motor direction is backwards

Use:

```text
CV5=1
```

## ESP32 resets when the motor starts

Check:

1. Buck converter output remains close to 5V when the motor starts.
2. Battery -, buck converter black wire, IBT-2 ground, and ESP32 ground are common.
3. Motor power is connected to IBT-2 B+/B-, not through the ESP32.
4. Motor-current wiring is secure.
5. The 5V USB-C buck converter is suitable for powering the ESP32.

## IBT-2 does not respond even though the ESP32 is running

**Check the common ground first.**

The ESP32 control signals cannot reliably control the IBT-2 unless their grounds share the same reference.

---

# 11. Advanced Configuration
## Only use this section if you intentionally changed the default control pins

The normal IBT-2 installation uses the defaults above.

## Classic ESP32

| CV | IBT-2 | Default GPIO |
|---:|---|---:|
| CV100 | RPWM | GPIO25 |
| CV101 | LPWM | GPIO26 |
| CV102 | R_EN | GPIO27 |
| CV103 | L_EN | GPIO33 |

## ESP32-S3

| CV | IBT-2 | Default GPIO |
|---:|---|---:|
| CV100 | RPWM | GPIO6 |
| CV101 | LPWM | GPIO7 |
| CV102 | R_EN | GPIO4 |
| CV103 | L_EN | GPIO5 |

The motor-driver type is normally:

```text
CV1=DUAL_PWM
```

Only change CV100 through CV103 if you physically wired the IBT-2 to different GPIOs.

---

# 12. One-Page Wiring Reference

## Power

```text
Battery + ------+------> IBT-2 B+
                |
                +------> Buck red wire

Battery - ------+------> IBT-2 B-
                |
                +------> IBT-2 GND
                |
                +------> Buck black wire/ground
                           |

Buck USB-C cable ------> ESP32 USB-C port

ESP32 5V pin -----------> IBT-2 VCC

IBT-2 M+ --------------> Motor
IBT-2 M- --------------> Motor
```

**COMMON GROUND REQUIRED: Connect Battery - to IBT-2 B-, IBT-2 GND, and the buck converter black wire.**

## Classic ESP32

```text
RPWM -> GPIO25
LPWM -> GPIO26
R_EN -> GPIO27
L_EN -> GPIO33
```

## ESP32-S3

```text
RPWM -> GPIO6
LPWM -> GPIO7
R_EN -> GPIO4
L_EN -> GPIO5
```
