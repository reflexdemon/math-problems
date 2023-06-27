#!/bin/bash

git pull

npm install

npm start

git add docs
git commit -m "Published new set of problems $(date)"

git push

echo "Done publish"