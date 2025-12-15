#!/bin/bash

PIDFILE="/tmp/local.pid"
INTERFACE="wls2"
IFIP="182.168.50.1/24"

ip addr add $IFIP dev $INTERFACE

if [ "$1" = "-k" ] || [ "$1" = "--kill" ]; then
	if [[ -f $PIDFILE ]]; then
		kill $(cat $PIDFILE)
		rm $PIDFILE
		exit 0
	fi
fi

php -S $IFIP:80 router.php > .php.log 2>&1 &
PHPID=$!
cat .php.log

echo "$PHPID" > $PIDFILE

sleep 2

if wget -q --spider http://$IFIP; then
    echo "up and running"
fi

./.hotspot_forward
