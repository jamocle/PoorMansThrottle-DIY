# Installation Options

The Poor Man's Throttle electronics can be installed in several different ways depending on the locomotive and available space.

This document describes common installation methods used by hobbyists.

---

# Installation Goals

A good installation should:

• keep electronics secure  
• prevent wires from moving or rubbing  
• allow easy battery or power access  
• avoid contact with moving parts

---

# Common Installation Locations

Typical locations inside a locomotive include:

• locomotive body  
• tender  
• battery car  
• external enclosure (required for DC Transformer installations)

Each option has advantages depending on the locomotive design.

---

# Option 1 — Inside the Locomotive Body

This installation keeps everything inside the locomotive.

```
Locomotive Body
 ├─ ESP32 Controller
 ├─ Motor Driver
 ├─ Wiring
 └─ Optional Buck Converter
```

### Advantages

• fully self-contained  
• no external cars required

### Disadvantages

• limited space  
• heat buildup may occur

---

# Option 2 — Inside a Tender

Many locomotives have tenders with extra space.

```
Tender
 ├─ Battery
 ├─ ESP32
 ├─ Motor Driver
 └─ Wiring Harness → Locomotive
```

### Advantages

• more installation space  
• easier maintenance

### Disadvantages

• requires wiring between tender and locomotive

---

# Option 3 — Battery Car

A separate rail car holds the electronics and battery.

```
Battery Car
 ├─ Battery
 ├─ ESP32
 ├─ Motor Driver
 └─ Wiring → Locomotive Motor
```

### Advantages

• very easy installation  
• plenty of room for components

### Disadvantages

• requires an extra car in the train  
• requires wiring between extra car and locomotive

---

# Option 4 — Electronics Enclosure

Electronics may also be mounted inside a small enclosure.

```
Electronics Box
 ├─ ESP32
 ├─ Motor Driver
 ├─ Fuse
 └─ Wiring Connectors
```

### Advantages

• protects electronics  
• organized wiring

### Disadvantages

• may require mounting brackets

---

# Option 5 — Trackside DC Controller Box

When using a **DC model railroad transformer**, the Poor Man's Throttle system is normally installed **outside the locomotive**.

Instead of mounting electronics in the locomotive, the controller is installed in a **small project box placed between the transformer and the track**.

```
DC Transformer
      │
      │
      ▼
Controller Box
 ├─ ESP32
 ├─ Motor Driver
 ├─ Fuse
 └─ Wiring Terminals
      │
      ▼
   Track Leads
      │
      ▼
   Locomotive
```

In this configuration the controller acts as a **wireless throttle between the transformer and the track**.  It also supplies **High Torque PWM** power to the locomotives for extreme low speed and high speed control.

---

## Typical Controller Box Wiring

```
Transformer Output
        │
        ▼
       Fuse
        │
        ▼
   Controller Box
        │
        ▼
     Track Output
```

The ESP32 inside the controller box receives throttle commands from the smartphone and controls the motor driver that feeds the track.

---

## Advantages

• works with existing DC layouts  
• no locomotive modifications required  
• easy to install and remove  
• can control any locomotive on the track

---

## Recommended Enclosure

A small plastic project box works well.

Inside the enclosure you may mount:

• ESP32 controller  
• motor driver  
• fuse holder  
• wiring terminals

Terminal blocks or binding posts can make connecting the transformer and track wires easier.

---

# Mounting Tips

To keep electronics secure:

• use double-sided foam tape  
• use small screws or brackets  
• avoid loose components

Keep wiring away from:

• gears  
• wheels  
• drive shafts

---

# Ventilation

Motor drivers can generate heat.

Provide airflow when possible.

Avoid placing the motor driver directly against plastic surfaces.

---

# Wiring Management

Good wiring improves reliability.

Recommended practices:

• keep wires short  
• bundle wires together  
• label connectors if possible  
• secure wires with zip ties

---

# Photo Placeholders

**Coming Soon**

```
[Photo: ESP32 Wiring]

[Photo: Motor Driver Wiring]
```

---

# Next Step

Continue to:

This document explains how to safely power the system for the first time.

https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/08_first_power_test.md


[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
