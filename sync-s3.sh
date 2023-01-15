#!/bin/bash -
#===============================================================================
#
#          FILE: sync-s3.sh
#
#         USAGE: ./sync-s3.sh
#
#   DESCRIPTION:
#
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: YOUR NAME (),
#  ORGANIZATION:
#       CREATED: 12/06/2017 18:56
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error

# buckets="diaa.me www.diaa.me"
# Now all requests to www.diaa.me are going to diaa.me
buckets="diaa.me"
for bucket in $buckets; do
    # aws --profile=diaa s3 sync . s3://$bucket --exclude=".git/*" --exclude=".tmp/*"
    aws --profile=diaa s3 sync ./blog/public/ s3://$bucket --exclude=".git/*" --exclude=".tmp/*"
done

