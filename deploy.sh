#!/bin/bash

# exit with non-zero exit code on failure
set -e

# Taken from https://medium.com/philosophy-logic/publishing-gh-pages-with-travis-ci-53a8270e87db

cd test/ci/.tmp
git config user.name "Travis CI"
git add .
git commit -m "[travis build #$TRAVIS_JOB_NUMBER] Automatic deploy from https://travis-ci.org/maurizzzio/generator-mnm"
git push --force "https://${GH_TOKEN}@${GH_REF}" master > /dev/null 2>&1

