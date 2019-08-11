import clone from 'ramda/src/clone'

const DEFAULT_OPTIONS = {
  length: 32,
  prefix: '__EMPTY_SUGGESTION__:'
}

const encryption = (options, encrypt, decrypt) => {
  const result = options || { }
  result.encryptString = encrypt
  result.decryptString = decrypt

  const encryptionOptions = options.encryption || {}
  Object.keys(DEFAULT_OPTIONS).forEach((key) => { 
    encryptionOptions[key] = encryptionOptions[key] || DEFAULT_OPTIONS[key] 
  })

  const safeDecrypt = (suggestion, errorKey, value) => {
    try {
      if (typeof value === 'object') {
        return JSON.parse(decrypt(value.encrypted))
      }

      return decrypt(value)
    } catch (e) {
      suggestion.error = suggestion.error || {}
      suggestion.error[errorKey] = suggestion.error[errorKey] || []
      suggestion.error[errorKey].push(e)
    }
  }

  result.encrypt = (suggestion) => {
    const resultItem = clone(suggestion)
    
    while (resultItem.tokens.length < encryptionOptions.length) {
      resultItem.tokens.push(`${encryptionOptions.prefix}:${resultItem.tokens.length}`)
    }

    resultItem.token = encrypt(resultItem.token)
    resultItem.tokens = resultItem.tokens.map(encrypt).filter((i) => 
      i.substr(0, encryptionOptions.prefix.length) !== encryptionOptions.prefix
    )
    resultItem.payload = { encrypted: encrypt(JSON.stringify(resultItem.payload)) }

    return resultItem
  }

  result.decrypt = (suggestion) => {
    const resultItem = clone(suggestion)
    
    resultItem.token = safeDecrypt(suggestion, 'token', resultItem.token)
    resultItem.payload = safeDecrypt(suggestion, 'payload', resultItem.payload)
    if (Array.isArray(resultItem.tokens)) {
      resultItem.tokens = resultItem.tokens.map(safeDecrypt.bind(suggestion, 'tokens'))
    }
    
    return resultItem
  }

  return result
}

export default encryption