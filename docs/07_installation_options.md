# Installation Options

The Poor Man's Throttle electronics can be installed in several different ways depending on the locomotive, the available space, and the firmware features you plan to use.

This document describes common installation methods used by hobbyists and explains the firmware-related hardware choices that now affect how an installation should be planned.

---

# Installation Goals

A good installation should:

* keep electronics secure  
* prevent wires from moving or rubbing  
* allow easy battery or power access  
* avoid contact with moving parts  
* leave enough space for the selected motor driver and wiring method  
* allow access to any optional hardware you plan to use, such as Wi-Fi, telemetry, or lighting outputs

---

# Installation Planning Before You Mount Anything

Before choosing where to place the electronics, decide which firmware-supported hardware features your build will use.

## Motor Driver Mode Matters

Poor Man's Throttle currently supports **four motor driver control modes**. Each one changes how the ESP32 must be wired to the motor driver.

### DUAL_PWM
Separate forward and reverse PWM control, with optional enable pins.

Typical example boards:

* IBT-2  
* BTS7960 / BTS7960B  
* IBT-20  
* other dual-PWM high-current drivers

Typical ESP32 control pins in the default firmware layout:

* GPIO25 → forward PWM  
* GPIO26 → reverse PWM  
* GPIO27 → enable A  
* GPIO33 → enable B

This is often the best fit for heavier train loads and higher-current installations.

### PWM_DIR
One PWM pin for speed and one digital pin for direction.

Typical example boards:

* Cytron MD10C  
* similar PWM + direction style drivers

Typical ESP32 control pins in the default firmware layout:

* GPIO25 → PWM  
* GPIO26 → DIR

This is a clean and simple wiring style when using a driver designed around a dedicated direction input.

### PWM_BIDIR
One PWM or enable pin plus separate forward and reverse logic pins.

Typical example boards:

* L298N  
* L293D  
* TB6612FNG  
* similar H-bridge boards

Typical ESP32 control pins in the default firmware layout:

* GPIO25 → PWM / EN  
* GPIO26 → forward logic  
* GPIO27 → reverse logic

This is common on inexpensive H-bridge boards.

### DUAL_INPT
Two motor-control inputs, with PWM applied to the active side depending on direction.

Typical example boards:

* DRV8833  
* similar two-input H-bridge drivers

Typical ESP32 control pins in the default firmware layout:

* GPIO25 → input A  
* GPIO26 → input B

This is a compact option for smaller driver boards.

## Optional Wi-Fi / WebSocket Control

BLE is the primary control method, but the firmware can also start a **Wi-Fi / WebSocket control path** when Wi-Fi is enabled and configured.

This matters for installation because:

* a trackside or external controller box may be a better fit for Wi-Fi-enabled layouts  
* enclosures should not excessively shield the ESP32 antenna  
* you may want easier access for changing Wi-Fi credentials or checking IP information  
* a controller box can be designed around both BLE and Wi-Fi availability

## Optional INA219 Telemetry / Low-Voltage Protection

The firmware can optionally use an **INA219 current/voltage monitor**.

This adds installation considerations:

* space for the INA219 module  
* I2C wiring between the ESP32 and INA219  
* optional low-voltage indicator LED wiring  
* thoughtful placement so battery or supply leads are routed cleanly through the measurement path

Default INA219-related firmware assumptions include:

* SDA default pin: GPIO21  
* SCL default pin: GPIO22  
* default I2C address: `0x40`

## Optional Lighting / Function Outputs

The firmware supports up to **12 configurable function outputs** for items such as:

* headlight  
* reverse light  
* accessory or effect outputs

This affects installation because you may need:

* extra GPIO planning  
* additional connectors in the harness  
* room for resistors, drivers, or lighting boards  
* a clean wiring path between tender/body electronics and the shell lighting

If you know you will later add lights or effects, leave spare wiring paths and connector positions during the original install.

---

# Common Installation Locations

Typical locations for PMT electronics include:

* locomotive body  
* tender  
* battery car  
* external electronics enclosure  
* trackside controller box

Each option has advantages depending on the locomotive design, selected motor driver, power source, and optional firmware features.

---

# Option 1 — Inside the Locomotive Body

This installation keeps the main PMT electronics inside the locomotive shell.

```
Locomotive Body
 ├─ ESP32 Controller
 ├─ Motor Driver
 ├─ Wiring
 ├─ Optional Buck Converter
 ├─ Optional INA219
 └─ Optional Lighting Harness
```

### Best For

* locomotives with generous internal space  
* fully self-contained battery installations  
* simple BLE-first installs  
* builds where lighting wiring stays inside the locomotive shell

### Advantages

* fully self-contained  
* no external cars required  
* neat appearance with no trailing harnesses

### Disadvantages

* limited space in many locomotives  
* heat buildup may occur  
* harder to service once assembled  
* less room for larger drivers such as IBT-2 class boards  
* less room for optional INA219 or extra function wiring

### Installation Notes

* Check motor-driver size before committing to this option.  
* Leave room around the ESP32 so BLE and optional Wi-Fi performance are not heavily blocked by metal.  
* If using many function outputs, plan shell removal and connector access carefully.  
* Keep the motor driver away from moving gear towers, flywheels, and drive shafts.  

---

# Option 2 — Inside a Tender

Many locomotives have tenders with extra room, making them one of the easiest PMT installation locations.

```
Tender
 ├─ Battery
 ├─ ESP32
 ├─ Motor Driver
 ├─ Optional INA219
 ├─ Optional Fuse / Main Switch
 └─ Wiring Harness → Locomotive
```

### Best For

* battery-powered installations  
* larger motor drivers  
* builds needing easier maintenance access  
* installs that will later add lighting, telemetry, or accessory outputs

### Advantages

* more installation space  
* easier maintenance  
* more room for battery, fuse, and wiring organization  
* easier to add optional telemetry and function wiring

### Disadvantages

* requires wiring between tender and locomotive  
* harness design becomes more important  
* visible connector or cable may be required between units

### Installation Notes

* This is often the easiest place to use larger drivers such as IBT-2 / BTS7960 style boards.  
* A tender also works well when adding an INA219 module and low-voltage indicator LED.  
* Plan the harness for motor leads, lighting leads, and any shared ground returns from the start.  
* Use a connector that supports future expansion if you may later add headlights, reverse lights, or accessory functions.  

---

# Option 3 — Battery Car

A separate rail car can hold the PMT electronics and battery.

```
Battery Car
 ├─ Battery
 ├─ ESP32
 ├─ Motor Driver
 ├─ Optional INA219
 ├─ Fuse / Main Power Switch
 └─ Wiring → Locomotive Motor and Optional Lights
```

### Best For

* very large batteries  
* easy retrofits  
* temporary or experimental installs  
* locomotives with almost no internal space

### Advantages

* very easy installation  
* plenty of room for components  
* easy access for service and upgrades  
* good choice for trying different motor driver boards

### Disadvantages

* requires an extra car in the train  
* requires wiring between extra car and locomotive  
* visible wiring may reduce realism  
* more chance of cable strain between cars

### Installation Notes

* This option is especially practical when testing different firmware-supported motor driver modes.  
* It gives plenty of room for INA219 telemetry hardware, lighting drivers, connectors, and fusing.  
* Use strain relief on all cables that leave the car.  
* Keep the battery and motor power wiring physically secure so movement does not fatigue solder joints.  

---

# Option 4 — Electronics Enclosure

PMT electronics may also be mounted in a dedicated enclosure instead of inside rolling stock.

```
Electronics Box
 ├─ ESP32
 ├─ Motor Driver
 ├─ Fuse
 ├─ Wiring Connectors
 ├─ Optional INA219
 └─ Optional Antenna-Friendly Layout
```

### Best For

* bench testing  
* modular installs  
* portable controller systems  
* projects where electronics should remain independent from the locomotive

### Advantages

* protects electronics  
* organized wiring  
* easy to move between test setups  
* easy to access for CV and wiring changes

### Disadvantages

* may require mounting brackets  
* still requires external wiring to the locomotive  
* enclosure material and layout may affect wireless performance

### Installation Notes

* A plastic enclosure is usually better than metal for BLE and optional Wi-Fi signal performance.  
* Leave ventilation room for the motor driver.  
* Use connectors or terminal blocks for quick replacement of the locomotive or test load.  
* This option is a strong fit for hobbyists who frequently change motor drivers, pin assignments, or optional modules.  

---

# Option 5 — Trackside DC Controller Box

When using a **DC model railroad transformer**, the PMT system is commonly installed **outside the locomotive**.

Instead of mounting electronics in the locomotive, the controller is installed in a **small project box placed between the transformer and the track**.

```
DC Transformer
      │
      ▼
Controller Box
 ├─ ESP32
 ├─ Motor Driver
 ├─ Fuse
 ├─ Wiring Terminals
 ├─ Optional Wi-Fi / WebSocket Use
 └─ Optional INA219
      │
      ▼
   Track Leads
      │
      ▼
   Locomotive
```

In this configuration the controller acts as a **wireless throttle between the transformer and the track**.

### Best For

* existing DC layouts  
* users who do not want to modify locomotives  
* shared layouts with multiple locomotives  
* installations where an external box is the most practical place for Wi-Fi-enabled control hardware

### Advantages

* works with existing DC layouts  
* no locomotive modifications required  
* easy to install and remove  
* can control any locomotive on the track  
* provides plenty of room for wiring terminals, fuses, and optional telemetry hardware

### Disadvantages

* all control electronics are external  
* wiring quality to the transformer and track becomes very important  
* enclosure layout must consider wireless signal access  
* not all installation practices used for onboard battery power apply here

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

## Recommended Enclosure

A small plastic project box works well.

Inside the enclosure you may mount:

* ESP32 controller  
* motor driver  
* fuse holder  
* wiring terminals  
* optional INA219 module  
* optional indicator LEDs

Terminal blocks or binding posts can make connecting the transformer and track wires easier.

## Installation Notes

* This is one of the most natural places to use optional Wi-Fi / WebSocket support because the controller box is easy to reach and has more room for wireless-friendly placement.  
* A controller box also makes it easier to include low-voltage indication, external switches, and clear labeling for power and track terminals.  
* Keep high-current wiring short and secure inside the box.  
* Do not crowd the ESP32 antenna area against dense metal parts or heavy wire bundles if wireless range matters.  

---

# Firmware Features That Affect Installation

This section does not replace the command or CV documentation. It highlights the firmware capabilities that can change the physical design of the installation.

## 1. Motor Driver Selection Changes Wiring

The current firmware supports these motor driver types:

* `DUAL_PWM`  
* `PWM_DIR`  
* `PWM_BIDIR`  
* `DUAL_INPT`

That means the installation should be planned around the actual driver board you intend to use, not around one generic wiring diagram.

## 2. Pins Are Configurable

The firmware includes configurable pin assignments for the supported motor driver modes.

That helps when a locomotive layout forces different GPIO choices, but it also means your installation notes and labels should match the configured pins, not only the default examples.

## 3. Wi-Fi Is Optional

BLE remains the normal control path, but Wi-Fi / WebSocket can also be used when enabled and configured.

Installations that may use Wi-Fi should avoid burying the ESP32 where signal performance is poor or access is difficult.

## 4. INA219 Is Optional

Telemetry and low-voltage protection hardware are optional, but if they are part of the build, they should be planned from the start so battery wiring, I2C routing, and indicator outputs are not treated as afterthoughts.

## 5. Function Outputs May Need Harness Capacity

The firmware supports up to 12 configurable function outputs.

Even if your first build only uses headlight and reverse light, reserve connector capacity and wire routing for future functions if the locomotive may later gain smoke, marker lamps, cab light, or other effects.

---

# Mounting Tips

To keep electronics secure:

* use double-sided foam tape where appropriate  
* use small screws or brackets for heavier boards  
* avoid loose components  
* provide strain relief for wires leaving a tender, car, or enclosure  
* leave service access for connectors, fuses, and optional modules

Keep wiring away from:

* gears  
* wheels  
* drive shafts  
* flywheels  
* sharp frame edges

---

# Ventilation

Motor drivers can generate heat.

Provide airflow when possible.

Avoid placing the motor driver directly against plastic surfaces with no air gap.

Larger or higher-current boards deserve extra spacing and should not be packed tightly against the ESP32 or battery.

---

# Wiring Management

Good wiring improves reliability.

Recommended practices:

* keep wires short  
* bundle wires together  
* label connectors if possible  
* secure wires with zip ties  
* separate signal wiring from high-current motor wiring where practical  
* leave enough slack for shell removal without straining connectors

For installations with optional lights, telemetry, or accessory outputs, plan the harness once instead of adding extra loose wires later.

---

# Suggested Build Checklist

Before final assembly, verify:

* selected motor driver mode matches the actual board  
* ESP32 pin plan matches the intended firmware configuration  
* battery or transformer power path is fused appropriately  
* motor wiring is secure and away from moving parts  
* optional INA219 wiring is planned correctly if used  
* optional low-voltage LED wiring is planned correctly if used  
* any future lighting or function outputs have a realistic wiring path  
* the enclosure or shell does not unnecessarily block wireless performance  
* service access remains possible after the body is closed

---

# Photo Placeholders

**Coming Soon**

```
[Photo: DUAL_PWM / IBT-2 Installation Example]

[Photo: PWM_BIDIR / L298N Installation Example]

[Photo: Tender Harness Example]

[Photo: Trackside Controller Box Example]

[Photo: INA219 and Low-Voltage LED Example]
```

---

# Next Step

Continue to:

This document explains how to safely power the system for the first time.

[**08_first_power_test.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/08_first_power_test.md)

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
