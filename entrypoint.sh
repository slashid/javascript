#!/bin/sh

set -e

pnpm serve --filter $APP_NAME & pnpm test:e2e --filter tests