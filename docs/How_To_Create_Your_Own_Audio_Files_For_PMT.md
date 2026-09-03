# How to Create Your Own Audio Files for PMT

## 1. What This Guide Is For

PMT can play custom locomotive sounds from WAV files stored on its SD card.

This guide explains how to make those WAV files yourself, even if you have little or no audio-editing experience.

You will learn:

- what each PMT audio file is for;
- what the file should sound like;
- how long the sound should usually be;
- which sounds must loop smoothly;
- the exact WAV format PMTPlayer accepts;
- how to take a useful sound from a longer recording;
- how to edit it in Audacity;
- how to name the file correctly;
- where to put the file on the SD card.

The recommended lengths in this guide are **authoring recommendations**, not fixed hardware timing requirements.

PMTPlayer should be allowed to work with naturally sized sounds. A startup sound can be longer than another startup sound. A horn release can be short or long. A diesel idle loop does not have to be an exact number of seconds.

The important parts are:

1. use the correct filename;
2. use the correct WAV format;
3. make loops sound seamless;
4. make one-shot sounds start and end naturally;
5. choose audio that matches the purpose of the file.

---

# 2. The PMT Audio Format

## 2.1 Recommended Standard for Every PMT WAV File

For easiest and most predictable results, create every PMT sound as:

| Setting | PMT Authoring Standard |
|---|---|
| File type | WAV |
| WAV encoding | Signed 16-bit PCM |
| Channels | Mono |
| Sample rate | **22,050 Hz** |
| Bit depth | **16-bit** |
| Effective PCM bitrate | **352.8 kbps** |
| Filename | Four digits plus `.wav` |
| Example | `0090.wav` |
| Compression | None |

### Important: bitrate works differently for WAV files

There is no MP3-style "bitrate quality" setting for these PMT files.

For uncompressed PCM WAV audio, the bitrate is calculated from:

`sample rate × bit depth × number of channels`

For the PMT authoring standard:

`22,050 × 16 × 1 = 352,800 bits per second`

That is:

**352.8 kbps**

The small WAV file header adds a tiny amount of extra data, but it does not matter for normal PMT audio work.

---

## 2.2 What the Firmware Actually Accepts

The PMTPlayer WAV reader verifies all of the following:

- RIFF/WAVE file;
- PCM audio format;
- exactly **1 channel**;
- exactly **16 bits per sample**;
- sample rate from **8,000 Hz through 48,000 Hz**;
- a non-empty audio data section.

The PMTPlayer source uses **22,050 Hz** as its default WAV/audio rate, so this guide uses 22,050 Hz as the standard authoring rate.

Other sample rates inside the accepted 8,000–48,000 Hz range can work, but there is normally no advantage to making locomotive sound files more complicated than necessary.

### Use this unless you have a specific technical reason not to

> **22,050 Hz / mono / signed 16-bit PCM WAV**

---

## 2.3 Formats to Avoid

Do **not** export your PMT sounds as:

- stereo WAV;
- 24-bit WAV;
- 32-bit float WAV;
- compressed WAV;
- ADPCM WAV;
- MP3;
- AAC;
- OGG;
- FLAC.

Even though some of these are good audio formats in other situations, they are not the PMTPlayer WAV format described by the current firmware.

---

# 3. File and Folder Naming

PMTPlayer builds the filename from a four-digit track number.

Examples:

- track 80 becomes `0080.wav`
- track 90 becomes `0090.wav`
- track 100 becomes `0100.wav`
- track 202 becomes `0202.wav`
- track 300 becomes `0300.wav`

Use the exact four-digit form.

The two PMT sound folders are:

```text
/diesel
/steam
```

Examples:

```text
/diesel/0090.wav
/diesel/0105.wav
/diesel/0202.wav

/steam/0093.wav
/steam/0148.wav
/steam/0212.wav
```

The same track number can contain a different sound in each folder.

For example:

```text
/diesel/0212.wav
```

can be a sustained diesel locomotive horn:

**"HOOOOOOONK"**

while:

```text
/steam/0212.wav
```

can be a sustained steam whistle:

**"TOOOOOOOOOT"**

---

# 4. Three Types of Sounds You Will Make

Most PMT audio files fall into one of three practical categories.

## 4.1 One-shot sounds

A one-shot plays once and ends.

Examples:

- diesel startup;
- diesel shutdown;
- cab chatter;
- steam stationary event;
- horn release.

A good one-shot should:

- begin quickly without unnecessary silence;
- contain the complete sound;
- end naturally;
- avoid a loud click at either end.

---

## 4.2 Loop sounds

A loop repeats while PMT needs that sound.

Examples:

- diesel idle;
- diesel notch sounds;
- steam stationary background;
- steam moving background;
- horn sustain;
- brake squeal sustain.

A good loop should sound as though it never ends.

The listener should **not** hear:

**"rrrrrrrr — CLICK — rrrrrrrr — CLICK"**

The goal is:

**"rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"**

with no obvious restart.

---

## 4.3 Start / Sustain / Release sounds

Some PMT sounds use three files.

They work like this:

```text
START -> SUSTAIN -> RELEASE
```

For example, a horn can be:

```text
0211.wav    0212.wav        0213.wav
"HWAH-"  + "HOOOOOOONK" + "-oooooff"
```

The middle file is normally the loop.

This three-part design lets a person hold the horn button for a short or long time without requiring one giant recording.

---

# 5. General Sound-Editing Rules

## 5.1 Remove dead air at the beginning

For most effects, do not leave a large silent gap before the sound.

Bad:

```text
[silence............] DING
```

Better:

```text
DING
```

A few milliseconds of clean lead-in is fine. Half a second of unnecessary silence usually is not.

---

## 5.2 Do not cut off natural tails

A bell should usually contain its natural ring:

**"DINGgggggg..."**

not:

**"DING—CUT"**

A brake release should trail away naturally.

A horn release should contain the sound of the horn pressure or tone falling away.

---

## 5.3 Avoid clipping

Clipping happens when audio is too loud and the waveform runs into the digital maximum.

Clipping can sound like:

**"KRK!"**, **"CRACK!"**, or harsh distortion.

As a starting point, this guide recommends normalizing finished PMT samples to about:

**-3 dBFS peak**

This is an authoring recommendation, not a firmware requirement.

It gives some useful headroom when PMT mixes more than one sound.

---

## 5.4 Do not make every sound equally loud

A bell, horn, engine, steam hiss, and radio conversation should not all sound equally loud.

Peak normalization is useful for controlling accidental overload, but use your ears.

For example:

- a horn should sound strong;
- a background steam bed should stay in the background;
- cab chatter should not overpower the locomotive;
- a brake squeal can be sharp without being painfully loud.

---

# 6. Diesel Sound Files

The diesel folder is:

```text
/diesel
```

---

## 6.1 `0090.wav` — Diesel Engine Startup

### Expected sound

**"rrr... rrr... RRR... VROOOM... RUM-RUM-RUM"**

This is the sound of the prime mover starting.

### Purpose

PMT uses this as the startup portion of the diesel prime-mover sound system.

The startup plays before the steady diesel loop takes over.

### Recommended length

**4 to 10 seconds**

This is not an exact firmware requirement.

Shorter starts can work. Longer starts can work. The sound should simply contain a convincing complete engine-start sequence.

### Good source recording

Look for a recording containing:

1. starter/cranking noise;
2. the engine catching;
3. the first strong combustion pulses;
4. the engine settling toward idle.

### Good edit

Start close to the first starter sound.

End after the engine has clearly caught and is settling into running.

Do not include 10 seconds of unrelated idling after the startup. The idle file handles the steady idle.

### Format

`22,050 Hz / mono / signed 16-bit PCM WAV / 352.8 kbps`

---

## 6.2 `0091.wav` — Diesel Engine Shutdown

### Expected sound

**"RUM-RUM-rum... rrr... putt... putt... ...stop"**

### Purpose

This is the diesel prime-mover shutdown sound.

### Recommended length

**3 to 8 seconds**

### Good source recording

Find a section where:

1. the running engine is shut down;
2. engine speed falls;
3. the final combustion pulses are heard;
4. the sound naturally stops.

### Editing advice

Do not put a long steady idle at the beginning.

Start close to the actual shutdown action.

Leave enough of the final engine decay that it does not sound chopped off.

### Format

`22,050 Hz / mono / signed 16-bit PCM WAV / 352.8 kbps`

---

## 6.3 `0100.wav` — Diesel Idle / Notch 0

### Expected sound

**"RUM... RUM... RUM... RUM..."**

or, for a smoother diesel:

**"rrrrrrrr-RUM-rrrrrrrr"**

### Purpose

This is the steady engine sound when the locomotive is at idle.

PMT treats this as a managed loop.

### Recommended length

**2 to 6 seconds**

### Most important requirement

It must loop well.

### Source selection

Choose a section where:

- engine speed is steady;
- throttle is not changing;
- there is no horn;
- there is no bell;
- nobody is talking;
- there is no sudden compressor pop unless you intentionally want that pop every time the loop repeats.

### Editing advice

Avoid including a unique event such as:

**"RUM-RUM-RUM—CLANK"**

because the listener will hear the same **CLANK** every few seconds.

Choose a boring, steady section. For a loop, boring is good.

### Format

`22,050 Hz / mono / signed 16-bit PCM WAV / 352.8 kbps`

---

# 7. Diesel Notch Files

PMT has eight diesel power notches.

The files are:

| File | PMT Notch | Approx. throttle band | Expected character |
|---|---:|---:|---|
| `0101.wav` | 1 | 1–13% | **"rum-RUM-rum-RUM"** |
| `0102.wav` | 2 | 14–26% | **"RUM-RUM-RUM"** |
| `0103.wav` | 3 | 27–39% | **"RRUM-RRUM-RRUM"** |
| `0104.wav` | 4 | 40–52% | **"RRRAAM-RRRAAM"** |
| `0105.wav` | 5 | 53–65% | **"RRAAAAMMMMM"** |
| `0106.wav` | 6 | 66–78% | **"RRRRAAAAMMMM"** |
| `0107.wav` | 7 | 79–91% | **"WAAARRR-RRRAAAM"** |
| `0108.wav` | 8 | 92–100% | **"WAAAAARRRRR!"** |

These phonetic descriptions are examples of the **energy and character** expected. Different real locomotives sound different.

## Recommended length for every notch file

**2 to 6 seconds**

Each notch file is a steady loop.

The exact duration does not need to match the other notch files.

## What matters more than length

The loop must represent a stable engine state.

Do not build `0105.wav` from a recording where the locomotive is accelerating through several engine speeds.

Instead, find a section where it has reached a steady notch and remains there.

### Good sequence

Your set should sound like progressively stronger versions of the same locomotive:

```text
0100  "RUM...RUM..."
0101  "rum-RUM-rum-RUM"
0102  "RUM-RUM-RUM"
0103  "RRUM-RRUM"
0104  "RRRAAM"
0105  "RRAAAAM"
0106  "RRRRAAAAM"
0107  "WAAARRR-RRRAAAM"
0108  "WAAAAARRRRR!"
```

Do not simply turn the same recording louder eight times.

If possible, sample the real locomotive at each actual engine notch.

---

# 8. Steam Stationary Sounds

The steam folder is:

```text
/steam
```

---

## 8.1 `0093.wav` — Stationary Steam / Boiler Event

### Expected sound

Examples include:

**"PSSSSHHHHHH!"**

**"tsssss... pssshhh..."**

**"burble... PSSSHHH..."**

The exact event can vary depending on the locomotive recording.

### Purpose

This is a periodic steam event while the locomotive is stopped.

PMT can play a portion of this recording rather than always playing the entire file.

### Minimum authoring length

**2.0 seconds minimum**

### Recommended length

**4 to 10 seconds**

A longer file gives PMT more audio from which to create different-length stationary events.

### Source selection

Look for natural stationary steam sounds such as:

- steam hiss;
- boiler breathing;
- injector-like steam texture;
- valve leakage;
- a gentle steam release;
- other believable stationary locomotive steam activity.

Avoid speech, bells, whistles, or moving chuffs unless you intentionally want those sounds in every stationary event.

### Editing advice

The first two seconds should already sound useful.

Do not make the file:

```text
2 seconds of silence -> PSSSHHH
```

Make the useful sound start near the beginning.

### Format

`22,050 Hz / mono / signed 16-bit PCM WAV / 352.8 kbps`

---

## 8.2 `0094.wav` — Stationary Steam Settle / Release

### Expected sound

**"psssshhhh... tssss... sss..."**

### Purpose

This is the settle/release sound that follows the stationary steam event.

### Recommended length

**0.5 to 2.5 seconds**

### Editing advice

This should sound like an event finishing, not like another full steam blast beginning.

Good:

**"PSSSHHhhhh...sss..."**

Less useful:

**"PSSSHHH!"**

with a hard cut at the end.

### Format

`22,050 Hz / mono / signed 16-bit PCM WAV / 352.8 kbps`

---

## 8.3 `0095.wav` — Stopped Steam Background Loop

### Expected sound

**"sssshhhhhhhh... hhhhhssss... sssshhhh..."**

### Purpose

This is the steady background sound underneath the stopped steam locomotive.

It is a loop.

### Recommended length

**3 to 8 seconds**

### Good source recording

Choose quiet, steady boiler ambience.

The loop should not contain a very obvious unique event.

Bad loop:

**"hiss... hiss... CLANK... hiss... hiss... CLANK..."**

because the repeating clank gives away the loop.

Better:

**"sssshhhhhhhhhhhhhhhhhhhh"**

with subtle natural movement.

### Format

`22,050 Hz / mono / signed 16-bit PCM WAV / 352.8 kbps`

---

# 9. Steam Chuff Files

PMT uses **48 separate moving chuff files**.

They are divided into three speed bands:

- low;
- medium;
- high.

Each band contains:

- 4 different sound sets;
- 4 wheel phases per set.

The four wheel phases represent:

- 0 degrees;
- 90 degrees;
- 180 degrees;
- 270 degrees.

PMT moves through those four phases in order.

After a full wheel revolution, it moves to another set of four similar chuffs so the sound does not repeat the exact same four recordings forever.

This is why all four chuffs in a set should sound like the **same locomotive under the same load**, while still having small natural differences.

---

## 9.1 Low-Speed Chuffs — `0100.wav` through `0115.wav`

### Expected sound

**"CHUFF!"**

At low speed, the chuff can be full, heavy, and easy to hear.

### Recommended length

**0.25 to 0.55 seconds each**

The sound can have:

- a strong pressure attack;
- a clear body;
- a short natural tail.

Do not add a large silent gap before the attack.

### Individual files

| File | Set | Wheel phase | Expected sound |
|---|---:|---:|---|
| `0100.wav` | 1 | 0° | **"CHUFF!"** |
| `0101.wav` | 1 | 90° | **"CHUFF!"** |
| `0102.wav` | 1 | 180° | **"CHUFF!"** |
| `0103.wav` | 1 | 270° | **"CHUFF!"** |
| `0104.wav` | 2 | 0° | **"CHUFF!"** |
| `0105.wav` | 2 | 90° | **"CHUFF!"** |
| `0106.wav` | 2 | 180° | **"CHUFF!"** |
| `0107.wav` | 2 | 270° | **"CHUFF!"** |
| `0108.wav` | 3 | 0° | **"CHUFF!"** |
| `0109.wav` | 3 | 90° | **"CHUFF!"** |
| `0110.wav` | 3 | 180° | **"CHUFF!"** |
| `0111.wav` | 3 | 270° | **"CHUFF!"** |
| `0112.wav` | 4 | 0° | **"CHUFF!"** |
| `0113.wav` | 4 | 90° | **"CHUFF!"** |
| `0114.wav` | 4 | 180° | **"CHUFF!"** |
| `0115.wav` | 4 | 270° | **"CHUFF!"** |

### Source selection

A good method is to find several clean low-speed wheel revolutions in a real recording.

Cut individual exhaust beats from those revolutions.

Try to keep:

- similar microphone distance;
- similar locomotive load;
- similar overall level;
- natural differences between individual exhaust beats.

---

# 10. Medium-Speed Steam Chuffs

Files:

```text
0120.wav through 0135.wav
```

### Expected sound

**"Chuff!"**

or slightly tighter:

**"CHFF!"**

Compared with the low-speed set, these should generally feel shorter and more energetic.

### Recommended length

**0.16 to 0.35 seconds each**

### Individual files

| File | Set | Wheel phase | Expected sound |
|---|---:|---:|---|
| `0120.wav` | 1 | 0° | **"Chuff!"** |
| `0121.wav` | 1 | 90° | **"Chuff!"** |
| `0122.wav` | 1 | 180° | **"Chuff!"** |
| `0123.wav` | 1 | 270° | **"Chuff!"** |
| `0124.wav` | 2 | 0° | **"Chuff!"** |
| `0125.wav` | 2 | 90° | **"Chuff!"** |
| `0126.wav` | 2 | 180° | **"Chuff!"** |
| `0127.wav` | 2 | 270° | **"Chuff!"** |
| `0128.wav` | 3 | 0° | **"Chuff!"** |
| `0129.wav` | 3 | 90° | **"Chuff!"** |
| `0130.wav` | 3 | 180° | **"Chuff!"** |
| `0131.wav` | 3 | 270° | **"Chuff!"** |
| `0132.wav` | 4 | 0° | **"Chuff!"** |
| `0133.wav` | 4 | 90° | **"Chuff!"** |
| `0134.wav` | 4 | 180° | **"Chuff!"** |
| `0135.wav` | 4 | 270° | **"Chuff!"** |

---

# 11. High-Speed Steam Chuffs

Files:

```text
0140.wav through 0155.wav
```

### Expected sound

**"CHFF!"**

or:

**"TCHFF!"**

At high speed, the individual exhaust events should be compact enough that several can blend naturally into a rapid locomotive exhaust rhythm.

### Recommended length

**0.10 to 0.22 seconds each**

### Individual files

| File | Set | Wheel phase | Expected sound |
|---|---:|---:|---|
| `0140.wav` | 1 | 0° | **"CHFF!"** |
| `0141.wav` | 1 | 90° | **"CHFF!"** |
| `0142.wav` | 1 | 180° | **"CHFF!"** |
| `0143.wav` | 1 | 270° | **"CHFF!"** |
| `0144.wav` | 2 | 0° | **"CHFF!"** |
| `0145.wav` | 2 | 90° | **"CHFF!"** |
| `0146.wav` | 2 | 180° | **"CHFF!"** |
| `0147.wav` | 2 | 270° | **"CHFF!"** |
| `0148.wav` | 3 | 0° | **"CHFF!"** |
| `0149.wav` | 3 | 90° | **"CHFF!"** |
| `0150.wav` | 3 | 180° | **"CHFF!"** |
| `0151.wav` | 3 | 270° | **"CHFF!"** |
| `0152.wav` | 4 | 0° | **"CHFF!"** |
| `0153.wav` | 4 | 90° | **"CHFF!"** |
| `0154.wav` | 4 | 180° | **"CHFF!"** |
| `0155.wav` | 4 | 270° | **"CHFF!"** |

### Do not pad high-speed chuffs with silence

A file like this is poor:

```text
CHFF! [silence................]
```

because the sound itself becomes artificially long.

Trim close to the natural exhaust tail.

PMT intentionally schedules the chuffs according to locomotive cadence and allows them to overlap naturally.

---

# 12. `0190.wav` — Steam Moving Background Bed

### Expected sound

A steady moving-steam texture such as:

**"hhhhhhhh—sssshhhh—rrrrhhhh"**

The exact phonetic sound depends on the locomotive and recording.

### Purpose

This is the continuous background layer under the individual moving chuffs.

Think of it as everything you hear while a steam locomotive is moving that is **not** one individual exhaust beat:

- rushing air;
- running gear wash;
- steam texture;
- low mechanical motion;
- general moving locomotive sound.

### Recommended length

**3 to 8 seconds**

### Loop requirement

This file should loop smoothly.

### Source selection

Find a steady moving section and avoid individual sounds that would become annoying when repeated.

You can leave some blended exhaust texture in the bed, but the clearly defined **"CHUFF!"** attacks should mainly come from the chuff files.

### Current firmware note

The current runtime uses `0190.wav` as the continuous moving-bed file.

Although `0191` and `0192` identifiers exist in the source code, the current moving-bed runtime explicitly operates in an **0190-only continuous mode**.

For firmware 3.0.0 revision 221, you do not need to create:

```text
0191.wav
0192.wav
```

for the standard moving-bed system.

### Format

`22,050 Hz / mono / signed 16-bit PCM WAV / 352.8 kbps`

---

# 13. Brake Squeal Files

These files are used in both the diesel and steam sound roots.

Create them in whichever locomotive folders need brake audio.

```text
0080.wav
0081.wav
0082.wav
```

PMT uses them as:

```text
START -> SUSTAIN -> RELEASE
```

---

## 13.1 `0080.wav` — Brake Squeal Start

### Expected sound

**"SKREE-"**

or:

**"eeeeEEE-"**

### Purpose

This is the beginning of the brake squeal.

PMT's brake audio lifecycle lets this intro play fully before settling into the sustain portion.

### Recommended length

**0.10 to 0.40 seconds**

### Editing advice

Use the point where the brake noise first grabs.

Do not include a long sustain. That belongs in `0081.wav`.

---

## 13.2 `0081.wav` — Brake Squeal Sustain

### Expected sound

**"EEEEEEEEEEEE"**

or:

**"SKRRRRRREEEEEE"**

### Purpose

This is the looping portion while the braking sound continues.

### Recommended length

**0.4 to 1.5 seconds**

### Most important requirement

Make it loop cleanly.

Avoid a strong change in pitch inside the loop unless it loops back naturally.

---

## 13.3 `0082.wav` — Brake Squeal Release

### Expected sound

**"eeeeee... eee... ssst"**

### Purpose

This finishes the brake sound.

### Recommended length

**0.2 to 0.8 seconds**

### Editing advice

Use a natural decrease in squeal.

Do not make the release sound like another fresh brake application.

---

# 14. Bell — `0202.wav`

### Expected sound

**"DINGgggggg..."**

or:

**"CLANGgggg..."**

### Purpose

This is the locomotive bell.

PMT treats the bell as a natural loop while the bell function is active.

### Recommended length

**0.8 to 1.6 seconds per bell cycle**

### What should be inside the file

A useful bell cycle normally contains:

1. the strike;
2. the ring;
3. the natural decay;
4. enough remaining space to create a believable next strike when the file loops.

Example:

```text
DINGgggggg...... | DINGgggggg...... | DINGgggggg......
```

The vertical bars show where the file repeats.

### Avoid

A file containing:

```text
DINGDINGDINGDING
```

unless that really matches the bell cadence you want.

Also avoid cutting the ring off sharply at the end.

### Diesel versus steam

You can use different bell recordings in:

```text
/diesel/0202.wav
/steam/0202.wav
```

---

# 15. Horn and Steam Whistle Files

The horn/whistle uses three files:

```text
0211.wav = start
0212.wav = sustain
0213.wav = release
```

The same numbers are used in the selected locomotive sound folder.

---

## 15.1 Diesel Horn Example

### `0211.wav` — Horn Start

Expected:

**"HWAH-"**

Recommended length:

**0.15 to 0.50 seconds**

Use the pressure attack and the beginning of the horn tone.

---

### `0212.wav` — Horn Sustain

Expected:

**"HOOOOOOOOONK"**

Recommended length:

**0.5 to 2.0 seconds**

This is the loop.

Choose a steady part of the horn after the attack has finished.

The beginning and end should join cleanly.

---

### `0213.wav` — Horn Release

Expected:

**"-oooooooff..."**

Recommended length:

**0.25 to 1.0 seconds**

Use the sound of the horn pressure dropping and the tone dying away.

---

## 15.2 Steam Whistle Example

The same filenames can contain steam-whistle audio under `/steam`.

### `0211.wav`

**"TWOO-"**

### `0212.wav`

**"TOOOOOOOOOOT"**

### `0213.wav`

**"-oooooooot... psssh"**

The recommended lengths are approximately the same as the diesel horn:

| File | Purpose | Recommended length |
|---|---|---:|
| `0211.wav` | attack | 0.15–0.50 s |
| `0212.wav` | sustain loop | 0.5–2.0 s |
| `0213.wav` | release | 0.25–1.0 s |

A large steam whistle with a slow pressure build may need a somewhat longer start or release. That is fine. There is no exact file-duration requirement.

---

# 16. Cab Chatter — `0300.wav` and Up

Cab chatter is a group of randomized one-shot sounds.

PMT starts scanning at:

```text
0300.wav
```

and can use as many as 100 tracks:

```text
0300.wav through 0399.wav
```

### Expected sound

Examples:

**"psshht... copy that..."**

**"ksssh... clear ahead..."**

**"psshht... dispatcher to engine..."**

The actual speech is your choice.

### Recommended length

**1 to 8 seconds each**

There is no fixed duration requirement.

### Very important numbering rule

The files must be continuous from `0300.wav`.

The current code stops scanning cab-chatter files when it reaches the first missing filename.

Example:

```text
0300.wav  exists
0301.wav  exists
0302.wav  exists
0303.wav  MISSING
0304.wav  exists
```

In this example, PMT stops at `0303.wav`.

`0304.wav` will not become part of the discovered cab-chatter set.

So use:

```text
0300.wav
0301.wav
0302.wav
0303.wav
0304.wav
...
```

with no gaps.

### How PMT uses them

When cab chatter is enabled:

- PMT can play one immediately;
- later requests are scheduled at randomized delays;
- the delay is between 30 and 90 seconds in the current firmware;
- PMT selects from the discovered files rather than repeating one fixed recording.

### Recording advice

For believable cab audio:

- keep the microphone sound consistent;
- use similar radio EQ/noise across the set;
- do not make one clip dramatically louder than the others;
- trim long silence at the start and end;
- keep each line understandable but short.

---

# 17. Optional Custom Function Audio

PMT can also play a user-selected track number as custom function audio.

The current code accepts custom track numbers from:

```text
0001.wav through 9999.wav
```

A custom function can be configured as either:

- a one-shot sound; or
- a replaying/looping sound.

### One-shot examples

- air dump: **"PSSSH!"**
- coupler: **"CLANK!"**
- conductor call: **"All aboard!"**
- compressor event: **"BRRrrrr...chk"**

### Loop examples

- fan: **"whrrrrrrrr"**
- auxiliary pump: **"mmmmmmmm"**
- warning tone: **"beeeeeep"**

### Recommended length

For one-shots:

**0.2 to 15 seconds**, depending on the sound.

For loops:

**1 to 8 seconds** is usually practical.

### Important

Do not accidentally reuse a filename already needed by the standard locomotive sound set unless you intentionally want the custom function to play that same file.

---

# 18. Quick File Checklist

## Diesel

```text
/diesel/0080.wav    brake start
/diesel/0081.wav    brake sustain
/diesel/0082.wav    brake release

/diesel/0090.wav    diesel startup
/diesel/0091.wav    diesel shutdown

/diesel/0100.wav    idle
/diesel/0101.wav    notch 1
/diesel/0102.wav    notch 2
/diesel/0103.wav    notch 3
/diesel/0104.wav    notch 4
/diesel/0105.wav    notch 5
/diesel/0106.wav    notch 6
/diesel/0107.wav    notch 7
/diesel/0108.wav    notch 8

/diesel/0202.wav    bell
/diesel/0211.wav    horn start
/diesel/0212.wav    horn sustain
/diesel/0213.wav    horn release

/diesel/0300.wav+   optional cab chatter
```

---

## Steam

```text
/steam/0080.wav     brake start
/steam/0081.wav     brake sustain
/steam/0082.wav     brake release

/steam/0093.wav     stationary steam event
/steam/0094.wav     stationary event release
/steam/0095.wav     stopped steam background loop

/steam/0100-0115.wav  low-speed chuffs
/steam/0120-0135.wav  medium-speed chuffs
/steam/0140-0155.wav  high-speed chuffs

/steam/0190.wav     moving steam background loop

/steam/0202.wav     bell
/steam/0211.wav     whistle start
/steam/0212.wav     whistle sustain
/steam/0213.wav     whistle release

/steam/0300.wav+    optional cab chatter
```

---

# 19. Audacity: Basic PMT Editing Workflow

The following examples use the current stable Audacity 3.7.9 interface.

Audacity 4 is still in beta at the time of this draft, so this guide does not use beta-only instructions.

Official Audacity site:

<https://www.audacityteam.org/>

---

## Step 1 — Open the source recording

Start Audacity.

Open your source recording using:

```text
File > Import > Audio...
```

You can also drag an audio file into the Audacity window.

The source file can originally be at a higher sample rate or in stereo. You will convert the finished PMT clip later.

---

## Step 2 — Listen for the exact sound you need

Use the Space bar to start and stop playback.

Find the section containing the desired sound.

Examples:

- for `0202.wav`, find one clean **"DING"**;
- for `0100.wav`, find steady **"RUM-RUM-RUM"** diesel idle;
- for `0090.wav`, find the complete **"rrr...VROOM"** startup;
- for a chuff, find one clean **"CHUFF!"**;
- for `0212.wav`, find the steady **"HOOOOONK"** part after the horn attack.

---

## Step 3 — Select the useful section

Click and drag across the waveform.

Press Space to listen only to the selection.

Adjust the left and right edges until the selection contains only what you need.

---

## Step 4 — Trim away the rest

With the useful section selected, use:

```text
Edit > Remove Special > Trim Audio
```

Shortcut on Windows/Linux:

```text
Ctrl + T
```

Audacity's Trim Audio command keeps the selected part of the clip and removes the rest from normal view.

---

# 20. Convert Stereo to Mono

PMTPlayer requires mono.

If your source track is stereo:

1. select the track;
2. choose:

```text
Tracks > Mix > Mix Stereo Down to Mono
```

Audacity combines the left and right channels into a mono track.

### Listen afterward

Sometimes a stereo recording contains different sounds on the two channels.

After converting, listen again and make sure the important locomotive sound did not become weak or strange because of phase cancellation.

If it did, undo the operation and consider using only the better left or right channel instead.

---

# 21. Clean the Beginning and End

Zoom in near the beginning.

Remove unnecessary silence before the sound.

For one-shot files, a very short fade can help prevent a click.

Audacity provides:

```text
Effect > Fading > Fade In
Effect > Fading > Fade Out
```

For locomotive samples, the fade is normally very short unless the natural sound itself should fade gradually.

Do not put a long artificial fade on a chuff.

A chuff should still begin like:

**"CHUFF!"**

not:

**"...chuff"**

---

# 22. Making a Good Loop in Audacity

Loop files include:

- diesel idle;
- diesel notch files;
- brake sustain;
- horn/whistle sustain;
- steam stopped background;
- steam moving background.

## Step 1 — Find a steady section

Do not choose a part where speed, pitch, or load is changing.

---

## Step 2 — Select the possible loop

Select several seconds of steady sound.

---

## Step 3 — Turn on loop playback

Audacity's current loop control uses:

```text
L
```

to turn looping on or off.

With your loop region set, press Space to listen repeatedly.

Listen to the exact point where the end wraps back to the beginning.

If you hear:

**"rrrrrrrr—CLICK—rrrrrrrr"**

the loop needs more work.

---

## Step 4 — Adjust the boundaries

Move the selection boundaries a little at a time.

Audacity recommends choosing loop points near a **zero crossing**, where the waveform passes through the center line.

This reduces the chance of a click.

Zoom in closely when needed.

---

## Step 5 — Listen for several repeats

Do not listen only once.

Let the loop play for at least 10 or 20 repetitions.

Ask yourself:

- Do I hear a click?
- Does the volume suddenly jump?
- Does the pitch seem to jump?
- Is there one unique clank that repeats too obviously?
- Does the rhythm suddenly reset?

If you notice the loop point, improve it.

The best loop sounds like one continuous recording.

---

# 23. Normalizing the Finished Clip

After trimming and cleaning the sound:

1. select the whole finished clip;
2. choose:

```text
Effect > Volume and Compression > Normalize...
```

A useful PMT starting point is:

```text
Normalize peak amplitude to: -3.0 dB
```

This is a PMT authoring recommendation.

Audacity's standard Normalize effect controls peak level. It does not automatically make different sounds have the same perceived loudness.

After normalizing, listen again.

If a cab voice is far louder than your horn, reduce it.

If a background loop is overpowering the main locomotive, reduce it.

Use your ears, not only the number on the screen.

---

# 24. Resampling and Exporting the PMT WAV

This is the most important technical step.

When the audio is ready:

```text
File > Export Audio...
```

Set:

| Audacity Export Setting | Value |
|---|---|
| Format | WAV |
| Channels | Mono |
| Sample Rate | **22050 Hz** |
| Encoding | **Signed 16-bit PCM** |

Then enter the exact PMT filename, for example:

```text
0090.wav
```

or:

```text
0202.wav
```

Click **Export**.

Audacity's WAV export dialog allows you to set the channel count, sample rate, and PCM encoding directly.

---

# 25. Verify the File Before Copying It to the SD Card

For every exported file, check:

- [ ] filename has exactly four digits;
- [ ] extension is `.wav`;
- [ ] file is WAV, not an Audacity project;
- [ ] channels = mono;
- [ ] bit depth = 16-bit;
- [ ] encoding = signed PCM;
- [ ] sample rate = 22,050 Hz;
- [ ] no large silent gap at the start;
- [ ] no clipping;
- [ ] one-shot ends naturally;
- [ ] loop sounds seamless if the file is supposed to loop;
- [ ] file is in the correct `/diesel` or `/steam` folder.

---

# 26. How to Sample Specific PMT Sounds from a Longer Recording

## Diesel startup

Find:

**"starter... starter... VROOM... running"**

Keep:

- the starter;
- the engine catching;
- the transition into running.

Do not keep minutes of idle afterward.

Export as:

```text
0090.wav
```

---

## Diesel notch

Find a long section where the engine stays at one constant power setting.

Listen for:

**"RRRRAAAAMMMMM"**

with no obvious rise or fall in engine speed.

Take 2–6 seconds.

Make it loop.

Export to the correct notch filename.

---

## Bell

Find one clear:

**"DINGgggg..."**

Keep the strike and useful decay.

Add enough natural spacing that the next looped strike sounds believable.

Export as:

```text
0202.wav
```

---

## Horn sustain

Find a horn recording:

**"HWAH-HOOOOOOOOONK-oooooff"**

Split it mentally into:

```text
HWAH-        HOOOOOOOOONK        -oooooff
start        sustain             release
0211         0212                0213
```

Make the middle section loop smoothly.

---

## Steam chuff

Find a clean exhaust beat:

**"CHUFF!"**

Start close to the pressure attack.

End after the useful exhaust tail.

Do not add artificial silence afterward.

Create multiple natural variations for each speed band.

---

## Steam background

Find a section with steady:

**"sssshhhhhhhhrrrrhhhhhh"**

and without a large individual **"CHUFF!"**

Take several seconds.

Make it loop smoothly.

Export as:

```text
0190.wav
```

---

# 27. Sound Design Tips for a Convincing PMT Set

## Keep one locomotive consistent

Do not build a diesel set from eight completely different locomotive recordings unless that is intentional.

Ideally:

- `0090.wav`;
- `0091.wav`;
- `0100.wav`;
- `0101.wav` through `0108.wav`;

should sound like the same engine family.

---

## Keep microphone perspective consistent

A horn recorded 3 feet away and an engine recorded 500 feet away may not sound convincing together.

Try to use sounds with a similar recording perspective.

---

## Remove unwanted background events

Listen for:

- people talking;
- birds;
- road traffic;
- another locomotive;
- crossing bells;
- camera handling;
- wind blasts.

If those sounds repeat in a loop, they become very noticeable.

---

## Do not over-process

A little cleanup can help.

Too much noise reduction, compression, or EQ can make a locomotive sound artificial.

If the original recording already sounds good, trim it, make the loop clean, set the level, and export it.

---

# 28. Duration Reference Chart

These are **recommended authoring ranges**, not fixed hardware timing requirements.

| File / Range | Purpose | Recommended length |
|---|---|---:|
| `0080.wav` | brake start | 0.10–0.40 s |
| `0081.wav` | brake sustain loop | 0.4–1.5 s |
| `0082.wav` | brake release | 0.2–0.8 s |
| `0090.wav` | diesel startup | 4–10 s |
| `0091.wav` | diesel shutdown | 3–8 s |
| `0093.wav` | steam stationary event | **2.0 s minimum; 4–10 s recommended** |
| `0094.wav` | steam event release | 0.5–2.5 s |
| `0095.wav` | stopped steam background loop | 3–8 s |
| `0100.wav` diesel | idle loop | 2–6 s |
| `0101–0108.wav` diesel | notch loops | 2–6 s each |
| `0100–0115.wav` steam | low-speed chuffs | 0.25–0.55 s each |
| `0120–0135.wav` steam | medium-speed chuffs | 0.16–0.35 s each |
| `0140–0155.wav` steam | high-speed chuffs | 0.10–0.22 s each |
| `0190.wav` steam | moving background loop | 3–8 s |
| `0202.wav` | bell cycle loop | 0.8–1.6 s |
| `0211.wav` | horn/whistle start | 0.15–0.50 s |
| `0212.wav` | horn/whistle sustain loop | 0.5–2.0 s |
| `0213.wav` | horn/whistle release | 0.25–1.0 s |
| `0300–0399.wav` | cab chatter | 1–8 s each |

---

# 29. Which Files Need Seamless Loops?

## Must be treated as loop material

### Diesel

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

### Steam

```text
0095.wav
0190.wav
```

### Common effects

```text
0081.wav
0202.wav
0212.wav
```

### Custom audio

Any user-defined sound configured for replay/loop behavior.

---

# 30. Which Files Should Be One-Shot Natural Sounds?

```text
0080.wav
0082.wav
0090.wav
0091.wav
0093.wav
0094.wav
0211.wav
0213.wav
0300.wav through the last contiguous cab-chatter file
```

Steam chuffs are also one-shot sounds:

```text
0100-0115
0120-0135
0140-0155
```

They are triggered rhythmically by PMT rather than looped as individual WAV files.

---

# 31. Firmware Duration Check

The current PMTPlayer implementation does **not** require the normal authored WAV files to have one exact fixed duration.

That is intentional and is the correct authoring model for this guide.

Examples:

- diesel startup is allowed to be a naturally sized startup recording;
- diesel shutdown is allowed to end naturally;
- notch sounds are loops rather than exact-duration clips;
- horn sustain can continue as needed by looping its sustain file;
- brake sustain can continue as needed by looping its sustain file;
- steam background sounds are loops;
- cab chatter files can have different natural lengths.

### `0093.wav`

For this guide, author `0093.wav` at **2.0 seconds minimum**.

A **4–10 second** source is preferred because it gives the stationary event more useful material and variation.

### Steam chuffs

Steam chuff length is not a fixed hardware duration.

The chuff scheduler controls when new chuffs begin, and individual chuffs are allowed to overlap naturally.

This is why the recommended chuff lengths get shorter as the speed band increases.

---

# 32. Common Mistakes

## Wrong

```text
90.wav
```

## Right

```text
0090.wav
```

---

## Wrong

Stereo WAV.

## Right

Mono WAV.

---

## Wrong

24-bit PCM.

## Right

16-bit PCM.

---

## Wrong

A diesel loop containing:

**"RUM-RUM-RUM... horn blast... RUM-RUM"**

The horn blast will repeat every time the loop wraps.

## Right

Use only steady engine audio.

---

## Wrong

A chuff containing:

**"CHUFF!.................silence"**

## Right

Trim to:

**"CHUFF!"**

plus its natural short tail.

---

## Wrong

A horn sustain containing the attack every loop:

**"HWAH-HONK-HWAH-HONK-HWAH-HONK"**

## Right

Use:

```text
0211 = HWAH-
0212 = HOOOOOOOOONK
0213 = -oooooff
```

---

# 33. Final Export Recipe

If you remember nothing else, remember this:

1. Find the clean sound.
2. Trim it.
3. Convert it to mono.
4. Make the loop seamless if it is a loop.
5. Normalize conservatively.
6. Export with:

```text
WAV
Mono
22050 Hz
Signed 16-bit PCM
```

7. Use the correct four-digit name.
8. Put it in `/diesel` or `/steam`.
9. Listen to it in PMT.
10. Go back to Audacity and adjust by ear if needed.

---

# 34. Technical Source Notes


Important implementation details used in this guide include:

- firmware version `3.0.0`, revision `221`;
- sound roots `/diesel` and `/steam`;
- filename pattern `/diesel/####.wav` or `/steam/####.wav`;
- RIFF/WAVE PCM parser requirements;
- mono-only requirement;
- 16-bit-only requirement;
- accepted 8,000–48,000 Hz sample-rate range;
- default 22,050 Hz audio rate;
- diesel startup, shutdown, idle, and notch map;
- 48-file steam chuff map;
- four chuff phases and four sound sets per speed band;
- steam stationary `0093/0094/0095` behavior;
- `0190.wav` continuous moving-bed behavior;
- horn/whistle three-part behavior;
- brake three-part behavior;
- natural-loop bell behavior;
- randomized contiguous cab-chatter range beginning at `0300.wav`;
- custom function track range.

---

# 35. Audacity References

Audacity version used for these instructions:

**Audacity 3.7.9 stable**

Official download:

<https://www.audacityteam.org/>

Official Audacity manual pages used to verify the workflow:

- WAV export options:  
  <https://manual.audacityteam.org/man/wav_export_options.html>
- Export Audio:  
  <https://manual.audacityteam.org/man/file_export_dialog.html>
- Mix Stereo Down to Mono:  
  <https://manual.audacityteam.org/man/tracks_menu_mix.html>
- Making audio loops:  
  <https://support.audacityteam.org/music/working-with-audio-loops/making-audio-loops>
- Loop playback:  
  <https://manual.audacityteam.org/man/transport_menu_looping.html>
- Trim Audio:  
  <https://manual.audacityteam.org/man/edit_menu_remove_special.html>
- Normalize:  
  <https://support.audacityteam.org/audio-editing/loudness-normalization>
- Fade In / Fade Out:  
  <https://manual.audacityteam.org/man/fades.html>

---

**End of first draft**
