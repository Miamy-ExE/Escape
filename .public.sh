#!/bin/bash

PIDFILE="/tmp/public.pid"

if [ "$1" = "-k" ] || [ "$1" = "--kill" ]; then
	if [[ -f $PIDFILE ]]; then
		kill $(cat $PIDFILE)
		rm $PIDFILE
		sysctl -w net.ipv4.ip_forward=0
		exit 0
	fi
fi

ip link set wls2 down
ip addr flush dev wls2
ip addr add 192.168.50.1/24 dev wls2
ip link set wls2 up
sysctl -w net.ipv4.ip_forward=1

dnsmasq -C /etc/dnsmasq.wls2.conf -d > .dnsmasq.log 2>&1 &
DNSMASQID=$!
hostapd /etc/hostapd/hostapd.conf -d > .hostapd.log 2>&1 &
HOSTAPDID=$!
php -S 0.0.0.0:80 > .php.log 2>&1 &
PHPID=$!
tcpdump -A -ni wls2 "tcp port 80" -w tcpdump.log &
DUMPID=$!
cat .php.log

echo "$DNSMASQID $HOSTAPDID $PHPID $DUMPID" > $PIDFILE

sleep 2

if wget -q --spider http://yetanotheros.local; then
    echo "up and running"
fi