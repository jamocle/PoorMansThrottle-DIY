# Changelog — PoorMansThrottle

## Firmware:

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

