# Poor Man's HID Firmware Publishing

Poor Man's HID uses a firmware catalog and versioned binary folders that are separate from Poor Man's Throttle.

## Public installer targets

| Installer target | Build task product | Firmware directory |
| --- | --- | --- |
| Classic ESP32-WROOM-32 | `classic` | `firmware/hid/classic/<version>/` |
| ESP32-S3-WROOM-1-N16R8 | `s3-n16r8-uart` | `firmware/hid/s3-n16r8/<version>/` |
| ESP32-S3-WROOM-1-N8R8 | `s3-n8r8-uart` | `firmware/hid/s3-n8r8/<version>/` |

The N16R8 native-USB build remains available to developers in `poormanshid-task.sh`, but it is not a public installer target.

## Version source

The release version is read from the single `FW_VERSION` definition in:

`pmt_module_package/PoorMansHID/PoorMansHID.ino`

The initial public installer release remains `1.0.0`.

## Catalog

The web installer reads:

`installer/@hid-firmware-versions.json`

Each board entry has independent `latest`, `dropdownDefault`, `versions`, flash parts, and a versioned firmware directory.

The HID catalog is intentionally separate from `installer/@firmware-versions.json`, which remains the Poor Man's Throttle catalog.

## Required binaries

Each public target deploys these four Arduino export files:

- `PoorMansHID.ino.bootloader.bin`
- `PoorMansHID.ino.partitions.bin`
- `boot_app0.bin`
- `PoorMansHID.ino.bin`

The deployment task verifies the complete set before replacing a version directory.

## Release workflow

From the directory containing `poormanshid-task.sh`, run:

```bash
bash poormanshid-task.sh deploy-all
```

The task:

1. Shows the firmware version read from `PoorMansHID.ino`.
2. Prompts for the new `dropdownDefault` for Classic, S3 N16R8, and S3 N8R8 before compilation starts, matching the Poor Man's Throttle release workflow.
3. Validates every requested dropdown version against the target's catalog versions plus the firmware version being published.
4. Uses the isolated PoorMansHID Arduino-ESP32 `3.3.12` toolchain and NimBLE-Arduino `2.5.1`.
5. Builds Classic, S3 N16R8 UART, and S3 N8R8 UART in that order.
6. Verifies all four binaries for each target.
7. Deploys them into the matching versioned `firmware/hid/...` directory.
8. Inserts the firmware version into the matching HID catalog board when needed.
9. Updates that board's `latest` and approved `dropdownDefault` values only after its binaries have been deployed.

In the interactive PoorMansHID menu, **100) Build/Export/Deploy Classic + N16R8 + N8R8** runs the same all-target release workflow.

The sequence stops on the first failed build or deployment.

## Publishing order

Apply the installer/task changes first, run the HID deployment task so the binary folders exist, verify the generated catalog and directories, then publish the DIY site/repository. Do not publish a catalog entry whose referenced binaries are absent.
