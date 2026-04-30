# Tools and Safety

This document lists the tools needed to build the Poor Man's Throttle and the most important safety practices to follow during wiring, power-up, testing, and installation.

This version has been refreshed against the current firmware behavior for **Poor Man's Throttle firmware v1.12.1** on **ESP32-WROOM-32**. The firmware supports multiple motor driver control styles, optional INA219 low-voltage monitoring, BLE control, and optional Wi-Fi/WebSocket control, so the safety guidance below has been updated to match that broader scope.

Builders may choose a **beginner build style** or an **advanced build style** depending on their experience and installation goals.

---

# Tool Categories

Two tool sets are described:

* Basic Tools (no soldering required)  
* Advanced Tools (for permanent installations)

You may use either approach.

---

# Basic Tools

These tools allow a beginner to build the system using jumper wires, temporary wiring, or screw terminals.

| Tool | Purpose |
|-----|---------|
| Small screwdriver set | Tighten terminal screws and module terminals |
| Multimeter | Verify voltage, polarity, continuity, and adjusted buck output before connection |
| Breadboard female/female jumper wires | Temporary signal connections between boards |
| Breadboard male/female jumper wires | Temporary connections from boards to loose modules or test setups |
| Label tape or masking tape | Mark wires during setup and troubleshooting |
| Small flush cutters or scissors | Trim zip ties, heat shrink, or temporary wire ends |

These tools are sufficient for people inexperienced with soldering, testing, or temporary installations, but a **multimeter is strongly recommended**, not optional.

---

# Advanced Tools

Advanced builders may want to create a more permanent installation.

| Tool | Purpose |
|-----|---------|
| Soldering iron | Permanent electrical connections |
| Solder | Electrical joints |
| Wire cutters | Cut wires to length |
| Wire stripper | Remove insulation |
| Heat shrink tubing | Protect solder joints |
| Heat gun or lighter | Shrink tubing |
| Crimp tool | Install crimp connectors |
| Ferrules or crimp terminals | Improve screw terminal connections |
| Multimeter | Measure voltage, continuity, polarity, and fault conditions |
| Bench power supply or fused test supply | Safer first power-up and troubleshooting |
| Helping hands or PCB holder | Stabilize boards while soldering |

These tools are commonly used for locomotive installations.

---

# Hardware Awareness Before You Build

Poor Man's Throttle is not limited to one motor driver board.

The current firmware supports these motor driver control modes:

| Mode | Typical Control Style | Common Example |
|-----|------------------------|----------------|
| DUAL_PWM | Separate forward and reverse PWM outputs, with optional enable pins | IBT-2 / BTS7960 |
| PWM_DIR | One PWM pin plus one direction pin | Cytron MD10C style drivers |
| PWM_BIDIR | One PWM or enable pin plus forward and reverse logic pins | L298N style drivers |
| DUAL_INPT | Two H-bridge inputs, with PWM applied to the active side | DRV8833 style drivers |

This matters because the exact wiring, current capability, and fault behavior depend on the driver board you are actually using. Do not assume every installation behaves like an IBT-2 build.

---

# Firmware-Backed Build Considerations

The firmware also supports these optional hardware-related features:

| Feature | Why It Matters |
|--------|-----------------|
| Configurable motor control pins | Wiring may differ from the default example pins |
| 12 configurable function outputs | Additional lights or effects may add more wiring points |
| BLE control | Default wireless control path |
| Optional Wi-Fi / WebSocket control | Optional secondary or failover control path when configured |
| Optional INA219 voltage/current telemetry | Can be used for low-voltage warning, throttle limiting, shutdown, and disconnect detection |
| Onboard and subscribed LED behavior | LED outputs may be used for status or low-voltage indication |

Because of this, safe builds should be planned around the **actual configured hardware**, not only the default demo wiring.

---

# Use a Fuse

A fuse protects your wiring and electronics.

Install the fuse **in the positive power line** and place it **as close to the power source as practical**.

Typical recommended fuse:

**7.5A blade fuse** for many single-motor installations

Larger locomotives, multiple motors, or higher-current drivers may require a different fuse value. Choose a fuse size that matches the expected wiring and driver current, not just a default number.

The fuse is there to reduce damage if a short circuit or wiring failure occurs. It does **not** replace correct wire sizing or careful wiring.

---

# Verify Polarity

Before connecting power:

* verify positive and negative wires  
* check polarity using a multimeter  
* double check battery adapters, buck converters, and motor driver terminals  
* confirm the ESP32 power input is correct before applying power

Reversed polarity can damage electronics quickly.

---

# Disconnect Power Before Changes

Always disconnect the battery or power supply before:

* changing wiring  
* adjusting components  
* changing motor driver pin connections  
* installing electronics  
* changing optional sensor or LED wiring

Never modify wiring while power is connected.

---

# Adjust Buck Converters Before Use

NOTE: Buck converters are optional in this setup.

If a buck converter is used, it must be adjusted **before connecting electronics**.

Example:

20V battery → adjusted to about **15V output** for the motor path, or to the correct lower voltage required by the electronics being powered

Incorrect voltage can damage the motor, ESP32, motor driver logic, LEDs, or sensors.

Always verify the output with a multimeter before connecting the load.

---

# Use Separate Logic and Motor Power Planning When Needed

Many installations benefit from treating **logic power** and **motor power** as separate concerns.

Examples:

* ESP32 powered from a regulated 5V source  
* motor driver motor input powered from the main battery or track-side DC source  
* optional sensors and LEDs powered from a suitable regulated rail

This reduces reset problems, brownouts, and noise-related issues during heavy motor load changes.

---

# Avoid Short Circuits

Short circuits can damage electronics and wiring.

To prevent shorts:

* keep wires insulated  
* avoid exposed conductors  
* secure loose wires  
* use heat shrink when possible  
* protect battery adapter and motor terminals from accidental contact  
* secure modules so they cannot shift into metal chassis parts

---

# Motor Driver and Wiring Safety

Motor driver boards are not interchangeable in their limits.

Before installation, verify:

* the control mode matches the board you are using  
* the driver's voltage range matches your power source  
* the driver's continuous and stall current rating are suitable for the locomotive  
* the heat sinking and airflow are adequate for the expected load  
* your wire gauge matches expected current

A board that works for a bench test may still be undersized for long heavy-train operation.

---

# Motor Safety

Locomotive motors can draw significant current, especially at startup, on grades, when hauling long consists, or during a stall.

Typical current levels vary widely depending on the motor, gearing, locomotive size, load, voltage, and driver used. The original guide gave example ranges such as:

| Condition | Example Current Range |
|----------|------------------------|
| Running | 0–3A |
| Stall | 1–10A |
| Multi motor | 1–40A |

Treat these as rough examples only, not guaranteed limits for your build.

Important safety note:

* motor **stall current** is the most important value to understand  
* the driver, fuse, battery wiring, and connectors must all tolerate the real worst-case load  
* repeated stalls can overheat wiring, drivers, batteries, and motors

If the locomotive stalls, remove power and find the cause instead of repeatedly commanding more throttle.

---

# Low-Voltage and Battery Protection

The current firmware includes optional **INA219 telemetry and protection support**.

When configured, it can be used for:

* voltage warning  
* throttle limiting under low-voltage conditions  
* low-voltage shutdown  
* recovery threshold handling  
* battery disconnect detection  
* optional low-voltage LED indication

This is useful for battery-powered installations, but it is still **optional** and depends on correct hardware installation and configuration.

Important guidance:

* do not rely on firmware protection if the sensor is not installed and configured correctly  
* a separate hardware low-voltage disconnect may still be desirable for battery protection  
* verify shutdown and warning thresholds carefully before regular use

---

# Control Link Safety

The firmware supports **BLE control** and can optionally enable **Wi-Fi/WebSocket** as a secondary or failover control path.

The firmware also includes connection-loss safety behavior such as:

* grace-period handling after loss of control connection  
* forced stop latching after disconnect timeout  
* safe-stop behavior before some restart or recovery actions  
* reverse sequencing that stops first before changing direction when already moving

This improves safety, but it is not a substitute for careful testing.

Always test:

* startup behavior  
* disconnect behavior  
* reconnect behavior  
* stop and brake behavior  
* direction change behavior

Do this **with the locomotive supported or wheels off the track** during initial validation.

---

# LED and Function Output Safety

The firmware supports:

* the onboard status LED  
* subscribed LED patterns  
* up to **12 configurable function outputs** for lights or effects

Before wiring extra lighting or function outputs:

* verify the selected GPIO is appropriate for output use  
* do not overload an ESP32 GPIO pin directly  
* use a transistor, MOSFET, relay module, or driver stage when the load exceeds safe GPIO drive capability  
* confirm shared grounds where required  
* label auxiliary wires clearly

Do not treat ESP32 GPIO pins as direct power outputs for large lamps, smoke units, or high-current accessories.

---

# Electrical Noise

Electric motors create electrical noise.

Optional components can help reduce interference. These are **optional** and mainly useful if your installation shows resets, unstable control, or noisy power behavior.

| Component | Purpose |
|----------|---------|
| 470µF capacitor | Helps stabilize motor driver supply input in some installations |
| 220µF capacitor | Helps stabilize ESP32 or logic supply input |
| Ferrite core | Helps reduce interference on motor leads or power wiring |

These parts are optional, but they can improve reliability in difficult installations.

---

# Bench Test Before Full Installation

Before permanent installation:

* test the ESP32 and motor driver on the bench  
* confirm the configured motor driver mode matches the hardware  
* verify motor direction and stop behavior at low throttle  
* verify fuse placement and polarity  
* verify optional buck converter voltage  
* verify optional INA219 readings and thresholds if used  
* verify lights and function outputs one at a time

This is the safest way to catch wiring mistakes before placing the system into a locomotive.

---

# Work Slowly

Take your time when building the system.

* verify each connection  
* test components step by step  
* keep wiring organized  
* change one thing at a time during troubleshooting

Careful assembly leads to reliable operation.

---

# Next Step

Continue to:

This document provides the step-by-step firmware installation.

[**05_firmware_installation.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/05_firmware_installation.md)

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
