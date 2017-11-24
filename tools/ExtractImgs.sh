#! /bin/bash
if [ ! $# -eq 2 ]; then
	echo "Usage:./ExtractImgs.sh target NumOfOutput"
	exit
fi
BaseTime='1970-10-01 UTC'
Duration=`ffprobe $1 2>&1 | grep -e 'Duration' | cut -c 13-20`

DuraSec=$((`date -d "$BaseTime $Duration" +%s`-`date -d "$BaseTime" +%s`))
for ((i=0; i<$2; ++i)) 
do
	RandomSec=$((RANDOM % DuraSec))
	RandomTime=`date -d "@$RandomSec" -u +%T`
	ffmpeg -ss $RandomTime -i $1 -an -vcodec mjpeg -y output2_$i.jpg 2>/dev/null
	echo "Output outupt$i.jpg Done." 
done
# ffmpeg -ss $t -i $if -f image2 -y $of
