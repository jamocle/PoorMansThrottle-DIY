# Changelog — PoorMansThrottle

## Smartphone App:

### Version 2.0.0
* **App support for Poor Man's Turbine added** so PMT can discover, connect to, configure, and control Poor Man's Turbine firmware in addition to train throttle controllers.
* **New turbine control screen added** with a dedicated turbine output dial, stop control, live output readback, and a saved governor limit so users can cap the maximum turbine output from the app.
* **Guided ESC calibration added** to walk users through teaching an Electronic Speed Control its low and high throttle endpoints, with safety prompts, confirmation steps, and automatic restoration of the previous output limits.
* **Turbine configuration support added** for minimum output, full output, ramp-to-full-output time, ESC PWM pin, and turbine dial tap behavior.
* **Module-style device support added** so the scan screen can recognize registered PMT module devices, display them separately from locomotive throttles, and open the correct module control/configuration experience.
* **Minimum supported firmware updated to 2.0.0** so the app targets the shared 2.0 firmware generation used by the throttle, module, and turbine firmware.
* **WebSocket backup connection behavior improved** so the app can continue using a known network connection when available and show clearer status when neither BLE nor WebSocket is connected.
* **WebSocket diagnostic logging added** so users can enable WebSocket logging for the next launch and review connection, persisted-IP discovery, and error details from settings.
* **Known-device scanning improved** so previously known devices can be shown from saved network information when reachable, even when BLE discovery is not the only available path.
* **Known throttle management added** so users can review and administer remembered throttles from settings.
* **Auto-connect and disconnected-throttle shutdown settings added** so users can control whether known throttles reconnect automatically and whether disconnected train throttles are shut down automatically.
* **Version information experience expanded** with startup and settings-based release notices so users can review relevant app/version information from inside PMT.
* **Localization expanded** beyond English, Spanish, and French to include German, Finnish, Gujarati, Hindi, Italian, Dutch, Portuguese, and Tamil.
* **Accessibility and screen-reader support expanded** across newer PMT screens and controls, including module/turbine screens, diagnostics, settings, and version-notice experiences.

### Version 1.12.2
* **PMT is multilingual** The PMT app now supports multiple languages including Spanish, French, and English.
* **PMT is accessible** VoiceOver / screen-reader support was added and expanded for users with vision impairments.
* **Consist view selection dialog** The selection of the view for consists had a regression where the selection dialog was removed. It is now back.
* **Android slider tap behavior fixed** Now Android and iOS behave the same with the tap behavior on throttle sliders.
* **Configuration safety** The firmware and app safely retain configuration state to help protect settings from accidental overwrites during firmware flashing.
* Fixed a bug where throttle names could become mismatched between the scan list and saved consists.
* **Misc refinements and bug squashing for Android** The code monkey has been busy (me).

### Version 1.11.2
* **Misc refinements and bug squashing for Android** The code monkey has been busy (me).

### Version 1.11.1
* **MU Consisting for Apple** Configure and run MU Consists with PMT.  Multiple engine control with one throttle like the big boys do it.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.11.0
* **MU Consisting Beta for Android** Configure and run MU Consists with PMT.  Multiple engine control with one throttle like the big boys do it.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.10.3
* **New Telemetry** The app supports new telemetry coming from Firmware v1.12.4.
* **UI change** Modified configuration to uncomplicate the Battery Management section and removed the INA219 I2C Address from the UI. To set this use CV33.  The default is 0x40 (64 decimal). 
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.10.2
* **Schedule a Run** The app supports the ability to schedule the start and stop commands for autonomous running of a train.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.10.0
* **Battery Management Support** The app supports the use of the INA219 board to monitor and manage battery information that ties to locomotive behavior.  The app can now protect against undervoltages without the need for a BMS.  Constantly see the Volts, Amps and Watts in this telemetry.

### Version 1.9.24
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.23
* **Informational Carousel** Add an informational carousel at app startup to provide important information to users of PMT.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.21
* **Swipe between throttle screens** Now when you have multiple throttles connected to the PMT app, you can easily swipe between them without having to go back to the Scan screen like in previous versions of the app.
* **Asynchronous Connect** Now you can connect to all of the throttles without having to wait. 
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.12
* **Backup and restore capabilities** Now there is a copy button on the CV section in configuration that will copy the settings for a throttle for external storage by the user.  The import capability is handled by pasting the output of the copy into the script view on the terminal page and it will reset the hardware to defaults and apply the settings.  This can be used to restore a throttle or copy settings to another throttle.
* **UI Changes** Minor Tweaks.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.11
* **UI Changes** The app will now scroll certain parts of the view depending on UI real-estate.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.9.10
* **PMT Hardware Naming Fix** The app now handles BLE throttle names by better managing the BLE notification name and BLE cache lifecycle. Basically, when you change your PMT name in the app, it sticks now :-)
* **Misc refinements and bug squashing** The code monkey has been busy (me).


### Version 1.9.7
* **Support for firmware 1.11.0** Can configure new Driver Modes.  [More...](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/CHANGELOG_Firmware.md)
* **Graphical Changes** Slight changes in the graphics
* **Misc refinements and bug squashing** The code monkey has been busy (me).


### Version 1.9.5
* **Support for WiFi Failover** The app now uses both BLE and Wi-Fi for better connectivity consistency
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
* **Stronger BLE Scanning** Hardened the BLE scanning algorithms further to strengthen the app's ability to find devices even on slower devices.
* **Scripting Halt Ability** The app supports stopping a script mid-flight.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.8.4
* **Stronger BLE Scanning** Hardened the BLE scanning algorithms to strengthen the app's ability to find devices even on slower devices.
* **BLE Diagnostic Mode** Ability to view BLE logs for scan failures.
* **Scripting ability** The app supports scripting commands together.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 1.8.0

* **Improved throttle look** More streamlined and aesthetic look and feel for the standard throttle screen
* **BLE scan and device discovery interface** for locating and selecting available throttle controllers.
* **Multiple throttle interface modes** including Novice, Standard, and Pro throttle layouts.
* **Default throttle page selection** with persistent storage of the preferred throttle interface.
* **System PIN protection** for restricting access to selected configuration and control features.
* **Appearance customization interface** for adjusting application theme colors and restoring default theme settings.
* **Demo mode support** for operating the application without a live controller connection.
* **Expanded controller configuration interface** for adjusting motor driver type, minimum start throttle, maximum throttle, reverse direction, and start assist behavior.
* **Raw CV Editor** Editor to modify CVs without having to use the terminal for any newly added CVs not enabled yet by the App UI.
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
