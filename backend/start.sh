#!/bin/bash

url=http://localhost:9200

while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' $url)" != "200" ]];
 do
   echo "Elastic is unavailable, sleeping ZzZ..."
   sleep 1;
 done

yarn run start
