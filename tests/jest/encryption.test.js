import '@babel/polyfill'
import aes from 'aes-js'

import suggestionsEncryption from '../../src/encryption'
import Suggestions from '../../src'
import testUtils from '../utils'
import Config from '../utils/config'

const config = new Config()

const encrypt = (value) => {
  const aesCtr = new aes.ModeOfOperation.ctr(
    [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
    new aes.Counter(5)
  )

  return aes.utils.hex.fromBytes(
    aesCtr.encrypt(
      aes.utils.utf8.toBytes(value)
    )
  )
}

const decrypt = (value) => {
  const aesCtr = new aes.ModeOfOperation.ctr(
    [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
    new aes.Counter(5)
  )

  return aes.utils.utf8.fromBytes(
    aesCtr.decrypt(
      aes.utils.hex.toBytes(value)
    )
  )
}

afterEach(async () => {
  await testUtils.disconnectAll()
})

test('Upsert', async () => {
  const { node, key } = await testUtils.create(config)

  const encryptedSuggestions = new Suggestions(
    node, 
    suggestionsEncryption({ key }, encrypt, decrypt)
  )
  
  const cats = await encryptedSuggestions.upsert('CATS', 42, { isTest: true })
  const cat = await encryptedSuggestions.upsert('CAT', 40)
  
  const q = await encryptedSuggestions.q('CA')

  expect(cats).toStrictEqual({ id: cats.id, token: encrypt('CATS') })
  expect(cat).toStrictEqual({ id: cat.id, token: encrypt('CAT') })
  expect(q).toStrictEqual([ 
    { ...cats, token: 'CATS', payload: { isTest: true } }, 
    { ...cat, token: 'CAT', payload: { } }
  ])
})

test('UpsertMany', async () => {
  const { node, key } = await testUtils.create(config)

  const encryptedSuggestions = new Suggestions(
    node, 
    suggestionsEncryption({ key }, encrypt, decrypt)
  )
  
  const [ cats, cat ] = await encryptedSuggestions.upsertMany([
    { token: 'CATS', rating: 42, payload: { isTest: true } },
    { token: 'CAT', rating: 40, payload: { } }
  ])
  
  const q = await encryptedSuggestions.q('CA')

  expect(cats).toStrictEqual({ id: cats.id, token: encrypt('CATS') })
  expect(cat).toStrictEqual({ id: cat.id, token: encrypt('CAT') })
  expect(q).toStrictEqual([ 
    { ...cats, token: 'CATS', payload: { isTest: true } }, 
    { ...cat, token: 'CAT', payload: { } }
  ])
})