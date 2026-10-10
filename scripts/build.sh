#!/usr/bin/env bash
# Assemble the whole site into dist/ for Firebase Hosting:
#   /                          this repo (portfolio page)
#   /time-person-of-the-year/  built from briandaviddavidson/time-person-of-the-year
#   /projections/, /git-and-github/, /d3-maptime/
#                              Maptime talk decks, from each repo's default branch
set -euo pipefail
cd "$(dirname "$0")/.."

OWNER=briandaviddavidson
OUT=dist
TALKS=(projections git-and-github d3-maptime)

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
rm -rf "$OUT"
mkdir -p "$OUT"

# Portfolio: an explicit list, so nothing else in the repo is published.
cp -R index.html favicon.ico Davidson_Thesis.pdf css fonts images "$OUT"/

for talk in "${TALKS[@]}"; do
  echo "Adding /$talk/"
  git clone -q --depth 1 "https://github.com/$OWNER/$talk.git" "$WORK/$talk"
  mkdir -p "$OUT/$talk"
  git -C "$WORK/$talk" archive HEAD | tar -x -C "$OUT/$talk"
done

echo "Building /time-person-of-the-year/"
git clone -q --depth 1 "https://github.com/$OWNER/time-person-of-the-year.git" "$WORK/time"
(cd "$WORK/time" && yarn install --frozen-lockfile --silent && yarn -s build)
cp -R "$WORK/time/build" "$OUT/time-person-of-the-year"

echo "Built $OUT/ ($(du -sh "$OUT" | cut -f1))"
