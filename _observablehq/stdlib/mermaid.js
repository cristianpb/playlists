import r from"https://cdn.jsdelivr.net/npm/mermaid@11.2.0/+esm";let t=0;const a=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"neutral";r.initialize({startOnLoad:!1,securityLevel:"loose",theme:a});async function i(){const e=document.createElement("div");return e.innerHTML=(await r.render(`mermaid-${++t}`,String.raw.apply(String,arguments))).svg,e.removeChild(e.firstChild)}export{i as default};
