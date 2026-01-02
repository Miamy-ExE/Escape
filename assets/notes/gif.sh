#!/bin/bash

OUT=note.gif
TMP=_tmp

mkdir -p $TMP
rm -f $TMP/*

# Sequenz bauen
i=0
for n in {1..30}; do
    if (( RANDOM % 4 == 0 )); then
        f=$(ls note-*.png | shuf -n 1)
        d=$((RANDOM % 10 + 10))
    else
        f=note.png
        d=20
    fi

    cp "$f" "$TMP/f_$i.png"
    frames+="-delay $d $TMP/f_$i.png "
    ((i++))
done

# GIF bauen
convert -loop 1 -dispose previous $frames "$OUT"

echo "✔ GIF gebaut: $OUT"
