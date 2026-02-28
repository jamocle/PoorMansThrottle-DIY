# Bill of Materials

This document lists the hardware required to build the Poor Man's Throttle system.

Some components are required for all builds.  
Others are optional depending on the installation style.

---

# Required Components

These parts are needed for every installation.

| Component | Description |
|----------|-------------|
| ESP32-WROOM-32 USB-C Development Board | Main controller |
| IBT-2 BTS7960 Motor Driver | High current motor driver |
| 5V Power Module | Provides 5V power for ESP32 |
| ATC Fuse Holder | Protects wiring and electronics |
| Blade Fuse (7.5A recommended) | Overcurrent protection |
| 16AWG Silicone Wire | Main power wiring |

---

# Battery Installation Components

These components are used when installing the system in a battery-powered locomotive.

| Component | Description |
|----------|-------------|
| Cordless Tool Battery | Main power source |
| Battery Adapter | Connects the battery to the system (https://www.amazon.com/dp/B0CVXP2RWN?ref=ppx_yo2ov_dt_b_fed_asin_title)|

Supported battery brands include:

• DeWalt  
• Milwaukee  
• Ryobi  
• Ridgid  
• other compatible tool batteries

Builders must select a battery adapter that matches their battery brand.

---

# DC Transformer Installation Components

For layouts powered by a DC model railroad transformer.

| Component | Description |
|----------|-------------|
| DC Model Railroad Transformer | Provides locomotive power |

A battery adapter is **not required** for this installation type.

---

# Optional Components

These components improve performance but are not required.

| Component | Purpose |
|----------|---------|
| Adjustable Buck Converter | Reduces battery voltage (https://www.amazon.com/dp/B085T73CSD?ref=ppx_yo2ov_dt_b_fed_asin_title)|
| 470µF Electrolytic Capacitor | Stabilizes motor power |
| 220µF Capacitor | Stabilizes 5V supply |
| Ferrite Core | Reduces electrical noise |

---

# Example Buck Converter

An adjustable DC-DC buck converter can reduce battery voltage.

Typical example:

20V battery → adjusted to about 15V output.

Any adjustable buck converter capable of handling the required current can be used. ->https://www.amazon.com/dp/B085T73CSD?ref=ppx_yo2ov_dt_b_fed_asin_title

---

# Connectors and Hardware

Builders may also need small hardware items.

Examples:

• screw terminals  
• crimp connectors  
• heat shrink tubing  
• mounting hardware

These parts vary depending on the installation style.

---

# Photo Placeholders

```
[Photo: ESP32 Wiring]

[Photo: Buck Converter Adjustment]

[Photo: Motor Driver Wiring]
```

---

# Next Step

Continue to:

```
04_tools_and_safety.md
```

This document describes the tools needed and important safety guidelines.