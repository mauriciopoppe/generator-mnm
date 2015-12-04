#!/usr/bin/env node
'use strict'

const yars = require('yargs')
const <%= camelName %>  = require('<%= indexPath %>')

yargs
  .usage('Usage: $0 [an argument]')
  .demand(1)

<%= camelName %>(yargs.argv)

