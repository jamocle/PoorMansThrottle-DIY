# Changelog — PoorMansThrottle

## Smartphone App:

### Version 1.9.1
* **Lighting configuration support** The configuration page now supports setup for lighting-related command behavior, including linked function selections and momentary options.
* **Lighting control slideout** Standard and Pro throttle pages now include a slideout for lighting control while operating the throttle.
* **Improved BLE device discovery metadata** Mock BLE devices now advertise service UUIDs and include advertisement metadata to better simulate real device discovery behavior.
* **Refined mock scan/device setup** Mock BLE device definitions were consolidated into reusable device instances for more consistent scan and connection behavior during development and testing.
* **Faster mock firmware responses** Reduced simulated firmware response delay to make mock-device testing more responsive.
* **Updated minimum firmware requirement** Minimum supported firmware version updated to **1.10.5**.

### Version 1.8.4
* **Stronger BLE Scanning** Hardened the BLE scanning algorithms further to strengthen the apps ability to find devices even on slower devices.
* **Scripting Halt Ability** The app supports stopping a script mid flight.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.8.4
* **Stronger BLE Scanning** Hardened the BLE scanning algorithms to strengthen the apps ability to find devices even on slower devices.
* **BLE Diagnostic Mode** Ability to view BLE logs for scan failures.
* **Scripting abaility** The app supports scripting commands together.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.8.0

* **Improved throttle Look** more streamlined and asthetic look and feel for the standard throttle screen
* **BLE scan and device discovery interface** for locating and selecting available throttle controllers.
* **Multiple throttle interface modes** including Novice, Standard, and Pro throttle layouts.
* **Default throttle page selection** with persistent storage of the preferred throttle interface.
* **System PIN protection** for restricting access to selected configuration and control features.
* **Appearance customization interface** for adjusting application theme colors and restoring default theme settings.
* **Demo mode support** for operating the application without a live controller connection.
* **Expanded controller configuration interface** for adjusting motor driver type, minimum start throttle, maximum throttle, reverse direction, and start assist behavior.
* **Raw CV Editor** Editor to modify CV's without having to use the terminal for any newly added CV's not enabled yet by the App UI.
* **Configurable debug mode** for enabling enhanced diagnostics from the configuration area.
* **Dedicated throttle debug interface** for viewing live session and message activity while connected to a controller.
* Pro throttle brake feathering control with a dedicated brake slider for finer braking adjustment.
* Novice throttle mode with simplified switcher-style operation for basic train control.

### Version 1.6.0

* **BLE client interface** for connecting to the throttle controller.
* **Throttle and direction control interface** designed for simple train operation.
* **Controller state display** showing motion state and connection status.
* **Configuration interface** for tuning throttle behavior parameters stored on the controller.
* **Basic diagnostics interface** for verifying connection status and controller readiness.
* Primary throttle control screen with a large numeric throttle display and 0–100 slider for real-time speed adjustment.
* Directional control interface with forward and reverse buttons that visually indicate the currently active direction.
* Quick action controls for immediate stop and braking operations.
* Live controller state display that updates throttle value and direction automatically based on device feedback.
* Connection status indicator showing current BLE state with visual feedback for connected, disconnected, and reconnecting conditions.
* Automatic reconnect handling with UI messaging when the app is attempting to restore a lost connection.
* Terminal preview panel on the main screen that displays recent controller responses for quick diagnostics.
* Full terminal interface for sending manual commands and viewing detailed device responses.
* Command presets allowing commonly used actions to be sent without retyping.
* Programmable function keys that can store user-defined actions for quick access during operation.
* Function key configuration interface supporting tap-to-configure, long-press reconfiguration, and persistent storage of key assignments.
* Terminal message log distinguishing between sent commands, received responses, and informational status messages.
* Manual disconnect control available directly from the main throttle screen.