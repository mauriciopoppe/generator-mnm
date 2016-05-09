'use strict'

import <%= camelName %> from '<%= indexPath %>'
import test from 'ava'

test('awesome:test', t => {
  const message = 'everything is awesome'
  t.is(<%= camelName %>('awesome'), message, message)
})

