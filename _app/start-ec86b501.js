var it=Object.defineProperty,at=Object.defineProperties;var ot=Object.getOwnPropertyDescriptors;var I=Object.getOwnPropertySymbols;var J=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var W=(n,t,e)=>t in n?it(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,R=(n,t)=>{for(var e in t||(t={}))J.call(t,e)&&W(n,e,t[e]);if(I)for(var e of I(t))G.call(t,e)&&W(n,e,t[e]);return n},X=(n,t)=>at(n,ot(t));var x=(n,t)=>{var e={};for(var s in n)J.call(n,s)&&t.indexOf(s)<0&&(e[s]=n[s]);if(n!=null&&I)for(var s of I(n))t.indexOf(s)<0&&G.call(n,s)&&(e[s]=n[s]);return e};import{S as lt,i as ct,s as ut,e as ft,c as ht,a as dt,d as E,b as P,f as $,t as _t,g as pt,h as gt,j as L,k as mt,l as y,m as D,n as wt,o as U,p as M,q as H,r as j,u as v,v as A,w as N,x as m,y as bt,z as yt,A as vt,B,C as K}from"./chunks/vendor-4a72e481.js";import{_ as Y}from"./chunks/preload-helper-90fecdef.js";function F(n){let t,e,s;const r=[n[2]||{}];var a=n[0][1];function i(o){let l={$$slots:{default:[Et]},$$scope:{ctx:o}};for(let c=0;c<r.length;c+=1)l=B(l,r[c]);return{props:l}}return a&&(t=new a(i(n))),{c(){t&&L(t.$$.fragment),e=y()},l(o){t&&D(t.$$.fragment,o),e=y()},m(o,l){t&&U(t,o,l),$(o,e,l),s=!0},p(o,l){const c=l&4?M(r,[H(o[2]||{})]):{};if(l&521&&(c.$$scope={dirty:l,ctx:o}),a!==(a=o[0][1])){if(t){j();const u=t;v(u.$$.fragment,1,0,()=>{A(u,1)}),N()}a?(t=new a(i(o)),L(t.$$.fragment),m(t.$$.fragment,1),U(t,e.parentNode,e)):t=null}else a&&t.$set(c)},i(o){s||(t&&m(t.$$.fragment,o),s=!0)},o(o){t&&v(t.$$.fragment,o),s=!1},d(o){o&&E(e),t&&A(t,o)}}}function Q(n){let t,e,s;const r=[n[3]||{}];var a=n[0][2];function i(o){let l={};for(let c=0;c<r.length;c+=1)l=B(l,r[c]);return{props:l}}return a&&(t=new a(i())),{c(){t&&L(t.$$.fragment),e=y()},l(o){t&&D(t.$$.fragment,o),e=y()},m(o,l){t&&U(t,o,l),$(o,e,l),s=!0},p(o,l){const c=l&8?M(r,[H(o[3]||{})]):{};if(a!==(a=o[0][2])){if(t){j();const u=t;v(u.$$.fragment,1,0,()=>{A(u,1)}),N()}a?(t=new a(i()),L(t.$$.fragment),m(t.$$.fragment,1),U(t,e.parentNode,e)):t=null}else a&&t.$set(c)},i(o){s||(t&&m(t.$$.fragment,o),s=!0)},o(o){t&&v(t.$$.fragment,o),s=!1},d(o){o&&E(e),t&&A(t,o)}}}function Et(n){let t,e,s=n[0][2]&&Q(n);return{c(){s&&s.c(),t=y()},l(r){s&&s.l(r),t=y()},m(r,a){s&&s.m(r,a),$(r,t,a),e=!0},p(r,a){r[0][2]?s?(s.p(r,a),a&1&&m(s,1)):(s=Q(r),s.c(),m(s,1),s.m(t.parentNode,t)):s&&(j(),v(s,1,1,()=>{s=null}),N())},i(r){e||(m(s),e=!0)},o(r){v(s),e=!1},d(r){s&&s.d(r),r&&E(t)}}}function kt(n){let t,e,s=n[0][1]&&F(n);return{c(){s&&s.c(),t=y()},l(r){s&&s.l(r),t=y()},m(r,a){s&&s.m(r,a),$(r,t,a),e=!0},p(r,a){r[0][1]?s?(s.p(r,a),a&1&&m(s,1)):(s=F(r),s.c(),m(s,1),s.m(t.parentNode,t)):s&&(j(),v(s,1,1,()=>{s=null}),N())},i(r){e||(m(s),e=!0)},o(r){v(s),e=!1},d(r){s&&s.d(r),r&&E(t)}}}function Z(n){let t,e=n[5]&&tt(n);return{c(){t=ft("div"),e&&e.c(),this.h()},l(s){t=ht(s,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,class:!0});var r=dt(t);e&&e.l(r),r.forEach(E),this.h()},h(){P(t,"id","svelte-announcer"),P(t,"aria-live","assertive"),P(t,"aria-atomic","true"),P(t,"class","svelte-1j55zn5")},m(s,r){$(s,t,r),e&&e.m(t,null)},p(s,r){s[5]?e?e.p(s,r):(e=tt(s),e.c(),e.m(t,null)):e&&(e.d(1),e=null)},d(s){s&&E(t),e&&e.d()}}}function tt(n){let t;return{c(){t=_t(n[6])},l(e){t=pt(e,n[6])},m(e,s){$(e,t,s)},p(e,s){s&64&&gt(t,e[6])},d(e){e&&E(t)}}}function Rt(n){let t,e,s,r;const a=[n[1]||{}];var i=n[0][0];function o(c){let u={$$slots:{default:[kt]},$$scope:{ctx:c}};for(let h=0;h<a.length;h+=1)u=B(u,a[h]);return{props:u}}i&&(t=new i(o(n)));let l=n[4]&&Z(n);return{c(){t&&L(t.$$.fragment),e=mt(),l&&l.c(),s=y()},l(c){t&&D(t.$$.fragment,c),e=wt(c),l&&l.l(c),s=y()},m(c,u){t&&U(t,c,u),$(c,e,u),l&&l.m(c,u),$(c,s,u),r=!0},p(c,[u]){const h=u&2?M(a,[H(c[1]||{})]):{};if(u&525&&(h.$$scope={dirty:u,ctx:c}),i!==(i=c[0][0])){if(t){j();const f=t;v(f.$$.fragment,1,0,()=>{A(f,1)}),N()}i?(t=new i(o(c)),L(t.$$.fragment),m(t.$$.fragment,1),U(t,e.parentNode,e)):t=null}else i&&t.$set(h);c[4]?l?l.p(c,u):(l=Z(c),l.c(),l.m(s.parentNode,s)):l&&(l.d(1),l=null)},i(c){r||(t&&m(t.$$.fragment,c),r=!0)},o(c){t&&v(t.$$.fragment,c),r=!1},d(c){t&&A(t,c),c&&E(e),l&&l.d(c),c&&E(s)}}}function $t(n,t,e){let{stores:s}=t,{page:r}=t,{components:a}=t,{props_0:i=null}=t,{props_1:o=null}=t,{props_2:l=null}=t;bt("__svelte__",s),yt(s.page.notify);let c=!1,u=!1,h=null;return vt(()=>{const f=s.page.subscribe(()=>{c&&(e(5,u=!0),e(6,h=document.title||"untitled page"))});return e(4,c=!0),f}),n.$$set=f=>{"stores"in f&&e(7,s=f.stores),"page"in f&&e(8,r=f.page),"components"in f&&e(0,a=f.components),"props_0"in f&&e(1,i=f.props_0),"props_1"in f&&e(2,o=f.props_1),"props_2"in f&&e(3,l=f.props_2)},n.$$.update=()=>{n.$$.dirty&384&&s.page.set(r)},[a,i,o,l,c,u,h,s,r]}class St extends lt{constructor(t){super();ct(this,t,$t,Rt,ut,{stores:7,page:8,components:0,props_0:1,props_1:2,props_2:3})}}const T=[()=>Y(()=>import("./pages/__layout.svelte-22d7cc63.js"),["pages/__layout.svelte-22d7cc63.js","assets/pages/__layout.svelte-7e82d8ec.css","chunks/vendor-4a72e481.js"]),()=>Y(()=>import("./error.svelte-d4898ba4.js"),["error.svelte-d4898ba4.js","chunks/vendor-4a72e481.js"]),()=>Y(()=>import("./pages/index.svelte-8fb9661a.js"),["pages/index.svelte-8fb9661a.js","assets/pages/index.svelte-8a61dfbc.css","chunks/vendor-4a72e481.js","chunks/preload-helper-90fecdef.js"])],qt=[[/^\/$/,[T[0],T[2]],[T[1]]]],Lt=[T[0](),T[1]()];function Ut(n){let t=n.baseURI;if(!t){const e=n.getElementsByTagName("base");t=e.length?e[0].href:n.URL}return t}let et="";function At(n){et=n.base,n.assets}function z(){return{x:pageXOffset,y:pageYOffset}}function st(n){return n.composedPath().find(e=>e instanceof Node&&e.nodeName.toUpperCase()==="A")}function rt(n){return n instanceof SVGAElement?new URL(n.href.baseVal,document.baseURI):new URL(n.href)}class Ot{constructor({base:t,routes:e,trailing_slash:s,renderer:r}){this.base=t,this.routes=e,this.trailing_slash=s,this.navigating=0,this.renderer=r,r.router=this,this.enabled=!0,document.body.setAttribute("tabindex","-1"),history.replaceState(history.state||{},"",location.href)}init_listeners(){"scrollRestoration"in history&&(history.scrollRestoration="manual"),addEventListener("beforeunload",()=>{history.scrollRestoration="auto"}),addEventListener("load",()=>{history.scrollRestoration="manual"});let t;addEventListener("scroll",()=>{clearTimeout(t),t=setTimeout(()=>{const a=X(R({},history.state||{}),{"sveltekit:scroll":z()});history.replaceState(a,document.title,window.location.href)},200)});const e=a=>{const i=st(a);i&&i.href&&i.hasAttribute("sveltekit:prefetch")&&this.prefetch(rt(i))};let s;const r=a=>{clearTimeout(s),s=setTimeout(()=>{e(a)},20)};addEventListener("touchstart",e),addEventListener("mousemove",r),addEventListener("click",a=>{if(!this.enabled||a.button||a.which!==1||a.metaKey||a.ctrlKey||a.shiftKey||a.altKey||a.defaultPrevented)return;const i=st(a);if(!i||!i.href)return;const o=rt(i),l=o.toString();if(l===location.href){location.hash||a.preventDefault();return}const c=(i.getAttribute("rel")||"").split(/\s+/);if(i.hasAttribute("download")||c&&c.includes("external")||(i instanceof SVGAElement?i.target.baseVal:i.target)||!this.owns(o))return;const u=i.hasAttribute("sveltekit:noscroll"),h=l.indexOf("#"),f=location.href.indexOf("#"),b=h>=0?l.substring(0,h):l,p=f>=0?location.href.substring(0,f):location.href;history.pushState({},"",o.href),b===p&&window.dispatchEvent(new HashChangeEvent("hashchange")),this._navigate(o,u?z():null,!1,[],o.hash),a.preventDefault()}),addEventListener("popstate",a=>{if(a.state&&this.enabled){const i=new URL(location.href);this._navigate(i,a.state["sveltekit:scroll"],!1,[])}})}owns(t){return t.origin===location.origin&&t.pathname.startsWith(this.base)}parse(t){if(this.owns(t)){const e=t.pathname.slice(this.base.length)||"/",s=decodeURI(e),r=this.routes.filter(([o])=>o.test(s)),a=new URLSearchParams(t.search);return{id:`${e}?${a}`,routes:r,path:e,decoded_path:s,query:a}}}async goto(t,{noscroll:e=!1,replaceState:s=!1,keepfocus:r=!1,state:a={}}={},i){const o=new URL(t,Ut(document));return this.enabled&&this.owns(o)?(history[s?"replaceState":"pushState"](a,"",t),this._navigate(o,e?z():null,r,i,o.hash)):(location.href=o.href,new Promise(()=>{}))}enable(){this.enabled=!0}disable(){this.enabled=!1}async prefetch(t){const e=this.parse(t);if(!e)throw new Error("Attempted to prefetch a URL that does not belong to this app");return this.renderer.load(e)}async _navigate(t,e,s,r,a){const i=this.parse(t);if(!i)throw new Error("Attempted to navigate to a URL that does not belong to this app");if(this.navigating||dispatchEvent(new CustomEvent("sveltekit:navigation-start")),this.navigating++,i.path!=="/"){const o=i.path.endsWith("/");(o&&this.trailing_slash==="never"||!o&&this.trailing_slash==="always"&&!(i.path.split("/").pop()||"").includes("."))&&(i.path=o?i.path.slice(0,-1):i.path+"/",history.replaceState({},"",`${this.base}${i.path}${location.search}`))}await this.renderer.handle_navigation(i,r,!1,{hash:a,scroll:e,keepfocus:s}),this.navigating--,this.navigating||dispatchEvent(new CustomEvent("sveltekit:navigation-end"))}}function nt(n){return n instanceof Error||n&&n.name&&n.message?n:new Error(JSON.stringify(n))}function jt(n){let t=5381,e=n.length;if(typeof n=="string")for(;e;)t=t*33^n.charCodeAt(--e);else for(;e;)t=t*33^n[--e];return(t>>>0).toString(36)}function Nt(n){const t=n.status&&n.status>=400&&n.status<=599&&!n.redirect;if(n.error||t){const e=n.status;if(!n.error&&t)return{status:e||500,error:new Error};const s=typeof n.error=="string"?new Error(n.error):n.error;return s instanceof Error?!e||e<400||e>599?(console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500'),{status:500,error:s}):{status:e,error:s}:{status:500,error:new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof s}"`)}}if(n.redirect){if(!n.status||Math.floor(n.status/100)!==3)return{status:500,error:new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')};if(typeof n.redirect!="string")return{status:500,error:new Error('"redirect" property returned from load() must be a string')}}if(n.context)throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');return n}function Tt(n){const t=K(n);let e=!0;function s(){e=!0,t.update(i=>i)}function r(i){e=!1,t.set(i)}function a(i){let o;return t.subscribe(l=>{(o===void 0||e&&l!==o)&&i(o=l)})}return{notify:s,set:r,subscribe:a}}function Ct(n,t){const e=typeof n=="string"?n:n.url;let s=`script[data-type="svelte-data"][data-url=${JSON.stringify(e)}]`;t&&typeof t.body=="string"&&(s+=`[data-body="${jt(t.body)}"]`);const r=document.querySelector(s);if(r&&r.textContent){const a=JSON.parse(r.textContent),{body:i}=a,o=x(a,["body"]);return Promise.resolve(new Response(i,o))}return fetch(n,t)}class It{constructor({Root:t,fallback:e,target:s,session:r,host:a}){this.Root=t,this.fallback=e,this.host=a,this.router,this.target=s,this.started=!1,this.session_id=1,this.invalid=new Set,this.invalidating=null,this.current={page:null,session_id:0,branch:[]},this.cache=new Map,this.loading={id:null,promise:null},this.stores={page:Tt({}),navigating:K(null),session:K(r)},this.$session=null,this.root=null;let i=!1;this.stores.session.subscribe(async o=>{if(this.$session=o,!i||!this.router)return;this.session_id+=1;const l=this.router.parse(new URL(location.href));l&&this.update(l,[],!0)}),i=!0}async start({status:t,error:e,nodes:s,page:r}){const a=[];let i={},o,l;try{for(let c=0;c<s.length;c+=1){const u=c===s.length-1,h=await this._load_node({module:await s[c],page:r,stuff:i,status:u?t:void 0,error:u?e:void 0});if(a.push(h),h&&h.loaded)if(h.loaded.error){if(e)throw h.loaded.error;l={status:h.loaded.status,error:h.loaded.error,path:r.path,query:r.query}}else h.loaded.stuff&&(i=R(R({},i),h.loaded.stuff))}o=l?await this._load_error(l):await this._get_navigation_result_from_branch({page:r,branch:a})}catch(c){if(e)throw c;o=await this._load_error({status:500,error:nt(c),path:r.path,query:r.query})}if(o.redirect){location.href=new URL(o.redirect,location.href).href;return}this._init(o)}async handle_navigation(t,e,s,r){this.started&&this.stores.navigating.set({from:{path:this.current.page.path,query:this.current.page.query},to:{path:t.path,query:t.query}}),await this.update(t,e,s,r)}async update(t,e,s,r){var l;const a=this.token={};let i=await this._get_navigation_result(t,s);if(a!==this.token)return;if(this.invalid.clear(),i.redirect)if(e.length>10||e.includes(t.path))i=await this._load_error({status:500,error:new Error("Redirect loop"),path:t.path,query:t.query});else{this.router?this.router.goto(i.redirect,{replaceState:!0},[...e,t.path]):location.href=new URL(i.redirect,location.href).href;return}if(i.reload?location.reload():this.started?(this.current=i.state,this.root.$set(i.props),this.stores.navigating.set(null)):this._init(i),r){const{hash:c,scroll:u,keepfocus:h}=r;h||((l=getSelection())==null||l.removeAllRanges(),document.body.focus());const f=Math.round(pageYOffset),b=document.documentElement.scrollHeight-innerHeight;await 0;const p=Math.round(pageYOffset),k=document.documentElement.scrollHeight-innerHeight;if(p===Math.min(f,k)||b-f==k-p){const S=c&&document.getElementById(c.slice(1));u?scrollTo(u.x,u.y):S?S.scrollIntoView():scrollTo(0,0)}}else await 0;if(this.loading.promise=null,this.loading.id=null,!this.router)return;const o=i.state.branch[i.state.branch.length-1];o&&o.module.router===!1?this.router.disable():this.router.enable()}load(t){return this.loading.promise=this._get_navigation_result(t,!1),this.loading.id=t.id,this.loading.promise}invalidate(t){return this.invalid.add(t),this.invalidating||(this.invalidating=Promise.resolve().then(async()=>{const e=this.router&&this.router.parse(new URL(location.href));e&&await this.update(e,[],!0),this.invalidating=null})),this.invalidating}_init(t){this.current=t.state;const e=document.querySelector("style[data-svelte]");e&&e.remove(),this.root=new this.Root({target:this.target,props:R({stores:this.stores},t.props),hydrate:!0}),this.started=!0}async _get_navigation_result(t,e){if(this.loading.id===t.id&&this.loading.promise)return this.loading.promise;for(let s=0;s<t.routes.length;s+=1){const r=t.routes[s];let a=s+1;for(;a<t.routes.length;){const o=t.routes[a];if(o[0].toString()===r[0].toString())o[1].forEach(l=>l()),a+=1;else break}const i=await this._load({route:r,info:t},e);if(i)return i}return await this._load_error({status:404,error:new Error(`Not found: ${t.path}`),path:t.path,query:t.query})}async _get_navigation_result_from_branch({page:t,branch:e}){const s=e.filter(Boolean),r=s.find(l=>l.loaded&&l.loaded.redirect),a={redirect:r&&r.loaded?r.loaded.redirect:void 0,state:{page:t,branch:e,session_id:this.session_id},props:{components:s.map(l=>l.module.default)}};for(let l=0;l<s.length;l+=1){const c=s[l].loaded;a.props[`props_${l}`]=c?await c.props:null}(!this.current.page||t.path!==this.current.page.path||t.query.toString()!==this.current.page.query.toString())&&(a.props.page=t);const i=s[s.length-1],o=i.loaded&&i.loaded.maxage;if(o){const l=`${t.path}?${t.query}`;let c=!1;const u=()=>{this.cache.get(l)===a&&this.cache.delete(l),f(),clearTimeout(h)},h=setTimeout(u,o*1e3),f=this.stores.session.subscribe(()=>{c&&u()});c=!0,this.cache.set(l,a)}return a}async _load_node({status:t,error:e,module:s,page:r,stuff:a}){const i={module:s,uses:{params:new Set,path:!1,query:!1,session:!1,stuff:!1,dependencies:[]},loaded:null,stuff:a},o={};for(const c in r.params)Object.defineProperty(o,c,{get(){return i.uses.params.add(c),r.params[c]},enumerable:!0});const l=this.$session;if(s.load){const{started:c}=this,u={page:{host:r.host,params:o,get path(){return i.uses.path=!0,r.path},get query(){return i.uses.query=!0,r.query}},get session(){return i.uses.session=!0,l},get stuff(){return i.uses.stuff=!0,R({},a)},fetch(f,b){const p=typeof f=="string"?f:f.url,{href:k}=new URL(p,new URL(r.path,document.baseURI));return i.uses.dependencies.push(k),c?fetch(f,b):Ct(f,b)}};e&&(u.status=t,u.error=e);const h=await s.load.call(null,u);if(!h)return;i.loaded=Nt(h),i.loaded.stuff&&(i.stuff=i.loaded.stuff)}return i}async _load({route:t,info:{path:e,decoded_path:s,query:r}},a){const i=`${s}?${r}`;if(!a){const d=this.cache.get(i);if(d)return d}const[o,l,c,u]=t,h=u?u(o.exec(s)):{},f=this.current.page&&{path:e!==this.current.page.path,params:Object.keys(h).filter(d=>this.current.page.params[d]!==h[d]),query:r.toString()!==this.current.page.query.toString(),session:this.session_id!==this.current.session_id},b={host:this.host,path:e,query:r,params:h};let p=[],k={},V=!1,S=200,O;l.forEach(d=>d());t:for(let d=0;d<l.length;d+=1){let _;try{if(!l[d])continue;const w=await l[d](),g=this.current.branch[d];if(!g||w!==g.module||f.path&&g.uses.path||f.params.some(q=>g.uses.params.has(q))||f.query&&g.uses.query||f.session&&g.uses.session||g.uses.dependencies.some(q=>this.invalid.has(q))||V&&g.uses.stuff){_=await this._load_node({module:w,page:b,stuff:k});const q=d===l.length-1;if(_&&_.loaded){if(_.loaded.error&&(S=_.loaded.status,O=_.loaded.error),_.loaded.redirect)return{redirect:_.loaded.redirect,props:{},state:this.current};_.loaded.stuff&&(V=!0)}else if(q&&w.load)return}else _=g}catch(w){S=500,O=nt(w)}if(O){for(;d--;)if(c[d]){let w,g,C=d;for(;!(g=p[C]);)C-=1;try{if(w=await this._load_node({status:S,error:O,module:await c[d](),page:b,stuff:g.stuff}),w&&w.loaded&&w.loaded.error)continue;p=p.slice(0,C+1).concat(w);break t}catch{continue}}return await this._load_error({status:S,error:O,path:e,query:r})}else _&&_.loaded&&_.loaded.stuff&&(k=R(R({},k),_.loaded.stuff)),p.push(_)}return await this._get_navigation_result_from_branch({page:b,branch:p})}async _load_error({status:t,error:e,path:s,query:r}){const a={host:this.host,path:s,query:r,params:{}},i=await this._load_node({module:await this.fallback[0],page:a,stuff:{}}),o=[i,await this._load_node({status:t,error:e,module:await this.fallback[1],page:a,stuff:i&&i.loaded&&i.loaded.stuff||{}})];return await this._get_navigation_result_from_branch({page:a,branch:o})}}async function Mt({paths:n,target:t,session:e,host:s,route:r,spa:a,trailing_slash:i,hydrate:o}){const l=new It({Root:St,fallback:Lt,target:t,session:e,host:s}),c=r?new Ot({base:n.base,routes:qt,trailing_slash:i,renderer:l}):null;At(n),o&&await l.start(o),c&&(a&&c.goto(location.href,{replaceState:!0},[]),c.init_listeners()),dispatchEvent(new CustomEvent("sveltekit:start"))}export{Mt as start};
