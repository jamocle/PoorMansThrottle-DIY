# Changelog — PoorMansThrottle

## Firmware:

### Version 1.12.3
* **Scheduled operating mode** added, allowing the controller to automatically turn activity on and off at user-configured times on selected days.
* **Autonomous operation during scheduled windows** added so the train can continue following its configured start and stop schedule even when no controller is actively connected.
* **Automatic start and stop actions** added so the configured ON and OFF commands run at the exact scheduled times on enabled days.
* **Safer scheduled behavior** added by requiring a complete and valid schedule before autonomous operation can activate, helping prevent accidental or partial schedule setups from taking effect.
* **More reliable unattended operation** added by temporarily suppressing disconnect grace, BLE recovery escalation, and pending reboot-after-stop behavior while scheduled autonomous mode is active.
* **Persistent schedule settings** added so schedule enablement, days, times, and commands are saved and restored after reboot.

### Version 1.12.1
* **INA219 telemetry sampling default** changed from `250 ms` to `500 ms`, reducing background sensor polling frequency so battery monitoring stays lighter-weight relative to throttle-control work.
* **INA219 telemetry publish default** changed from `1000 ms` to `10000 ms`, making battery status reporting far less chatty over BLE and WebSocket connections.
* **INA219 recovery-threshold semantics corrected** so `CV39 = 0` now means **recovery disabled / off** instead of being treated as an always-satisfied recovery condition.
* **Safer low-voltage recovery behavior** added by preventing automatic recovery when no explicit recovery threshold is configured, avoiding unintended rapid recovery after shutdown or protection events.

### Version 1.12.0
* **Battery telemetry and protection support** added, giving the throttle controller optional live battery monitoring for voltage, current, and power when an INA219 sensor is enabled.
* **Low-voltage protection behavior** added so the controller can warn, reduce available throttle, or stop output based on configured battery thresholds.
* **Battery recovery behavior** added so protection states can clear automatically after voltage recovers above the configured recovery threshold.
* **Battery-disconnect detection** added so the controller can recognize a disconnected or collapsed battery condition and report it to the app.
* **Configurable battery-monitoring settings** added through CVs, including enable/disable, sensor connection settings, telemetry timing, voltage thresholds, throttle-cap percentage, and low-voltage indicator pin assignment.
* **Low-voltage indicator output** added so users can assign a dedicated output pin to visually show low-voltage-related states.
* **Compact app telemetry updates** added for battery voltage, current, power, and protection-state flags, using shorter async messages designed to fit more reliably over BLE.
* **Safer default rollout behavior** added by leaving battery-protection thresholds inactive until the feature is explicitly configured, allowing the monitoring subsystem to be introduced without immediately changing train behavior.

### Version 1.11.0
* **New `DUAL_INPT` motor driver mode** added for dual-input H-bridge drivers such as the DRV8833. The firmware header now documents this mode as a driver model that swaps which pin receives PWM based on direction.
* **`CV1` motor driver selection expanded** so the firmware now accepts and reports `DUAL_INPT` alongside the existing `DUAL_PWM`, `PWM_DIR`, and `PWM_BIDIR` modes.
* **`CV104` / `CV105` reused as the shared two-pin interface** for both `PWM_DIR` and `DUAL_INPT`, with the internal pin naming updated to neutral `TwoPinA` / `TwoPinB` semantics instead of the older PWM-vs-direction wording.
* **Two-pin PWM attachment and safe-pin handling expanded** so both two-pin outputs are forced safe, detached, and reattached correctly when `DUAL_INPT` is active.
* **`DUAL_INPT` setup behavior added** so startup and reconfiguration initialize both two-pin outputs as safe low outputs before motion begins.
* **Hardware-state readback support added for `DUAL_INPT`** so debug and verification logic can interpret forward, reverse, stop, and throttle percentage correctly when either two-pin channel is being PWM-driven.

### Version 1.10.9
* **Websocket Hardeniong** Enhanced the code that handles the WiFi Websocket transport for stronger connectivity

### Version 1.10.7
* **Feathered Braking Bug Fix** The firmware now accurately re-establishes the remembered throttle of the speed does not reach 0
* **Escalated BLE advertising recovery** added with a bounded hard-recovery path that triggers if normal BLE advertising restart and watchdog recovery do not restore scanability after disconnect.
* **Safe deferred BLE recovery reboot** added so, when hard BLE recovery is required, the controller first forces a quick stop and only reboots after the locomotive has safely stopped.
* **BLE hard-recovery cancellation during socket control** added so an active WebSocket control path suppresses BLE-forced reboot behavior instead of interrupting an otherwise valid control session.
* **Improved BLE disconnect recovery state handling** added by explicitly clearing hard-recovery, watchdog, and reboot-pending state in more reconnect and disconnect transitions, reducing stale recovery-state carryover.
* **Per-function application flags support** added by extending each configurable function slot with a persisted `appFlags` value stored in non-volatile memory.
* **New function CV field for app flags** added so each function now has an additional CV-backed field for reading and writing its unsigned 32-bit application flags value.
* **Unsigned 32-bit parsing for function flags** added to validate `appFlags` writes safely before storage, preventing invalid or overflowed values from being accepted.
* **Function configuration persistence expanded** so the new per-function `appFlags` value is loaded from and saved to preferences alongside each function’s name, pin, pattern, and direction mode.
* **Version command reply behavior** changed so the `V` command now responds through the ACK/reply path using the firmware version value instead of returning only the raw version string.

### Version 1.10.4

* **Configurable function-output / lighting support** added, introducing twelve configurable function slots with default roles such as `Headlight`, `ReverseLgt`, and additional `FX` outputs for accessory lighting or other switched outputs.
* **Per-function configuration persistence** added so each function can store its own name, assigned GPIO pin, output pattern, and direction behavior in non-volatile memory and restore those settings at startup.
* **Multiple LED output patterns** added for function outputs, including `SOLID`, `DBL_BLNK`, `FRED`, `BLINK+`, and `BLINK-`, expanding the available lighting effects beyond simple on/off behavior.
* **Direction-aware function gating** added so configured outputs can be limited to forward-only, reverse-only, or both directions, allowing headlight and reverse-light style behavior to follow train direction automatically.
* **Runtime subscribed LED-output management** added, allowing configured outputs to be activated, deactivated, tracked by pin, and safely forced off when needed.
* **Blink timing configuration** added through stored settings for phase period and on-time, allowing the `BLINK+` and `BLINK-` lighting modes to be tuned at runtime instead of using only fixed timing.
* **Startup function-safe initialization** added so all configured function outputs are explicitly forced off during boot before normal operation begins, improving output safety during startup and configuration restore.
* **Onboard status LED mode cleanup** appears to be improved by refactoring the built-in LED behavior to use the same named base-pattern concepts (`Solid`, `Double_Blink`, and `FRED`) now used by the new function-lighting system, which should make status-light behavior more consistent internally.

### Version 1.9.6

* **PWM_BIDIR motor driver support** added, expanding compatibility to include single-PWM plus separate forward/reverse logic driver boards in addition to the previously supported dual-PWM and PWM-plus-direction modes. 
* **Additional motor-driver pin configuration options** added for PWM_BIDIR operation, including configurable PWM, forward, and reverse control pins. 
* **Runtime pin validation** added so unsupported GPIO assignments are rejected instead of being applied, helping prevent invalid motor-control configurations. 
* **Safer live pin remapping behavior** added by forcing a motor stop, placing outputs in a safe state, and reinitializing PWM/output pins before applying a new pin configuration. 
* **Stored pin configuration sanitizing** added during startup so invalid saved pin assignments automatically fall back to safe default pins instead of being used as-is. 
* **Expanded hardware-state readback support** added for the new PWM_BIDIR driver mode, improving internal verification of actual direction and throttle output across supported driver types. 
* **Variable-brake resume handling** appears to be improved with added logic for releasing variable brake and replaying the remembered motion target, which should make recovery from braking behavior more consistent. 

* **Major speed and efficiency enhancements** Better memory management


### Version 1.8.0

* **Wi-Fi and WebSocket control support** added as a secondary communication path alongside BLE for controller access and state updates.
* **Wi-Fi configuration options** added, including enable/disable control, stored SSID, stored password, and configurable WebSocket port settings.
* **Support for multiple motor driver types** added, including both dual-PWM drivers and PWM-plus-direction drivers for broader hardware compatibility.
* **Configurable motor control pin mapping** added to support different driver boards and wiring layouts.
* **Direction inversion option** added to simplify setup when motor wiring produces reversed movement.
* **Custom train-name BLE advertising** added, allowing the controller to broadcast a user-defined train name instead of only the default device name.
* **Improved BLE advertising recovery** added, including restart handling and watchdog-based recovery when advertising does not resume correctly after disconnect.
* **Expanded disconnect grace-period handling** added so brief connection interruptions can be tolerated before stop behavior is forced.
* **Enhanced status LED behavior** added to indicate disconnected search mode, grace mode, active connection, and RX/TX activity.
* **MTU-aware BLE notification chunking** added for more reliable delivery of longer responses and status messages.
* **Asynchronous state notification scheduling** added with separate update timing for steady-state and changing-state conditions.
* **State reporting over both BLE and WebSocket** added so live controller updates can be delivered across either connection path.
* **Dual state reporting** added to show both commanded throttle values and hardware-level throttle values.
* **Hardware readback and mismatch diagnostics** added for monitoring actual PWM output, direction state, enable-pin behavior, and expected-versus-actual motor operation.
* **Start-assist / kick-start tuning controls** added, including configurable kick throttle, duration, ramp-down behavior, and maximum apply limits.
* **Variable braking support** added with dedicated runtime brake-state handling and controlled stop behavior.
* **Improved stop and reverse sequencing** added for cleaner direction changes, safer transition timing, and more controlled recovery from braking or stop states.
* **Expanded persistent configuration storage** added to save motor, Wi-Fi, train-name, kick-start, braking, and timing settings in non-volatile memory.


### Version 1.7.0

Version **1.7.0** introduces major flexibility improvements to the firmware, including support for multiple motor driver architectures, configurable GPIO assignments, direction inversion, and expanded CV-based configuration. These changes allow the same firmware image to support a wide range of motor driver boards without recompilation.

#### New Features

##### Multiple Motor Driver Support

Firmware now supports two motor driver control architectures:

* **DUAL_PWM** – separate PWM outputs for forward and reverse
* **PWM_DIR** – a single PWM output with a direction pin

Motor driver mode can be selected at runtime.

##### Motor Driver Mode Configuration

**CV1** selects the motor driver control type.

| CV  | Function          | Values                |
| --- | ----------------- | --------------------- |
| CV1 | Motor driver mode | `DUAL_PWM`, `PWM_DIR` |

When the driver mode is changed the firmware safely:

1. Stops the motor
2. Forces motor pins to a safe state
3. Detaches PWM outputs
4. Reinitializes the hardware for the new driver type

#### Supported Motor Driver Boards

The firmware now supports a wide variety of common motor driver boards that use either the **DUAL_PWM** or **PWM_DIR** electrical control model.

| Motor Driver Board | Driver Type | Control Method                                           |
| ------------------ | ----------- | -------------------------------------------------------- |
| IBT-2 (BTS7960)    | DUAL_PWM    | Separate Forward and Reverse PWM inputs with enable pins |
| IBT-20             | DUAL_PWM    | Separate Forward and Reverse PWM inputs with enable pins |
| BTS7960 Module     | DUAL_PWM    | Separate Forward and Reverse PWM inputs with enable pins |
| Cytron MD10C       | PWM_DIR     | PWM speed control with a direction pin                   |
| Cytron MD13S       | PWM_DIR     | PWM speed control with a direction pin                   |
| Cytron MDD10A      | PWM_DIR     | PWM speed control with a direction pin                   |
| Cytron MDD3A       | PWM_DIR     | PWM speed control with a direction pin                   |
| L298N              | PWM_DIR     | PWM speed control with a direction pin                   |
| L293D              | PWM_DIR     | PWM speed control with a direction pin                   |
| MX1508             | PWM_DIR     | PWM speed control with a direction pin                   |
| TB6612FNG          | PWM_DIR     | PWM speed control with a direction pin                   |
| DRV8871 / DRV8872  | PWM_DIR     | PWM speed control with a direction pin                   |

Boards that follow either of these control models can generally be used by configuring the appropriate GPIO pins.

#### Configurable GPIO Assignments

Motor driver pins are now configurable using CV values.

| CV    | Function              |
| ----- | --------------------- |
| CV100 | Dual PWM Forward pin  |
| CV101 | Dual PWM Reverse pin  |
| CV102 | Dual PWM Enable A     |
| CV103 | Dual PWM Enable B     |
| CV104 | PWM_DIR PWM pin       |
| CV105 | PWM_DIR Direction pin |

Changing these values safely stops the motor and reinitializes the hardware configuration.

#### Direction Inversion

**CV5** allows the motor direction to be inverted.

| CV  | Function            | Values                       |
| --- | ------------------- | ---------------------------- |
| CV5 | Direction inversion | `0` = normal, `1` = inverted |

Direction inversion is applied internally within the motor output layer so that:

* throttle logic
* ramp behavior
* state queries
* kick logic

remain unaffected.

#### Train Name Configuration

The train name is now stored using **CV4**.

| CV  | Function   |
| --- | ---------- |
| CV4 | Train name |

Behavior:

* The stored name is used as the BLE advertised device name.
* If the stored name is empty, the firmware automatically advertises using the firmware name.
* Advertising updates immediately when the name changes.

#### Configuration Reset via CV

A reset trigger has been added.

| CV  | Function      |
| --- | ------------- |
| CV8 | Reset trigger |

Behavior:

* `CV8=8` wipes stored configuration and reboots the device.
* `CV8?` always returns `0`.
* CV8 is not stored in persistent memory.

#### Persistence Improvements

Additional configuration values are now stored in persistent memory:

* Motor driver mode (CV1)
* Direction inversion (CV5)
* GPIO assignments (CV100–CV105)
* Train name (CV4)

The configuration storage schema has been expanded to support these settings.

Existing installations automatically migrate to the new configuration format.

#### Safety Improvements

##### Safe Hardware Reconfiguration

When motor mode or GPIO assignments are changed the firmware now:

1. Stops the motor immediately
2. Forces all motor-related pins into a safe state
3. Detaches PWM outputs
4. Reinitializes the hardware configuration

This prevents unintended motor activation during configuration changes.

##### Improved Boot Safety

Startup initialization order has been improved:

1. Load configuration from persistent storage
2. Force motor pins into a safe state
3. Configure motor driver pins
4. Initialize PWM outputs

This ensures safe hardware initialization when configurable GPIO assignments are used.

#### Internal Architecture Improvements

##### Motor Driver Abstraction

Motor output control is now separated by driver type. This architecture allows additional motor driver types to be added in future firmware versions with minimal changes to the throttle and ramp logic.

##### Hardware State Monitoring Enhancements

Hardware monitoring and debug comparison logic have been updated to properly interpret driver-specific behavior and direction inversion.

#### Compatibility Notes

* Default configuration behavior remains unchanged for standard setups.
* Existing installations automatically migrate to the updated configuration schema.
* The firmware now supports a significantly wider range of motor driver boards through runtime configuration.


---


### Version 1.6.2

* Added invalid command message error replies
* Minor bug fixes


---


### Version 1.6.1

* **Initial public release** of the ESP32 BLE-based train throttle controller.
* **BLE wireless throttle control** using a custom GATT service for command input and status notifications.
* **Secure connection handshake system** that requires a validated client before motion control is accepted.
* **Real-time throttle and direction control** for forward and reverse operation.
* **Dual ramping profiles** providing both realistic momentum-style acceleration and faster response control modes.
* **Smooth non-linear acceleration and deceleration engine** using integer-based easing for consistent motion without floating-point math.
* **Stop-first reversing logic** that forces the throttle to zero and waits a safety delay before reversing direction.
* **Multiple stopping behaviors** including fast stop and controlled braking-style deceleration.
* **Motor output shaping** through configurable **minimum-start floor** and **maximum ceiling limit** to better match motor characteristics.
* **Start-assist (“kick”) system** to help motors overcome static friction when starting from a stop.
* **Configurable train name broadcasting** so each throttle can advertise a custom identifier over BLE.
* **Persistent configuration storage** so tuning parameters survive power cycling.
* **Connection-loss safety system** with reconnection grace period followed by automatic emergency stop and control lockout.
* **Hardware state monitoring and reporting** including both commanded state and measured PWM output state.
* **Status LED system** providing visual feedback for searching, connected, and BLE activity states.
* **Built-in diagnostic and debug logging mode** with timestamped serial output and hardware/state comparison monitoring.
* **Periodic hardware verification system** capable of detecting mismatches between stored throttle state and actual PWM output.
* **Maintenance features** including configuration reset and system reboot capabilities.
