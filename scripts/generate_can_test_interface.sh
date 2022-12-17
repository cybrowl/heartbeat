#!/bin/bash

# TESTING #
# NOTE: update file OSX ONLY (Linux remove '')

# health_metrics
cp .dfx/local/canisters/health_metrics/health_metrics.did.js .dfx/local/canisters/health_metrics/health_metrics.did.test.cjs
sed -i '' 's/export//g' .dfx/local/canisters/health_metrics/health_metrics.did.test.cjs
echo "module.exports = { idlFactory };" >> .dfx/local/canisters/health_metrics/health_metrics.did.test.cjs
