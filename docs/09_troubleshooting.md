# Troubleshooting

If the locomotive does not operate correctly, follow these troubleshooting steps.

Work through the checks slowly and carefully.

---

## Before You start test your IBT-2 Motor Driver

The IBT-2 motor driver that comes from China has notoriously bad quality assurance.  Use the link below to test your IBT-2 Board before starting

We have had 100% success when using good IBT-2 boards and wiring the project correctly.  If the project controls one direction but not the other or doesnt work, FIRST check your assumptions.  Check the wiriong AND check to make sure you have a bad IBT-2 Board.

[Check Your IBT-2 Board Before You Start](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_troubleshooting_a_bad_IBT_board.md)


# AI Troubleshooter

The AI has all the access to the code for the app and firmware and it is knowledgable of the hardware used for Poor Man's Throttle.  Try this out and ask it questions

[AI Troubleshooter - **Check it out**](https://chatgpt.com/gpts/editor/g-69b6b9e2de288191b93ca08de865a365)

# System Does Not Power On

### Possible Causes

* fuse not installed in holder or broken
* power supply disconnected  
* incorrect polarity

### Checks

| Check | Action |
|-----|-------|
| Power source | Verify battery or transformer is connected |
| Fuse | Verify fuse is installed and not blown |
| Wiring polarity | Confirm positive and negative wires |

---

# ESP32 Does Not Power On

### Possible Causes

* 5V power module USB-C not connected  
* wiring error  
* faulty USB-C cable or connector

### Checks

| Check            | Action                            |
|------------------|-----------------------------------|
| 5V module input  | Verify power source connected     |
| USB-C connection | Confirm cable or connector secure |

---

# Motor Does Not Move

### Possible Causes

* motor wiring incorrect  
* motor driver not powered  
* loose wiring

### Checks

| Check | Action |
|-----|-------|
| Motor driver power | Verify voltage at B+ and B- |
| Motor wiring | Confirm M+ and M- connected |
| Motor condition | Verify motor rotates freely |

---

# Motor Runs Only One Direction

### Possible Causes

* control wiring error  
* enable pins not connected

### Checks

| Check | Action |
|-----|-------|
| ESP32 GPIO wiring | Verify connections |
| Motor driver control pins | Check RPWM / LPWM connections |

---

# Motor Runs Immediately at Full Speed

### Possible Causes

* incorrect control wiring  
* enable pins not connected correctly

Turn off power and verify control wiring.

---

# System Resets During Operation

### Possible Causes

* unstable power supply  
* electrical noise

### Possible Fixes

* install optional capacitors  
* add ferrite core to motor wires  
* verify wiring connections

---

# Fuse Blows

### Possible Causes

* short circuit  
* motor stall condition

### Checks

* inspect wiring  
* check motor for mechanical blockage

---

# Still Having Problems?

Carefully re-inspect the wiring.

Compare your wiring to the reference tables in:

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
