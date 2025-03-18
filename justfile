dev:
    zola serve

build:
    zola build

clean:
    rm -rf public

deploy:
    ./sync-s3.sh

release: build deploy
