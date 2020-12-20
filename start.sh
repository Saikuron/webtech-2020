#!/bin/bash

# Start dex
cd dex/
./bin/dex serve ../dex-config/config-private.yaml > ../logs/log-dex 2>&1 & # or err to ../logs/log-dex-err

# Start back-end
# Deal the reset and init switches
reset=0
init=0
cd ..
while [ -n "$1" ]
do
case "$1" in
--reset) reset=1;;
--init) init=1;;
*) echo "$1 is not an option";;
esac
shift
done
if [ $reset -eq 1 ]
then
bash ./back-end/bin/reset
fi
if [ $init -eq 1 ]
then
node ./back-end/bin/init
fi
node ./back-end/bin/start > logs/log-back 2>&1 & # or err to logs/log-back-err

# Start front-end
cd front-end/
npm start
# kill back-end and dex when npm start is finished (i.e. ctrl-C)
#ps -ef | grep back-end/bin/start | grep -v grep | awk '{print $2}' | xargs kill
ps -ef | grep dex | grep -v grep | awk '{print $2}' | xargs kill

echo "Script done"