#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODE="dry-run"

if [ "$#" -gt 1 ]; then
  printf '%s\n' "Usage: zsh cleanup-obsolete-installer-files.zsh [--apply]" >&2
  exit 2
fi

if [ "$#" -eq 1 ]; then
  if [ "$1" != "--apply" ]; then
    printf 'Unknown option: %s\n' "$1" >&2
    printf '%s\n' "Usage: zsh cleanup-obsolete-installer-files.zsh [--apply]" >&2
    exit 2
  fi
  MODE="apply"
fi

CATALOG="${SCRIPT_DIR}/@firmware-versions.json"
APP_JS="${SCRIPT_DIR}/app.js"
HOME_HTML="${SCRIPT_DIR}/home.html"

if [ ! -f "$CATALOG" ] || [ ! -f "$APP_JS" ] || [ ! -f "$HOME_HTML" ]; then
  printf '%s\n' "ERROR: Run this script from the upgraded Installer folder." >&2
  exit 1
fi

if ! /usr/bin/grep -Eq '"schemaVersion"[[:space:]]*:[[:space:]]*2' "$CATALOG"; then
  printf '%s\n' "ERROR: The new firmware catalog (schemaVersion 2) is not installed." >&2
  printf '%s\n' "Refusing to remove old manifest files." >&2
  exit 1
fi

if ! /usr/bin/grep -q 'new_install_prompt_erase' "$APP_JS"; then
  printf '%s\n' "ERROR: The upgraded app.js was not detected." >&2
  printf '%s\n' "Refusing to remove old manifest files." >&2
  exit 1
fi

if ! /usr/bin/grep -q 'styles.css?v=20260903-4' "$HOME_HTML" || \
   ! /usr/bin/grep -q 'app.js?v=20260903-4' "$HOME_HTML"; then
  printf '%s\n' "ERROR: The corrected installer home.html was not detected." >&2
  printf '%s\n' "Refusing to remove old manifest files." >&2
  exit 1
fi

OBSOLETE_FILES=(
  "manifest-1.6.1.json"
  "manifest-1.6.2.json"
  "manifest-1.7.1.json"
  "manifest-1.8.0.json"
  "manifest-1.9.3.json"
  "manifest-1.9.6.json"
  "manifest-1.10.4.json"
  "manifest-1.10.7.json"
  "manifest-1.10.9.json"
  "manifest-1.11.0.json"
  "manifest-1.12.1.json"
  "manifest-1.12.3.json"
  "manifest-1.12.4.json"
  "manifest-1.12.5.json"
  "manifest-1.12.7.json"
  "manifest-2.0.0.json"
  "manifest-3.0.0.json"
)

if [ "$MODE" = "dry-run" ]; then
  printf '%s\n' "DRY RUN — nothing will be deleted."
  printf '%s\n' "The following obsolete installer manifests are eligible for removal:"
else
  printf '%s\n' "Applying cleanup."
fi

found=0

for file in "${OBSOLETE_FILES[@]}"; do
  path="${SCRIPT_DIR}/${file}"

  if [ -f "$path" ]; then
    found=1

    if [ "$MODE" = "dry-run" ]; then
      printf '  WOULD REMOVE: %s\n' "$path"
    else
      /bin/rm -f "$path"
      printf '  REMOVED: %s\n' "$path"
    fi
  fi
done

if [ "$found" -eq 0 ]; then
  printf '%s\n' "No obsolete manifest files were found. Nothing to do."
fi

if [ "$MODE" = "dry-run" ] && [ "$found" -eq 1 ]; then
  printf '\n%s\n' "Review the list above. To delete those exact files, run:"
  printf '  zsh %s --apply\n' "$(basename "$0")"
fi

printf '\n%s\n' "Firmware folders were not touched."
