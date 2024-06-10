#!/bin/bash

set -euxo pipefail

mkdir -p _site/
cp -R chords-detection/* _site/
sed -i '' "s/%PUBLISHABLE_KEY%/$ROBOFLOW_PUBLISHABLE_KEY/g" _site/computer-vision.js
