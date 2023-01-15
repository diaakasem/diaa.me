# Zola

## Description

Started using Zola Static Site Generator (SSG) to be able to have a blog,
where I write markdown files and it generates HTML.

### To Develop locally

From within `./blog/` dirextory execute:

```sh

zola serve

```

### To Build

```bash

zola build

```

### To Deploy

From git root directory `gr`, execute the following script to sync to S3

```bash

./sync-s3.sh

```
