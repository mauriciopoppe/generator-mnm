#!/usr/bin/env node
'use strict'

import yargs from 'yargs'

import <%= camelName %> from './'

yargs
  .usage('Usage: $0 awesome')
  .demand(1)

<%= camelName %>(yargs.argv)

