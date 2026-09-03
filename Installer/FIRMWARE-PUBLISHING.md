# Poor Man's Throttle Firmware Publishing

This installer is designed so normal firmware releases do **not** require editing HTML, JavaScript, or individual manifest files.

## The two settings that control the web installer

Each board has two independent settings in `@firmware-versions.json`:

- `latest` — the version installed by **Install Latest Firmware**.
- `dropdownDefault` — the version initially selected in the **Choose a specific firmware version** dropdown.

They do not need to be the same.

Current deployment:

| Board | `latest` | `dropdownDefault` |
| --- | --- | --- |
| Classic ESP32-WROOM-32 | `3.0.0` | `2.0.0` |
| ESP32-S3-N16R8 (N8R8) | `3.0.0` | `3.0.0` |

## Recommended publishing workflow

The helper script validates and copies the four web-flashing binaries to the correct firmware folder.

From the `Installer` folder:

```zsh
zsh prepare-firmware-release.zsh classic 3.1.0 "/path/to/Arduino/build/output"
```

or:

```zsh
zsh prepare-firmware-release.zsh s3 3.1.0 "/path/to/Arduino/build/output"
```

The script:

1. Checks that all four required `.bin` files exist.
2. If `flash_args` is present, verifies the flash offsets still match the installer recipe.
3. Refuses to overwrite an existing release folder.
4. Copies only the four required distribution binaries.
5. Prints the one catalog entry you need to add.

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

### ESP32-S3-N16R8 (N8R8) destination

```text
firmware/s3/<version>/
```

Example:

```text
firmware/s3/3.1.0/
```

## Add the version to the catalog

Open:

```text
Installer/@firmware-versions.json
```

Find the correct board and add one entry near the top of its `versions` array:

```json
{ "version": "3.1.0" }
```

Normally that is the only catalog entry needed.

If you want custom display text, add `label`:

```json
{ "version": "3.1.0-beta.1", "label": "v3.1.0 Beta 1" }
```

## Decide whether to change `latest`

Only change `latest` when the big **Install Latest Firmware** button should install the new release.

Example:

```json
"latest": "3.1.0"
```

If you are publishing a beta or test build but do not want it on the Latest button, leave `latest` unchanged.

## Decide whether to change `dropdownDefault`

Only change `dropdownDefault` when you want that release preselected in the version dropdown.

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

Do **not** use that merged file for the normal Poor Man's Throttle web update path.

The current S3 merged image spans the NVS configuration area. Writing the four individual parts instead allows the normal update path to avoid intentionally overwriting the NVS configuration region. The installer therefore uses the four files listed above.

## Flash-layout safety

The board-level flash offsets are stored once in `@firmware-versions.json`. You should not change them for normal releases.

The current recipes are:

### Classic ESP32-WROOM-32

```text
0x1000   PoorMansThrottle.ino.bootloader.bin
0x8000   PoorMansThrottle.ino.partitions.bin
0xE000   boot_app0.bin
0x10000  PoorMansThrottle.ino.bin
```

### ESP32-S3-N16R8 (N8R8)

```text
0x0      PoorMansThrottle.ino.bootloader.bin
0x8000   PoorMansThrottle.ino.partitions.bin
0xE000   boot_app0.bin
0x10000  PoorMansThrottle.ino.bin
```

If a future Arduino build produces different `flash_args`, **do not publish it using the old recipe**. Stop and update/verify the installer first.

## User configuration safety

The web manifest always asks ESP Web Tools to give the user the erase choice.

The installer tells users to:

1. Make a configuration backup in the app first.
2. Leave **Erase device** off/unchecked for a normal update.
3. Choose erase only when intentionally starting fresh.

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
