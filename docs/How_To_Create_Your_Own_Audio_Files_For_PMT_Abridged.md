# How to Create Your Own Audio Files for PMT — Abridged Guide

**Firmware source:** PMT `3.0.0`, revision `221`  
**Audio system:** PMTPlayer only  
**Audacity examples:** Audacity `3.7.9` stable

This is the short version of the PMT audio-authoring guide. It assumes you already know the basics of opening, selecting, trimming, and exporting audio in Audacity.

---

# 1. The PMT Audio Format

For best results, make **every PMT sound**:

| Setting | Use |
|---|---|
| File type | WAV |
| Encoding | Signed 16-bit PCM |
| Channels | Mono |
| Sample rate | **22,050 Hz** |
| Bit depth | **16-bit** |
| PCM bitrate | **352.8 kbps** |
| Compression | None |
| Filename | Four digits, such as `0090.wav` |

PMTPlayer accepts sample rates from **8,000 through 48,000 Hz**, but **22,050 Hz mono, 16-bit PCM WAV** is the recommended authoring standard.

Do not use stereo, 24-bit, 32-bit float, MP3, AAC, OGG, FLAC, ADPCM, or another compressed WAV format.

---

# 2. Folder and Filename Rules

PMT sounds go in:

```text
/diesel
/steam
```

Track numbers always use four digits:

```text
0080.wav
0090.wav
0100.wav
0202.wav
0300.wav
```

Not:

```text
80.wav
90.wav
100.wav
```

The same track number can contain different sounds in the diesel and steam folders.

Example:

```text
/diesel/0212.wav = "HOOOOOOONK"
/steam/0212.wav  = "TOOOOOOOOOT"
```

---

# 3. Three Audio Types

## One-shot

Plays once and ends naturally.

Examples:

- startup;
- shutdown;
- chuff;
- steam event;
- horn release;
- cab chatter.

Trim unnecessary silence, but keep the natural sound tail.

---

## Loop

Repeats while PMT needs it.

Examples:

- diesel idle;
- diesel notches;
- steam background;
- horn sustain;
- brake sustain.

The loop point should not be obvious.

Good:

**"rrrrrrrrrrrrrrrrrrrr"**

Bad:

**"rrrrrr—CLICK—rrrrrr—CLICK"**

---

## Start / Sustain / Release

Some effects use three files:

```text
START -> SUSTAIN -> RELEASE
```

Example horn:

```text
0211.wav    0212.wav         0213.wav
"HWAH-"  + "HOOOOOOONK"  + "-oooooff"
```

The sustain file is normally the loop.

---

# 4. Diesel Files

Place these in:

```text
/diesel
```

| File | Purpose | Expected sound | Recommended length |
|---|---|---|---:|
| `0080.wav` | Brake start | **"SKREE-"** | 0.10–0.40 s |
| `0081.wav` | Brake sustain loop | **"EEEEEEEE"** | 0.4–1.5 s |
| `0082.wav` | Brake release | **"eeee...ssst"** | 0.2–0.8 s |
| `0090.wav` | Engine startup | **"rrr...RRR...VROOM...RUM"** | 4–10 s |
| `0091.wav` | Engine shutdown | **"RUM-rum...putt...stop"** | 3–8 s |
| `0100.wav` | Idle / Notch 0 loop | **"RUM...RUM...RUM"** | 2–6 s |
| `0101.wav` | Notch 1 loop | **"rum-RUM-rum-RUM"** | 2–6 s |
| `0102.wav` | Notch 2 loop | **"RUM-RUM-RUM"** | 2–6 s |
| `0103.wav` | Notch 3 loop | **"RRUM-RRUM-RRUM"** | 2–6 s |
| `0104.wav` | Notch 4 loop | **"RRRAAM-RRRAAM"** | 2–6 s |
| `0105.wav` | Notch 5 loop | **"RRAAAAMMMMM"** | 2–6 s |
| `0106.wav` | Notch 6 loop | **"RRRRAAAAMMMM"** | 2–6 s |
| `0107.wav` | Notch 7 loop | **"WAAARRR-RRRAAAM"** | 2–6 s |
| `0108.wav` | Notch 8 loop | **"WAAAAARRRRR!"** | 2–6 s |
| `0202.wav` | Bell loop | **"DINGgggg..."** | 0.8–1.6 s |
| `0211.wav` | Horn start | **"HWAH-"** | 0.15–0.50 s |
| `0212.wav` | Horn sustain loop | **"HOOOOOOONK"** | 0.5–2.0 s |
| `0213.wav` | Horn release | **"-oooooff..."** | 0.25–1.0 s |
| `0300.wav+` | Cab chatter | **"psshht...copy that..."** | 1–8 s |

## Diesel notch rule

Each notch file should contain a **steady engine state**.

Do not take one recording of an engine accelerating through several speeds and cut arbitrary pieces from it.

Whenever possible, sample the actual locomotive while it is holding each real notch.

The files should become progressively stronger from `0100.wav` through `0108.wav`, not simply louder copies of one file.

---

# 5. Steam Stationary Files

Place these in:

```text
/steam
```

| File | Purpose | Expected sound | Recommended length |
|---|---|---|---:|
| `0080.wav` | Brake start | **"SKREE-"** | 0.10–0.40 s |
| `0081.wav` | Brake sustain loop | **"EEEEEEEE"** | 0.4–1.5 s |
| `0082.wav` | Brake release | **"eeee...ssst"** | 0.2–0.8 s |
| `0093.wav` | Stationary steam event | **"PSSSSHHHH!"** | **2.0 s minimum; 4–10 s recommended** |
| `0094.wav` | Steam event release | **"pssshhh...sss..."** | 0.5–2.5 s |
| `0095.wav` | Stopped steam background loop | **"sssshhhhhhhh..."** | 3–8 s |
| `0190.wav` | Moving steam background loop | **"hhhhhh-sssshh-rrrrhh"** | 3–8 s |
| `0202.wav` | Bell loop | **"DINGgggg..."** | 0.8–1.6 s |
| `0211.wav` | Whistle start | **"TWOO-"** | 0.15–0.50 s |
| `0212.wav` | Whistle sustain loop | **"TOOOOOOOOOT"** | 0.5–2.0 s |
| `0213.wav` | Whistle release | **"-oooooot...pssh"** | 0.25–1.0 s |
| `0300.wav+` | Cab chatter | **"psshht...clear ahead..."** | 1–8 s |

## `0093.wav`

`0093.wav` must be at least:

**2.0 seconds**

A **4–10 second** file is recommended because it gives PMT more useful stationary-steam material.

The useful sound should begin near the start of the file. Do not put two seconds of silence before the steam event.

---

# 6. Steam Chuffs

PMT uses **48 separate chuff files**.

Each speed band has:

- four chuff sets;
- four wheel phases per set;
- phases at 0°, 90°, 180°, and 270°.

PMT steps through the four phases and changes sound sets so the locomotive does not repeat exactly the same four chuffs forever.

## Low-speed chuffs

```text
0100.wav through 0115.wav
```

Expected:

**"CHUFF!"**

Recommended:

**0.25–0.55 seconds each**

---

## Medium-speed chuffs

```text
0120.wav through 0135.wav
```

Expected:

**"Chuff!"**

or:

**"CHFF!"**

Recommended:

**0.16–0.35 seconds each**

---

## High-speed chuffs

```text
0140.wav through 0155.wav
```

Expected:

**"CHFF!"**

or:

**"TCHFF!"**

Recommended:

**0.10–0.22 seconds each**

---

## Chuff authoring rules

Choose clean individual exhaust beats.

Keep:

- the attack;
- the body;
- a short natural tail.

Do not add artificial silence after the chuff.

Bad:

```text
CHUFF!...................[silence]
```

Better:

```text
CHUFF!
```

with its natural short exhaust tail.

Within each group of four, the chuffs should sound like the same locomotive at the same general load, with small natural differences.

---

# 7. Steam Moving Background — `0190.wav`

`0190.wav` is the continuous moving steam background.

Expected:

**"hhhhhh—sssshh—rrrrhhhhh"**

Think of it as the moving locomotive sound underneath the individual chuffs:

- rushing air;
- running gear;
- steam texture;
- low mechanical movement.

Recommended:

**3–8 seconds**

It must loop smoothly.

The current runtime uses **`0190.wav` only** for the normal continuous moving-bed system.

You do not need to create `0191.wav` or `0192.wav` for this system.

---

# 8. Bell — `0202.wav`

Expected:

**"DINGgggggg..."**

Recommended:

**0.8–1.6 seconds per bell cycle**

The file loops while the bell is active.

Include:

1. the strike;
2. the ring;
3. its natural decay;
4. enough spacing for the next looped strike to sound believable.

The loop should sound like:

```text
DINGgggg...... | DINGgggg...... | DINGgggg......
```

Do not cut the ringing tail off sharply.

---

# 9. Horn / Whistle

These use:

```text
0211.wav = start
0212.wav = sustain loop
0213.wav = release
```

## Diesel

```text
0211 = "HWAH-"
0212 = "HOOOOOOONK"
0213 = "-oooooff..."
```

## Steam

```text
0211 = "TWOO-"
0212 = "TOOOOOOOOOT"
0213 = "-oooooot...pssh"
```

Recommended lengths:

| File | Length |
|---|---:|
| `0211.wav` | 0.15–0.50 s |
| `0212.wav` | 0.5–2.0 s |
| `0213.wav` | 0.25–1.0 s |

The important part is making `0212.wav` loop smoothly.

---

# 10. Cab Chatter

Cab chatter begins at:

```text
0300.wav
```

and can continue through:

```text
0399.wav
```

Examples:

**"psshht...copy that..."**

**"ksssh...clear ahead..."**

**"dispatcher to engine..."**

Recommended:

**1–8 seconds each**

## Important numbering rule

Cab chatter filenames must be continuous.

Good:

```text
0300.wav
0301.wav
0302.wav
0303.wav
```

Bad:

```text
0300.wav
0301.wav
0302.wav
0304.wav
```

If `0303.wav` is missing, PMT stops discovering cab-chatter tracks at that gap.

---

# 11. Which Files Must Loop Well?

## Diesel

```text
0100.wav
0101.wav
0102.wav
0103.wav
0104.wav
0105.wav
0106.wav
0107.wav
0108.wav
```

## Steam

```text
0095.wav
0190.wav
```

## Both locomotive types

```text
0081.wav    brake sustain
0202.wav    bell
0212.wav    horn/whistle sustain
```

Any custom audio configured as a repeating sound must also loop well.

---

# 12. Audacity Fast Workflow

## 1. Import

```text
File > Import > Audio...
```

or drag the source file into Audacity.

---

## 2. Find the sound

Select the clean section you want.

Examples:

- **"DING"** for the bell;
- **"CHUFF!"** for a steam exhaust beat;
- **"RUM-RUM-RUM"** for diesel idle;
- **"HOOOOONK"** for horn sustain.

---

## 3. Trim

Use:

```text
Edit > Remove Special > Trim Audio
```

Windows/Linux shortcut:

```text
Ctrl + T
```

Remove unnecessary lead-in and trailing dead air.

---

## 4. Convert to mono

Use:

```text
Tracks > Mix > Mix Stereo Down to Mono
```

Listen afterward to make sure the sound did not become weak due to phase cancellation.

---

## 5. Fix clicks

Use very short fades where needed:

```text
Effect > Fading > Fade In
Effect > Fading > Fade Out
```

Do not use a slow fade on an attack such as:

**"CHUFF!"**

or:

**"DING!"**

unless that is actually how the source should sound.

---

## 6. Test loops

For loop files, use Audacity loop playback.

Press:

```text
L
```

to control looping, then play the loop repeatedly.

Listen for:

- clicks;
- jumps in level;
- sudden pitch changes;
- repeating clanks or other obvious events;
- an obvious restart.

Adjust the loop boundaries until the transition disappears.

Choosing boundaries near waveform zero crossings can help reduce clicks.

---

## 7. Normalize

A useful PMT starting point is:

```text
Effect > Volume and Compression > Normalize...
```

Set peak amplitude to approximately:

```text
-3.0 dB
```

This is an authoring recommendation, not a firmware requirement.

Listen afterward. Do not rely on the number alone.

---

# 13. Export from Audacity

Use:

```text
File > Export Audio...
```

Set:

| Setting | Value |
|---|---|
| Format | WAV |
| Channels | Mono |
| Sample Rate | **22050 Hz** |
| Encoding | **Signed 16-bit PCM** |

Then use the exact PMT filename:

```text
0090.wav
0202.wav
0212.wav
```

---

# 14. Fast Sampling Examples

## Diesel startup — `0090.wav`

Find:

**"rrr...rrr...VROOM...RUM-RUM"**

Keep the cranking, engine catch, and transition into running.

Do not include a long idle afterward.

---

## Diesel notch

Find several seconds of a steady engine state:

**"RRRRAAAAMMMMM"**

Trim 2–6 seconds and make it loop.

---

## Bell — `0202.wav`

Find one clean:

**"DINGgggg..."**

Keep the strike and useful natural decay.

---

## Horn / whistle

Find:

**"HWAH-HOOOOOOONK-oooooff"**

Split it into:

```text
0211 = attack
0212 = steady sustain
0213 = release
```

Make `0212.wav` loop cleanly.

---

## Steam chuff

Find one clean:

**"CHUFF!"**

Trim close to the pressure attack and natural tail.

Do not pad it with silence.

---

## Steam moving bed — `0190.wav`

Find steady:

**"sssshhhh-rrrrhhhh"**

without a large individual **"CHUFF!"**

Take 3–8 seconds and make it loop.

---

# 15. Quick Duration Reference

These are **recommended authoring ranges**, not exact PMT hardware durations.

| File / Range | Recommended length |
|---|---:|
| `0080.wav` | 0.10–0.40 s |
| `0081.wav` | 0.4–1.5 s |
| `0082.wav` | 0.2–0.8 s |
| `0090.wav` | 4–10 s |
| `0091.wav` | 3–8 s |
| `0093.wav` | **2.0 s minimum; 4–10 s recommended** |
| `0094.wav` | 0.5–2.5 s |
| `0095.wav` | 3–8 s |
| Diesel `0100–0108` | 2–6 s each |
| Steam `0100–0115` | 0.25–0.55 s each |
| Steam `0120–0135` | 0.16–0.35 s each |
| Steam `0140–0155` | 0.10–0.22 s each |
| `0190.wav` | 3–8 s |
| `0202.wav` | 0.8–1.6 s |
| `0211.wav` | 0.15–0.50 s |
| `0212.wav` | 0.5–2.0 s |
| `0213.wav` | 0.25–1.0 s |
| `0300–0399.wav` | 1–8 s each |

---

# 16. Final Checklist

Before copying a file to the SD card:

- [ ] correct `/diesel` or `/steam` folder;
- [ ] four-digit filename;
- [ ] `.wav`;
- [ ] mono;
- [ ] 22,050 Hz;
- [ ] signed 16-bit PCM;
- [ ] no clipping;
- [ ] no unnecessary silence at the beginning;
- [ ] natural ending for one-shot sounds;
- [ ] seamless transition for loop sounds;
- [ ] reasonable loudness compared with the rest of the sound set.

## Export recipe

```text
WAV
Mono
22050 Hz
Signed 16-bit PCM
```

If those four settings and the filename are correct, you have handled the most important technical requirements.

---

# 17. Source Notes

This abridged guide is based on the supplied PMT firmware and the full:

```text
How_To_Create_Your_Own_Audio_Files_For_PMT.md
```

The PMT firmware is the source of truth for:

- WAV format requirements;
- filenames;
- `/diesel` and `/steam` paths;
- track roles;
- loop and one-shot behavior;
- steam chuff ranges;
- `0093.wav` minimum usable length;
- `0190.wav` moving-bed behavior;
- cab-chatter numbering.

Audacity instructions match the Audacity `3.7.9` stable workflow used in the full guide.

---

**End of abridged guide**
