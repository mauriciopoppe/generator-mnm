'use strict'

import test from 'tape'

import <%= safeSlugname %> from '../src/'

test('awesome:test', t => {
  const message = 'everything is awesome'
  t.equals(<%= safeSlugname %>('awesome'), message, message)
  t.end()
})
