#!/bin/bash

# set port
[[ -z "$2" ]] && port=4000 || port=$2

# func / start server
start() {
  php -S 0.0.0.0:$port -t ./
}

case "$1" in
  start)
    start
    ;;

  setup)
    # make cache directory
    if [ ! -d cache ]; then
      mkdir cache
      chmod 707 cache
    fi
    # copy .env
    if [ ! -f .env ]; then
      cp .env.example .env
    fi
    ;;

  *)
    echo "Usage: ./action.sh {setup|start}" >&2
    exit 3
    ;;

esac