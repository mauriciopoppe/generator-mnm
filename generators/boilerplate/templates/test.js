'use strict'

import <%= camelName %> from '../lib/'
import test from 'tape'

test('awesome:test', t => {
  const message = 'everything is awesome'
  t.equals(<%= camelName %>('awesome'), message, message)
  t.end()
})

