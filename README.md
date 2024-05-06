# iso-auto1111-api
This is an auto1111 api wrapper that works the same in node and in the browser.

I generally think everyone else puts too much library in their libraries, so this is my attempt at not doing that (xkcd_standards_comic.png). In comparison with the 4 other libraries already on NPM wrapping this API, this one has far fewer features and lines of code, runs on both client/server, and has a much greater focus on REPL ergonomics (when instantiated with the `dev` flag). If you're looking for batteries included type libaries these have like 6-11 batteries each minimum:

- [stable-diffusion-api](https://www.npmjs.com/package/stable-diffusion-api)
- [node-sd-webui](https://www.npmjs.com/package/node-sd-webui)
- [stable-diffusion-webapi](https://www.npmjs.com/package/stable-diffusion-webapi)
- [stable-diffusion-client](https://www.npmjs.com/package/stable-diffusion-client)

This is now just a simple wrapper for [openapi-autowrapper](https://www.npmjs.com/package/openapi-autowrapper) because there was nothing auto1111 specific in this repo and I wanted to reuse the introspection/documentation code for my oobabooga api wrapper.

## Changelog

#### 1.0.0
endpoints no longer require or support `POST.call(...)` you can just use `POST(...)` directly

## Usage

Install with NPM or just clone this repo, you'll also need to have [auto1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui/) running somewhere with `--api` and probably also `--cors-allow-origins *` and `--listen` 
This uses `fetch()` so you'll also need an [18](https://nodejs.org/en/blog/announcements/v18-release-announce)+ copy of node.

You can try running the script for an interactive demo.
```bash
node node_example.mjs
```
or use `--inspect` in order to play with the library in the debug tools
```bash
node --inspect node_example.mjs
```
this has the benefit of having a nice pretty-printing self-docs introspection tool in the REPL

![image](https://user-images.githubusercontent.com/94414189/235275280-906ee9d4-4fde-4aea-b0a0-3ad3d1303173.png)

or you can use `http-server` or similar to serve up the frontend in `/client_example.html`, which also supports the above in the console. The github pages version (TODO) can also be used if your cors is setup properly.
```
npm install -g http-server
http-server

>> *open localhost:8080/client_example.html in your browser*
```
or you can code against the api in node
```js
import SD_API from '/SD_API.mjs'
let api = await SD_API() //SD_API() defaults to SD_API('http://localhost:7860')
let response = await api['/sdapi/v1/txt2img'].POST({prompt: 'an angel with a shotgun'}) //nightcore remix
///////
> response
> {
    images: ['iVBORw0KGgoAAAANSUhEUgA...'], // base64 encoded png by default, probably breaks if you generate jpgs?
    info: {prompt: 'an angel with a shotgun', all_prompts: Array(1), negative_prompt: '', all_negative_prompts: Array(1), seed: 1802462605, …},
    parameters: {enable_hr: false, denoising_strength: 0, firstphase_width: 0, firstphase_height: 0, hr_scale: 2, …}
}
```
or in the browser
```js
import SD_API from '/SD_API.mjs'

let api = await SD_API() //SD_API() defaults to SD_API('http://localhost:7860')
let waifu = await api['/sdapi/v1/txt2img'].POST({prompt: 'a purple witch'}) //ask for a waifu
let img = new Image()
img.src = `data:image/png;base64,${waifu.images[0]}`

document.body.appendChild(img);
```

## Additional Auto1111 API Documentation

For the most part you can get away with just introspecting on the schema using the command line tools, however, some things are a buit more complex and require actual documentation.

 - [generic how to an the auto1111 API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
 - [info about using controlnets via API](https://github.com/Mikubill/sd-webui-controlnet/wiki/API#integrating-sdapiv12img)


## Secret Bonus Features
Since this uses the API's self documentation capabilities it actually works (kinda) against other gradio tools, (i've tested a bit with oobabooga). Just point at the right IP and mess around.

## Caveats

 - untested
 - no support for auth
 - for the web example to work set `--cors-allow-origins *` when starting auto1111 and `--listen` if you want to access it on another computer.
