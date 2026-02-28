# Changelog — PoorMansThrottle

## Firmware:

### Version 1.6.2
* Added invalid command message error replies
* Minor bug fixes
  
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

