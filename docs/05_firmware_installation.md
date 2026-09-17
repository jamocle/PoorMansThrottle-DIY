# Firmware Installation

The ESP32 controller must have firmware installed before the system can operate.

This document explains how to load the firmware onto the ESP32 development board.

This process normally only needs to be done once unless the firmware is updated or reinstalled.

[Additional installation material from the app](https://jamocle.github.io/PoorMansThrottle-DIY/Installer/Info/installation.html)

---

# Required Hardware

| Item | Purpose |
|----|---------|
| ESP32 development board | Controller |
| USB cable for your board | Connects the ESP32 to the computer for flashing |
| Computer with a supported browser | Used to open the installer and upload firmware |

---

# Firmware Installer

Install the firmware from:

```text
https://jamocle.github.io/PoorMansThrottle-DIY/Installer/
```

Read the full installer screen before continuing.

The installer provides:
- a recommended USB/browser path to install the latest firmware
- a version selector for installing an older firmware version when needed

For supported **ESP32-S3 N16R8 and N8R8** throttle hardware, the PMT app can also install the catalog's current `latest` firmware over Wi-Fi using OTA. Classic ESP32-WROOM hardware continues to use the USB/browser installer.

USB installation remains the recovery and rollback path for all boards, and it is the path to use when a specific or older firmware version must be installed.

[ESP32-S3 OTA firmware update guide](https://jamocle.github.io/PoorMansThrottle-DIY/Installer/Info/ota_firmware_update.html)

---

# ESP32-S3 Over-the-Air (OTA) Firmware Updates

Supported **ESP32-S3 N16R8 and N8R8** throttle hardware can install firmware wirelessly from the PMT app when the device is connected to Wi-Fi.

OTA behavior:

- OTA is supported on the ESP32-S3 throttle builds only. Classic ESP32-WROOM throttle hardware uses the USB installer.
- The app asks the device whether OTA is supported before offering the update.
- OTA installs the board target's catalog `latest` firmware. It does not install a version selected from the USB installer's version list.
- Older versions, specific-version installs, downgrades, and recovery installs remain USB-only.
- When OTA is accepted, the throttle first performs its normal stop behavior and waits until it is fully stopped before firmware transfer begins.
- During the actual firmware transfer, the app can receive progress in 10% steps from `0%` through `100%`.
- `0%` means the firmware image transfer/write phase has started. Manifest lookup and OTA preparation happen before `0%`.
- `100%` means the firmware image transfer/write completed successfully. The device then reboots automatically.
- Do not remove power while OTA is active.
- On supported S3 hardware, the onboard RGB LED alternates **GREEN/PURPLE every 300 ms** while OTA is active. This OTA indication has priority over the normal `CV21` LED output mode.
- If OTA cannot be completed, use the USB installer as the recovery path.

The existing USB/browser instructions below remain valid for Classic ESP32, recovery, rollback, and specific-version installation.

---

# Connect the ESP32

1. Plug the USB cable into the ESP32 board.
2. Connect the other end to your computer.
3. Wait for the computer to recognize the board as a serial device.

On Windows, this usually appears as a COM port such as `COM3`.  
On other operating systems, it may appear with a different serial device name.

---

# Use the Installer to Load Firmware

Open:

```text
https://jamocle.github.io/PoorMansThrottle-DIY/Installer/
```

## Install the latest firmware

1. Use the **Recommended: Install Latest** section unless you have a specific reason to use another version.
2. Press **Connect**.
3. Select the ESP32 serial device when prompted by the browser.
4. Follow the on-screen prompts until the upload completes.

## Install an older firmware version

1. Choose the desired firmware version from the **Version** drop-down field.
2. Press **Connect**.
3. Select the ESP32 serial device when prompted.
4. Follow the on-screen prompts until the upload completes.

Do not disconnect power or unplug the USB cable during the upload.

---

# Verify Installation

After installation:

1. Disconnect and reconnect the ESP32 if the installer does not already restart it cleanly.
2. Power the controller.
3. Confirm the board begins advertising over BLE.
4. Open the PMT smartphone app and scan for the throttle.
5. For an exact firmware build check, open a terminal connection and send `VV`. Firmware 3.3.0 revision 241 replies:

```text
ACK:V3.3.0.241
```

`V` remains available when only the semantic firmware version is needed and returns `ACK:V3.3.0`.

What to expect:
- Use the firmware build that matches your controller board profile: **Classic ESP32-WROOM** or **ESP32-S3-WROOM-1-N16R8**. Do not flash a build intended for the other board profile.
- By default, the BLE advertising name is `GScaleThrottle`.
- If a train name has already been stored in controller settings, the advertised BLE name may appear as that configured train name instead.
- The onboard status LED behavior is firmware-controlled and board-dependent in color. With the default `CV21=1`, the firmware passes its normal proposed LED state to the hardware, including the blinking search pattern while disconnected and the solid-on state when a control connection is active. `CV21=0` forces the firmware-controlled onboard LED off. `CV21=2` allows the proposed LED state while disconnected but forces the LED output off while either BLE or WebSocket control is connected. On supported ESP32-S3 throttle hardware, the OTA GREEN/PURPLE indication is a higher-priority status state and is intentionally shown regardless of `CV21` while OTA is active.

If the throttle appears in the app and the app can connect, the firmware installation is complete.

---

# Notes

- This guide covers firmware loading only.
- Motor driver mode, GPIO mapping, Wi-Fi failover, function outputs, and telemetry-related setup are configured after firmware installation.
- If you are reinstalling firmware onto a board that was previously used, some saved settings may still be present in non-volatile storage unless they are explicitly reset by the firmware or installer workflow.

---

# Next Step

Continue to:

This appendix contains the step-by-step build guidance.

[**06_build_guide.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/06_build_guide.md)

[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
