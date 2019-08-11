import '@babel/polyfill'

import Suggestions from '../../src'
import testUtils from '../utils'
import Config from '../utils/config'

const config = new Config()

afterEach(async () => {
  await testUtils.disconnectAll()
})

test('Upsert', async () => {
  const { node, key } = await testUtils.create(config)

  const suggestions = new Suggestions(node, { key })
  
  const cats = await suggestions.upsert('CATS', 42, { isTest: true })
  const cat = await suggestions.upsert('CAT', 40)
  
  const q = await suggestions.q('CA')

  expect(cats).toStrictEqual({ id: cats.id, token: 'CATS' })
  expect(cat).toStrictEqual({ id: cat.id, token: 'CAT' })
  expect(q).toStrictEqual([ 
    { ...cats, payload: { isTest: true } }, 
    { ...cat, payload: { } }
  ])
})

test('UpsertMany', async () => {
  const { node, key } = await testUtils.create(config)

  const suggestions = new Suggestions(node, { key })
  
  const [ cats, cat ] = await suggestions.upsertMany([
    { token: 'CATS', rating: 42, payload: { isTest: true } },
    { token: 'CAT', rating: 40, payload: { } }
  ])
  
  const q = await suggestions.q('CA')

  expect(cats).toStrictEqual({ id: cats.id, token: 'CATS' })
  expect(cat).toStrictEqual({ id: cat.id, token: 'CAT' })
  expect(q).toStrictEqual([ 
    { ...cats, payload: { isTest: true } }, 
    { ...cat, payload: { } }
  ])
})