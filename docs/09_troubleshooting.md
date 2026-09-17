# Troubleshooting

If a Poor Man's Throttle device does not operate correctly, follow these troubleshooting steps.

Work through the checks slowly and carefully. Start with power and wiring, then check configuration, then check wireless control behavior.

This troubleshooting guide has been refreshed for the current Poor Man's Throttle app and firmware platform, including throttle, module, and turbine-style devices.

---

## Before You Start: Test Your IBT-2 Motor Driver

The IBT-2 motor driver that comes from China has notoriously inconsistent quality control.

If your project works in one direction but not the other, or behaves unpredictably, **do not assume the firmware is the problem first**. Check your wiring carefully and also verify that the IBT-2 board itself is good.

[Check Your IBT-2 Board Before You Start](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_troubleshooting_a_bad_IBT_board.md)

> **Important:** Poor Man's Throttle no longer supports only IBT-2 style wiring. Current throttle firmware supports multiple motor driver modes. If you are using a driver other than IBT-2/BTS7960, make sure the configured motor driver mode and GPIO pin assignments match your hardware.

Supported driver styles in current firmware include:
- **DUAL_PWM** - example: IBT-2 / BTS7960
- **PWM_DIR** - example: Cytron MD10C style
- **PWM_BIDIR** - example: L298N style
- **DUAL_INPT** - example: DRV8833 / TB6612FNG style

A wiring layout that is correct for one driver mode can fail completely in another mode.

## Know Which PMT Device You Are Troubleshooting

Poor Man's Throttle now includes more than one kind of PMT device. The first troubleshooting question is: **what firmware/device type are you working with?**

| Device Type | What It Controls | Common Troubleshooting Focus |
|---|---|---|
| Poor Man's Throttle | Locomotive motor, lights, battery telemetry, and train behavior | Motor driver wiring, direction, throttle, BLE/Wi-Fi connection, battery protection |
| Poor Man's Module | Module-style device foundation | Power, BLE/Wi-Fi connection, configuration, schedule, telemetry |
| Poor Man's Turbine | ESC-style turbine/fan/blower output | ESC signal wiring, common ground, calibration, output limits, battery protection |

Do not troubleshoot a turbine or module as if it were an IBT-2 locomotive throttle. The connection and configuration foundation is shared, but the output hardware is different.

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
- the train/device name changed
- BLE advertising did not recover after a disconnect
- the controller rebooted after a safe-stop recovery event
- the device is a module or turbine and you are looking in the wrong app flow

### What to Know

The firmware advertises using either the default firmware/device name or the configured train/device name. After disconnects, the firmware attempts to restart advertising automatically. If advertising does not recover, the firmware can escalate to a safe stop and reboot sequence.

### Checks

| Check | Action |
|-----|-------|
| ESP32 status LED | If `CV21` allows LED output and the onboard LED is blinking, the controller is powered but not currently under active control. A dark firmware-controlled LED is not by itself a fault when `CV21=0`, or when `CV21=2` and BLE or WebSocket control is connected. |
| Onboard LED output mode | Check `CV21` if the firmware-controlled onboard LED is unexpectedly dark. `0` = always off, `1` = normal proposed LED state, `2` = off while BLE or WebSocket control is connected and normal proposed state while disconnected. |
| Device name | Check for the configured train/device name, not only the default device name |
| Recent disconnect | Power cycle if the device stopped appearing after a difficult disconnect or failed reconnect |
| Phone BLE cache | Toggle Bluetooth off/on or force the app to rescan |
| Distance / interference | Move closer and reduce RF interference |

---

# App Connects But Commands Do Not Work

### Possible Causes

- command path not fully initialized yet
- control session was interrupted and a forced-stop latch is still in effect until reconnect
- you are connected to the wrong device
- the app opened the wrong device type flow
- handshake or startup sequence did not complete in the app
- BLE and WebSocket status are not both understood

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

# Firmware Script Recording / Playback Does Not Work

Firmware 3.3 adds SD-backed recording and playback using `SR`, `SR=<name>`, `SP1=<name>`, `SPR=<name>`, `SP0`, `SS?`, and `SD=<name>`.

### First Checks

| Check | Action |
|---|---|
| Script state | Send `SS?` and confirm whether the device reports `A:SS=IDLE`, `A:SS=REC`, `A:SS=PLAY`, or `A:SS=REPEAT` |
| SD availability | Confirm the device has an active PMT SD filesystem; SD-backed script operations return `ERR:SD` when storage is unavailable |
| Script name | Use 1–16 base-name characters from `a-z`, `0-9`, `_`, or `-`; `.pmt` is optional in the command |
| File location | Firmware scripts are stored as `/scripts/<name>.pmt` |
| Playback content | Firmware `.pmt` files may contain only valid recordable device-control commands, blank lines, and `PAUSE` lines |
| App vs firmware scripts | The app's Run Script page is a separate app-side scripting mechanism; app-only directives are not valid firmware `.pmt` lines |

### Common Script Errors

| Result | Meaning / Action |
|---|---|
| `ERR:SD` | No active PMT SD storage is available. Check the card, reader/slot, and whether the selected firmware/hardware configuration initialized SD storage. |
| `ERR:NAME` | The name is empty, longer than 16 characters, or contains a character other than `a-z`, `0-9`, `_`, or `-`. |
| `ERR:NOFILE` | The requested `/scripts/<name>.pmt` file does not exist. Confirm spelling and use the same base name that was used when saving. |
| `ERR:WRITE` | The recording could not be written completely. Check card health, free space, contacts, and SD stability. |
| `ERR:DELETE` | `SD=<name>` found the script but the filesystem could not delete it. Check card health and filesystem access. |
| `ERR:FULL` | The in-memory recording exceeded the 32 KiB firmware script limit. Make the recording shorter or reduce the number of recorded commands. |
| `ERR:READ` | The script file could not be read completely. Check card/filesystem integrity. |
| `ERR:SIZE` | The `.pmt` file is larger than the 32 KiB playback limit. |
| `ERR:EMPTY` | The saved script contains no executable content. Record at least one eligible control command before saving. |
| `ERR:SCRIPT` | A line in the `.pmt` file is not a valid `PAUSE` or recordable control command for that firmware image. |
| `ERR:MEM` | Firmware could not reserve the required script buffer memory. Reboot and retry; if it repeats, investigate memory pressure. |
| `ERR:BUSY` | Recording or playback is already active. Use `SS?`; stop playback with `SP0` before starting/deleting another script. |
| `ERR:STATE` | The requested state transition is invalid, such as sending `SP0` when no script is running or trying `SR=<name>` when recording is not active. |

### Recording Timing Does Not Look Right

Firmware records elapsed time **between eligible control commands** as `PAUSE <milliseconds>` lines. When `SR=<name>` is sent, it also records the elapsed time from the **last recorded control command to the stop-recording command** as the final pause.

The time between the initial `SR` and the first recorded control command is not stored.

This means a recording such as:

```text
F40
...wait...
B
...wait 10 seconds...
SR=yard
```

will end with a final pause after `B`. That trailing delay is especially important for `SPR=<name>` because it prevents the next repetition from starting immediately after the final command.

### A Command Does Not Appear in the Saved Script

Only commands classified as recordable physical/device controls are captured. Configuration commands, script-management commands, and internally scheduled commands are not recorded.

Current recordable controls include:

* **Throttle:** `S`, `B`, `B0..100`, `F0..100`, `R0..100`, `FQ0..100`, `RQ0..100`, and `FX1..12=0/1`
* **Turbine:** `F0..100`, `F0..100*`, and `FQ100`
* **Generic Module:** no module-specific recordable physical controls are currently defined

### External Controls Do Not Respond During Playback

This is expected for recordable control commands. While playback is active, external and scheduled commands that classify as recordable controls are suppressed so they cannot override the running script. Send `SP0` to stop playback before taking manual control again.

---

# Wi-Fi / WebSocket Control Does Not Work

### Possible Causes

- Wi-Fi support is not enabled
- SSID or password is incorrect
- the locomotive never joined the network
- the WebSocket port does not match the client
- BLE is working, but the Wi-Fi path was never configured

### What to Know

Current firmware supports Wi-Fi / WebSocket as a **secondary, backup, or failover control path**. It only starts when Wi-Fi is enabled and configured.

### Checks

| Check | Action |
|-----|-------|
| Wi-Fi enabled | Confirm Wi-Fi was enabled in configuration |
| Network credentials | Re-check SSID and password |
| IP address | Confirm the locomotive obtained an IP address |
| WebSocket port | Confirm the client is using the configured port |
| Same network | Make sure the phone or client is on the same network |
| Known-device information | If using a saved device/IP, confirm the saved network address is still valid |
| WebSocket diagnostics | Enable or review app WebSocket logs if the app provides them |

### Tip

If BLE works but WebSocket does not, the motor side may be fine and the issue may be only Wi-Fi configuration.

---

# ESP32-S3 OTA Firmware Update Fails

OTA applies to supported ESP32-S3 N16R8 and N8R8 throttle hardware. Classic ESP32-WROOM throttle hardware continues to use the USB firmware installer.

### Expected OTA Sequence

1. The app checks support with `OTA?`.
2. The device must have an active Wi-Fi connection.
3. `OTA` is accepted with `ACK:OTA`.
4. The throttle performs its normal stop behavior and waits until it is fully stopped.
5. OTA prepares the secure connection and reads the firmware catalog.
6. Firmware transfer begins at `A:OTA 0` and advances in 10% steps through `A:OTA 100`.
7. After `A:OTA 100`, the device disconnects and reboots automatically.

The GREEN/PURPLE onboard RGB indication is expected throughout the active OTA lifecycle.

### Common Results

| Result | Meaning / Action |
|-----|-------|
| `ERR:NS` from `OTA?` | OTA is not supported on this hardware. Classic ESP32 uses the USB installer. |
| `ERR:NO WIFI` | The S3 device is not connected to Wi-Fi, or Wi-Fi was lost during OTA. Restore Wi-Fi and try again. |
| `ERR:OTA` before `A:OTA 0` | OTA preparation failed, such as secure catalog access, manifest validation, board-target selection, or another pre-transfer error. |
| `ERR:OTA` after progress begins | Firmware transfer/write did not complete. Keep the current firmware running if possible and use USB recovery if OTA cannot be retried successfully. |
| Progress reaches `A:OTA 100` and the connection drops | Normal successful behavior. The firmware image completed and the device is rebooting. |
| No progress percentages yet | This can be normal while OTA is stopping the throttle, obtaining validation time, or reading/validating the manifest. `0%` begins only when the firmware image transfer/write phase starts. |

### Checks

- Confirm the device is an ESP32-S3 N16R8 or N8R8 throttle.
- Confirm Wi-Fi is connected before starting OTA.
- Do not remove power while GREEN/PURPLE OTA indication is active.
- If OTA repeatedly fails, use the normal USB installer as the recovery path.
- Use USB when installing a specific older version or intentionally downgrading; OTA always installs the catalog's current `latest` version for the detected S3 target.

---

# Device Appears in the App but Opens the Wrong Screen

### Possible Causes

- the wrong firmware image is installed
- the app has stale remembered information for the device
- the device is advertising an unexpected identity
- the app has not refreshed known-device information yet

### Checks

| Check | Action |
|-----|-------|
| Firmware type | Confirm whether the device is Throttle, Module, or Turbine firmware |
| App flow | Make sure you are opening the matching control/configuration screen |
| Known devices | Forget or refresh the remembered device if stale information appears to be used |
| Firmware version | Confirm the installed firmware is compatible with the app version |

---

# Known Device or Auto-Connect Does Not Work

### Possible Causes

- the device IP address changed
- Wi-Fi is disabled or credentials changed
- the device is on a different network than the phone
- the app remembered an old device name or address
- BLE discovery is unavailable and the saved WebSocket path is stale

### Checks

| Check | Action |
|-----|-------|
| Power and Wi-Fi | Verify the PMT device is powered and joined to the expected network |
| Same network | Confirm the phone is on the same Wi-Fi network |
| IP address | Reconnect over BLE and check the current reported IP address |
| Known-device entry | Remove and rediscover the device if the saved entry is stale |
| Auto-connect setting | Confirm auto-connect is enabled if you expect the app to connect automatically |

---

# Locomotive Motor Does Not Move

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

# Locomotive Motor Runs Only One Direction

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

# Locomotive Motor Runs the Wrong Direction

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

# Locomotive Motor Runs Immediately at Full Speed

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

Current throttle firmware supports multiple motion styles:
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

# Motor Buzz, Whine, or Low-Speed PWM Feel

Current throttle firmware allows the motor PWM switching frequency to be tuned with **CV90**.

The default is:

```text
CV90=202020202020
```

which keeps the motor at 20 kHz across the full throttle range.

CV90 can use a fixed frequency:

```text
CV90=10
```

which expands to `101010101010`, or a changing frequency curve:

```text
CV90=051520
```

which expands to `050515152020`.

The six canonical points correspond to effective mapped throttle values `1,10,25,50,75,100%`, and firmware interpolates between them.

### What Frequency Changes Can Do

Changing PWM frequency can alter:

- audible motor buzz or whine
- low-speed feel and smoothness
- motor/driver heating
- how a particular motor and driver respond under load

Results depend on the motor and driver. Lower frequency does **not** guarantee more torque, and CV90 does not directly command torque or speed.

### Checks

| Check | Action |
|---|---|
| Return to known behavior | Set `CV90=20` or `CV90=202020202020` to restore 20 kHz everywhere |
| Verify stored curve | Query CV90; readback is always the canonical 12-digit form |
| Tune gradually | Change frequency in small steps and test motor sound, low-speed behavior, and temperature |
| Separate frequency from duty | If start speed/output is wrong, also review CV2, CV3, and CV9 rather than treating CV90 as a duty-control setting |
| Watch hardware temperature | Stop testing if the motor or driver becomes unusually hot |

Valid CV90 frequency values are `01..40` kHz per curve point.

---

# MU / Consist Behavior Is Wrong

### Possible Causes

- one locomotive in the consist is not connected
- one locomotive has the wrong direction configuration
- one locomotive has different momentum, ramp, or start behavior
- the app has stale throttle names or remembered device information
- one controller is being limited by battery protection

### What to Know

Consisting is managed by the smartphone app. Each locomotive controller still controls its own motor, safety behavior, connection state, battery protection, and configured direction behavior.

If a consist behaves incorrectly, troubleshoot each locomotive by itself first.

### Checks

| Check | Action |
|-----|-------|
| Individual locomotive test | Run each locomotive alone before running the consist |
| Direction | Confirm each locomotive moves forward when commanded forward by itself |
| Names | Refresh stale throttle names if the app shows old names |
| Battery protection | Check whether one locomotive is being limited or shut down |
| Motion settings | Compare ramp, brake, and start settings between locomotives |

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

# Scheduled Operation Does Not Run

### Possible Causes

- schedule is not enabled
- active days are not selected
- ON or OFF time is incomplete
- ON or OFF command is blank or invalid
- the controller does not have a valid current time
- the schedule was configured for the wrong device

### What to Know

Scheduled operation requires a complete schedule and a valid current time. Depending on setup, the device may get time from the network or from the app/device configuration flow.

For locomotive throttles, scheduled operation can allow autonomous start/stop behavior during the configured window. For module or turbine devices, scheduled commands only make sense if the configured commands are valid for that device type.

### Checks

| Check | Action |
|-----|-------|
| Schedule enabled | Confirm scheduling is turned on |
| Days | Confirm the current day is selected |
| Time | Confirm the controller has current time |
| Commands | Confirm ON and OFF commands match the device type |
| Manual test | Run the ON/OFF commands manually before trusting the schedule |

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

# Poor Man's Turbine Output Does Not Work

### Possible Causes

- turbine firmware is not installed
- ESC or turbine output hardware is not powered
- ESC signal wire is on the wrong GPIO pin
- ESP32 and ESC do not share a common ground
- ESC calibration has not been performed
- output limits are set too low
- low-voltage shutdown or limiting is active
- the app is connected to the wrong device type

### Checks

| Check | Action |
|-----|-------|
| Firmware type | Confirm the device is running Poor Man's Turbine firmware |
| Power | Verify the ESC/turbine power source is connected and appropriate |
| Signal pin | Confirm the configured ESC PWM pin matches the wiring |
| Common ground | Confirm ESP32 ground and ESC signal ground are tied together |
| Calibration | Run the app's ESC calibration flow if the ESC has not learned endpoints |
| Output limits | Check minimum output, full output, quick output, and governor/limit settings |
| Battery protection | Verify INA219 protection is not forcing output off or capping output |

---

# Lights or Function / FX Effects Do Not Work

### Possible Causes

- function pattern is not configured
- direction gating prevents the FX from being active in the current direction
- for a physical LED pattern, no valid GPIO is assigned
- for a physical LED pattern, another active function is using the same pin
- for an audio pattern, audio is disabled or the selected PMTPlayer sound mode is not usable
- for custom audio, the function pin/track CV is not a valid PMTPlayer track number
- LED wiring expects a higher voltage or includes a resistor sized for 12V or 5V use

### What to Know

Current firmware provides **12 FX slots**. Pattern values `1..99` are the physical/LED family and values `100..199` are the audio family.

Implemented values are:

- `1` = LED solid
- `2` = LED double blink
- `3` = FRED
- `4` = LED blink+
- `5` = LED blink-
- `100` = audio bell
- `101` = audio horn
- `102` = audio cab chatter
- `103` = custom audio one-shot
- `104` = custom audio replay / loop

Legacy text aliases such as `SOLID`, `DBL_BLNK`, `AUDIO_BELL`, and `AUDIO_HORN` are still accepted. Queries return numeric pattern values.

Bell, horn, and cab-chatter patterns do **not** require a physical function GPIO. For patterns `103` and `104`, the function pin CV is repurposed as the PMTPlayer track number (`1..9999`).

### Checks

| Check | Action |
|-----|-------|
| Pattern | Query the function's pattern CV and confirm the expected numeric pattern is configured |
| Direction gating | Test in the direction where the function is allowed |
| Physical FX pin | For patterns `1..99`, confirm a valid, non-conflicting output GPIO is assigned |
| LED wiring | For physical FX, check LED polarity and resistor assumptions for 3.3V GPIO operation |
| Audio enable | For patterns `100..199`, confirm `CV400=1` |
| PMTPlayer sound mode | Confirm `CV401` selects the intended sound mode (`2` Diesel, `3` Steam) |
| Audio volume | Confirm `CV402` is not zero |
| Custom track | For pattern `103` or `104`, confirm the function pin/track CV contains a valid track number `1..9999` and the file exists under the active PMTPlayer sound root |

---

# Onboard ESP32 LED Seems to Blink in a Strange Pattern

### What the LED Means

The onboard LED is useful for diagnosis. For normal status states, `CV21` is the final output gate and can intentionally suppress the physical LED without stopping the internal LED state machine. On supported ESP32-S3 throttle hardware, the OTA indication is intentionally higher priority than `CV21`.

| LED Behavior | Meaning |
|-----|-------|
| GREEN/PURPLE alternating every 300 ms | ESP32-S3 OTA is active. This OTA indication overrides `CV21` and normal/red status display until OTA finishes or aborts. |
| Forced off at all times | `CV21=0` during normal operation; OTA on supported S3 hardware is the documented exception. |
| Repeating double-blink search pattern | No active BLE or socket control connection, when `CV21` allows output |
| Grace pattern | Control was lost and grace countdown behavior is active, when `CV21` allows output |
| Solid on | Active control connection exists with `CV21=1` |
| Brief dips off while connected | RX/TX activity is occurring with `CV21=1` |
| Visible while disconnected, then forced off when control connects | `CV21=2`; the proposed LED state is passed while disconnected and suppressed while either BLE or WebSocket control is connected |

A dark firmware-controlled onboard LED is therefore not by itself evidence of a power or control-link problem. Check `CV21` before using the LED as a diagnostic indicator. During S3 OTA, GREEN/PURPLE should remain visible regardless of the normal `CV21` mode.

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
- app backup/restore data was copied to the wrong device type

### Checks

| Check | Action |
|-----|-------|
| Re-read the value | Verify the expected value really changed |
| Match the driver mode | Confirm you changed the CVs for the active motor driver style |
| Restart test | Reconnect and test again after configuration changes |
| NVS assumptions | Remember settings are persisted, so stale configuration from earlier testing may still be active |
| Backup/restore | Confirm backup or copied settings came from a compatible device type |

---

# Still Having Problems?

Carefully re-inspect the wiring and compare it to the reference material for the exact hardware mode you are using.

Then check:
- device type and installed firmware
- motor driver mode for locomotive throttle builds
- GPIO assignments
- direction behavior
- low-voltage protection settings
- BLE / Wi-Fi connection state
- function-output direction gating
- turbine ESC signal / common ground / calibration, if applicable
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
