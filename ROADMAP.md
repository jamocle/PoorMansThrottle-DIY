# Poor Man’s Throttle Roadmap

This document outlines completed features, planned improvements, and future ideas for the Poor Man’s Throttle project.

The roadmap is organized by feature category rather than development order.

Poor Man’s Throttle has grown from a single locomotive throttle into a broader PMT control platform that includes:

* Poor Man’s Throttle locomotive controllers
* Poor Man’s Module accessory / module-style controllers
* Poor Man’s Turbine ESC-style turbine / blower controllers
* the PMT smartphone app used to discover, configure, and operate supported devices

⸻

✅ ## Completed Features (Available Today)

These items are already part of the current PMT app and firmware platform.

Core Wireless Control

* Bluetooth smartphone control for PMT devices.
* Optional Wi-Fi / WebSocket control path for supported and configured devices.
* Known-device support to help reconnect to previously configured devices.
* Device naming so locomotives and PMT devices can be identified more easily in the app.

Locomotive Profiles, Configuration Management, and Operating Modes

* Locomotive Profiles
    The app can store settings for individual locomotives so each locomotive can have its own tuning, limits, behavior settings, and configuration.
* Copy Settings Between Locomotives
    Users can copy configuration settings from one locomotive profile to another, making it easier to configure multiple locomotives with similar behavior.
* Yard Switching Mode
    The app includes a yard switching mode optimized for slow-speed switching operations, giving users finer low-speed control for yard movements and close-coupling work.

Locomotive Throttle Control

* Forward / reverse direction control.
* Stop, quick-stop, and braking behavior.
* Momentum-style throttle behavior.
* Variable / feathered braking behavior.
* Configurable minimum start and maximum output limits.
* Multiple supported motor-driver interface styles, including DUAL_PWM, PWM_DIR, PWM_BIDIR, and DUAL_INPT.

App-Managed Multi-Locomotive Operation

* App-managed MU / consist operation for controlling multiple locomotive throttles together from the smartphone app.
* Multiple throttle support so users can operate more than one connected locomotive.
* Consist speed matching / trim support so individual locomotives in a consist can be adjusted to run together more smoothly.
* Consist profiles so users can save reusable locomotive groups such as Double-Header Freight, Passenger Pair, or Helper Set.
* Consist health / connection view so users can see whether every locomotive in a consist is connected and responding before or during operation.

Lighting and Function Outputs

* Configurable function outputs for lights and accessories.
* Direction-aware outputs for forward/reverse lighting behavior.
* Multiple output patterns, including solid, blinking, double-blink, and FRED-style behavior.
* Lighting control from the app for supported configured outputs.

Battery Telemetry and Protection

* Optional INA219 battery telemetry for voltage, current, and power reporting.
* Low-voltage warning behavior.
* Low-voltage output limiting.
* Low-voltage shutdown behavior.
* Battery-disconnect / collapsed-supply detection.
* Optional low-voltage indicator output.

Scheduled / Autonomous Operation

* Scheduled ON / OFF operation using configured days, times, and commands.
* Autonomous behavior during scheduled windows when configured correctly.
* Persistent schedule settings saved on the controller.

Module Platform Expansion

* Poor Man’s Module foundation for PMT-compatible module-style devices.
* Poor Man’s Turbine support for ESC-style turbine, fan, blower, or accessory output.
* Turbine output control from the app.
* Guided ESC calibration support for turbine-style builds.
* Turbine-specific configuration for output limits, ramping, quick-blast behavior, and ESC signal pin.

App Experience

* Configuration screens for supported firmware features.
* Terminal access for advanced command and CV use.
* Configuration backup / restore support.
* Diagnostics and WebSocket logging support.
* Multilingual app support.
* Accessibility / screen-reader improvements.
* In-app version and release information.

⸻

🛠️ ## Planned Improvements (Requested / In Progress)

These are customer-requested or planned improvements that align with the PMT direction but are not yet released.

Core Locomotive Control

1. Locomotive Templates
    Allow users to create reusable setup templates such as Yard Switcher, Heavy Freight, Passenger, or Light Engine. Templates could be applied to new locomotives for quicker setup.
2. Adjustable Throttle Curves
    Allow different throttle response curves to match locomotive type and operator preference. This could improve low-speed control and make locomotives feel more realistic.

Personalization and Branding

1. Personal Railroad Branding
    Allow users to personalize the app with railroad-themed branding, including custom theme colors, layout names, railroad names, or preferred display styles.
2. Enhanced Device Presentation
    Improve how locomotives, consists, modules, and turbine devices are displayed in the app so larger collections are easier to identify and manage.

System Awareness

1. Bluetooth Signal Strength Indicator
    Display connection quality between the smartphone and PMT device. This would help diagnose connection problems and understand range limitations on larger layouts.
2. Connection Quality History
    Show recent BLE and WebSocket connection events so users can understand whether problems are caused by range, power, firmware reset, or network behavior.
3. Battery and Protection History
    Add a simple view of recent battery warning, limit, shutdown, and recovery events for telemetry-enabled builds.

Locomotive Feature Control

1. Sound Trigger Outputs
    Provide output triggers that can activate external sound boards or audio modules, such as DFPlayer Mini-style sound boards. These triggers could support common locomotive sounds such as horn, bell, whistle, brake squeal, or prime-mover effects.
2. Expanded Function Output Presets
    Add easier app presets for common lighting and accessory output setups.
3. Function Output Test Mode
    Provide a safer app workflow for testing function outputs one at a time during installation.

Module and Accessory Control

1. Additional PMT Module Types
    Add more supported module plugins beyond Poor Man’s Turbine.
2. Turnout / Switch Control Module
    Support layout turnouts or switch motors using PMT-compatible module firmware and app screens.
3. Lighting Module
    Support layout lighting, structure lighting, yard lights, or effect lighting from PMT-compatible module hardware.
4. Sound Module
    Support dedicated sound-trigger modules for layout or locomotive sound effects.
5. Accessory Automation Module
    Support simple automation actions for layout accessories.

Layout-Level Control

1. Layout Control Mode
    Allow the system to interact with layout devices such as turnouts, signals, lighting, accessories, or sound modules.
2. Layout Mode vs Portable Mode
    Support two operating styles:
    * Portable Mode — the phone connects directly to locomotives and PMT devices.
    * Layout Mode — a layout controller or hub coordinates multiple locomotives, modules, and accessories.
3. Basic Layout Automation
    Allow users to define simple actions such as turning lights on, triggering sounds, or activating modules based on time or user command.

⸻

💡 Future Ideas (Exploratory / Hardware Expansion)

These are longer-term ideas or capabilities that may require additional hardware or further design work.

Future Hardware Expansion

Examples include:

* additional output drivers
* turnout / switch motor driver boards
* sound trigger boards
* layout lighting boards
* signal control boards
* sensor input boards
* layout control interfaces

These expansions should continue following the PMT philosophy: inexpensive, understandable, modular, and friendly to hobby builders.

Documentation Roadmap

Future documentation improvements may include:

* dedicated Poor Man’s Turbine build guide
* dedicated Poor Man’s Module guide
* turnout / switch motor module guide when supported
* sound trigger setup guide
* more app screenshots and walkthroughs
* more troubleshooting decision trees
* more examples for battery telemetry and low-voltage tuning

⸻

Contributing

Contributions and ideas are welcome.

If you have a feature suggestion or improvement, please open a GitHub issue to discuss it.

Builder feedback is especially useful when it includes:

* the device type being used
* app platform, such as iOS or Android
* firmware version
* hardware parts used
* wiring notes or photos
* what worked
* what failed
* what behavior you expected

⸻

Roadmap Note

This roadmap is not a promise of release dates or development order.

It is a guide to where the project is going and how future ideas fit into the Poor Man’s Throttle ecosystem.
