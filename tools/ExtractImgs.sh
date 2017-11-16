#! /bin/bash

BaseTime='1970-10-01 UTC'
Duration=`ffprobe $1 2>&1 | grep -e 'Duration' | cut -c 13-20`

DuraSec=$((`date -d "$BaseTime $Duration" +%s`-`date -d "$BaseTime" +%s`))
for i in {1..5}
do
	RandomSec=$((RANDOM % DuraSec))
	RandomTime=`date -d "@$RandomSec" -u +%T`
	ffmpeg -ss $RandomTime -i $1 -an -vcodec mjpeg -y output$i.jpg 2>/dev/null
	echo "Output outupt$i.jpg Done." 
done
# ffmpeg -ss $t -i $if -f image2 -y $of
