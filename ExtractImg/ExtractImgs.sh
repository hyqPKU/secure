#! /bin/bash

# This version script do random screenshot from video
# The main commend: ffmpeg -ss $t -i $if -f image2 -y $of

if [ ! $# -eq 1 ]; then
	echo "Usage:./ExtractImgs.sh target"
	exit
fi
BaseTime='1970-10-01 UTC'
Duration=`ffprobe "$1" 2>&1 | grep -e 'Duration' | cut -c 13-20`
DuraSec=$((`date -d "$BaseTime $Duration" +%s`-`date -d "$BaseTime" +%s`))
a=`cat num`
for ((i=0; i<5; i++))
do
	a=$((a+1))
	RandomSec=$((RANDOM % DuraSec))
	RandomTime=`date -d "@$RandomSec" -u +%T`
	ffmpeg -ss $RandomTime -i "$1" -an -vcodec mjpeg -y "$a.jpg" 2>/dev/null
	echo "Output $a.jpg Done." 
done
echo $a > num
echo "Extract five Images From $1 is finished, now remove $1" 
mv "$1" "${1/source/source_test3}"
