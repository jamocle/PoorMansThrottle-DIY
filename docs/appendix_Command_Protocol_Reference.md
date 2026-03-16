# Poor Man's Throttle (PMT) – Command Protocol Reference

**Firmware Version:** 1.7.2
**Platform:** ESP32 BLE Heavy-Train Throttle Controller

---

# Overview

The throttle accepts **ASCII text commands** sent over either control interface:

* **BLE (Primary Control)**
* **WebSocket / WiFi (Secondary Control)**

Both interfaces use **the same command protocol**.

Command characteristics:

* Commands are **case-insensitive**
* Leading/trailing whitespace and CR/LF are **ignored**
* Throttle values are **clamped to 0–100**

Responses are returned as either:

* `ACK:<command>`
* `ERR:<command>`
* **RAW responses** (no wrapper)

---

# Connection Authorization

Before most commands will be accepted, the controller requires a **connection authorization handshake**.

---

## Step 1 — Request the Connection Authorization ID

Send:

```
I
```

Response:

```
I:<auth-id>
```

Example:

```
I:1a2b3c4d5e6f
```

---

## Step 2 — Send Connection Authorization Token

The client must send a **connection authorization token**.

```
I,<token>
```

If the token is valid:

```
I:CONNECTED
```

If the token is invalid:

```
ERR:ConnFailed
```

---

## Step 3 — Verify Authorization

```
I?
```

Responses:

```
ACK:Connected
```

or

```
ERR:ConnFailed
```

Once authorization succeeds, **commands remain authorized until the device reboots**.

---

# Command Response Types

Most commands return one of the following:

```
ACK:<command>
```

or

```
ERR:<command>
```

However, some commands return **RAW responses** without wrappers.

RAW commands include:

```
?
??
C?
IP?
I
V
```

---

# Motion Commands

Throttle values range from **0–100**.

Values are internally mapped to hardware output using **CV2 (floor)** and **CV3 (ceiling)**.

---

# Momentum Ramp Commands

Smooth acceleration and deceleration using the firmware momentum model.

Forward:

```
F<n>
```

Reverse:

```
R<n>
```

Example:

```
F40
```

---

# Quick Ramp Commands

Faster acceleration profile than momentum ramps.

Forward quick ramp:

```
FQ<n>
```

Reverse quick ramp:

```
RQ<n>
```

Example:

```
FQ60
```

---

# Stop Commands

### Quick Stop

```
S
```

Rapid ramp down to stop.

---

### Brake Stop

```
B
```

Slower deceleration ramp.

---

# Direction Change Behavior

If a direction change is requested while the train is moving, the firmware automatically performs:

1. Ramp down to zero
2. Wait the configured **direction delay**
3. Ramp up in the new direction

This prevents mechanical shock and protects motor drivers.

---

# State Query Commands

These commands return **RAW responses**.

---

## Hardware State

```
?
```

Example response:

```
HW-FWD M40 HW60
```

Fields:

| Field  | Meaning                |
| ------ | ---------------------- |
| HW-FWD | Hardware direction     |
| M40    | Mapped throttle        |
| HW60   | Actual hardware output |

---

## Stored State

```
??
```

Example:

```
FWD M40 HW60
```

This reports the **stored throttle state** rather than measured hardware.

---

# Firmware Version

```
V
```

Example response:

```
1.7.2
```

---

# Connection Status

```
C?
```

Example response:

```
CONN B1 S0 W1
```

Fields:

| Field | Meaning              |
| ----- | -------------------- |
| B     | BLE connection       |
| S     | WebSocket connection |
| W     | WiFi connected       |

---

# IP Address Query

When WiFi is enabled, the device IP can be retrieved.

```
IP?
```

Example response:

```
IP:192.168.1.50
```

This address can be used to connect to the WebSocket server.

Example:

```
ws://192.168.1.50:81
```

---

# Debug Commands

Debug commands control serial logging.

---

## Enable Debug

```
D1
```

Enables debug output over the serial port at **115200 baud**.

---

## Disable Debug

```
D0
```

---

# Periodic Debug Logging

### Print only mismatches

```
P0
```

(Default behavior)

---

### Print every period

```
P1
```

---

# Asynchronous State Updates

The firmware periodically sends automatic state updates.

Format:

```
A:<state>
```

Example:

```
A:HW-FWD M30 HW50
```

Update frequency is controlled by:

| CV  | Purpose                                 |
| --- | --------------------------------------- |
| CV6 | Notify interval when throttle is steady |
| CV7 | Notify interval during ramps            |

---

# Control Transport Priority

The firmware supports two control transports.

### BLE

Primary control interface.

### WebSocket

Secondary / failover control interface.

Priority rules:

* If **BLE is connected**, BLE commands take priority
* If **BLE disconnects**, WebSocket can take control
* If **only WebSocket is connected**, it operates normally

Both interfaces use the **same command protocol and authorization process**.

---

# WebSocket Operation

When WiFi is enabled using:

```
CV10=1
```

The firmware connects to the configured network and starts a WebSocket server.

Default port:

```
81
```

Maximum simultaneous WebSocket clients:

```
2
```

Changing the following CVs restarts the WiFi/WebSocket service:

```
CV11
CV12
CV13
```

---

# Graceful Disconnect Behavior

If **all control connections are lost**:

1. A **15-second grace timer** begins
2. If no client reconnects
3. The firmware performs a **forced stop**

This prevents runaway trains if a controller disconnects unexpectedly.

---

# Command Summary

| Command        | Purpose                  |
| ---------      | ------------------------ |
| I              | Query Auth ID            |
| I,<auth-token> | Connection authorization |
| I?             | Verify authorization     |
| F<n>           | Forward momentum ramp    |
| R<n>           | Reverse momentum ramp    |
| FQ<n>          | Forward quick ramp       |
| RQ<n>          | Reverse quick ramp       |
| S              | Quick stop               |
| B              | Brake stop               |
| ?              | Hardware state query     |
| ??             | Stored state query       |
| V              | Firmware version         |
| C?             | Connection status        |
| IP?            | IP address               |
| D1             | Debug ON                 |
| D0             | Debug OFF                |
| P0             | Debug mismatches only    |
| P1             | Debug periodic logging   |
