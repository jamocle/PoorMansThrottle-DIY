# Troubleshooting

If the locomotive does not operate correctly, follow these troubleshooting steps.

Work through the checks slowly and carefully. Start with power and wiring, then check configuration, then check wireless control behavior.

This troubleshooting guide has been refreshed against firmware **v1.12.1** so it reflects current firmware behavior and supported features.

---

## Before You Start: Test Your IBT-2 Motor Driver

The IBT-2 motor driver that comes from China has notoriously inconsistent quality control.

If your project works in one direction but not the other, or behaves unpredictably, **do not assume the firmware is the problem first**. Check your wiring carefully and also verify that the IBT-2 board itself is good.

[Check Your IBT-2 Board Before You Start](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_troubleshooting_a_bad_IBT_board.md)

> **Important:** Poor Man's Throttle no longer supports only IBT-2 style wiring. Firmware v1.12.1 supports multiple motor driver modes. If you are using a driver other than IBT-2/BTS7960, make sure the configured motor driver mode and GPIO pin assignments match your hardware.

Supported driver styles in current firmware include:
- **DUAL_PWM** - example: IBT-2 / BTS7960
- **PWM_DIR** - example: Cytron MD10C style
- **PWM_BIDIR** - example: L298N style
- **DUAL_INPT** - example: DRV8833 / TB6612FNG style

A wiring layout that is correct for one driver mode can fail completely in another mode.

---

# AI Troubleshooter

The AI has access to the app and firmware behavior and is intended to help with Poor Man's Throttle troubleshooting.

[AI Troubleshooter - **Check it out**](https://chatgpt.com/gpts/editor/g-69b6b9e2de288191b93ca08de865a365)

---

# System Does Not Power On

### Possible Causes

- fuse not installed in holder or blown
- power supply disconnected
- incorrect polarity
- battery disconnected
- upstream switch off

### Checks

| Check | Action |
|-----|-------|
| Power source | Verify battery or transformer is connected and switched on |
| Fuse | Verify fuse is installed and not blown |
| Wiring polarity | Confirm positive and negative wires |
| Supply voltage | Measure voltage at the system input |
| Short circuits | Inspect for accidental shorts before replacing the fuse |

---

# ESP32 Does Not Power On

### Possible Causes

- 5V power module USB-C not connected
- wiring error
- faulty USB-C cable or connector
- faulty 5V converter or regulator
- insufficient supply current

### Checks

| Check | Action |
|------------------|-----------------------------------|
| 5V module input  | Verify power source connected |
| USB-C connection | Confirm cable or connector is secure |
| 5V output | Measure the 5V output feeding the ESP32 |
| ESP32 board | Confirm the power LED lights and the board is not overheating |

---

# Cannot Find the Device Over BLE

### Possible Causes

- the ESP32 is not powered
- the phone is not scanning correctly
- the train name changed
- BLE advertising did not recover after a disconnect
- the controller rebooted after a safe-stop recovery event

### What to Know

The firmware advertises using either the default firmware name or the configured train name. After disconnects, the firmware attempts to restart advertising automatically. If advertising does not recover, the firmware can escalate to a safe stop and reboot sequence.

### Checks

| Check | Action |
|-----|-------|
| ESP32 status LED | If the onboard LED is blinking, the controller is powered but not currently under active control |
| Device name | Check for the configured train name, not only the default device name |
| Recent disconnect | Power cycle if the device stopped appearing after a difficult disconnect or failed reconnect |
| Phone BLE cache | Toggle Bluetooth off/on or force the app to rescan |
| Distance / interference | Move closer and reduce RF interference |

---

# App Connects But Commands Do Not Work

### Possible Causes

- command path not fully initialized yet
- control session was interrupted and a forced-stop latch is still in effect until reconnect
- you are connected to the wrong device
- handshake or startup sequence did not complete in the app

### What to Know

In current firmware, motion commands are gated by the control session state. A reconnect may be required after a forced-stop or recovery event before motion commands will be accepted normally.

### Checks

| Check | Action |
|-----|-------|
| Reconnect | Disconnect and reconnect the app cleanly |
| Command test | Send a simple stop command first, then try a low forward command |
| Wrong device | Confirm you connected to the intended locomotive |
| Recovery event | If the locomotive stopped after a disconnect, reconnect before assuming the motor path is bad |

---

# Wi-Fi / WebSocket Control Does Not Work

### Possible Causes

- Wi-Fi support is not enabled
- SSID or password is incorrect
- the locomotive never joined the network
- the WebSocket port does not match the client
- BLE is working, but the Wi-Fi path was never configured

### What to Know

Firmware v1.12.1 supports Wi-Fi / WebSocket as a **secondary or failover control path**. It only starts when Wi-Fi is enabled and configured.

### Checks

| Check | Action |
|-----|-------|
| Wi-Fi enabled | Confirm Wi-Fi was enabled in configuration |
| Network credentials | Re-check SSID and password |
| IP address | Confirm the locomotive obtained an IP address |
| WebSocket port | Confirm the client is using the configured port |
| Same network | Make sure the phone or client is on the same network |

### Tip

If BLE works but WebSocket does not, the motor side may be fine and the issue may be only Wi-Fi configuration.

---

# Motor Does Not Move

### Possible Causes

- motor wiring incorrect
- motor driver not powered
- loose wiring
- wrong motor driver mode selected
- wrong GPIO pin mapping for the selected motor driver mode
- throttle is being limited or shut down by low-voltage protection
- the controller is in a forced-stop state after a connection-loss event

### Checks

| Check | Action |
|-----|-------|
| Motor driver power | Verify voltage at the driver power input |
| Motor wiring | Confirm motor leads are connected correctly |
| Motor condition | Verify the motor rotates freely |
| Driver mode | Confirm the configured motor driver mode matches the hardware being used |
| GPIO mapping | Check the configured motor pins for the selected driver mode |
| Low voltage protection | If INA219 protection is enabled, verify the battery is not under warn / limit / shutdown conditions |
| Reconnect state | Reconnect the control app after any disconnect-related forced stop |

### Important

A train that powers on but refuses to move is not always a wiring failure. In current firmware it can also be caused by:
- low-voltage shutdown
- throttle limiting from low voltage
- motion commands being ignored until reconnect after a forced stop
- a mismatch between configured driver mode and actual motor driver hardware

---

# Motor Runs Only One Direction

### Possible Causes

- control wiring error
- enable pins not connected
- one half of the motor driver is defective
- wrong motor driver mode selected
- direction inversion or driver-specific logic mismatch
- incorrect GPIO assignment for direction-related pins

### Checks

| Check | Action |
|-----|-------|
| ESP32 GPIO wiring | Verify all configured control pins |
| Motor driver control pins | Check the pins used for forward / reverse / direction |
| Driver mode | Confirm the selected mode matches the driver type |
| Known bad IBT-2 | Test the IBT-2 board before assuming firmware is wrong |
| Direction configuration | Check whether the locomotive direction is intentionally inverted in configuration |

### Notes by Driver Type

- **DUAL_PWM / IBT-2 style:** one direction working and the other not often points to a bad board, bad RPWM/LPWM wiring, or bad enable wiring.
- **PWM_DIR:** verify both the PWM pin and the separate direction pin.
- **PWM_BIDIR:** verify the PWM/enable pin plus both direction logic pins.
- **DUAL_INPT:** verify both control inputs and make sure the correct mode is selected.

---

# Motor Runs the Wrong Direction

### Possible Causes

- motor leads reversed
- direction invert configuration enabled when it should not be
- driver-specific logic expectations do not match the selected mode
- forward and reverse control pins swapped

### Checks

| Check | Action |
|-----|-------|
| Motor leads | Swap only if the software configuration is correct and you intentionally want a hardware fix |
| Direction invert setting | Check direction-related configuration before rewiring |
| GPIO assignments | Verify forward, reverse, and direction pins are not swapped |
| Driver mode | Confirm the selected motor driver mode matches the board |

---

# Motor Runs Immediately at Full Speed

### Possible Causes

- incorrect control wiring
- enable pins not connected correctly
- wrong driver mode selected
- PWM pin connected to the wrong place on the motor driver
- full-power behavior from a logic-wiring mistake

### Checks

| Check | Action |
|-----|-------|
| Turn power off | Stop testing immediately before continuing |
| Driver mode | Confirm the configured mode matches the driver board |
| PWM pin | Verify PWM is connected to the correct input for the selected driver mode |
| Direction pins | Verify direction pins are not tied high incorrectly |
| Enable pins | Verify optional enable pins are wired correctly if your board requires them |

---

# Train Does Not Reverse Immediately

### Possible Causes

- this is expected firmware behavior
- stop-first reverse sequencing is being mistaken for a fault
- momentum or braking settings are slowing the transition

### What to Know

Current firmware does **not** instantly slam from forward to reverse while moving. When direction changes while the train is moving, the firmware stops first, waits briefly, and then applies the new direction. This is intentional for reversing safety.

### Checks

| Check | Action |
|-----|-------|
| Wait briefly | Allow time for stop-first reverse sequencing to complete |
| Compare behavior | Test from a full stop versus while already moving |
| Momentum settings | Expect slower transitions if momentum-style behavior is configured |
| Quick ramp test | Use quick-ramp style control if you want faster transitions |

---

# Train Feels Slow to Respond

### Possible Causes

- momentum-style ramping is active
- quick stop or brake behavior is being mistaken for lag
- start-kick settings are not configured for a sticky motor
- floor / ceiling remap settings are conservative
- low-voltage throttle limiting is active

### What to Know

Firmware v1.12.1 supports multiple motion styles:
- **instant**
- **quick ramp**
- **momentum**
- **stop**
- **brake**
- **variable brake**

The train may therefore behave differently from a direct on/off throttle, especially around starts, stops, and reversals.

### Checks

| Check | Action |
|-----|-------|
| Motion style | Confirm whether you are testing instant, quick-ramp, or momentum behavior |
| Start behavior | If the motor hesitates at low speed, review start-kick and minimum-start settings |
| Battery voltage | Check for low-voltage limiting if INA219 protection is enabled |
| Stop expectation | Brake commands intentionally feel different from simple stop commands |

---

# Train Stops After Disconnect or Signal Loss

### Possible Causes

- this is expected safety behavior
- BLE or socket control was lost
- grace countdown expired
- firmware entered safe-stop and recovery behavior

### What to Know

The firmware maintains a grace period after control loss. If control does not return in time, the locomotive is forced to stop. In some recovery cases, the ESP32 may reboot after the train reaches a safe stop.

### Checks

| Check | Action |
|-----|-------|
| Reconnect promptly | Reconnect before the grace period expires |
| Expect stop after loss | Treat this as safety behavior, not automatically as a fault |
| Reconnect after stop | Reconnect cleanly before testing motion again |
| Power cycle if needed | If the device is no longer discoverable after a recovery event, power cycle and reconnect |

---

# System Resets During Operation

### Possible Causes

- unstable power supply
- electrical noise
- brownout when the motor starts or stalls
- firmware-initiated reboot after safe-stop BLE recovery escalation

### Possible Fixes

- install optional capacitors
- add ferrite cores to motor wires
- verify all wiring connections
- separate noisy motor wiring from logic wiring
- confirm the 5V supply to the ESP32 stays stable during motor startup

### Note

Not every restart is an accidental crash. In current firmware, some BLE recovery paths intentionally reboot the ESP32 **after** the train has already been brought to a safe stop.

---

# Low-Voltage Warning, Throttle Limiting, or Shutdown

### Possible Causes

- INA219 low-voltage telemetry is enabled
- battery voltage dropped below a warning threshold
- battery voltage dropped below a throttle-limit threshold
- battery voltage dropped below a shutdown threshold
- the battery was detected as disconnected

### What to Know

If INA219 support is enabled, the firmware can:
- publish telemetry
- warn on low voltage
- limit throttle under low-voltage conditions
- stop the train on low-voltage shutdown
- detect a battery disconnect
- drive an optional low-voltage LED output

### Checks

| Check | Action |
|-----|-------|
| Battery voltage | Measure pack voltage under load, not only at rest |
| INA219 wiring | Verify SDA, SCL, address, and sensor presence |
| Protection thresholds | Review warning, limit, shutdown, recovery, and disconnect settings |
| Low-voltage LED | If configured, use it as an additional clue that protection is active |

---

# Lights or Function Outputs Do Not Work

### Possible Causes

- no GPIO pin assigned to the function
- pin is not valid for runtime output
- function pattern not configured
- direction gating prevents the output from being active in the current direction
- another function is trying to use the same pin
- LED wiring expects a higher voltage or includes a resistor sized for 12V or 5V use

### What to Know

Current firmware supports up to **12 function outputs**. Outputs can be configured with:
- a name
- a GPIO pin
- a pattern
- a direction mode of **BOTH**, **FWD**, or **REV**

Supported patterns include:
- **SOLID**
- **DBL_BLNK**
- **FRED**
- **BLINK+**
- **BLINK-**

### Checks

| Check | Action |
|-----|-------|
| Pin assignment | Confirm the function has a valid GPIO pin assigned |
| Pattern | Make sure a pattern has actually been configured |
| Direction gating | Test in the direction where the function is allowed |
| Duplicate pin use | Make sure two active functions are not sharing one GPIO pin |
| LED wiring | Check LED polarity and resistor assumptions for 3.3V GPIO operation |

---

# Onboard ESP32 LED Seems to Blink in a Strange Pattern

### What the LED Means

The onboard LED is useful for diagnosis:

| LED Behavior | Meaning |
|-----|-------|
| Repeating double-blink search pattern | No active BLE or socket control connection |
| Grace pattern | Control was lost and grace countdown behavior is active |
| Solid on | Active control connection exists |
| Brief dips off while connected | RX/TX activity is occurring |

This can help distinguish a control-link problem from a motor power problem.

---

# Fuse Blows

### Possible Causes

- short circuit
- motor stall condition
- incorrect polarity
- damaged motor driver
- wiring error between supply, driver, and motor

### Checks

- inspect all wiring
- check the motor for mechanical blockage
- disconnect the motor and verify whether the short remains
- verify the motor driver is not internally shorted
- inspect for stray wire strands across terminals

---

# Configuration Changes Do Not Seem to Stick

### Possible Causes

- settings were not written correctly
- the wrong locomotive was edited
- the device rebooted before testing was repeated
- the value changed was not relevant to the current hardware mode

### Checks

| Check | Action |
|-----|-------|
| Re-read the value | Verify the expected value really changed |
| Match the driver mode | Confirm you changed the CVs for the active motor driver style |
| Restart test | Reconnect and test again after configuration changes |
| NVS assumptions | Remember settings are persisted, so stale configuration from earlier testing may still be active |

---

# Still Having Problems?

Carefully re-inspect the wiring and compare it to the reference material for the exact hardware mode you are using.

Then check:
- motor driver mode
- GPIO assignments
- direction behavior
- low-voltage protection settings
- BLE / Wi-Fi connection state
- function-output direction gating
- battery voltage under load

Compare your wiring and settings to the reference tables in the appendices.

# Next Steps

Open Mobile Installation Instructions

[10_mobile_device_installation_instructions.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/10_mobile_device_installation_instructions.md)

View the Appendices

[appendix_Configuration_Variables.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_Configuration_Variables.md)

[appendix_Command_Protocol_Reference.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_Command_Protocol_Reference.md)

[appendix_traditional_transformer_layout_benefits.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_traditional_transformer_layout_benefits.md)

[appendix_wiring_reference.md](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_wiring_reference.md)

---

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
