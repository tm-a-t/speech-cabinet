#!/usr/bin/env bash
set -e

case "$1" in
    web)
        if [ ! -f first_run_done ]; then
            yarn build
            yarn db:push
            touch first_run_done
        fi
        exec yarn start
        ;;
    worker)
        exec yarn worker:prod
        ;;
esac
