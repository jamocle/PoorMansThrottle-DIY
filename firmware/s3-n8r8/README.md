# ESP32-S3-WROOM-1-N8R8 Firmware Releases

This directory is the web-installer source for **ESP32-S3-WROOM-1-N8R8** firmware.

Each release must be placed in its own version directory:

```text
firmware/s3-n8r8/<version>/
```

For firmware version `3.0.0`, the installer expects:

```text
firmware/s3-n8r8/3.0.0/
├── PoorMansThrottle.ino.bootloader.bin
├── PoorMansThrottle.ino.partitions.bin
├── boot_app0.bin
└── PoorMansThrottle.ino.bin
```

The N8R8 build is compiled for:

```text
FlashSize=8M
PartitionScheme=default_8MB
PSRAM=opi
```

For the generic ESP32-S3 build recipe used by Arduino ESP32 core 3.3.10, the web installer writes:

```text
0x0      PoorMansThrottle.ino.bootloader.bin
0x8000   PoorMansThrottle.ino.partitions.bin
0xE000   boot_app0.bin
0x10000  PoorMansThrottle.ino.bin
```

Always verify the generated `flash_args` for a new build before publishing it.

Do not place N16R8 binaries in this directory. Existing N16R8 releases remain under:

```text
firmware/s3/<version>/
```

The installer creates ESP Web Tools manifests dynamically. Do not add per-version static manifest JSON files here.
