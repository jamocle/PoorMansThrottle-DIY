# Tools and Safety

This document lists the tools needed to build the Poor Man's Throttle and important safety guidelines.

Builders may choose a **beginner build style** or an **advanced build style** depending on their experience and installation goals.

---

# Tool Categories

Two tool sets are described:

• Basic Tools (no soldering required)  
• Advanced Tools (for permanent installations)

You may use either approach.

---

# Basic Tools

These tools allow a beginner to build the system using jumper wires or screw terminals.

| Tool | Purpose |
|-----|---------|
| Small screwdriver set | Tighten terminal screws |
| Multimeter (recommended) | Verify voltage and polarity |
| Breadboard female/female jumper wires | slide on connectors between boards |

These tools are sufficient for people inexperienced with soldering, testing or temporary installations.

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
| Multimeter | Measure voltage and continuity |

These tools are commonly used for locomotive installations.

---

# Safety Guidelines

Working with electrical systems requires careful attention to safety.

Always follow these rules.

---

# Use a Fuse

A fuse protects your wiring and electronics.

Install the fuse **in the positive power line**.

Typical recommended fuse:

**7.5A blade fuse** - or more for high power multi-motor together control

The fuse prevents damage if a short circuit occurs.

---

# Verify Polarity

Before connecting power:

• Verify positive and negative wires  
• Check polarity using a multimeter  
• Double check connections

Reversed polarity can damage electronics.

---

# Disconnect Power Before Changes

Always disconnect the battery or power supply before:

• changing wiring  
• adjusting components  
• installing electronics

Never modify wiring while power is connected.

---

# Adjust Buck Converters Before Use

NOTE: Buck converters are optional in this setup.

If a buck converter is used, it must be adjusted **before connecting electronics**.

Example:

20V battery → adjusted to about **15V output**

Incorrect voltage can damage the motor or electronics.

---

# Avoid Short Circuits

Short circuits can damage electronics and wiring.

To prevent shorts:

• keep wires insulated  
• avoid exposed conductors  
• secure loose wires  
• use heat shrink when possible

---

# Motor Safety

Locomotive motors can draw significant current.

Typical current levels:

| Condition | Current |
|----------|--------|
| Running | 0–3A |
| Stall | 1–10A |
| Multi motor | 1-40A |

If a locomotive stalls, the IBT-2 motor driver and fuse protect the system.

---

# Electrical Noise

Electric motors create electrical noise.

Optional components can help reduce interference.  This is **Completely Optional** and only necessary if you find issues with your setup.

| Component | Purpose |
|----------|---------|
| 470µF capacitor | Stabilizes IBT-2 motor driver power |
| 220µF capacitor | Stabilizes ESP32 power |
| Ferrite core | Reduces motor wire interference |

These components are **optional but recommended**.

---

# Work Slowly

Take your time when building the system.

• verify each connection  
• test components step by step  
• keep wiring organized

Careful assembly leads to reliable operation.

---

# Next Step

Continue to:

This document provides the step-by-step firmware installation.

https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/05_firmware_installation.md