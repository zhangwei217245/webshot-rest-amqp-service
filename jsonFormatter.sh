#!/bin/sh

sed 's/;/;\n/g; s/\[/\n\[\n/g; s/]/\n]\n/g; s/{/\n{\n/g;s/}/\n}/g;s/,\"/,\n\"/g;s/\":/\" : /g' <&0 | awk 'BEGIN{a=0}{s=$0;if (index($0,"{")!=0){a++;for (i=0;i<a;i++){s="\t"s};}else if(index($0,"}")!=0){a--;for (i=0;i<=a;i++){s="\t"s}}else if (index($0,"[")!=0){a++;for (i=0;i<a;i++){s="\t"s};}else if(index($0,"]")!=0){a--;for (i=0;i<=a;i++){s="\t"s}}else{for (i=0;i<=a;i++){s="\t"s}};print NR"\t|"s}'
