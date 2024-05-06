import fs from 'fs/promises'
import readline from 'readline/promises';

import SD_API from './SD_API.mjs'

const argv = process.execArgv.join()
//checks if running in debug
const isDebug = (argv.includes('inspect') || argv.includes('debug')) && (console.log('\n--inspect detected\n'), true)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let ip = await rl.question('what is the IP:PORT of you SD instance (default:127.0.0.1:7860): ')
const api = await SD_API('http://'+ip, {
  dev:isDebug 
})

if (isDebug) {
  console.log(`\nconst api = await SD_API('http://${ip}')\n\nyou are running with --inspect, connect a debugger and check out: \n\n > api.search('endpoint query')\n > api.describe(endpoint)\n > endpoint.rawJSON\n`)
  Object.assign(global, {api, SD_API, fs})
  process.stdin.resume()
}

while (!isDebug) {
  let prompt = await rl.question('what would you like to generate (default: waifu): ') || 'waifu'
  let response = await api['/sdapi/v1/txt2img'].POST({prompt, steps: 20})

  const image = response.images[0]

  const filename = `${Date.now()}${'.png'}`
  const filedata = Buffer.from(image, 'base64')

  await fs.writeFile(filename, filedata)
  console.log(`File saved as ${filename}\n`)
}
