# IBT-2 Quick Test (Before You Start Your Project)

## What this test does

This test checks:

* both sides of the driver
* both directions of output
* basic wiring and power

It will tell you:

* ✅ **Good board**
* ⚠️ **Half working (only one direction)**
* ❌ **Bad board**

---

# What you need

* 12V power supply (or battery)
* 5V source (Arduino 5V pin, USB 5V, etc.)
* Small DC motor (or small 12V load like a bulb)
* A few jumper wires
* (Optional but helpful) multimeter

---

# Step 1 — Know the important pins

### Power side (big screw terminals)

* **B+** → 12V positive
* **B-** → 12V negative
* **M+ / M-** → motor connections

### Control side (small pins)

* **VCC** → 5V (logic power)
* **GND** → ground
* **R_EN** → enable right side
* **L_EN** → enable left side
* **RPWM** → one direction input
* **LPWM** → opposite direction input

👉 Important:

* **VCC must be 5V (NOT 12V)**
* Grounds must be connected together

---

# Step 2 — BEFORE powering: quick safety check

Look at the board:

* nothing burnt
* no broken parts
* no loose terminals

👉 If anything looks damaged, stop here.

---

# Step 3 — Wire it up (no motor yet)

Connect:

* B+ → 12V +
* B- → 12V -
* VCC → 5V
* GND → ground

Now set control pins:

* R_EN → 5V (HIGH)
* L_EN → 5V (HIGH)

👉 This turns the board ON

---

# Step 4 — First test (no motor)

You will test **one direction at a time**

---

## Test A (Direction 1)

* RPWM → 5V (HIGH)
* LPWM → GND (LOW)

👉 What should happen:

* The board should produce voltage between **M+ and M-**

If using a multimeter:

* You should see a voltage close to your supply (around 12V)

---

## Test B (Direction 2)

* RPWM → GND (LOW)
* LPWM → 5V (HIGH)

👉 What should happen:

* You should again see voltage across **M+ and M-**
* It should be the **opposite direction** (polarity flipped)

---

# Step 5 — Add a motor (simple real-world check)

Now connect a small motor:

* Motor → M+ and M-

Repeat the same tests:

---

## Test A

* RPWM HIGH
* LPWM LOW

👉 Motor should spin

---

## Test B

* RPWM LOW
* LPWM HIGH

👉 Motor should spin the **other direction**

---

# Step 6 — How to read your results

### ✅ GOOD BOARD

* Motor spins in BOTH directions
* Both tests produce strong movement

---

### ⚠️ HALF-WORKING BOARD

* Motor spins in ONLY ONE direction
* Other direction does nothing

👉 This means one side of the driver is bad

---

### ❌ BAD BOARD

* Motor does not spin at all
* No output in either test

---

### ⚠️ POSSIBLE WIRING ISSUE (check before blaming board)

If nothing works, double-check:

* VCC = 5V (not 12V)
* GND is connected
* R_EN and L_EN are HIGH
* Power supply is actually on
* Motor is good

---

# Step 7 — One important reset step

If the board suddenly stops working:

1. Set:

   * R_EN → LOW
   * L_EN → LOW
2. Wait 2 seconds
3. Set both back to HIGH

👉 This can reset the board if protection triggered

---

# Step 8 — Common beginner mistakes

Avoid these:

* ❌ Putting 12V into VCC (this can destroy the board)
* ❌ Forgetting to connect GND
* ❌ Not setting R_EN and L_EN HIGH
* ❌ Trying to use both RPWM and LPWM HIGH at the same time
* ❌ Testing with a large motor first

---

# Final simple rule

👉 If it spins both directions → **good**

👉 If it spins one direction → **half bad**

👉 If it spins neither → **bad or wired wrong**

