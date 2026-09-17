# Installation Options

The Poor Man's Throttle electronics can be installed in several different ways depending on the device you are building, the available space, the power source, and the features you plan to use.

This document describes common installation methods used by hobbyists and explains the hardware choices that affect how an installation should be planned.

Poor Man's Throttle is no longer only one physical layout. The PMT app and firmware can support different PMT-style devices, including:

* **Poor Man's Throttle** — locomotive motor control
* **Poor Man's Module** — auxiliary PMT-style control hardware
* **Poor Man's Turbine** — ESC-style turbine / fan control

Most of this document focuses on locomotive throttle installations, but the same planning ideas also apply to modules, turbine builds, and external controller boxes.

---

# Installation Goals

A good installation should:

* keep electronics secure
* prevent wires from moving or rubbing
* allow easy battery or power access
* avoid contact with moving parts
* leave enough space for the selected driver, ESC, module wiring, and connectors
* allow access to optional hardware such as Wi-Fi, telemetry, lighting outputs, indicators, switches, or calibration points
* avoid enclosing the ESP32 in a way that unnecessarily blocks BLE or Wi-Fi performance
* make later service, firmware updates, and configuration changes practical

---

# Installation Planning Before You Mount Anything

Before choosing where to place the electronics, decide what kind of PMT device you are building and which firmware-supported hardware features your build will use.

## Choose the Device Type First

The physical installation depends on the device type.

| Device Type | Installation Focus |
|---|---|
| Poor Man's Throttle | ESP32, motor driver, motor or track feed, optional lighting, optional telemetry |
| Poor Man's Module | ESP32-based PMT control hardware for auxiliary device behavior |
| Poor Man's Turbine | ESP32, ESC / ESC-compatible controller, turbine or fan load, calibration access, optional telemetry |

A locomotive throttle build usually needs a motor driver.  
A turbine build usually needs an ESC-style output path instead of an IBT-2-style motor driver.  
A module build depends on the specific auxiliary hardware being controlled.

Do not assume every PMT device uses the same wiring or the same enclosure layout.

---

# Poor Man's Throttle Installation Planning

A Poor Man's Throttle build controls a locomotive motor or, in some DC layouts, controls power to the track.

## Motor Driver Mode Matters

Poor Man's Throttle supports multiple motor driver control modes. Each one changes how the ESP32 must be wired to the motor driver.

### DUAL_PWM

Separate forward and reverse PWM control, with optional enable pins.

Typical example boards:

* IBT-2
* BTS7960 / BTS7960B
* IBT-20
* other dual-PWM high-current drivers

Firmware defaults depend on the ESP32 board profile:

**Classic ESP32-WROOM**
* GPIO25 → forward PWM
* GPIO26 → reverse PWM
* GPIO27 → enable A
* GPIO33 → enable B

**ESP32-S3-WROOM-1-N16R8**
* GPIO6 → forward PWM
* GPIO7 → reverse PWM
* GPIO4 → enable A
* GPIO5 → enable B

This is often the best fit for heavier train loads and higher-current installations.

### PWM_DIR

One PWM pin for speed and one digital pin for direction.

Typical example boards:

* Cytron MD10C
* similar PWM + direction style drivers

Firmware defaults depend on the ESP32 board profile:

**Classic ESP32-WROOM**
* GPIO25 → PWM
* GPIO26 → DIR

**ESP32-S3-WROOM-1-N16R8**
* GPIO6 → PWM
* GPIO7 → DIR

This is a clean and simple wiring style when using a driver designed around a dedicated direction input.

### PWM_BIDIR

One PWM or enable pin plus separate forward and reverse logic pins.

Typical example boards:

* L298N
* L293D
* TB6612FNG
* similar H-bridge boards

Firmware defaults depend on the ESP32 board profile:

**Classic ESP32-WROOM**
* GPIO25 → PWM / EN
* GPIO27 → forward logic
* GPIO33 → reverse logic

**ESP32-S3-WROOM-1-N16R8**
* GPIO6 → PWM / EN
* GPIO4 → forward logic
* GPIO5 → reverse logic

This is common on inexpensive H-bridge boards.

### DUAL_INPT

Two motor-control inputs, with PWM applied to the active side depending on direction.

Typical example boards:

* DRV8833
* similar two-input H-bridge drivers

Firmware defaults depend on the ESP32 board profile:

**Classic ESP32-WROOM**
* GPIO25 → input A
* GPIO26 → input B

**ESP32-S3-WROOM-1-N16R8**
* GPIO6 → input A
* GPIO7 → input B

This is a compact option for smaller driver boards.

---

# Poor Man's Turbine Installation Planning

Poor Man's Turbine is different from a locomotive throttle build.

Instead of driving a locomotive motor through an IBT-2-style motor driver, a turbine build is intended around an **ESC-style control path** for a turbine, fan, or similar ESC-controlled load.

Typical turbine installation items include:

* ESP32 controller
* ESC or ESC-compatible controller
* turbine / fan / motor load appropriate for the ESC
* ESC power source
* ESC signal wire from the ESP32
* common ground between the ESP32 logic side and ESC signal side
* optional INA219 telemetry / low-voltage monitoring
* safe access for ESC calibration and testing

## Turbine Installation Considerations

Plan the turbine installation so that:

* the ESC has enough airflow and space for heat
* the ESC power wiring is short, secure, and fused where appropriate
* the ESP32 and ESC share the required signal ground
* the turbine or fan is physically guarded and cannot contact loose wires
* calibration can be performed safely before normal use
* the turbine can be tested at low output before applying full power
* the app can reach the device reliably over BLE or configured Wi-Fi/WebSocket

A turbine build should not blindly follow the IBT-2 locomotive motor-driver wiring diagrams.

---

# Poor Man's Module Installation Planning

A Poor Man's Module build is a PMT-style auxiliary controller rather than a locomotive motor throttle.

The exact installation depends on what the module is controlling, but the same general rules apply:

* mount the ESP32 securely
* provide stable logic power
* keep high-current loads away from delicate signal wiring
* use common ground where the controlled hardware requires it
* leave service access for configuration and troubleshooting
* label connectors so the module can be serviced later

If a module controls lighting, effects, accessories, or other outputs, plan the wiring harness before mounting the board.

---

# Optional Wi-Fi / WebSocket Control

BLE is the primary control method, but supported firmware can also use a **Wi-Fi / WebSocket control path** when Wi-Fi is enabled and configured.

This matters for installation because:

* a trackside or external controller box may be a better fit for Wi-Fi-enabled layouts
* enclosures should not excessively shield the ESP32 antenna
* you may want easier access for changing Wi-Fi credentials or checking network information
* the smartphone app can use saved or known-device information to help reconnect to previously configured devices
* a controller box can be designed around both BLE and Wi-Fi availability

Wi-Fi should normally be treated as an additional capability, not a substitute for doing the first power and motion tests carefully.

---

# Optional INA219 Telemetry / Low-Voltage Protection

Supported firmware can optionally use an **INA219 current/voltage monitor**.

This adds installation considerations:

* space for the INA219 module
* I2C wiring between the ESP32 and INA219
* optional low-voltage indicator LED wiring
* thoughtful placement so battery or supply leads are routed cleanly through the measurement path
* service access if the sensor or wiring needs troubleshooting later

Default INA219 wiring is board-profile specific:

| Board profile | SDA (`CV31`) | SCL (`CV32`) |
|---|---:|---:|
| Classic ESP32-WROOM | GPIO16 | GPIO17 |
| ESP32-S3-WROOM-1-N16R8 | GPIO17 | GPIO18 |

The default I2C address is `0x40` (`CV33=64`) on both profiles.

The INA219 is optional. The basic locomotive throttle build, module build, and turbine build can all be planned without it unless you want telemetry or low-voltage behavior.

---

# Optional Lighting / Function Outputs

The firmware supports configurable function outputs for items such as:

* headlight
* reverse light
* accessory or effect outputs
* indicators or other switched loads, depending on the build

This affects installation because you may need:

* extra GPIO planning
* additional connectors in the harness
* room for resistors, drivers, or lighting boards
* a clean wiring path between tender/body electronics and shell lighting

If you know you will later add lights or effects, leave spare wiring paths and connector positions during the original install.

---

# Scheduled Operation Planning

Supported firmware and the smartphone app can configure scheduled operation for supported PMT devices.

This can affect installation planning because unattended or semi-attended operation benefits from:

* secure wiring
* stable power
* a reliable fuse and switch arrangement
* good wireless placement for later connection
* careful placement of any moving, spinning, hot, or high-current parts
* easy access to stop, disconnect, or power down the device

For locomotive use, make sure the train behaves correctly under manual control before relying on scheduled operation.

For turbine use, make sure the ESC and load are calibrated and tested safely before relying on scheduled operation.

---

# App-Managed Consist Planning

MU / consist operation is managed by the smartphone app. Each locomotive controller still operates as its own PMT device.

This matters during installation because each locomotive in a consist should be installed, configured, and tested individually before being grouped in the app.

Before using a locomotive in a consist:

* confirm it connects reliably by itself
* confirm direction is correct
* confirm throttle response is predictable
* confirm stop and brake behavior work correctly
* confirm the device name is clear enough to identify in the app

Good device naming and consistent wiring make consists easier to manage.

---

# Common Installation Locations

Typical locations for PMT electronics include:

* locomotive body
* tender
* battery car
* external electronics enclosure
* trackside controller box
* auxiliary module enclosure
* turbine / fan enclosure or support box

Each option has advantages depending on the device type, selected driver or ESC, power source, and optional features.

---

# Option 1 — Inside the Locomotive Body

This installation keeps the main PMT throttle electronics inside the locomotive shell.

```text
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
* Test the locomotive as a single device before adding it to an app-managed consist.

---

# Option 2 — Inside a Tender

Many locomotives have tenders with extra room, making them one of the easiest PMT throttle installation locations.

```text
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
* Label the locomotive clearly in the app so it is easy to identify later for single-throttle or consist use.

---

# Option 3 — Battery Car

A separate rail car can hold the PMT electronics and battery.

```text
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

* This option is especially practical when testing different supported motor driver modes.
* It gives plenty of room for INA219 telemetry hardware, lighting drivers, connectors, and fusing.
* Use strain relief on all cables that leave the car.
* Keep the battery and motor power wiring physically secure so movement does not fatigue solder joints.
* Keep the ESP32 accessible enough for discovery, configuration, and troubleshooting.

---

# Option 4 — Electronics Enclosure

PMT electronics may also be mounted in a dedicated enclosure instead of inside rolling stock.

```text
Electronics Box
 ├─ ESP32
 ├─ Driver, ESC, or Module Wiring
 ├─ Fuse
 ├─ Wiring Connectors
 ├─ Optional INA219
 └─ Optional Antenna-Friendly Layout
```

### Best For

* bench testing
* modular installs
* portable controller systems
* auxiliary module builds
* turbine or fan projects where the electronics should be separate from the moving load
* projects where electronics should remain independent from the locomotive

### Advantages

* protects electronics
* organized wiring
* easy to move between test setups
* easy to access for configuration and wiring changes
* useful for testing throttle, module, or turbine hardware before permanent installation

### Disadvantages

* may require mounting brackets
* still requires external wiring to the locomotive, module load, ESC, turbine, or test hardware
* enclosure material and layout may affect wireless performance

### Installation Notes

* A plastic enclosure is usually better than metal for BLE and optional Wi-Fi signal performance.
* Leave ventilation room for the motor driver or ESC.
* Use connectors or terminal blocks for quick replacement of the locomotive, load, or test hardware.
* This option is a strong fit for hobbyists who frequently change motor drivers, pin assignments, optional modules, or ESC setups.
* If used for a turbine build, make sure moving parts are physically guarded and the ESC has enough airflow.

---

# Option 5 — Trackside DC Controller Box

When using a **DC model railroad transformer**, the PMT throttle system is commonly installed **outside the locomotive**.

Instead of mounting electronics in the locomotive, the controller is installed in a **small project box placed between the transformer and the track**.

```text
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
* the controller controls the powered track section, not an individual locomotive decoder

## Typical Controller Box Wiring

```text
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
* Use clear labels so the transformer input and track output cannot be accidentally reversed.

---

# Option 6 — Auxiliary Module Box

A Poor Man's Module can be installed in its own small enclosure.

```text
Module Box
 ├─ ESP32
 ├─ Module Output Wiring
 ├─ Logic Power
 ├─ Optional Fuse / Switch
 ├─ Optional Indicator LEDs
 └─ Connectors to Controlled Hardware
```

### Best For

* auxiliary effects or accessories
* bench-mounted control hardware
* layout-side devices
* add-on PMT devices that do not directly drive a locomotive motor

### Advantages

* keeps module electronics separate from locomotive wiring
* easy to label and service
* can be placed near the accessory or device it controls
* can still be discovered and configured through the PMT app

### Disadvantages

* exact wiring depends on the controlled hardware
* may need additional driver circuitry for higher-current loads
* power and grounding need to match the device being controlled

### Installation Notes

* Treat the module as its own PMT device with its own power, name, and wiring plan.
* Label outputs clearly.
* Keep load wiring separate from ESP32 signal wiring where practical.
* Leave enough access to troubleshoot the controlled accessory.

---

# Option 7 — Turbine / Fan Controller Installation

Poor Man's Turbine installations should be planned around the ESC, the moving load, and safe access for testing.

```text
Turbine / Fan Build
 ├─ ESP32
 ├─ ESC or ESC-Compatible Controller
 ├─ Turbine / Fan / Motor Load
 ├─ ESC Power Source
 ├─ Common Ground
 ├─ Optional INA219
 └─ Guarding / Airflow / Service Access
```

### Best For

* turbine-style effects
* fan-driven effects
* ESC-controlled loads
* experiments where the app controls an output device rather than a locomotive motor

### Advantages

* uses PMT app and firmware patterns for a different type of device
* can be configured and operated from the smartphone app
* supports safer testing when calibration and low-output checks are performed first
* can use optional telemetry and low-voltage behavior when installed

### Disadvantages

* ESC wiring and calibration are different from locomotive motor-driver wiring
* spinning loads require extra physical safety planning
* airflow and heat management are more important
* the build may need a dedicated enclosure or guarded mounting area

### Installation Notes

* Do not use the IBT-2 locomotive wiring guide for a turbine build.
* Confirm ESC signal, power, and ground wiring before applying power.
* Keep loose wires away from spinning parts.
* Mount the ESC where it can cool properly.
* Test calibration and low output before normal operation.
* Use the PMT app's turbine-specific controls and configuration workflow for setup.

---

# Firmware and App Features That Affect Installation

This section does not replace the command, CV, app, or wiring documentation. It highlights the capabilities that can change the physical design of the installation.

## 1. Device Type Changes the Hardware

Throttle, Module, and Turbine builds do not all use the same output hardware.

Plan the enclosure, connectors, and power routing around the actual device type you are building.

## 2. Motor Driver Selection Changes Wiring

For throttle builds, the supported motor driver types include:

* `DUAL_PWM`
* `PWM_DIR`
* `PWM_BIDIR`
* `DUAL_INPT`

That means the installation should be planned around the actual driver board you intend to use, not around one generic wiring diagram.

## 3. Pins Are Configurable

Supported firmware includes configurable pin assignments for the supported motor driver modes and optional hardware.

That helps when a locomotive layout forces different GPIO choices, but it also means your installation notes and labels should match the configured pins, not only the default examples.

## 4. Wi-Fi Is Optional

BLE remains the normal control path, but Wi-Fi / WebSocket can also be used when enabled and configured.

Installations that may use Wi-Fi should avoid burying the ESP32 where signal performance is poor or access is difficult.

## 5. INA219 Is Optional

Telemetry and low-voltage protection hardware are optional, but if they are part of the build, they should be planned from the start so battery wiring, I2C routing, and indicator outputs are not treated as afterthoughts.

## 6. Function Outputs May Need Harness Capacity

Function outputs can require extra wire paths, resistors, drivers, or connectors.

Even if your first build only uses headlight and reverse light, reserve connector capacity and wire routing for future functions if the locomotive may later gain smoke, marker lamps, cab light, or other effects.

## 7. App-Managed Consists Need Clear Device Identity

Because consisting is managed by the smartphone app, each locomotive should be named and tested individually before being added to a consist.

Clear names and consistent direction setup make multi-locomotive operation much easier.

## 8. Scheduled Operation Needs Reliable Physical Setup

Scheduled operation is only as good as the physical installation.

Before using schedules, make sure the wiring, power, fuse, motor/ESC behavior, and stop behavior are reliable under manual control.

---

# Mounting Tips

To keep electronics secure:

* use double-sided foam tape where appropriate
* use small screws or brackets for heavier boards
* avoid loose components
* provide strain relief for wires leaving a tender, car, enclosure, or module box
* leave service access for connectors, fuses, switches, and optional modules

Keep wiring away from:

* gears
* wheels
* drive shafts
* flywheels
* fan blades or turbine parts
* hot ESCs or motor drivers
* sharp frame edges

---

# Ventilation

Motor drivers and ESCs can generate heat.

Provide airflow when possible.

Avoid placing the driver or ESC directly against plastic surfaces with no air gap.

Larger or higher-current boards deserve extra spacing and should not be packed tightly against the ESP32, battery, or wiring bundle.

---

# Wiring Management

Good wiring improves reliability.

Recommended practices:

* keep wires short
* bundle wires together
* label connectors if possible
* secure wires with zip ties
* separate signal wiring from high-current motor, ESC, or load wiring where practical
* leave enough slack for shell removal without straining connectors
* keep spinning loads and moving model parts clear of loose wiring

For installations with optional lights, telemetry, or accessory outputs, plan the harness once instead of adding extra loose wires later.

---

# Suggested Build Checklist

Before final assembly, verify:

* selected device type is clear: Throttle, Module, or Turbine
* selected motor driver mode matches the actual board for throttle builds
* ESC signal and power wiring are correct for turbine builds
* ESP32 pin plan matches the intended firmware configuration
* battery or transformer power path is fused appropriately
* motor, ESC, or load wiring is secure and away from moving parts
* optional INA219 wiring is planned correctly if used
* optional low-voltage LED wiring is planned correctly if used
* any future lighting or function outputs have a realistic wiring path
* the enclosure or shell does not unnecessarily block wireless performance
* device name is clear enough to identify in the app
* service access remains possible after the body or enclosure is closed

---

# Photo Placeholders

**Coming Soon**

```text
[Photo: DUAL_PWM / IBT-2 Installation Example]

[Photo: PWM_BIDIR / L298N Installation Example]

[Photo: Tender Harness Example]

[Photo: Trackside Controller Box Example]

[Photo: Module Box Example]

[Photo: Turbine / ESC Installation Example]

[Photo: INA219 and Low-Voltage LED Example]
```

---

# Next Step

Continue to:

This document explains how to safely power the system for the first time.

[**08_first_power_test.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/08_first_power_test.md)

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
