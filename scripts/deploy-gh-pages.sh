#!/usr/bin/env bash
set -euo pipefail

BRANCH="gh-pages"
OUT_DIR="dist/h5"

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "[deploy-gh-pages] missing git remote 'origin'"
  exit 1
fi

if [ ! -d "$OUT_DIR" ]; then
  echo "[deploy-gh-pages] missing $OUT_DIR, run npm run build:h5:static first"
  exit 1
fi

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

cp -R "$OUT_DIR"/. "$TMP_DIR"/

git checkout --orphan "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
git rm -rf . >/dev/null 2>&1 || true
cp -R "$TMP_DIR"/. .
git add .
git commit -m "deploy: update gh-pages" || true
git push -f origin "$BRANCH"

echo "[deploy-gh-pages] pushed to origin/$BRANCH"
