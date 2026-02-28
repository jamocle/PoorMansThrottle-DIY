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

The firmware file will be provided in the project repository.

Example file:

```
firmware.bin
```

Download the file before continuing.

---

# Connect the ESP32

1. Plug the USB-C cable into the ESP32.
2. Connect the other end to your computer.

The computer should recognize the ESP32 as a serial device.  (Note the COM port. e.g. COM3)

---

# Upload the Firmware

Use a standard ESP32 flashing tool.

Typical process:

1. Open the flashing tool.
2. Select the ESP32 device.
3. Choose the firmware file.
4. Start the upload process.

Wait for the upload to complete.

---

# Verify Installation

After installation:

1. Disconnect and reconnect the ESP32.
2. Power the system.
3. Confirm the smartphone app can connect.

If the connection works, the firmware installation is complete.

---

# Updating Firmware

If new firmware versions are released:

1. Download the updated firmware file.
2. Repeat the installation process.

---

# Next Step

Continue to:

```
appendix_wiring_reference.md
```

This appendix contains the full wiring reference tables.