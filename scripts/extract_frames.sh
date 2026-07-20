#!/usr/bin/env bash
# Extract frames from a source video for canvas scroll-scrub.
# Usage: bash scripts/extract_frames.sh [video_file] [output_dir]

set -euo pipefail

# This script lives in scripts/; resolve defaults against the project root.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VIDEO="${1:-"${ROOT_DIR}/pool_cleaning_timelapse.mp4"}"
OUT_DIR="${2:-"${ROOT_DIR}/public/frames"}"
FPS=24          # frames per second to extract — lower = fewer files, less smooth
QUALITY=3       # ffmpeg -q:v: 1 (best) – 31 (worst). 2-4 is a good balance.

# ── checks ────────────────────────────────────────────────
if ! command -v ffmpeg &>/dev/null; then
  echo "Error: ffmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

if [[ ! -f "$VIDEO" ]]; then
  echo "Error: video file '$VIDEO' not found."
  echo "Usage: bash scripts/extract_frames.sh [video_file] [output_dir]"
  exit 1
fi

# ── extract ───────────────────────────────────────────────
mkdir -p "$OUT_DIR"
echo "Extracting frames at ${FPS}fps from '$VIDEO'…"

ffmpeg -i "$VIDEO" \
  -vf "fps=${FPS},scale=1920:-2:flags=lanczos" \
  -q:v "$QUALITY" \
  -threads 0 \
  "${OUT_DIR}/frame_%04d.jpg" \
  -hide_banner -loglevel error -stats

FRAME_COUNT=$(ls "$OUT_DIR"/frame_*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "Done. $FRAME_COUNT frames -> $OUT_DIR/"

# ── report total size ─────────────────────────────────────
TOTAL_SIZE=$(du -sh "$OUT_DIR" | cut -f1)
echo "Total size: $TOTAL_SIZE"
echo ""
echo "Next step: open index.html — the canvas scrubber will pick up"
echo "           frames automatically using FRAME_COUNT=$FRAME_COUNT"
echo ""
echo "If the total size is too large, re-run with a lower FPS (e.g. FPS=15)"
echo "or higher QUALITY number (e.g. QUALITY=5) to reduce file sizes."
