#!/bin/bash

set -euxo pipefail

./build.sh

python -m http.server -d _site/