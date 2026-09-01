# "Big-Boy" Systems Controller vs. Poor Man’s Throttle v3.0

> **Comparison scope:** This document compares the "Big-Boy" Systems platform and app with Poor Man’s Throttle (PMT) v3.0.  
> For "Big-Boy" Systems, “No” should be read as “not supported or not documented in the current "Big-Boy" Systems feature set” where applicable.

---

## 1. Hardware Platform & Cost

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Hardware architecture** | 🔒 **Proprietary Big-Boy hardware/platform** | ✅ **Based on the Espressif ESP32 architecture family** |
| **Uses widely available general-purpose hardware** | ❌ **No — proprietary decoder hardware** | ✅ **Yes — ESP32-family hardware is widely available; you may already have compatible boards lying around** |
| **Hardware ecosystem** | 🔒 **Closed/proprietary** | ✅ **Commodity ESP32-based architecture with selectable supporting hardware** |
| **Software / firmware cost** | 💰 **Commercial product** | ✅ **FREE** |
| **Cost to get started** | 💰💰💰💰 **$$$$ — purchase Big-Boy decoder** | ✅ **FREE software/firmware; build from inexpensive commodity hardware** |
| **Reuse hardware you may already own** | ❌ Typically requires purchasing the Big-Boy | ✅ **Yes — compatible ESP32 hardware may already be in your parts bin** |

---

## 2. App & Full-Layout Ecosystem

| Feature | "Big-Boy" Systems / App | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Floating camera video while controlling locomotive** | ❌ **No** | ✅ **Yes — floating camera overlay while throttle remains operational** |
| **Full layout ecosystem from one app** | ❌ **No — locomotive-decoder focused** | ✅ **Yes** |
| **Control modules/devices other than locomotives** | ❌ **No general module ecosystem** | ✅ **Yes — Poor Man’s Modules and other PMT devices** |
| **Locomotives and layout modules in same app** | ❌ No | ✅ **Yes** |
| **Turbine/ESC control in same application** | ❌ No | ✅ **Yes** |
| **Future device types can be added to same ecosystem** | ❌ No general module framework | ✅ **Yes** |
| **Device-type-aware user interface** | ❌ Primarily locomotive-decoder UI | ✅ **Yes — locomotive, module, turbine, etc.** |
| **Unified locomotive + attached-module configuration** | ❌ No general module framework | ✅ **Yes** |
| **Customize app to your own railroad look and feel** | ⚠️ Limited per-locomotive color themes | ✅ **Yes — extensive personalization and railroad branding** |
| **Personal railroad branding** | ❌ No equivalent full branding system | ✅ **Yes** |
| **Multiple throttle screen types** | ❌ No equivalent tiered throttle system | ✅ **Novice / Standard / Expert** |
| **Novice throttle** | ❌ No dedicated mode | ✅ **Yes** |
| **Standard throttle** | ❌ No separate operator tier | ✅ **Yes** |
| **Expert throttle** | ❌ No equivalent expert control surface | ✅ **Yes** |
| **Lock throttle type for children/young operators** | ❌ No | ✅ **Yes** |
| **Simplified protected throttle for youngsters/guests** | ❌ No dedicated lockable mode | ✅ **Yes — Novice mode can be locked** |
| **Feathered brake UI** | ❌ No | ✅ **Yes — Expert Throttle** |
| **Multilingual application** | ❌ No documented multilingual UI | ✅ **Yes** |
| **Integrated command terminal** | ❌ **No** | ✅ **Yes** |
| **Integrated diagnostic terminal** | ❌ **No** | ✅ **Yes** |
| **Send direct firmware/CV commands from app terminal** | ❌ No | ✅ **Yes** |
| **Test commands without leaving application** | ❌ No | ✅ **Yes** |
| **Scripting subsystem for autonomous running of commands and effects** | ❌ No | ✅ **Yes** |
| **Scheduling subsystem for running commands / scripts at specific times** | ❌ No | ✅ **Yes** |
| **Built-in help system** | ❌ No equivalent integrated help system documented | ✅ **Yes** |
| **BLE and Wi-Fi devices controlled from same application** | ❌ Bluetooth only | ✅ **Yes** |
| **Application manages communication failover** | ❌ No secondary wireless transport | ✅ **Yes — BLE ↔ Wi-Fi/WebSockets** |
| **WebSocket/API-controlled devices integrated into app ecosystem** | ❌ No | ✅ **Yes** |
| **Application can gain new capabilities without replacing locomotive hardware** | ⚠️ Vendor-dependent | ✅ **Yes** |
| **Application acts as a layout-control platform** | ❌ Primarily locomotive control/configuration | ✅ **Yes** |
| **Graphical interactive speed curves** | ❌ Conventional decoder speed-table configuration | ✅ **Yes — graphical and interactive** |
| **Application-level installer/developer diagnostics** | ❌ No integrated terminal equivalent | ✅ **Yes** |
| **Graphical MU/consist speed matching** | ⚠️ Limited Low / Medium / High adjustment points with +/- controls | ✅ **Yes — graphical interactive matching** |
| **Real-time MU speed-matching adjustments** | ⚠️ Limited adjustment model | ✅ **Yes — real-time graphical adjustment while operating** |
| **Graphically visualize relationships between locomotives in consist** | ❌ No equivalent interactive system | ✅ **Yes** |
| **Number of simultaneously defined consists** | **4 consists** | ✅ **Unlimited** |
| **Yard/switching reduced-speed mode** | ✅ **Yes — ½-speed Switching Mode** | ✅ **Yes — Yard Switching Mode** |
| **Control multiple locomotives from one app** | ✅ Multi-Train | ✅ Yes |
| **Create consists/MUs** | ✅ Yes | ✅ Yes |
| **Control consist functions** | ✅ Yes | ✅ Yes |
| **Individual locomotive function access while consisted** | ✅ Yes | ✅ Yes |
| **Actual locomotive speed display** | ✅ Yes | ✅ Yes |
| **Target-speed display** | ✅ Yes | ✅ Yes |
| **Voltage display/telemetry** | ✅ Yes | ✅ Yes with compatible telemetry hardware |
| **Wireless signal-strength display** | ✅ RSSI | ❌ No |
| **Stop-All / emergency-stop control** | ✅ Yes | ✅ Yes |
| **Wireless CV editing** | ✅ Yes | ✅ Yes |
| **Locomotive naming** | ✅ Yes | ✅ Yes |
| **Function customization** | ✅ Yes | ✅ Yes |
| **iPhone/iPad support** | ✅ Yes | ✅ Yes |
| **Android support** | ✅ Yes | ✅ Yes |

---

## 3. Updates, Development & User Influence

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **User-installable locomotive firmware updates** | ❌ **No documented user firmware-update mechanism** | ✅ **Yes** |
| **Frequent firmware releases** | ❌ Vendor controlled | ✅ **Daily/weekly as development requires** |
| **Rapid firmware bug fixes** | ❌ Vendor release cycle | ✅ **Yes** |
| **Rapid addition of new firmware capabilities** | ❌ Vendor controlled | ✅ **Yes** |
| **User-suggested features regularly implemented** | ❌ Manufacturer roadmap determines implementation | ✅ **Yes — regularly added** |
| **Community directly influences development** | ⚠️ User feedback possible; implementation vendor-controlled | ✅ **Yes** |
| **Users can modify firmware** | ❌ Proprietary | ⚠️ **Yes — NDA and approval required** |
| **Community firmware contributions** | ❌ No public contribution model | ⚠️ **Yes — NDA and approval required** |
| **User-accessible firmware source** | ❌ No | ⚠️ **Controlled access — NDA/approval requirements apply** |
| **App update cadence** | ⚠️ **Periodic — typically weeks/months between releases** | ✅ **Daily/weekly when development requires** |
| **Active app development** | ✅ Yes | ✅ Yes |

---

## 4. Connectivity, Wi-Fi, Failover & API

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Wi-Fi as primary locomotive-control transport** | ❌ **No** | ✅ **Yes** |
| **Wi-Fi locomotive control** | ❌ **No** | ✅ **Yes** |
| **WebSocket control transport** | ❌ **No** | ✅ **Yes — built into app and firmware** |
| **BLE ↔ Wi-Fi communication failover** | ❌ **No** | ✅ **Yes** |
| **Automatic communication failover** | ❌ No secondary wireless transport | ✅ **Yes** |
| **Secondary wireless transport if primary transport fails** | ❌ No | ✅ **Yes** |
| **Multiple independent wireless transports** | ❌ Bluetooth | ✅ **BLE + Wi-Fi/WebSockets** |
| **Control through an API** | ❌ No documented public control API | ✅ **Yes — WebSocket API** |
| **Computer-based locomotive control** | ❌ No documented direct public API | ✅ **Yes** |
| **External embedded-controller access** | ❌ No documented public API | ✅ **Yes** |
| **Third-party software integration** | ❌ No documented network-control API | ✅ **Yes** |
| **Programmatic locomotive control** | ❌ No documented API | ✅ **Yes** |
| **IP/network-based locomotive control** | ❌ No | ✅ **Yes** |
| **Bluetooth locomotive control** | ✅ Yes | ✅ BLE |
| **Smartphone/tablet control** | ✅ Yes | ✅ Yes |
| **Operate without DCC command station** | ✅ Yes | ✅ Yes |
| **Wireless configuration** | ✅ Yes | ✅ Yes |
| **Real-time wireless control** | ✅ Yes | ✅ Yes |

---

## 5. Crowdsourced & Shareable Audio Ecosystem

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Professionally recorded sounds** | ✅ **Yes** | ⚠️ **Crowdsourced** |
| **Crowdsourced locomotive audio** | ⚠️ **Professionally recorded sounds** | ✅ **Yes** |
| **Users contribute locomotive sound files** | ❌ No arbitrary user-audio ecosystem | ✅ **Yes** |
| **Share sound files with other users** | ❌ No | ✅ **Yes** |
| **Download community-created locomotive sounds** | ❌ No | ✅ **Yes** |
| **Community continuously grows the sound library** | ❌ Manufacturer controlled | ✅ **Yes** |
| **Community-created prime movers** | ❌ No arbitrary import | ✅ **Yes** |
| **Community-created horns** | ❌ No arbitrary import | ✅ **Yes** |
| **Community-created bells** | ❌ No arbitrary import | ✅ **Yes** |
| **Community-created whistles** | ❌ No arbitrary import | ✅ **Yes** |
| **Community-created chuffs** | ❌ No arbitrary import | ✅ **Yes** |
| **Community-created FX sounds** | ❌ No arbitrary import | ✅ **Yes** |
| **Record your own locomotive and install it** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **Distribute complete locomotive sound sets** | ❌ No | ✅ **Yes** |
| **Potential sound library size** | Large but manufacturer-defined | ✅ **Community-expandable; PMTPlayer addresses track IDs `0001`–`9999` within the active sound root, subject to storage/content limits** |
| **Sound ecosystem independent of manufacturer releases** | ❌ No | ✅ **Yes** |

---

## 6. Core Sound Architecture

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Steam and Diesel sound architectures available simultaneously** | ❌ No runtime cross-profile system documented | ✅ **Yes** |
| **Real-time Steam ↔ Diesel switching** | ❌ No | ✅ **Yes** |
| **Select Steam/Diesel using a CV** | ❌ No equivalent capability | ✅ **Yes — real-time CV selectable** |
| **Change engine sound type while operating** | ❌ No | ✅ **Yes** |
| **User-supplied WAV files** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **User-replaceable complete locomotive sound library** | ❌ Manufacturer library | ✅ **Yes** |
| **User-created complete locomotive sound sets** | ❌ No arbitrary library | ✅ **Yes** |
| **Mutable locomotive WAV files** | ❌ No | ✅ **Yes** |
| **Firmware designed around mutable user WAVs** | ❌ Factory-defined audio | ✅ **Yes** |
| **Replace audio without recompiling firmware** | ❌ Not with arbitrary audio | ✅ **Yes** |
| **Sound library expansion without manufacturer involvement** | ❌ No | ✅ **Yes** |
| **Sound for virtually any locomotive/engine type** | ✅ Extensive Steam/Diesel options | ✅ **Yes — user sound-set based** |
| **Steam locomotive sound** | ✅ Yes | ✅ Yes |
| **Diesel locomotive sound** | ✅ Yes | ✅ Yes |
| **Multiple prime movers** | ✅ Yes | ✅ Yes |
| **Multiple steam exhaust/chuff choices** | ✅ Yes | ✅ Yes |
| **Speed-responsive sound** | ✅ Yes | ✅ Yes |
| **Load-responsive sound** | ✅ Dynamic Digital Exhaust | ✅ Yes |
| **Dynamic exhaust behavior** | ✅ DDE | ✅ Yes |

---

## 7. Custom Function / FX Audio

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Attach custom sound files to Functions (FX)** | ❌ **NONE** | ✅ **FULLY CAPABLE** |
| **Import arbitrary WAV as an FX sound** | ❌ None | ✅ **Yes** |
| **Assign personal recording to an FX function** | ❌ No | ✅ **Yes** |
| **User-created FX library** | ❌ No arbitrary files | ✅ **Yes** |
| **Locomotive-specific custom FX audio** | ❌ No arbitrary files | ✅ **Yes** |
| **Potential number of custom FX sounds** | ❌ **0 arbitrary user-provided files** | ✅ **Track IDs `1`–`9999` are addressable for custom PMTPlayer FX within the active sound root; 12 FX slots can be configured at once** |
| **Replace FX sound with another user WAV** | ❌ No | ✅ **Yes** |
| **Add FX audio without recompiling firmware** | ❌ No arbitrary WAV support | ✅ **Yes** |
| **Crowdsource FX sounds** | ❌ No | ✅ **Yes** |
| **Share FX sounds with another PMT user** | ❌ No | ✅ **Yes** |
| **Function-triggered sound** | ✅ Yes | ✅ Yes |
| **Function remapping** | ✅ Flex-Map | ✅ Yes |
| **Direction-sensitive functions** | ✅ Yes | ✅ Yes |
| **28-function capability** | ✅ Yes | ✅ Configurable |

---

## 8. Diesel Sound

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **User-created prime mover** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **User-created horn** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **User-created bell** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **User-created compressor/coupler/auxiliary sounds** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **Crowdsourced Diesel sound library** | ❌ No | ✅ **Yes** |
| **Diesel prime mover** | ✅ Yes | ✅ Yes |
| **Multiple prime movers** | ✅ Yes | ✅ Yes |
| **Engine startup** | ✅ Yes | ✅ Yes |
| **Engine shutdown** | ✅ Yes | ✅ Yes |
| **Idle sound** | ✅ Yes | ✅ Yes |
| **Notch-based engine sound** | ✅ Yes | ✅ Yes |
| **RPM/notch changes** | ✅ Yes | ✅ Yes |
| **Load-reactive exhaust** | ✅ DDE | ⚠️ **Requires INA219 child board** |
| **Horn** | ✅ Yes | ✅ Yes |
| **Multiple horns** | ✅ Yes | ✅ Yes |
| **Bell** | ✅ Yes | ✅ Yes |
| **Dynamic-brake sound** | ✅ Yes | ✅ Yes/custom FX |
| **Air compressor** | ✅ Yes | ✅ Yes/custom FX |
| **Coupler** | ✅ Yes | ✅ Yes/custom FX |
| **Brake squeal** | ✅ Yes | ✅ Yes |
| **Cab chatter/crew audio** | ✅ Yes | ✅ Yes |

---

## 9. Steam Sound

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **User-created chuff/exhaust WAVs** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **User-created whistle WAVs** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **User-created steam appliance sounds** | ❌ Manufacturer library | ✅ **Yes** |
| **Crowdsourced Steam sound library** | ❌ No | ✅ **Yes** |
| **Steam exhaust/chuff** | ✅ Yes | ✅ Yes |
| **Chuff cadence changes with speed** | ✅ Yes | ✅ Yes |
| **Four exhaust events per wheel revolution capability** | ✅ Yes/configurable | ✅ Yes |
| **Load-responsive steam exhaust** | ✅ DDE | ✅ Yes |
| **Multiple chuff types** | ✅ Yes | ✅ Yes |
| **Whistle** | ✅ Yes | ✅ Yes |
| **Multiple whistles** | ✅ Yes | ✅ Yes |
| **Bell** | ✅ Yes | ✅ Yes |
| **Injector** | ✅ Yes | ✅ Custom FX capable |
| **Air pump/compressor** | ✅ Yes | ✅ Custom FX capable |
| **Dynamo** | ✅ Yes | ✅ Custom FX capable |
| **Power reverse** | ✅ Yes | ✅ Custom FX capable |
| **Firebox effects** | ✅ Yes | ✅ Configurable |
| **Coupler sounds** | ✅ Yes | ✅ Yes |

---

## 10. Audio Processing & Amplifier

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Audio system accepts arbitrary user WAV library** | ❌ No | ✅ **Yes** |
| **Audio system works with crowdsourced sound sets** | ❌ No | ✅ **Yes** |
| **User can fundamentally replace audio content** | ❌ Manufacturer library | ✅ **Yes** |
| **Digital audio mixing** | ✅ Yes | ✅ Yes |
| **Master volume** | ✅ Yes | ✅ Yes |
| **Individual sound volume** | ✅ Yes | ⚠️ **Not yet — coming soon** |
| **Audio shaping / EQ** | ✅ Yes | ⚠️ **Yes — not configurable** |
| **Reverb/audio processing** | ✅ Yes | ⚠️ **Yes — not configurable** |
| **Dynamic audio processing** | ✅ Yes | ✅ Yes |
| **Sound priority management** | ✅ Yes | ✅ Yes |
| **Standard amplifier recipe** | **3W / 8Ω** | ✅ **4W / 4Ω or 8Ω** |

> Removed from this comparison as requested: **Concurrent Audio Playback**, **Multi-channel/Voice Audio**, and **Sound Channels**.

---

## 11. Motor Power & Large-Scale / Multi-Locomotive Capability

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **48A standard installation** | ❌ **No — 4A max stall current** | ✅ **Yes — 48A standard recipe** |
| **Up to 10 locomotives wired in parallel** | ❌ No 48A-class capability | ✅ **Yes** |
| **High-current multi-locomotive architecture** | ❌ Fixed 4A output | ✅ **Yes** |
| **Motor power independently scalable from controller** | ❌ Integrated/fixed | ✅ **Yes** |
| **Replace motor driver without replacing controller** | ❌ No | ✅ **Yes** |
| **Selectable motor-driver hardware** | ❌ No | ✅ **Yes** |
| **Scale amperage by changing motor driver** | ❌ No | ✅ **Yes** |
| **Motor load beyond 4A aggregate** | ❌ No | ✅ **Yes** |
| **Standard maximum motor capability** | **4A stall** | **48A standard installation** |
| **Direct motor control** | ✅ Yes | ✅ Yes |
| **Forward/reverse** | ✅ Yes | ✅ Yes |
| **Variable speed** | ✅ Yes | ✅ Yes |

> **Technical note:** Big-Boy’s limitation is **4A aggregate maximum motor stall current**. Parallel motors are not inherently prohibited if their total load remains within that rating.

---

## 12. Motor Control & Speed Curves

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Interactive graphical speed-curve editor** | ❌ Conventional decoder speed-table configuration | ✅ **Yes — graphical and interactive** |
| **Replaceable motor-control power stage** | ❌ No | ✅ **Yes** |
| **User-selectable motor-driver architecture** | ❌ No | ✅ **Yes** |
| **Advanced motor control** | ✅ Big-Boy architecture | ✅ PMT motor control |
| **Back-EMF control** | ✅ Yes | ✅ **Yes — requires INA219 or compatible micro board** |
| **Low-speed control** | ✅ Yes | ✅ Yes |
| **Acceleration momentum** | ✅ Yes | ✅ Yes |
| **Deceleration momentum** | ✅ Yes | ✅ Yes |
| **Speed matching** | ✅ Yes | ✅ Yes |
| **Speed curves** | ✅ 3-point / 28-point custom | ✅ **Graphical and interactive speed curves** |
| **Maximum-speed configuration** | ✅ Yes | ✅ Yes |
| **Motor direction configuration/inversion** | ✅ Yes | ✅ Yes |

---

## 13. Braking & Driving Realism

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Feathered braking** | ❌ **No** | ✅ **Yes — Expert Throttle** |
| **Continuous proportional operator brake control** | ❌ No feathered-brake equivalent | ✅ **Yes — Expert Throttle; supported by firmware** |
| **Acceleration momentum** | ✅ Yes | ✅ Yes |
| **Deceleration momentum** | ✅ Yes | ✅ Yes |
| **Adjustable acceleration** | ✅ Yes | ✅ Yes |
| **Adjustable deceleration** | ✅ Yes | ✅ Yes |
| **Locomotive brake** | ✅ Yes | ✅ Yes |
| **Train brake** | ✅ Yes | ✅ Yes |
| **Adjustable braking behavior** | ✅ Yes | ✅ Yes |
| **Brake sound integration** | ✅ Yes | ✅ Yes |
| **Brake squeal** | ✅ Yes | ✅ **Yes — start/sustain/stop implementation** |
| **Rapid/E-stop capability** | ✅ Yes | ✅ Yes |

---

## 14. Lighting & Physical Functions

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Function-output architecture expandable through modules** | ❌ Fixed eight outputs | ✅ **Yes** |
| **Output hardware independently selectable** | ❌ Fixed decoder | ✅ **Yes** |
| **Physical function outputs** | ✅ **8** | ✅ Hardware/module dependent |
| **Function-output rating** | ✅ **400mA each** | ✅ Hardware dependent |
| **Directional headlights** | ✅ Yes | ✅ Yes |
| **Function-controlled lighting** | ✅ Yes | ✅ Yes |
| **Lighting effects** | ✅ Hyperlight | ✅ Configurable |
| **Dimming** | ✅ Yes | ✅ Yes |
| **Flashing/blinking effects** | ✅ Yes | ✅ Yes |
| **Ditch lights** | ✅ Yes | ✅ Yes |
| **Mars/Gyralite-style effects** | ✅ Yes | ✅ Configurable |
| **Firebox flicker** | ✅ Yes | ✅ Configurable |
| **Function mapping** | ✅ Flex-Map | ✅ Yes |
| **Direction-sensitive mapping** | ✅ Yes | ✅ Yes |

---

## 15. Configuration, Backup & Locomotive Management

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Real-time Steam/Diesel type selection by CV** | ❌ No | ✅ **Yes** |
| **Locomotive templates** | ❌ No equivalent PMT template architecture | ✅ **Yes** |
| **Backup locomotive configuration/settings** | ✅ **Yes** | ✅ **Yes** |
| **Restore saved locomotive configuration/settings** | ✅ **Yes** | ✅ **Yes** |
| **Copy settings between locomotives** | ✅ **Yes** | ✅ **Yes** |
| **Locomotive profiles/configurations** | ✅ Yes | ✅ Yes |
| **CV-based configuration** | ✅ Yes | ✅ Yes |
| **Wireless CV configuration** | ✅ Yes | ✅ Yes |
| **Real-time parameter adjustment** | ✅ Yes | ✅ Yes |
| **Motor configuration** | ✅ Yes | ✅ Yes |
| **Sound configuration** | ✅ Yes | ✅ Yes |
| **Lighting configuration** | ✅ Yes | ✅ Yes |
| **Momentum configuration** | ✅ Yes | ✅ Yes |
| **Brake configuration** | ✅ Yes | ✅ Yes |
| **Function mapping** | ✅ Yes | ✅ Yes |

---

## 16. Operating Modes & Multi-Locomotive Control

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Wi-Fi-only locomotive operation** | ❌ No | ✅ **Yes** |
| **Network-controlled locomotive operation** | ❌ No IP transport | ✅ **Yes** |
| **Battery/dead-rail operation** | ✅ Yes | ✅ Yes |
| **Traditional DC operation** | ✅ Yes | ✅ Yes |
| **Tri-mode capable** | ⚠️ **Controller and battery; DC rail power and controller** | ✅ **Controller and battery; DC rail power and controller; controller between DC and rails** |
| **DCC operation** | ✅ Yes | ❌ PMT is not a DCC decoder |
| **Bluetooth operation without DCC** | ✅ Yes | ✅ Yes |
| **Multiple-locomotive control** | ✅ Yes | ✅ Yes |
| **Consisting / MU operation** | ✅ Yes | ✅ Yes |
| **½-speed yard/switching operation** | ✅ **Yes — Switching Mode** | ✅ **Yes — Yard Switching Mode** |

---

## 17. Hardware Specifications

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **48A standard motor installation** | ❌ No | ✅ **Yes** |
| **Up to 10 locomotives wired in parallel** | ❌ No 48A-class capability | ✅ **Yes** |
| **Replaceable motor-power stage** | ❌ No | ✅ **Yes** |
| **Selectable motor hardware** | ❌ No | ✅ **Yes** |
| **Maximum motor stall rating** | **BLU 4A** | **48A** (driver dependent) |
| **Standard PMT motor recipe** | — | **48A** |
| **Physical function outputs** | **8** | Hardware/module dependent |
| **Function-output current** | **400mA each** | Hardware dependent |
| **Audio amplifier** | **3W / 8Ω** | ✅ **4W / 4Ω or 8Ω** |
| **Dimensions** | **69 × 30.5 × 14mm** | Installation dependent |
| **DCC track voltage** | **7–27V** | N/A |
| **Keep-alive capability** | ✅ **CurrentKeeper connector** | ✅ **Can install a capacitor to provide this functionality** |

---

## 18. Telemetry, Sensors & Expansion

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **General-purpose sensor expansion** | ❌ Not a general modular platform | ✅ **Yes** |
| **User-installable control modules** | ❌ Fixed decoder architecture | ✅ **Poor Man’s Modules** |
| **Voltage telemetry expansion** | ❌ No general module framework | ✅ **Yes** |
| **Current telemetry expansion** | ❌ No general module framework | ✅ **Yes** |
| **Power telemetry** | ❌ No general module framework | ✅ **Yes** |
| **Back-EMF sensing with external measurement hardware** | ❌ Integrated architecture | ✅ **Yes — INA219 or compatible micro board** |
| **External sensor integration** | ❌ No general module framework | ✅ **Yes** |
| **Wi-Fi telemetry** | ❌ No | ✅ **Yes** |
| **WebSocket telemetry/API access** | ❌ No network API | ✅ **Yes** |
| **External computer/software telemetry access** | ❌ No public network API | ✅ **Yes** |

---

## 19. Platform Extensibility

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **User firmware modification** | ❌ No | ⚠️ **Yes — NDA + approval required** |
| **Community firmware contribution** | ❌ No public model | ⚠️ **Yes — NDA + approval required** |
| **User-accessible firmware source** | ❌ No | ⚠️ **Controlled access** |
| **User-expandable audio library** | ❌ No arbitrary user audio | ✅ **Yes** |
| **Crowdsourced audio ecosystem** | ❌ No | ✅ **Yes** |
| **Custom FX-audio platform** | ❌ No arbitrary WAV import | ✅ **Yes** |
| **General hardware expansion modules** | ❌ Fixed decoder | ✅ **Yes** |
| **Replaceable motor-driver architecture** | ❌ No | ✅ **Yes** |
| **Sensor expansion** | ❌ Not general-purpose | ✅ **Yes** |
| **Telemetry expansion** | ❌ Not general-purpose | ✅ **Yes** |
| **Wi-Fi networking** | ❌ No | ✅ **Yes** |
| **WebSocket networking** | ❌ No | ✅ **Yes** |
| **External control API** | ❌ No documented API | ✅ **Yes** |
| **Turbine/ESC support** | ❌ No | ✅ **Yes** |
| **ESC configuration/calibration** | ❌ No | ✅ **Yes** |
| **Platform supports devices beyond locomotive decoder** | ❌ Primarily locomotive decoder | ✅ **Yes — full layout ecosystem** |

---

# Highest-Impact Differentiators

| Feature | "Big-Boy" Systems | Poor Man’s Throttle v3.0 |
|---|---|---|
| **Hardware architecture** | 🔒 **Proprietary** | ✅ **Espressif ESP32 family** |
| **Software / firmware cost** | 💰 Commercial | ✅ **FREE** |
| **Full layout ecosystem** | ❌ | ✅ **YES** |
| **Control non-locomotive modules** | ❌ | ✅ **YES** |
| **Floating camera overlay while driving** | ❌ | ✅ **YES** |
| **Novice / Standard / Expert throttles** | ❌ | ✅ **YES** |
| **Lockable youngster-friendly throttle** | ❌ | ✅ **YES** |
| **Feathered braking** | ❌ | ✅ **YES — EXPERT THROTTLE** |
| **Graphical interactive MU speed matching** | ❌ Limited Low/Medium/High +/- | ✅ **YES** |
| **Interactive graphical speed curves** | ❌ Conventional speed-table configuration | ✅ **YES** |
| **Number of consists** | **4** | ✅ **UNLIMITED** |
| **Multilingual app** | ❌ | ✅ **YES** |
| **Integrated terminal** | ❌ | ✅ **YES** |
| **Built-in help system** | ❌ No equivalent | ✅ **YES** |
| **Custom railroad branding/look & feel** | ⚠️ Limited color themes | ✅ **YES** |
| **Wi-Fi as primary control transport** | ❌ | ✅ **YES** |
| **BLE ↔ Wi-Fi failover** | ❌ | ✅ **YES** |
| **WebSocket control** | ❌ | ✅ **YES** |
| **Computer/API control** | ❌ | ✅ **YES** |
| **48A standard installation** | ❌ **4A MAX** | ✅ **48A** |
| **Up to 10 locomotives wired in parallel** | ❌ | ✅ **YES** |
| **Steam + Diesel simultaneously available** | ❌ | ✅ **YES** |
| **Real-time Steam ↔ Diesel CV switching** | ❌ | ✅ **YES** |
| **User-supplied locomotive WAV files** | ❌ | ✅ **YES** |
| **Custom audio files attached to FX** | ❌ **NONE** | ✅ **FULLY CAPABLE** |
| **Potential custom FX sounds** | ❌ **NONE** | ✅ **EFFECTIVELY UNLIMITED** |
| **Crowdsourced locomotive audio** | ⚠️ **Professionally recorded sounds** | ✅ **YES** |
| **Share/download community sound sets** | ❌ | ✅ **YES** |
| **Frequent firmware/app development** | Vendor release cycle | ✅ **DAILY/WEEKLY** |
| **User-requested features regularly implemented** | Vendor roadmap | ✅ **YES** |
| **User firmware modification** | ❌ | ⚠️ **YES — NDA + APPROVAL REQUIRED** |
| **Replaceable/scalable motor driver** | ❌ | ✅ **YES** |
| **General hardware expansion** | ❌ | ✅ **YES** |
| **Sensor/telemetry expansion** | ❌ | ✅ **YES** |
| **Bluetooth locomotive control** | ✅ | ✅ |
| **½-speed yard/switching mode** | ✅ | ✅ |
| **Backup configuration** | ✅ | ✅ |
| **Restore configuration** | ✅ | ✅ |
| **Copy settings between locomotives** | ✅ | ✅ |
| **Steam sound** | ✅ | ✅ |
| **Diesel sound** | ✅ | ✅ |
| **Dynamic/load-responsive sound** | ✅ | ✅ |
| **Advanced motor control** | ✅ | ✅ |
| **Locomotive/train braking** | ✅ | ✅ |
| **Lighting/function effects** | ✅ | ✅ |

---

## Summary

**"Big-Boy" Systems** is a sophisticated proprietary commercial locomotive sound/motor decoder with Bluetooth control, extensive factory sound libraries, advanced motor control, braking, lighting, CV configuration, and strong locomotive-focused app features.

**Poor Man’s Throttle v3.0** is an ESP32-family, free software/firmware platform designed as a broader model-railroad ecosystem. It adds Wi-Fi/WebSocket transport, BLE/Wi-Fi failover, API control, much higher scalable motor power, graphical consist/speed tools, feathered braking, multiple throttle experiences, a floating camera overlay, layout modules, telemetry, custom and crowdsourced WAV audio, arbitrary FX audio, rapid feature evolution, and controlled community firmware contribution.
