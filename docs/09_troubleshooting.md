# Troubleshooting

If the locomotive does not operate correctly, follow these troubleshooting steps.

Work through the checks slowly and carefully.

---

# System Does Not Power On

### Possible Causes

• fuse not installed in holder or broken
• power supply disconnected  
• incorrect polarity

### Checks

| Check | Action |
|-----|-------|
| Power source | Verify battery or transformer is connected |
| Fuse | Verify fuse is installed and not blown |
| Wiring polarity | Confirm positive and negative wires |

---

# ESP32 Does Not Power On

### Possible Causes

• 5V power module USB-C not connected  
• wiring error  
• faulty USB-C cable or connector

### Checks

| Check            | Action                            |
|------------------|-----------------------------------|
| 5V module input  | Verify power source connected     |
| USB-C connection | Confirm cable or connector secure |

---

# Motor Does Not Move

### Possible Causes

• motor wiring incorrect  
• motor driver not powered  
• loose wiring

### Checks

| Check | Action |
|-----|-------|
| Motor driver power | Verify voltage at B+ and B- |
| Motor wiring | Confirm M+ and M- connected |
| Motor condition | Verify motor rotates freely |

---

# Motor Runs Only One Direction

### Possible Causes

• control wiring error  
• enable pins not connected

### Checks

| Check | Action |
|-----|-------|
| ESP32 GPIO wiring | Verify connections |
| Motor driver control pins | Check RPWM / LPWM connections |

---

# Motor Runs Immediately at Full Speed

### Possible Causes

• incorrect control wiring  
• enable pins not connected correctly

Turn off power and verify control wiring.

---

# System Resets During Operation

### Possible Causes

• unstable power supply  
• electrical noise

### Possible Fixes

• install optional capacitors  
• add ferrite core to motor wires  
• verify wiring connections

---

# Fuse Blows

### Possible Causes

• short circuit  
• motor stall condition

### Checks

• inspect wiring  
• check motor for mechanical blockage

---

# Still Having Problems?

Carefully re-inspect the wiring.

Compare your wiring to the reference tables in:

# Next Steps

View the Appendices
[**appendix_traditional_transformer_layout_benefits.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_traditional_transformer_layout_benefits.md)

[**appendix_wiring_reference.md**](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/docs/appendix_wiring_reference.md)


[<<Back to Home](https://github.com/jamocle/PoorMansThrottle-DIY/blob/main/README.md)

[<< Back to Docs](https://github.com/jamocle/PoorMansThrottle-DIY/tree/main/docs)
