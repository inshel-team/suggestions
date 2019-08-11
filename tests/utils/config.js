import fs from 'fs'
import path from 'path'

const KEY_PATH = path.join(process.cwd(), 'environment', 'key')

const readFileSync = (fileName, fn = (i) => i) => {
  try {
    return fn(fs.readFileSync(fileName, { encoding: 'UTF-8' }).toString())
  } catch (e) {
    throw new Error(`Can't read file ${fileName}`)
  }
}

const createConfig = () => {
  return { key: readFileSync(KEY_PATH) }
}

export default createConfig
