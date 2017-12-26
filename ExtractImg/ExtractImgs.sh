#! /bin/bash

# This version script do random screenshot from video
# The main commend: ffmpeg -ss $t -i $if -f image2 -y $of

if [ ! $# -eq 2 ]; then
	echo "Usage:./ExtractImgs.sh target NumOfOutput"
	exit
fi
BaseTime='1970-10-01 UTC'
Duration=`ffprobe "$1" 2>&1 | grep -e 'Duration' | cut -c 13-20`

DuraSec=$((`date -d "$BaseTime $Duration" +%s`-`date -d "$BaseTime" +%s`))
for ((i=0; i<$2; ++i)) 
do
	RandomSec=$((RANDOM % DuraSec))
	RandomTime=`date -d "@$RandomSec" -u +%T`
	ffmpeg -ss $RandomTime -i "$1" -an -vcodec mjpeg -y "${1##*/}_$i.jpg" 2>/dev/null
	echo "Output ${1##*/}_$i.jpg Done." 
done
echo "Extract $2 Image From $1 is finished, now remove $1" 
rm "$1"