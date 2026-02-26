#!/usr/bin/env bash

# ============================================================
# optimize-images.sh
# Resize and convert images using ImageMagick
# Supports output formats: avif, jpeg, webp
# ============================================================

set -euo pipefail

# ── Defaults ────────────────────────────────────────────────
MAX_WIDTH=1200
INPUT_DIR=""
OUTPUT_DIR=""
FORMAT="avif"   # avif | jpeg | webp

# ── Help ────────────────────────────────────────────────────
usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Options:
  -i, --input   <path>    Path to folder with original images  (required)
  -o, --output  <path>    Path to output folder                (required)
  -w, --width   <px>      Max width in pixels; wider images are scaled down,
                          narrower ones stay at their original size
                          (default: ${MAX_WIDTH})
  -f, --format  <format>  Output format: avif | jpeg | webp
                          (default: ${FORMAT})
  -h, --help              Show this help message

Format notes:
  avif  — Best color accuracy + smallest files. Requires ImageMagick
           built with AVIF/HEIC support (standard in recent Homebrew builds).
  jpeg  — Universal compatibility, excellent color accuracy, larger files.
  webp  — Widely supported but can shift colors; use avif or jpeg instead
           if color fidelity is critical.

Supported input formats: JPEG, PNG, GIF, TIFF, BMP, AVIF, WebP

Examples:
  $(basename "$0") -i ./photos -o ./optimized
  $(basename "$0") -i ./photos -o ./optimized -f jpeg
  $(basename "$0") -i ./photos -o ./optimized -f avif -w 1920
EOF
  exit 0
}

# ── Argument parsing ─────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    -i|--input)  INPUT_DIR="$2";  shift 2 ;;
    -o|--output) OUTPUT_DIR="$2"; shift 2 ;;
    -w|--width)  MAX_WIDTH="$2";  shift 2 ;;
    -f|--format) FORMAT="$2";     shift 2 ;;
    -h|--help)   usage ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

# ── Validation ───────────────────────────────────────────────
if [[ -z "$INPUT_DIR" || -z "$OUTPUT_DIR" ]]; then
  echo "Error: --input and --output are required."
  echo "Run '$(basename "$0") --help' for usage."
  exit 1
fi

if [[ ! -d "$INPUT_DIR" ]]; then
  echo "Error: Input directory does not exist: $INPUT_DIR"
  exit 1
fi

FORMAT=$(echo "$FORMAT" | tr '[:upper:]' '[:lower:]')

if [[ "$FORMAT" != "avif" && "$FORMAT" != "jpeg" && "$FORMAT" != "webp" ]]; then
  echo "Error: Invalid format '$FORMAT'. Choose from: avif, jpeg, webp"
  exit 1
fi

# jpeg → jpg for file extension
if [[ "$FORMAT" == "jpeg" ]]; then
  OUT_EXT="jpg"
else
  OUT_EXT="$FORMAT"
fi

if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick is not installed or not in PATH."
  exit 1
fi

# Prefer the modern 'magick' binary; fall back to 'convert'
IM_CMD=$(command -v magick 2>/dev/null || command -v convert)

# ── Per-format convert args ──────────────────────────────────
build_convert_args() {
  local fmt="$1"
  case "$fmt" in
    avif)
      # 10-bit depth + 4:4:4 chroma = best color fidelity in smallest file
      echo "-depth 10 -define heic:chroma-subsampling=4:4:4 -quality 80 -colorspace sRGB"
      ;;
    jpeg)
      # 4:4:4 chroma subsampling, no color information is discarded
      echo "-sampling-factor 4:4:4 -quality 90 -colorspace sRGB -interlace Plane"
      ;;
    webp)
      # Best available WebP settings — note: some color shift is inherent
      # to the format due to its internal YUV color model
      echo "-define webp:method=6 -define webp:auto-filter=true -define webp:use-sharp-yuv=1 -quality 88 -colorspace sRGB"
      ;;
  esac
}

EXTRA_ARGS=$(build_convert_args "$FORMAT")

# ── Setup ────────────────────────────────────────────────────
mkdir -p "$OUTPUT_DIR"

SUPPORTED_EXTS="jpg jpeg png gif tiff tif bmp avif webp"
count_ok=0
count_skip=0
count_err=0

echo ""
echo "  Input       : $INPUT_DIR"
echo "  Output      : $OUTPUT_DIR"
echo "  Format      : $FORMAT (.${OUT_EXT})"
echo "  Max width   : ${MAX_WIDTH}px"
echo "  ImageMagick : $IM_CMD"
echo ""

# ── Process ──────────────────────────────────────────────────
shopt -s nullglob nocaseglob

for filepath in "$INPUT_DIR"/*; do
  [[ -f "$filepath" ]] || continue

  filename=$(basename "$filepath")
  ext="${filename##*.}"
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  name="${filename%.*}"

  # Check extension
  if ! echo "$SUPPORTED_EXTS" | grep -qw "$ext_lower"; then
    echo "  [SKIP]  $filename  (unsupported format)"
    ((count_skip++)) || true
    continue
  fi

  out_file="$OUTPUT_DIR/${name}.${OUT_EXT}"

  # Get original width
  orig_width=$("$IM_CMD" identify -format "%w" "$filepath" 2>/dev/null || echo 0)

  # Only downscale if image exceeds MAX_WIDTH
  if (( orig_width > MAX_WIDTH )); then
    resize_arg="${MAX_WIDTH}x>"
  else
    resize_arg="${orig_width}x>"
  fi

  echo -n "  [....] $filename → ${name}.${OUT_EXT}"

  # shellcheck disable=SC2086
  if "$IM_CMD" "$filepath" \
      -resize "$resize_arg" \
      -strip \
      $EXTRA_ARGS \
      "$out_file" 2>/dev/null; then

    orig_kb=$(du -k "$filepath" | cut -f1)
    new_kb=$(du  -k "$out_file" | cut -f1)
    savings=$(( orig_kb - new_kb ))
    echo -e "\r  [OK]   $filename → ${name}.${OUT_EXT}  (${orig_kb}KB → ${new_kb}KB, saved ${savings}KB)"
    ((count_ok++)) || true
  else
    echo -e "\r  [ERR]  $filename  (conversion failed)"
    ((count_err++)) || true
  fi
done

shopt -u nullglob nocaseglob

# ── Summary ──────────────────────────────────────────────────
echo ""
echo "Done."
echo "  ✓ Converted : $count_ok"
echo "  - Skipped   : $count_skip"
echo "  ✗ Errors    : $count_err"
echo ""