# Poor Man's Throttle  
### Wireless Control for Model Trains — Without the High Cost

## The Problem

Wireless throttle systems for model trains can be expensive and complicated.

Many hobbyists who convert locomotives to **battery power (dead-rail)** need a simple way to control their trains wirelessly without investing hundreds of dollars in commercial systems.

At the same time, hobbyists using **traditional DC transformers** often experience poor low-speed performance.

Typical problems include:

• locomotive hum at low speeds  
• weak torque when starting  
• jerky slow-speed operation  

These issues occur because inexpensive DC transformers reduce voltage instead of properly controlling motor power.

---

## The Solution

**Poor Man's Throttle** is a low-cost wireless throttle system that lets a smartphone control a model locomotive.

Using a simple ESP32 controller and an inexpensive motor driver, the system converts Bluetooth commands from a phone into **PWM motor control** (Pulse Width Modulation) signals.

This provides smooth and powerful motor control while allowing wireless operation from a smartphone.

---

## What It Does

Poor Man's Throttle allows a smartphone to control:

• locomotive speed  
• forward direction  
• reverse direction  
• stop  
• other commands  


All control is wireless, allowing the operator to walk around the layout while controlling the train.

---

# A Huge Upgrade for Traditional DC Layouts

Poor Man's Throttle is especially powerful when used with **traditional DC transformers**.

Instead of using the transformer to control speed, the transformer is set to **full power**.

The Poor Man's Throttle hardware then uses **PWM motor control** to regulate the locomotive speed.

```
DC Transformer (set to full power)
            │
            │
     Poor Man's Throttle
      PWM Motor Control
            │
            │
      Locomotive Motor
```

This provides several major benefits.

### Smooth Low-Speed Operation

PWM control allows locomotives to move smoothly at extremely low speeds.

### High Starting Torque

The motor still receives strong power pulses, allowing the locomotive to start moving easily.

### Eliminate Transformer Hum

Because the transformer is not operating at very low voltage levels, the humming and buzzing common with cheap DC throttles is greatly reduced.

### Wireless Operation

The system also adds **smartphone wireless control** to traditional DC layouts.

This combination of **smooth PWM control and wireless operation** is rarely available with inexpensive DC transformer systems.

---

## Designed for Dead-Rail

The system is also ideal for **dead-rail locomotives** powered by onboard batteries.

It works with common cordless tool batteries such as:

• DeWalt  
• Milwaukee  
• Ryobi  
• Rigid    
• other compatible tool batteries  
• other model hobbyist batteries (LiPo, Lithuim Ion, NiMH, Lead Acid, Alkaline) 

This allows hobbyists to reuse inexpensive and widely available batteries.

---

## Typical Hardware Cost

A basic build typically costs around:

**$21 per locomotive**

Example parts:

| Component | Typical Cost |
|----------|--------------|
| ESP32 Development Board | ~$6 |
| IBT-2 Motor Driver | ~$10 |
| 5V Power Module | ~$5 |

Total: **about $21**

Many hobbyists already have some of these components available.

---

## Who This Is For

This project is designed for:

• model railroad hobbyists  
• dead-rail builders  
• traditional DC layout operators  
• DIY electronics enthusiasts  
• makers and tinkerers  

It supports both:

**Beginner builders** using simple wiring  
and  
**Advanced builders** creating permanent installations.

---

## The Goal

The goal of Poor Man's Throttle is simple:

**Make wireless model train control accessible to anyone who wants to build it.**

No expensive proprietary hardware.  
No complicated systems.  
Just a simple, open, affordable throttle.

---

# Next Step

Continue to:

```
01_quick_overview.md
```

This document performs a quick overview of Poor Man's Throttle.