#!/usr/bin/env bash
# Fail if a relative Markdown (or llms.txt) link does not exist on disk.
# Scans README, AGENTS, CONTRIBUTING, docs/**, examples/**, and llms.txt
# when present. External URLs and same-file #anchors are skipped.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

failures=0

fail() {
  printf 'FAIL | %s\n' "$1" >&2
  failures=$((failures + 1))
}

is_skipped() {
  case "$1" in
    http://*|https://*|mailto:*|\#*) return 0 ;;
  esac
  return 1
}

extract_targets() {
  grep -oE '\[[^][]+\]\([^()]+\)' "$1" | sed -E 's/^\[[^][]+\]\((.+)\)$/\1/' || true
}

files=()
for required in README.md AGENTS.md CONTRIBUTING.md; do
  if [[ ! -f "${required}" ]]; then
    fail "missing scan target: ${required}"
  else
    files+=("${required}")
  fi
done
[[ -f llms.txt ]] && files+=(llms.txt)

while IFS= read -r rel; do
  files+=("${rel}")
done < <(find docs examples -type f \( -name '*.md' -o -name '*.txt' \) | sort)

for rel in "${files[@]}"; do
  dir="$(dirname "${rel}")"

  while IFS= read -r raw || [[ -n "${raw}" ]]; do
    [[ -z "${raw}" ]] && continue
    target="${raw%%[[:space:]]*}"
    target="${target#<}"
    target="${target%>}"
    target="${target%%\"*}"
    target="${target%%\'*}"
    [[ -z "${target}" ]] && continue
    if is_skipped "${target}"; then
      continue
    fi
    path_part="${target%%#*}"
    [[ -z "${path_part}" ]] && continue

    resolved="$(realpath -m "${dir}/${path_part}")"
    if [[ ! -e "${resolved}" ]]; then
      fail "${rel} -> ${target}"
    fi
  done < <(extract_targets "${rel}")
done

if (( failures > 0 )); then
  printf '\n%d broken relative link(s)\n' "${failures}" >&2
  exit 1
fi

printf 'Relative markdown links: ok\n'
