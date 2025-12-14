#!/bin/bash

PIDFILE="/tmp/local.pid"

if [ "$1" = "-k" ] || [ "$1" = "--kill" ]; then
	if [[ -f $PIDFILE ]]; then
		kill $(cat $PIDFILE)
		rm $PIDFILE
		exit 0
	fi
fi

php -S 0.0.0.0:80 > .php.log 2>&1 &
PHPID=$!
cat .php.log

echo "$PHPID" > $PIDFILE

sleep 2

if wget -q --spider http://127.0.0.1; then
    echo "up and running"
fi