#!/usr/bin/env bash
# The single repository gate. CI and the pre-push hook both run this script,
# so a local pass means the same checks pass in CI.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

step() {
  printf '\n== %s\n' "$1"
}

step "contracts and fixtures"
node scripts/validate-all.mjs

step "approval runtime tests"
node --test examples/approval-runtime/runtime.test.mjs

step "approval runtime walkthrough"
node examples/approval-runtime/demo.mjs > /dev/null

step "relative documentation links"
bash scripts/check-relative-links.sh

printf '\ncheck: all gates passed\n'
