function $(){}function F(t,e){for(const n in e)t[n]=e[n];return t}function M(t){return t()}function C(){return Object.create(null)}function g(t){t.forEach(M)}function D(t){return typeof t=="function"}function ut(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function I(t){return Object.keys(t).length===0}function R(t,...e){if(t==null)return $;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function ot(t,e,n){t.$$.on_destroy.push(R(e,n))}function lt(t,e,n,i){if(t){const r=L(t,e,n,i);return t[0](r)}}function L(t,e,n,i){return t[1]&&i?F(n.ctx.slice(),t[1](i(e))):n.ctx}function ft(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const l=[],c=Math.max(e.dirty.length,r.length);for(let o=0;o<c;o+=1)l[o]=e.dirty[o]|r[o];return l}return e.dirty|r}return e.dirty}function at(t,e,n,i,r,l){if(r){const c=L(e,n,i,l);t.p(c,r)}}function _t(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function dt(t,e,n){return t.set(n),e}let v=!1;function G(){v=!0}function J(){v=!1}function K(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function Q(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const s=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&s.push(a)}e=s}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let s=0;s<e.length;s++){const u=e[s].claim_order,a=(r>0&&e[n[r]].claim_order<=u?r+1:K(1,r,x=>e[n[x]].claim_order,u))-1;i[s]=n[a]+1;const f=a+1;n[f]=s,r=Math.max(f,r)}const l=[],c=[];let o=e.length-1;for(let s=n[r]+1;s!=0;s=i[s-1]){for(l.push(e[s-1]);o>=s;o--)c.push(e[o]);o--}for(;o>=0;o--)c.push(e[o]);l.reverse(),c.sort((s,u)=>s.claim_order-u.claim_order);for(let s=0,u=0;s<c.length;s++){for(;u<l.length&&c[s].claim_order>=l[u].claim_order;)u++;const a=u<l.length?l[u]:null;t.insertBefore(c[s],a)}}function W(t,e){if(v){for(Q(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function ht(t,e,n){v&&!n?W(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function U(t){t.parentNode&&t.parentNode.removeChild(t)}function mt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function V(t){return document.createElement(t)}function X(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function A(t){return document.createTextNode(t)}function pt(){return A(" ")}function yt(){return A("")}function gt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function xt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Y(t){return Array.from(t.childNodes)}function Z(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function O(t,e,n,i,r=!1){Z(t);const l=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const o=t[c];if(e(o)){const s=n(o);return s===void 0?t.splice(c,1):t[c]=s,r||(t.claim_info.last_index=c),o}}for(let c=t.claim_info.last_index-1;c>=0;c--){const o=t[c];if(e(o)){const s=n(o);return s===void 0?t.splice(c,1):t[c]=s,r?s===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,o}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function B(t,e,n,i){return O(t,r=>r.nodeName===e,r=>{const l=[];for(let c=0;c<r.attributes.length;c++){const o=r.attributes[c];n[o.name]||l.push(o.name)}l.forEach(c=>r.removeAttribute(c))},()=>i(e))}function bt(t,e,n){return B(t,e,n,V)}function $t(t,e,n){return B(t,e,n,X)}function tt(t,e){return O(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>A(e),!0)}function vt(t){return tt(t," ")}function wt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Et(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Nt(t,e,n){for(let i=0;i<t.options.length;i+=1){const r=t.options[i];if(r.__value===e){r.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function At(t){const e=t.querySelector(":checked");return e&&e.__value}function St(t,e,n){t.classList[n?"add":"remove"](e)}function jt(t,e){const n=[];let i=0;for(const r of e.childNodes)if(r.nodeType===8){const l=r.textContent.trim();l===`HEAD_${t}_END`?(i-=1,n.push(r)):l===`HEAD_${t}_START`&&(i+=1,n.push(r))}else i>0&&n.push(r);return n}function Ct(t,e){return new t(e)}let y;function p(t){y=t}function H(){if(!y)throw new Error("Function called outside component initialization");return y}function Tt(t){H().$$.on_mount.push(t)}function kt(t){H().$$.after_update.push(t)}const h=[],T=[];let m=[];const k=[],P=Promise.resolve();let E=!1;function q(){E||(E=!0,P.then(z))}function Mt(){return q(),P}function N(t){m.push(t)}const w=new Set;let d=0;function z(){if(d!==0)return;const t=y;do{try{for(;d<h.length;){const e=h[d];d++,p(e),et(e.$$)}}catch(e){throw h.length=0,d=0,e}for(p(null),h.length=0,d=0;T.length;)T.pop()();for(let e=0;e<m.length;e+=1){const n=m[e];w.has(n)||(w.add(n),n())}m.length=0}while(h.length);for(;k.length;)k.pop()();E=!1,w.clear(),p(t)}function et(t){if(t.fragment!==null){t.update(),g(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(N)}}function nt(t){const e=[],n=[];m.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),m=e}const b=new Set;let _;function Dt(){_={r:0,c:[],p:_}}function Lt(){_.r||g(_.c),_=_.p}function it(t,e){t&&t.i&&(b.delete(t),t.i(e))}function Ot(t,e,n,i){if(t&&t.o){if(b.has(t))return;b.add(t),_.c.push(()=>{b.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function Bt(t){t&&t.c()}function Ht(t,e){t&&t.l(e)}function rt(t,e,n,i){const{fragment:r,after_update:l}=t.$$;r&&r.m(e,n),i||N(()=>{const c=t.$$.on_mount.map(M).filter(D);t.$$.on_destroy?t.$$.on_destroy.push(...c):g(c),t.$$.on_mount=[]}),l.forEach(N)}function ct(t,e){const n=t.$$;n.fragment!==null&&(nt(n.after_update),g(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function st(t,e){t.$$.dirty[0]===-1&&(h.push(t),q(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Pt(t,e,n,i,r,l,c,o=[-1]){const s=y;p(t);const u=t.$$={fragment:null,ctx:[],props:l,update:$,not_equal:r,bound:C(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(s?s.$$.context:[])),callbacks:C(),dirty:o,skip_bound:!1,root:e.target||s.$$.root};c&&c(u.root);let a=!1;if(u.ctx=n?n(t,e.props||{},(f,x,...S)=>{const j=S.length?S[0]:x;return u.ctx&&r(u.ctx[f],u.ctx[f]=j)&&(!u.skip_bound&&u.bound[f]&&u.bound[f](j),a&&st(t,f)),x}):[],u.update(),a=!0,g(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){G();const f=Y(e.target);u.fragment&&u.fragment.l(f),f.forEach(U)}else u.fragment&&u.fragment.c();e.intro&&it(t.$$.fragment),rt(t,e.target,e.anchor,e.customElement),J(),z()}p(s)}class qt{$destroy(){ct(this,1),this.$destroy=$}$on(e,n){if(!D(n))return $;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!I(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{rt as A,ct as B,X as C,$t as D,St as E,W as F,$ as G,ot as H,lt as I,at as J,_t as K,ft as L,N as M,Nt as N,gt as O,mt as P,At as Q,jt as R,qt as S,dt as T,pt as a,ht as b,vt as c,Ot as d,yt as e,Lt as f,it as g,U as h,Pt as i,kt as j,V as k,bt as l,Y as m,xt as n,Tt as o,Et as p,A as q,tt as r,ut as s,Mt as t,wt as u,Dt as v,T as w,Ct as x,Bt as y,Ht as z};