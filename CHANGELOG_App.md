# Changelog — PoorMansThrottle

## Smartphone App:

### Version 1.10.0
* **Battery Management Support** The app supports the use of the INA219 board to moditor and manage battery information that ties to locomotive behavior.  The app can no protect against undervoltages without the need for a BMS.  Constantly see the Volts, Amps and Watts in this telemetry.

### Version 1.9.24
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.23
* **Informational Carousel** Add an informational carousel at app startup to provide important information to users of PMT.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.21
* **Swipe between throttle screens** Now when you have multiple throttles connected to the PMT app, you can wasily swipe between them without having to go back to the Scan screen like in previous versions of the app.
* **Asynchronous Connect** Now you can connect to all of the throttles without having to wait. 
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.12
* **Backup and restore capabilities** Now there is a copy button on the CV section in configuratiopn that will copy the settings for a throttle for external storage by the user.  The import capability is handled by pasting the output of the copy into the script view on the terminal page and it will reset the hardware to defaults and apply the settings.  This can be used to restore a throttle or copy settings to another throttle.
* **UI Changes** Minor Tweaks.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.11
* **UI Changes** The app will now scroll certain parts of the view depending on UI real-estate.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.10
* **PMT Hardware Naming Fix** The app now handles BLE Throttle name by better managing the lifecycle of the BLE Notification name and BLE Cache.  
** Basically saying when you change your PMT name in the app it sticks now :-)
* **Misc refinements and bug squashing** The code monkey has been busy (me).


### Version 1.9.7
* **Support for firmware 1.11.0** Can configure new Driver Modes.  [More...](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/CHANGELOG_Firmware.md)
* **Graphical Changes** Slight changes in the graphics
* **Misc refinements and bug squashing** The code monkey has been busy (me).


### Version 1.9.5
* **Support for WiFi Failover** The app now uses both BLE and Wifi for better connectivity consistency
* **Graphical Changes** Slight changes in the graphics


### Version 1.9.3
* **Added more Permission granting for Android version** The App now notifies of more permissions required to perform BLE scans to better support some Android users. **FIXED**
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
* **Scripting ability** The app supports scripting commands together.
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
