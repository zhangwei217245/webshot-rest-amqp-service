#!/bin/sh

node ./bin/www >> console.log 2>&1 &
echo $! > webshot.pid