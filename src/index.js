import '@babel/polyfill'
import Options from './options'

const METHODS = [ 'upsertMany', 'upsert', 'q' ]

class Suggestions {
  constructor (node, options) {
    this.node = node
    this.options = new Options(options)

    METHODS.forEach((method) => {
      this[method] = options.key != null
        ? this[`_${method}`].bind(this, options.key) 
        : this[`_${method}`].bind(this)
    })
  }

  async _upsertMany (key, _suggestions) {
    const suggestions = _suggestions.map(({ token, rating, tokens, payload }) =>
      this.options.encrypt({
        token,
        rating,
        tokens: tokens == null ?
          new Array(token.length).fill().map((_, index) => token.substr(0, index + 1))
          : tokens,
        payload: typeof payload === 'object' 
          ? payload
          : {}
      })
    )

    return this.node.contracts.lambda(
      key, 
      this.options.contract, 
      this.options.lambdaUpsert, 
      { suggestions }
    )
  }

  async _upsert (key, token, rating, payload, tokens) {
    const [ result ] = await this._upsertMany(
      key,
      [ { token, rating, payload, tokens } ]
    )
    
    return result
  }

  async _q (key, token, limit) {
    const result = await this.node.contracts.lambda(
      key, 
      this.options.contract, 
      this.options.lambdaQ, 
      { 
        token: this.options.encryptString(token),  
        limit: limit || this.options.qLimit 
      }
    )

    return result.map(this.options.decrypt)
  }
}

export default Suggestions