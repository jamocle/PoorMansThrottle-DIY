#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

die() {
  echo "ERROR: $*" >&2
  exit 2
}

create_docs_installer_zip() {
  rm -f docs-installer.zip \
    && zip -r docs-installer.zip docs installer \
      -x 'installer/downloads/' 'installer/downloads/*'
}

repo_reset_main_delete_local_non_main() {
  # Preserve the original VS Code task semantics: this task used an && chain
  # without `set -euo pipefail`.
  set +e
  set +o pipefail

  git checkout main \
    && git fetch origin --prune \
    && git reset --hard origin/main \
    && git branch --format="%(refname:short)" \
      | grep -v '^main$' \
      | xargs -r git branch -D \
    && git branch
}

repo_delete_remote_non_main() {
  # Preserve the original VS Code task semantics: commands were separated by
  # semicolons and the delete loop tolerated individual remote delete failures.
  set +e
  set +o pipefail

  local branch

  git fetch origin --prune
  git branch -r --format="%(refname:short)" \
    | grep '^origin/' \
    | grep -v '^origin/main$' \
    | grep -v '^origin/HEAD$' \
    | sed 's#^origin/##' \
    | while read -r branch; do
        git push origin --delete "${branch}" || true
      done
  git fetch origin --prune
  git remote prune origin
  git branch -r
}

update_diy_from_downloads() {
  local downloads_dir="${HOME}/Downloads"
  local archive_dir="${downloads_dir}/Archive_DIY"
  local working_dir="${downloads_dir}/Working"
  local extract_dir="${working_dir}/extracted"

  if [[ ! -d "${downloads_dir}" ]]; then
    die "Downloads directory not found: ${downloads_dir}"
  fi

  command -v unzip >/dev/null 2>&1 || die "unzip was not found on PATH."

  if [[ -e "${working_dir}" ]]; then
    die "Working directory already exists: ${working_dir}. Remove or rename it before running the update."
  fi

  local newest_zip=""
  local newest_mtime=-1
  local zip_file
  local zip_mtime

  while IFS= read -r -d '' zip_file; do
    if zip_mtime="$(stat -f '%m' "${zip_file}" 2>/dev/null)"; then
      :
    elif zip_mtime="$(stat -c '%Y' "${zip_file}" 2>/dev/null)"; then
      :
    else
      die "Could not determine modification time for: ${zip_file}"
    fi

    if (( zip_mtime > newest_mtime )); then
      newest_zip="${zip_file}"
      newest_mtime="${zip_mtime}"
    fi
  done < <(find "${downloads_dir}" -maxdepth 1 -type f -name '*.zip' -print0)

  if [[ -z "${newest_zip}" ]]; then
    die "No top-level ZIP files were found in ${downloads_dir}."
  fi

  local zip_name="${newest_zip##*/}"
  local archived_zip="${archive_dir}/${zip_name}"
  local working_zip="${working_dir}/${zip_name}"

  echo
  echo "Updating DIY from Downloads"
  echo "Source ZIP: ${newest_zip}"
  echo "Archive:    ${archived_zip}"
  echo "Target:     ${REPO_ROOT}"
  echo

  mkdir -p "${archive_dir}"
  cp -p "${newest_zip}" "${archived_zip}"

  mkdir "${working_dir}"
  mv "${newest_zip}" "${working_zip}"

  mkdir "${extract_dir}"
  unzip -q "${working_zip}" -d "${extract_dir}"

  # Preflight every top-level extracted item before copying anything into the
  # repository. Only directories are accepted, and every corresponding
  # destination directory must already exist.
  local entry
  local name
  local destination
  local issue_count=0
  local top_level_count=0
  local top_level_entries=()

  while IFS= read -r -d '' entry; do
    top_level_entries+=("${entry}")
    top_level_count=$((top_level_count + 1))

    name="${entry##*/}"
    destination="${REPO_ROOT}/${name}"

    if [[ -L "${entry}" || ! -d "${entry}" ]]; then
      echo "ERROR: ZIP contains unsupported top-level item: ${name}" >&2
      echo "       Only top-level directories can be merged." >&2
      issue_count=$((issue_count + 1))
      continue
    fi

    if [[ ! -d "${destination}" || -L "${destination}" ]]; then
      echo "ERROR: Required destination directory does not exist as a real directory:" >&2
      echo "       ${destination}" >&2
      issue_count=$((issue_count + 1))
    fi
  done < <(find "${extract_dir}" -mindepth 1 -maxdepth 1 -print0)

  if (( top_level_count == 0 )); then
    die "The ZIP contains no top-level directories to merge. Nothing was copied into the repository."
  fi

  if (( issue_count != 0 )); then
    die "Preflight failed with ${issue_count} issue(s). Nothing was copied into the repository."
  fi

  echo
  echo "Preflight passed. Merging into existing DIY directories."
  echo

  for entry in "${top_level_entries[@]}"; do
    name="${entry##*/}"
    destination="${REPO_ROOT}/${name}"

    echo "==> Merging ${name}/ into ${destination}/"
    cp -R "${entry}/." "${destination}/"
  done

  rm -rf "${working_dir}"

  echo
  echo "Update complete."
  echo "Archived ZIP: ${archived_zip}"
  echo "Updated:      ${REPO_ROOT}"
}

print_menu() {
  echo
  echo "DIY Repository Menu"
  echo "Project: ${REPO_ROOT}"
  echo
  echo "Repository exports"
  echo "  4) Create docs-installer.zip"
  echo
  echo "Repository maintenance"
  echo "  6) Reset to main and delete local non-main branches"
  echo "  7) Delete remote non-main branches"
  echo " 99) Update DIY from newest Downloads ZIP"
  echo
  echo "  0) Exit"
  echo
}

run_menu() {
  while true; do
    print_menu

    local choice
    read -r -p "Choose: " choice

    if [[ "${choice}" == "0" ]]; then
      exit 0
    fi

    local action_status=0
    # Capture failure outside a conditional so errexit works inside each action.
    set +e
    (
      set -e
      case "${choice}" in
        4) create_docs_installer_zip ;;
        6) repo_reset_main_delete_local_non_main ;;
        7) repo_delete_remote_non_main ;;
        99) update_diy_from_downloads ;;
        *)
          echo "Invalid choice: ${choice}"
          exit 0
          ;;
      esac
    )
    action_status=$?
    set -e

    if (( action_status != 0 )); then
      echo
      echo "ERROR: Menu action failed (exit code ${action_status})."
      echo "The task will remain open and return to the DIY Repository Menu."
    fi

    echo
    read -r -p "Press Enter to return to the menu..." _
  done
}

main() {
  cd "${REPO_ROOT}"

  local command="${1:-menu}"

  case "${command}" in
    menu) run_menu ;;
    create-docs-installer-zip) create_docs_installer_zip ;;
    reset-local-branches) repo_reset_main_delete_local_non_main ;;
    delete-remote-branches) repo_delete_remote_non_main ;;
    update-from-downloads) update_diy_from_downloads ;;
    *)
      die "Unknown command: ${command}"
      ;;
  esac
}

main "$@"
