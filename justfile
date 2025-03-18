dev:
  pushd ./blog && zola serve

deploy:
  ./sync-s3.sh
