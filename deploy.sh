#!/bin/bash

# exit with non-zero exit code on failure
set -e

# Basically from https://medium.com/philosophy-logic/publishing-gh-pages-with-travis-ci-53a8270e87db

cd test/.tmp
git config user.name "Travis CI"
git config user.email "mauricio.poppe@gmail.com"
git add .
git commit -m "[maurizzzio/generator-mnm#$TRAVIS_JOB_ID] Auto-deploy from https://travis-ci.org/maurizzzio/generator-mnm"
git push --force "https://${GH_TOKEN}@${GH_REF}" master > /dev/null 2>&1

