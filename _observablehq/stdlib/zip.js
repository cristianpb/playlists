import{AbstractFile as s}from"../stdlib.js";import n from"https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm";class t{constructor(r){Object.defineProperty(this,"_",{value:r}),this.filenames=Object.keys(r.files).filter(e=>!r.files[e].dir)}static async from(r){return new t(await n.loadAsync(r))}file(r){const e=this._.file(r=`${r}`);if(!e||e.dir)throw new Error(`file not found: ${r}`);return new i(e)}}class i extends s{constructor(r){super(r.name),Object.defineProperty(this,"_",{value:r}),Object.defineProperty(this,"_url",{writable:!0})}async url(){return this._url||(this._url=this.blob().then(URL.createObjectURL))}async blob(){return this._.async("blob")}async arrayBuffer(){return this._.async("arraybuffer")}async text(){return this._.async("text")}async json(){return JSON.parse(await this.text())}}export{t as ZipArchive};