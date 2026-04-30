# Wiring Reference

This appendix contains the firmware-backed wiring reference for the Poor Man's Throttle system.

This version has been refreshed against firmware **v1.12.1** and reflects the hardware control styles, default pin mappings, and optional wiring paths currently supported by the firmware.

Use these tables to verify wiring during assembly or troubleshooting.

---

# Important Notes Before Wiring

- The firmware supports **four motor driver control styles**:
  - **DUAL_PWM** — example: IBT-2 / BTS7960
  - **PWM_DIR** — example: Cytron MD10C style drivers
  - **PWM_BIDIR** — example: L298N style drivers
  - **DUAL_INPT** — example: DRV8833 style drivers
- The tables below show the **firmware default pin assignments**. These pins are **configurable in firmware/app settings**, so your actual installation may differ.
- The onboard ESP32 status LED uses **GPIO2**. Do not plan accessory wiring around GPIO2.
- The ESP32 logic supply and the motor power supply should remain **electrically coordinated with a shared ground**, while the ESP32 itself is powered from a dedicated **5V power module**.
- For battery installs, a **buck converter** is optional and is only used when the battery voltage is higher than the desired motor voltage.

---

# Supported Motor Driver Modes and Default ESP32 Pin Mapping

| Driver Mode | Typical Boards | Firmware Default Pins | Notes |
|------------|----------------|-----------------------|-------|
| DUAL_PWM | IBT-2, BTS7960 style boards | GPIO25 = FWD PWM, GPIO26 = REV PWM, GPIO27 = ENA, GPIO33 = ENB | Best match for the original PMT wiring style and heavy-current installs |
| PWM_DIR | Cytron MD10C style boards | GPIO25 = PWM, GPIO26 = DIR | One PWM line plus one direction line |
| PWM_BIDIR | L298N style boards | GPIO25 = PWM/EN, GPIO26 = FWD logic, GPIO27 = REV logic | One PWM enable plus two direction logic pins |
| DUAL_INPT | DRV8833 style boards | GPIO25 = IN1, GPIO26 = IN2 | PWM is applied to the active side internally by firmware |

---

# ESP32 to IBT-2 Motor Driver Wiring (DUAL_PWM Default)

| From ESP32 | To IBT-2 | Purpose |
|------------|----------|---------|
| GPIO25 | RPWM | Forward PWM control |
| GPIO26 | LPWM | Reverse PWM control |
| GPIO27 | R_EN | Enable control |
| GPIO33 | L_EN | Enable control |
| 5V / VIN | VCC | Driver logic power |
| GND | GND | Shared ground |

This is the original and most common Poor Man's Throttle wiring pattern.

---

# ESP32 to PWM_DIR Driver Wiring (Default)

Use this pattern for drivers that expect **one PWM input** and **one direction input**.

| From ESP32 | To Driver | Purpose |
|------------|-----------|---------|
| GPIO25 | PWM | Speed control |
| GPIO26 | DIR | Direction control |
| GND | GND | Shared ground |
| 5V / VIN* | Logic VCC* | Driver logic reference if required by the board |

\* Some PWM_DIR boards handle logic power differently. Always verify the board's own pin labels and operating-voltage requirements.

---

# ESP32 to PWM_BIDIR Driver Wiring (L298N-Style Default)

Use this pattern for drivers that expect **one PWM/enable input** and **two direction logic inputs**.

| From ESP32 | To Driver | Purpose |
|------------|-----------|---------|
| GPIO25 | EN / PWM | Speed control |
| GPIO26 | IN1 / FWD | Forward logic |
| GPIO27 | IN2 / REV | Reverse logic |
| GND | GND | Shared ground |
| 5V / VIN* | Logic VCC* | Driver logic reference if required by the board |

\* Board implementation varies. Confirm the exact terminal names on your motor driver board.

---

# ESP32 to DUAL_INPT Driver Wiring (DRV8833-Style Default)

Use this pattern for drivers with **two motor-control inputs** and no separate direction pin.

| From ESP32 | To Driver | Purpose |
|------------|-----------|---------|
| GPIO25 | IN1 | Motor control input A |
| GPIO26 | IN2 | Motor control input B |
| GND | GND | Shared ground |
| 5V / VIN* | Logic VCC* | Logic reference if required by the board |

\* Some compact H-bridge boards already derive logic power from the board supply rail. Verify your specific board.

---

# Motor Driver Power Wiring

## High-current driver example (IBT-2 / BTS7960 style)

| From | To Driver | Purpose |
|------|-----------|---------|
| Fuse Output | B+ | Motor driver power |
| Power Ground | B- | Ground |

For other motor driver boards, connect the driver's main power input terminals according to the board's labeling, but keep the same PMT power architecture:
**power source -> optional buck converter -> fuse -> motor driver**.

---

# Motor or Track Output Wiring

| From Driver | To | Purpose |
|-------------|----|---------|
| Motor Output A | Motor lead or DC track power lead | Motor output |
| Motor Output B | Motor lead or DC track power lead | Motor output |

For battery dead-rail installs, these outputs normally go directly to the locomotive motor.  
For traditional DC layout use, these outputs can feed the controlled DC track section.

---

# Buck Converter Wiring (Optional)

Use a buck converter only when the battery voltage is higher than the desired motor voltage.

| From | To | Purpose |
|------|----|---------|
| Battery + | Buck Input + | Power input |
| Battery - | Buck Input - | Ground |
| Buck Output + | Fuse Input | Reduced motor voltage |
| Buck Output - | Driver Power Ground / B- | Ground |

---

# ESP32 Power Module Wiring

The ESP32 is intended to be powered separately from the motor driver logic path.

| From | To | Purpose |
|------|----|---------|
| Battery / DC Rail | 5V Power Module Input | Power source |
| 5V Power Module Output USB-C | ESP32 USB-C | ESP32 power |

This separate 5V controller supply helps keep the ESP32 stable when the motor starts, stops, or creates electrical noise.

---

# Optional INA219 Voltage Monitoring Wiring

Firmware v1.12.1 supports optional **INA219 telemetry and low-voltage protection**.

## INA219 default firmware pins

| Firmware Setting | Default |
|------------------|---------|
| SDA | GPIO21 |
| SCL | GPIO22 |
| I2C Address | 0x40 (decimal 64) |
| Low-voltage LED pin | Unassigned by default |

## INA219 wiring

| From ESP32 | To INA219 | Purpose |
|------------|-----------|---------|
| GPIO21 | SDA | I2C data |
| GPIO22 | SCL | I2C clock |
| 3.3V or board-appropriate VCC* | VCC | INA219 power |
| GND | GND | Shared ground |

\* Use the correct supply voltage for the INA219 breakout board you are using.

## INA219 power sense path

| From Power Path | To INA219 | Purpose |
|-----------------|-----------|---------|
| Source side of monitored positive rail | VIN+ | Measure incoming supply |
| Load side of monitored positive rail | VIN- | Measure load-side supply |

Place the INA219 in series with the **positive supply path you want to monitor**.

---

# Optional Low-Voltage Warning LED Wiring

The firmware supports a dedicated optional **low-voltage LED output** tied to INA219 low-voltage state.

| From ESP32 | To LED Circuit | Purpose |
|------------|----------------|---------|
| Configured low-voltage LED GPIO | LED resistor -> LED anode | Warning output |
| LED cathode | GND | Return path |

Notes:
- The low-voltage LED pin is **not assigned by default**.
- Do not assign this output to **GPIO2**, which is already used by the onboard status LED.
- Choose a valid output-capable GPIO and set it in the PMT configuration.

---

# Optional Function Output Wiring

Firmware v1.12.1 supports up to **12 configurable function outputs** for lights or other switched low-current accessories.

## Function names used by firmware

| Function Slot | Default Name | Default Direction Mode | Default Pin |
|---------------|--------------|------------------------|-------------|
| F1 | Headlight | FWD | Unassigned |
| F2 | ReverseLgt | REV | Unassigned |
| F3-F12 | FX3 through FX12 | BOTH | Unassigned |

## Basic function output wiring

| From ESP32 | To Accessory Circuit | Purpose |
|------------|----------------------|---------|
| Configured function GPIO | Resistor / accessory input | Switched output |
| Accessory return | GND | Return path |

Notes:
- Function pins are **unassigned by default** in current firmware.
- A function must have a valid **pin** and **pattern** configured before it can be activated.
- The firmware blocks use of **GPIO2** for function outputs because GPIO2 is the onboard status LED.
- Active function outputs must not share the same GPIO pin.

## Supported function output patterns

| Pattern | Meaning |
|---------|---------|
| SOLID | Constant ON when active |
| DBL_BLNK | Double blink |
| FRED | Single blink then double blink style pattern |
| BLINK+ | Phase-based blink |
| BLINK- | Opposite-phase blink |

---

# Output-Capable GPIOs Commonly Used by Firmware

The firmware accepts these ESP32 GPIOs as runtime output-capable pins:

`0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33`

Practical PMT notes:
- **GPIO2** is reserved in practice for the onboard status LED.
- The default motor control mappings center around **GPIO25, GPIO26, GPIO27, and GPIO33**.
- **GPIO21 and GPIO22** are the default INA219 I2C pins.

---

# Complete Power Flow

## Battery installation

```text
Battery Adapter
      │
 (Optional)
Buck Converter
      │
     Fuse
      │
 Motor Driver
      │
 Motor or Controlled Track Feed

Battery / DC Rail
      │
 5V Power Module
      │
  ESP32 USB-C
```

## DC transformer installation

```text
DC Transformer
      │
     Fuse
      │
 Motor Driver
      │
 Motor or Controlled Track Feed

DC Rail
   │
5V Power Module
   │
ESP32 USB-C
```

---

# Wiring Checklist

- Motor driver mode in PMT matches the actual driver board control style
- ESP32 control pins match the configured PMT pin assignments
- Motor driver power input is fused
- ESP32 has its own 5V supply path through the power module
- Grounds are shared correctly between controller and driver logic
- Optional INA219 wiring is correct if telemetry/low-voltage protection is enabled
- Optional function outputs and low-voltage LED outputs use valid GPIOs and are not assigned to GPIO2

---

# Photo Placeholders

**Coming Soon**

```text
[Photo: ESP32 Wiring]

[Photo: IBT-2 Motor Driver Wiring]

[Photo: Alternate Driver Wiring]

[Photo: INA219 Wiring]

[Photo: Function Output Wiring]
```

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
