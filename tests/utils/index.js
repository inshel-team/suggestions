import Node from '@inshel/node'
import JSEncrypt from 'node-jsencrypt'

class Utils {
  constructor () {
    this.nodes = []
  }

  invite = async (config) => {
    const encryptkey = new JSEncrypt()
    encryptkey.setPrivateKey(config.key)

    const client = this.createNode()
    await client.connect()

    const { key, invites } = await client.keys.approve(encryptkey)
    if (invites < 1000) {
      throw new Error(`Not enough invites: (key:${key})`)
    }

    return client.invites.create(key)
  }

  newKey = async (config) => {
    const newKey = new JSEncrypt()

    const invite = await this.invite(config)
    const client = this.createNode()
    await client.connect()
    await client.keys.create(invite, newKey)

    return newKey
  }

  createNode = () => {
    const node = new Node()
    this.nodes.push(node)

    return node
  }

  create = async (config) => {
    const newKey = await this.newKey(config)
    const node = this.createNode()
    await node.connect()
    
    const { key } = await node.keys.approve(newKey)
    
    this.nodes.push(node)

    return { node, key }
  }

  disconnectAll = async () => {
    while (this.nodes.length > 0) {
      const node = this.nodes.shift()
      if (node.status !== Node.STATUSES.CONNECTED) {
        continue
      }

      await node.disconnect()
    }
  }
}

export default new Utils()
