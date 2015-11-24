import <%= safeSlugname %> from '../src/'
import test from 'tape'

test('awesome:test', t => {
  const message = 'everything is awesome'
  t.equals(<%= safeSlugname %>('awesome'), message, message)
  t.end()
})
