#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
FIRMWARE_ROOT="${PROJECT_ROOT}/firmware"

usage() {
  cat <<'EOF'
Prepare a Poor Man's Throttle firmware release.

Usage:
  zsh prepare-firmware-release.zsh <classic|s3> <version> <arduino-build-folder>

Examples:
  zsh prepare-firmware-release.zsh classic 3.1.0 "/Users/me/build/PoorMansThrottle"
  zsh prepare-firmware-release.zsh s3 3.1.0 "/Users/me/build/PoorMansThrottle"
EOF
}

if [ "$#" -ne 3 ]; then
  usage
  exit 2
fi

BOARD="$1"
VERSION="$2"

if [ "$BOARD" != "classic" ] && [ "$BOARD" != "s3" ]; then
  printf '%s\n' "ERROR: board must be 'classic' or 's3'." >&2
  exit 2
fi

if ! printf '%s' "$VERSION" | /usr/bin/grep -Eq '^[A-Za-z0-9][A-Za-z0-9._+-]*$'; then
  printf 'ERROR: version contains unsupported characters: %s\n' "$VERSION" >&2
  exit 2
fi

if [ ! -d "$3" ]; then
  printf 'ERROR: build folder does not exist: %s\n' "$3" >&2
  exit 2
fi

SOURCE_DIR="$(cd "$3" && pwd)"

FILES=(
  "PoorMansThrottle.ino.bootloader.bin"
  "PoorMansThrottle.ino.partitions.bin"
  "boot_app0.bin"
  "PoorMansThrottle.ino.bin"
)

for file in "${FILES[@]}"; do
  if [ ! -f "${SOURCE_DIR}/${file}" ]; then
    printf '%s\n' "ERROR: required build file is missing:" >&2
    printf '  %s\n' "${SOURCE_DIR}/${file}" >&2
    exit 1
  fi
done

if [ "$BOARD" = "classic" ]; then
  TARGET_DIR="${FIRMWARE_ROOT}/${VERSION}"
  BOOTLOADER_OFFSET="0x1000"
  BOARD_LABEL="Classic ESP32-WROOM-32"
else
  TARGET_DIR="${FIRMWARE_ROOT}/s3/${VERSION}"
  BOOTLOADER_OFFSET="0x0"
  BOARD_LABEL="ESP32-S3-N16R8 (N8R8)"
fi

FLASH_ARGS="${SOURCE_DIR}/flash_args"

if [ -f "$FLASH_ARGS" ]; then
  printf 'Checking flash layout in: %s\n' "$FLASH_ARGS"

  check_flash_arg() {
    local offset="$1"
    local file="$2"

    if ! /usr/bin/grep -Eiq "(^|[[:space:]])${offset}[[:space:]]+${file}([[:space:]]|$)" "$FLASH_ARGS"; then
      printf '%s\n' "ERROR: flash_args does not contain the expected mapping:" >&2
      printf '  %s %s\n' "$offset" "$file" >&2
      printf '%s\n' "" >&2
      printf '%s\n' "The build layout differs from the installer recipe." >&2
      printf '%s\n' "Do not publish this build until the installer flash layout is reviewed." >&2
      exit 1
    fi
  }

  check_flash_arg "$BOOTLOADER_OFFSET" "PoorMansThrottle.ino.bootloader.bin"
  check_flash_arg "0x8000" "PoorMansThrottle.ino.partitions.bin"
  check_flash_arg "0xe000" "boot_app0.bin"
  check_flash_arg "0x10000" "PoorMansThrottle.ino.bin"

  printf '%s\n' "Flash layout matches the current installer recipe."
else
  printf '%s\n' "WARNING: flash_args was not found, so the script cannot independently verify offsets."
  printf '%s\n' "         The four required binaries will still be prepared."
fi

if [ -e "$TARGET_DIR" ]; then
  printf '%s\n' "ERROR: release destination already exists:" >&2
  printf '  %s\n' "$TARGET_DIR" >&2
  printf '%s\n' "Nothing was overwritten." >&2
  exit 1
fi

created_target=0
cleanup_on_error() {
  status=$?
  if [ "$status" -ne 0 ] && [ "$created_target" -eq 1 ]; then
    /bin/rm -rf "$TARGET_DIR"
  fi
  exit "$status"
}
trap cleanup_on_error EXIT

/bin/mkdir -p "$TARGET_DIR"
created_target=1

for file in "${FILES[@]}"; do
  /bin/cp -p "${SOURCE_DIR}/${file}" "${TARGET_DIR}/${file}"
done

trap - EXIT

printf '\n%s\n' "Release prepared successfully."
printf 'Board:       %s\n' "$BOARD_LABEL"
printf 'Version:     %s\n' "$VERSION"
printf 'Destination: %s\n' "$TARGET_DIR"
printf '\n%s\n' "Copied files:"
for file in "${FILES[@]}"; do
  printf '  %s\n' "$file"
done

printf '\n%s\n' "SHA-256:"
for file in "${FILES[@]}"; do
  /usr/bin/shasum -a 256 "${TARGET_DIR}/${file}"
done

printf '\n%s\n' "NEXT STEP:"
printf 'Edit %s/@firmware-versions.json\n' "$SCRIPT_DIR"
printf "and add this entry to the '%s' versions array:\n" "$BOARD"
printf '\n  { "version": "%s" }\n' "$VERSION"
printf '\nOnly change '\''latest'\'' if the Latest button should install %s.\n' "$VERSION"
printf 'Only change '\''dropdownDefault'\'' if the dropdown should open on %s.\n' "$VERSION"
