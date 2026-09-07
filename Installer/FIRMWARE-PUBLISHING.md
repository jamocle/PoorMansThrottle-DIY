# Poor Man's Throttle Firmware Publishing

This installer is designed so normal firmware releases do **not** require editing HTML, JavaScript, or individual manifest files.

## Firmware targets

The installer treats the two ESP32-S3 flash capacities as separate firmware targets.

| Installer target | Physical module | Firmware directory |
| --- | --- | --- |
| Classic ESP32-WROOM-32 | Classic ESP32-WROOM-32 | `firmware/<version>/` |
| ESP32-S3 N16R8 | ESP32-S3-WROOM-1-N16R8 | `firmware/s3/<version>/` |
| ESP32-S3 N8R8 | ESP32-S3-WROOM-1-N8R8 | `firmware/s3-n8r8/<version>/` |

The existing `firmware/s3/` location remains the N16R8 location so existing published links do not move.

**Never mix N16R8 and N8R8 binaries.** The modules use different physical flash sizes and different partition layouts.

## The settings that control the web installer

Each target has two independent settings in `Installer/@firmware-versions.json`:

- `latest` — the version installed by **Install Latest Firmware**.
- `dropdownDefault` — the version initially selected in the **Choose a specific firmware version** dropdown.

They do not need to be the same.

Current deployment:

| Board | `latest` | `dropdownDefault` |
| --- | --- | --- |
| Classic ESP32-WROOM-32 | `3.0.0` | `2.0.0` |
| ESP32-S3-WROOM-1-N16R8 | `3.0.0` | `3.0.0` |
| ESP32-S3-WROOM-1-N8R8 | `3.0.0` | `3.0.0` |

## User-facing S3 selection

The installer intentionally does not choose an S3 flash size automatically.

Users first choose **ESP32-S3**, then must choose one exact module marking:

- **N16R8 — 16 MB Flash / 8 MB PSRAM**
- **N8R8 — 8 MB Flash / 8 MB PSRAM**

The install controls stay hidden until an exact S3 variant is selected. If the user returns to the S3 family choice, the installer clears the active ESP Web Tools manifests so a previous N16R8 or N8R8 choice cannot remain attached accidentally.

## Recommended publishing workflow

The existing helper workflow validates and copies the four web-flashing binaries to the correct firmware folder for the targets it supports.

From the `Installer` folder:

```zsh
zsh prepare-firmware-release.zsh classic 3.1.0 "/path/to/Arduino/build/output"
```

or, for the existing N16R8 S3 target:

```zsh
zsh prepare-firmware-release.zsh s3 3.1.0 "/path/to/Arduino/build/output"
```

The helper script itself was not supplied with this installer source, so an N8R8 helper target is **not yet verified from the supplied code**. Until that helper is explicitly updated and verified, copy N8R8 releases manually to `firmware/s3-n8r8/<version>/` after verifying the generated `flash_args`.

The publishing workflow must:

1. Check that all four required `.bin` files exist.
2. Verify the generated `flash_args` still match the installer recipe.
3. Refuse to overwrite an existing release folder.
4. Copy only the four required distribution binaries.
5. Add the release only to the matching board target in `Installer/@firmware-versions.json`.

The required files are:

```text
PoorMansThrottle.ino.bootloader.bin
PoorMansThrottle.ino.partitions.bin
boot_app0.bin
PoorMansThrottle.ino.bin
```

### Classic ESP32-WROOM-32 destination

```text
firmware/<version>/
```

Example:

```text
firmware/3.1.0/
```

### ESP32-S3-WROOM-1-N16R8 destination

```text
firmware/s3/<version>/
```

Example:

```text
firmware/s3/3.1.0/
```

### ESP32-S3-WROOM-1-N8R8 destination

```text
firmware/s3-n8r8/<version>/
```

Example:

```text
firmware/s3-n8r8/3.1.0/
```

The N8R8 build is compiled for:

```text
FlashSize=8M
PartitionScheme=default_8MB
PSRAM=opi
```

The N16R8 build remains compiled for 16 MB flash and its 16 MB partition scheme.

## Add the version to the catalog

Open:

```text
Installer/@firmware-versions.json
```

Find the correct target and add one entry near the top of its `versions` array:

```json
{ "version": "3.1.0" }
```

Normally that is the only catalog entry needed.

If you want custom display text, add `label`:

```json
{ "version": "3.1.0-beta.1", "label": "v3.1.0 Beta 1" }
```

Do not add a version to the N8R8 target until the four N8R8 binaries exist in `firmware/s3-n8r8/<version>/`. Do not add a version to the N16R8 target until the matching N16R8 binaries exist in `firmware/s3/<version>/`.

## Decide whether to change `latest`

Only change `latest` when the big **Install Latest Firmware** button should install the new release for that exact target.

Example:

```json
"latest": "3.1.0"
```

If you are publishing a beta or test build but do not want it on the Latest button, leave `latest` unchanged.

The N16R8 and N8R8 `latest` values are independent.

## Decide whether to change `dropdownDefault`

Only change `dropdownDefault` when you want that release preselected in the version dropdown for that exact target.

Example:

```json
"dropdownDefault": "3.1.0-beta.1"
```

This setting is independent from `latest`.

## Important: S3 merged binary

The Arduino S3 build can create:

```text
PoorMansThrottle.ino.merged.bin
```

Do **not** use that merged file for the normal Poor Man's Throttle web update path for either S3 variant.

The merged image spans the NVS configuration area. Writing the four individual parts instead allows the normal update path to avoid intentionally overwriting the NVS configuration region. The installer therefore uses the four files listed above.

## Flash-layout safety

The board-level flash offsets are stored once per target in `Installer/@firmware-versions.json`. You should not change them for normal releases.

The current recipes are:

### Classic ESP32-WROOM-32

```text
0x1000   PoorMansThrottle.ino.bootloader.bin
0x8000   PoorMansThrottle.ino.partitions.bin
0xE000   boot_app0.bin
0x10000  PoorMansThrottle.ino.bin
```

### ESP32-S3-WROOM-1-N16R8

```text
0x0      PoorMansThrottle.ino.bootloader.bin
0x8000   PoorMansThrottle.ino.partitions.bin
0xE000   boot_app0.bin
0x10000  PoorMansThrottle.ino.bin
```

### ESP32-S3-WROOM-1-N8R8

```text
0x0      PoorMansThrottle.ino.bootloader.bin
0x8000   PoorMansThrottle.ino.partitions.bin
0xE000   boot_app0.bin
0x10000  PoorMansThrottle.ino.bin
```

For every new build, verify its generated `flash_args` before publishing. If a future Arduino build produces different offsets, **do not publish it using the old installer recipe**. Stop and update/verify the installer first.

The N16R8 and N8R8 binaries are not interchangeable even though their four write addresses are currently the same. Their bootloader/partition data is built for different flash capacities.

## ESP Web Tools manifests

No new static manifest files are required.

`Installer/app.js` creates the ESP Web Tools manifest dynamically after the user selects the exact board target and firmware version. The generated manifest contains the selected target's:

- board label;
- `chipFamily`;
- four binary URLs;
- four flash offsets;
- `new_install_prompt_erase: true`.

Both S3 variants use `chipFamily: "ESP32-S3"`. The installer therefore requires the N16R8/N8R8 choice before attaching a manifest to an install button.

The old per-version `manifest-*.json` files are not used by the current installer path.

## User configuration safety

The web manifest always asks ESP Web Tools to give the user the erase choice.

The installer tells users to:

1. Make a configuration backup in the app first.
2. Leave **Erase device** off/unchecked for a normal update.
3. Choose erase only when intentionally starting fresh.

## Publishing order

Deploy binary files and the matching installer catalog/UI changes together.

For a new N8R8 release:

1. Build the N8R8 target.
2. Verify the generated `flash_args`.
3. Copy the four required binaries to `firmware/s3-n8r8/<version>/`.
4. Add that version to the `s3-n8r8` target in `Installer/@firmware-versions.json`.
5. Change `latest` and/or `dropdownDefault` only when desired.
6. Deploy the firmware files and installer changes together.
7. Test Classic, N16R8, and N8R8 selections before announcing the release.

## One-time cleanup after this installer upgrade

The old per-version `manifest-*.json` files are no longer used.

Preview the cleanup first:

```zsh
zsh cleanup-obsolete-installer-files.zsh
```

Then apply it:

```zsh
zsh cleanup-obsolete-installer-files.zsh --apply
```

The cleanup script only targets the exact old manifest files known to this installer release. It does not remove firmware folders.
