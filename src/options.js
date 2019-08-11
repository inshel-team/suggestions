const DEFAULT_OPTIONS = {
  contract: 13,
  lambdaUpsert: 'upsert',
  lambdaQ: 'q',
  qLimit: 5,
  encrypt: (i) => i,
  decrypt: (i) => i,
  encryptString: (i) => i,
  decryptString: (i) => i
}

class Options {
  constructor (options = {}) {
    Object.keys(DEFAULT_OPTIONS).forEach((key) => { 
      this[key] = options[key] || DEFAULT_OPTIONS[key] 
    })
  }
}

export default Options