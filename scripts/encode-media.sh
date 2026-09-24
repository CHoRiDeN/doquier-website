#!/usr/bin/env bash
# Re-encodes source media into web-optimized copies under public/media.
# Originals are left untouched.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/media
mkdir -p "$OUT/hero" "$OUT/formats" "$OUT/reviews" "$OUT/posters"

# Every video is cropped to an exact 9:16 frame (width must be divisible by 9).
fit916() { echo "scale=$1:$(($1 * 16 / 9)):force_original_aspect_ratio=increase:flags=lanczos,crop=$1:$(($1 * 16 / 9)),setsar=1,fps=30"; }

loop() { # src dst width maxSeconds
  ffmpeg -y -v error -i "$1" -t "$4" -an -vf "$(fit916 "$3")" \
    -c:v libx264 -preset slow -crf 30 -profile:v high -pix_fmt yuv420p -movflags +faststart "$2"
}
full() { # src dst width
  ffmpeg -y -v error -i "$1" -vf "$(fit916 "$3")" \
    -c:v libx264 -preset slow -crf 27 -maxrate 1400k -bufsize 2800k -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 96k -movflags +faststart "$2"
}
poster() { # src width dst [seconds]
  ffmpeg -y -v error -ss "${4:-0.5}" -i "$1" -frames:v 1 -vf "$(fit916 "$2")" -q:v 5 "$3"
}

for i in $(seq 1 18); do
  loop "public/videos/hero/$i.mp4" "$OUT/hero/$i.mp4" 270 9
done

F=public/images/formats
declare -a FMT=(
  "interview/example1.mp4:interview-1"
  "podcast/example1.mp4:podcast-1"
  "product-ad/example1.mp4:product-ad-1"
  "product-ad/example3.mp4:product-ad-2"
  "reaction-demo/example1.mp4:reaction-demo-1"
  "reaction-demo/example3.mp4:reaction-demo-2"
  "talking-head/example1.mp4:talking-head-1"
  "talking-head/example2.mp4:talking-head-2"
  "walltext/example1.mp4:walltext-1"
  "walltext/example4.mp4:walltext-2"
)
for pair in "${FMT[@]}"; do
  src="$F/${pair%%:*}"; name="${pair##*:}"
  loop "$src" "$OUT/formats/$name.mp4" 540 10
  poster "$src" 540 "$OUT/posters/$name.jpg"
done
for n in 1 2; do
  ffmpeg -y -v error -i "$F/carousels/example$n.png" -vf "scale=540:-2" -q:v 4 "$OUT/formats/carousel-$n.jpg"
done

full "$F/product-review.mp4" "$OUT/reviews/product.mp4" 720
full "$F/service-review.mp4" "$OUT/reviews/service.mp4" 720
full "$F/product-ad/example3.mp4" "$OUT/reviews/brand-ad.mp4" 720
for n in product service; do poster "$OUT/reviews/$n.mp4" 720 "$OUT/posters/review-$n.jpg"; done
poster "$OUT/reviews/brand-ad.mp4" 720 "$OUT/posters/review-brand-ad.jpg" 12

mkdir -p "$OUT/competitors"
# Doquier's own clip for the side-by-side comparison
full "$F/organic-ugc-holafly.mp4" "$OUT/competitors/doquier-holafly.mp4" 540
poster "$F/organic-ugc-holafly.mp4" 540 "$OUT/posters/competitor-doquier-holafly.jpg"
C=public/images/competitors
for pair in arcads.webm:arcads custmiqai.mp4:customiqai heygen-video.webm:heygen mindshift.mp4:mindshift \
            rexen.mp4:rexen siriusly.mp4:siriusly tucomercial.mp4:tucomercialvirtual; do
  src="$C/${pair%%:*}"; name="${pair##*:}"
  loop "$src" "$OUT/competitors/$name.mp4" 360 8
  poster "$src" 360 "$OUT/posters/competitor-$name.jpg"
done
echo DONE
du -sh "$OUT" "$OUT"/*
