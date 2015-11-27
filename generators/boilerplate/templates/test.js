'use strict'

import <%= camelName %> from '<%= indexPath %>'
import test from 'tape'

test('awesome:test', t => {
  const message = 'everything is awesome'
  t.equals(<%= camelName %>('awesome'), message, message)
  t.end()
})

