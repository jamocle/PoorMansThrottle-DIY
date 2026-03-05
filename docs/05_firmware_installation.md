# Firmware Installation

The ESP32 controller must have firmware installed before the system can operate.

This document explains how to load the firmware onto the ESP32 development board.

This process only needs to be done once unless the firmware is updated.

---

# Required Hardware

| Item | Purpose |
|----|---------|
| ESP32 development board | Controller |
| USB-C cable | Connects ESP32 to computer |
| Computer | Used to upload firmware |

---

# Firmware File

The firmware can be installed from the following location

Example file:

```
https://jamocle.github.io/PoorMansThrottle-DIY/Installer/
```

Read the entire installation screen before continuing.

---

# Connect the ESP32

1. Plug the USB-C cable into the ESP32.
2. Connect the other end to your computer.

The computer should recognize the ESP32 as a serial device.  (Note the COM port. e.g. COM3)

---

# Use the installation screen to install the firmware

https://jamocle.github.io/PoorMansThrottle-DIY/Installer/

## Install the Latest Firmware:

1. **Typically** you should install the latest firmware.
2. Press the **Connect** button under the Recommended: Install Latest section.
3. Follow the on screen prompts.

Wait for the upload to complete.

## Install an older version of the firmware:

1. Choose the Firmware version in the drop down Version field.
2. Press the **Connect** button.
3. Follow the on screen prompts.

Wait for the upload to complete.

---

# Verify Installation

After installation:

1. Disconnect and reconnect the ESP32.
2. Power the system.
3. You should see both a Solid Red LED and a Blinking Blue LED 
4. Confirm the smartphone app can connect.

If the connection works, the firmware installation is complete.

---

# Next Step

Continue to:

```
06_build_guide.md
```

This appendix contains the full wiring reference tables.