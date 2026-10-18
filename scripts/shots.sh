#!/usr/bin/env bash
# Regenerate the marketing screenshots from the (private) basalt app repo's demo data.
#
#   scripts/shots.sh                 # every shot in shots.tsv, dark + light
#   THEMES=dark scripts/shots.sh home graph
#
# Env: BASALT_REPO (default ../basalt). Writes shots-src/<name>-<theme>.png (gitignored), then
# public/shots/<name>-<theme>.webp (needs `cwebp`: brew install webp).
set -euo pipefail
cd "$(dirname "$0")/.."
repo="${BASALT_REPO:-../basalt}"
out="$PWD/shots-src"; web="$PWD/public/shots"
mkdir -p "$out" "$web"
export CARGO_BUILD_JOBS="${CARGO_BUILD_JOBS:-4}"
themes="${THEMES:-dark light}"
want=" $* "

while IFS=$'\t' read -r name envs; do
  [[ -z "$name" || "$name" == \#* ]] && continue
  [[ $# -gt 0 && "$want" != *" $name "* ]] && continue
  for theme in $themes; do
    args=(BASALT_THEME="$theme" BASALT_AS_OF=2026-09-28 SHOT_WAIT="${SHOT_WAIT:-3}")
    for kv in $envs; do args+=("${kv//%20/ }"); done
    echo "▸ $name ($theme)"
    (cd "$repo" && env "${args[@]}" scripts/shot.sh "$out/$name-$theme.png" >/dev/null 2>&1) ||
      echo "  failed: $name ($theme)" >&2
    if command -v cwebp >/dev/null && [[ -f "$out/$name-$theme.png" ]]; then
      cwebp -quiet -q 86 "$out/$name-$theme.png" -o "$web/$name-$theme.webp"
    fi
  done
done < scripts/shots.tsv
