#!/bin/bash

set -euxo pipefail

mkdir -p _site/
cp -R rock-paper-scissors/* _site/
sed -i "s/%PUBLISHABLE_KEY%/$ROBOFLOW_PUBLISHABLE_KEY/g" _site/robot.js
