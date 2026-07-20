# Changelog — PoorMansThrottle

## Smartphone App:

### Version 2.3.0
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 2.2.1
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 2.2.0
* **Custom in-app splash screen added** so PMT can show a persaonal splash screen after platform starts.
* **Splash screen appearance controls added** under Global Settings > Appearance, between Language and Colors, with settings for enabling the custom splash, choosing the splash image, picking the background color, setting the display time, selecting the animation, and testing the result in-app.
* **Custom splash image upload added** so users can choose a square image from their device photo library. Non-square images are rejected with a localized warning so the splash image remains predictable across screen sizes.
* **Splash screen preview added** so users can test the exact configured splash screen from Global Settings without restarting the app.
* **Splash animation options added** with None, From Singularity, and From Infinity choices. From Infinity is the default, and the splash animation runs for 500 ms while the overall splash display time remains user configurable.
* **Splash display timing defaults updated** so new installations use a 4000 ms custom splash display time, with a 500 ms minimum enforced in configuration.
* **Custom splash persistence added** so splash settings and the uploaded image are stored as app-owned persisted configuration data and included in backup/admin support flows.
* **Admin System Files support added for custom splash settings** so the custom splash JSON can be viewed, edited, deleted, and included in AI Context export. The large image Base64 field is hidden in the editor while preserving the uploaded image unless the filename is intentionally cleared.
* **Scan startup behavior improved** so scan is no longer cancelled just because auto-connect starts or the scan page briefly disappears during startup navigation.
* **Scan button behavior improved** so the Scan button remains enabled while scanning, changes to Cancel Scan, and only shows Scan cancelled when the user explicitly cancels the scan.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

### Version 2.1.1
* **Android system bar color matching fixed** so the top Android status-bar area now follows the app's selected Brand Background color instead of showing the platform default color.
* **Appearance theme updates improved** so changing the Brand Background color in Global Settings > Appearance also updates Android system chrome.
* **Information and Help version awareness added** so help items for features newer than the installed app version now identify the required version and warn users before opening the article.
* **Startup version checks improved for iOS** so the app compares the installed version with the App Store version, shows both versions, and can send the user to the App Store when an update or current GA version is available.
* **Startup version messaging improved for Android** so the app still uses the existing PMT installer version file, but now shows the installed version, current GA version, and clearer update or pre-release guidance.
* **Admin persistence tools expanded** so System Files, Known Devices, Prefs, and AI Context expose more app-owned persisted information, including known device identities, Poor Man's Turbine dial tap behavior, and indexed scan-version notice state.
* **Admin cleanup behavior hardened** so deleting device-owned persisted data uses relationship-aware cleanup instead of leaving orphaned device state behind.
* **Known Devices admin details expanded** with additional remembered identity information such as the last observed device name.
* **AI Context export improved** so the Copy action includes the expanded known preferences and app-owned persisted files needed for support and troubleshooting.
* **Consist speed-match locomotive cards improved** so locomotive curve cards can collapse into a compact header, giving small screens more room while keeping live output and direction information visible.
* **Consist speed-match graph pop-out added** so a selected locomotive curve can expand into the card-list area for more precise editing, with a quick control to return to the normal card list.
* **Consist speed-match graph labels improved** so the expanded graph shows aligned point values and clear Input and Output axis labels without changing the underlying curve behavior.
* **Consist live curve editing improved** so changing a speed-match curve while live mode is active immediately sends the updated output command when the edit affects the locomotive's current throttle output.
* **Consist curve live mode default changed** so live mode starts enabled on the curve screen and can be turned off by the user when needed.
* **Localization updated** for the new version-warning, update-check, admin persistence, and graph label messages across supported languages.
* **Misc refinements and bug squashing** The code monkey has been busy (me).

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
