# Bill of Materials

This document lists the hardware required to build the Poor Man's Throttle system.

Some components are required for all builds.  
Others are optional depending on the installation style.

---

# Required Components

These parts are needed for every installation.

| Component                              | Description                 | Possible Buy Location |
|----------------------------------------|-----------------------------|-----------------------|
| ESP32-WROOM-32 USB-C Development Board | Main controller |(Cheap Chinese)https://www.amazon.com/dp/B0DNYR973V?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1  Check Ebay as well|
| IBT-2 BTS7960 Motor Driver             | High current motor driver   |https://www.amazon.com/dp/B0BGR92TCD?ref=ppx_yo2ov_dt_b_fed_asin_title|
| 5V Power Module                        | Provides 5V power for ESP32 |https://www.amazon.com/dp/B0BNQ5JNWZ?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1|

---

# Battery Installation Components

These components are used when installing the system in a battery-powered locomotive.

| Component              | Description                                                               |
|------------------------|---------------------------------------------------------------------------|
| Cordless Tool Battery  | Main power source                                                         |
| DeWalt Battery Adapter | Connects the battery to the system (https://www.amazon.com/dp/B0CVXP2RWN?ref=ppx_yo2ov_dt_b_fed_asin_title)|

Supported battery brands include:

* DeWalt  
* Milwaukee  
* Ryobi  
* Rigid  
* other compatible tool batteries  
* other model hobbyist batteries (LiPo, Lithuim Ion, NiMH, Lead Acid, Alkaline) 

Builders must select a battery adapter that matches their battery brand.

---

# DC Transformer Installation Components

For layouts powered by a DC model railroad transformer.

| Component                     | Description               |
|-------------------------------|---------------------------|
| DC Model Railroad Transformer | Provides locomotive power |

A battery adapter is **Unnecessary** for this installation type.

---

# Optional Components

These parts optional for your installation and **NOT** required.

| Component                    | Description                               | Possible Buy Location |
|------------------------------|-------------------------------------------|-----------------------|
| 4-38V Buck Converter 5A      | Reduces Voltage to match locomotive specs |https://www.amazon.com/dp/B085T73CSD?ref=ppx_yo2ov_dt_b_fed_asin_title|
| 1.2-36V Buck Converter 20A   | Reduces Voltage to match locomotive specs |https://www.amazon.com/dp/B07R832BRX?ref=ppx_yo2ov_dt_b_fed_asin_title|
| Low Voltage Disconnect       | Protects battery from undercharge         |https://www.amazon.com/dp/B0C2VMGCZR?ref=ppx_yo2ov_dt_b_fed_asin_title|
| ATC Fuse Holder              | Protects wiring and electronics           ||
| Blade Fuse (7.5A recommended)| Overcurrent protection                    ||
| 16AWG Silicone Wire          | Main power wiring                         ||
| 470µF Electrolytic Capacitor | Stabilizes motor power                    ||
| 220µF Capacitor              | Stabilizes 5V supply                      ||
| Ferrite Core                 | Reduces electrical noise                  ||

---

# Example Buck Converter

An adjustable DC-DC buck converter can reduce battery voltage.

Typical example:

20V battery → adjusted to about 15V output.

Any adjustable buck converter capable of handling the required current can be used.   
->https://www.amazon.com/dp/B085T73CSD?ref=ppx_yo2ov_dt_b_fed_asin_title  
->https://www.amazon.com/dp/B07R832BRX?ref=ppx_yo2ov_dt_b_fed_asin_title

---

# Connectors and Hardware

Builders may also need small hardware items.

Examples:

* screw terminals  
* crimp connectors  
* heat shrink tubing  
* mounting hardware

These parts vary depending on the installation style.

---

# Photo Placeholders

**Coming Soon**

![IBT-2 Wiring](docimages/ibt2wiring.PNG)

![LED Wiring](docimages/ledwiring.PNG)

![L298N](docimages/l298n.PNG)

![L298N Example](docimages/l298nwiring.PNG)


---

# Next Step

Continue to:

This document describes the tools needed and important safety guidelines.

[**04_tools_and_safety.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/04_tools_and_safety.md)


[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
