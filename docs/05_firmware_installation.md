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
- a recommended path to install the latest firmware
- a version selector for installing an older firmware version when needed

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

What to expect:
- The firmware target is an ESP32-WROOM-32 based controller.
- By default, the BLE advertising name is `GScaleThrottle`.
- If a train name has already been stored in controller settings, the advertised BLE name may appear as that configured train name instead.
- The onboard status LED behavior is firmware-controlled and board-dependent in color. The firmware uses a status LED on GPIO2 with a blinking search pattern while disconnected and a solid-on state when a control connection is active.

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
