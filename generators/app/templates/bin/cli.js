#!/usr/bin/env node
'use strict'
var argv = require('yargs').argv
var <%= safeSlugname %> = require('../lib/')

<%= safeSlugname %>['default'].apply(null, argv._)
