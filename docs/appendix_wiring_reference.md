# Wiring Reference

This appendix contains the complete wiring reference for the Poor Man's Throttle system.

Use these tables to verify wiring during assembly or troubleshooting.

---

# ESP32 to IBT-2 Motor Driver Wiring

| From ESP32 | To IBT-2 | Purpose             |
|------------|----------|---------------------|
| GPIO25     | RPWM     | Motor control       |
| GPIO26     | LPWM     | Motor control       |
| GPIO27     | R_EN     | Enable control      |
| GPIO33     | L_EN     | Enable control      |
| 5V / VIN   | VCC      |  Driver logic power |
| GND        | GND      | Shared ground       |

---

# IBT-2 Motor Driver Power Wiring

| From         | To IBT-2 | Purpose |
|--------------|----------|---------|
| Fuse Output  | B+       | IBT-2 Motor Driver power |
| Power Ground | B-       | Ground |

---

# Motor or DC Track Power Wiring

| From                  | To                                | Purpose      |
|-----------------------|-----------------------------------|--------------|
| IBT-2 Motor Driver M+ | Motor Lead or DC Track Power Lead | Motor output |
| IBT-2 Motor Driver M- | Motor Lead or DC Track Power Lead | Motor output |

---

# Buck Converter Wiring (Optional)

| From | To | Purpose |
|----|----|---------|
| Battery + | Buck Input + | Power input |
| Battery - | Buck Input - | Ground |
| Buck Output + | Fuse Input | Reduced voltage |
| Buck Output - | IBT-2 Motor Driver Ground | Ground |

---

# ESP32 Power Module Wiring

| From                         | To                    | Purpose      |
|------------------------------|-----------------------|--------------|
| Battery / DC Rail            | 5V Power Module Input | Power source |
| 5V Power Module Output USB-C | ESP32 USB-C           | ESP32 power  |

---

# Complete Power Flow

```
Battery Adapter or DC Transformer
            │
       (Optional)
     Buck Converter
            │
           Fuse
            │
      IBT-2 Motor Driver
            │
Motor or Track Power Lead

Battery / DC Rail
        │
   5V Power Module
        │
     ESP32 USB-C
```

---

# Photo Placeholders

**Coming Soon**

```
[Photo: ESP32 Wiring]

[Photo: IBT-2 Motor Driver Wiring]
```



[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
