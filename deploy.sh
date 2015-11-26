#!/bin/bash

# Basically from https://medium.com/philosophy-logic/publishing-gh-pages-with-travis-ci-53a8270e87db

cd test/.tmp
git config user.name "Mauricio Poppe"
git config user.email "mauricio.poppe@gmail.com"
git add .
git commit -m "Deploy to GitHub Pages"
git push --force "https://${GH_TOKEN}@${GH_REF}" master

