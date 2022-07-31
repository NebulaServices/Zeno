importScripts("/uv/uv.bundle.js"),importScripts("/uv/uv.config.js");class UVServiceWorker extends EventEmitter{constructor(a=__uv$config){super(),a.bare||(a.bare="/bare/"),this.addresses="string"==typeof a.bare?[new URL(a.bare,location)]:a.bare.map(a=>new URL(a,location)),this.headers={csp:["cross-origin-embedder-policy","cross-origin-opener-policy","cross-origin-resource-policy","content-security-policy","content-security-policy-report-only","expect-ct","feature-policy","origin-isolation","strict-transport-security","upgrade-insecure-requests","x-content-type-options","x-download-options","x-frame-options","x-permitted-cross-domain-policies","x-powered-by","x-xss-protection",],forward:["accept-encoding","connection","content-length",]},this.method={empty:["GET","HEAD"]},this.statusCode={empty:[204,304,]},this.config=a,this.browser=Ultraviolet.Bowser.getParser(self.navigator.userAgent).getBrowserName(),"Firefox"===this.browser&&(this.headers.forward.push("user-agent"),this.headers.forward.push("content-type"))}async fetch({request:d}){if(!d.url.startsWith(location.origin+(this.config.prefix||"/service/")))return fetch(d);try{let a=new Ultraviolet(this.config);"function"==typeof this.config.construct&&this.config.construct(a,"service");let i=await a.cookie.db();a.meta.origin=location.origin,a.meta.base=a.meta.url=new URL(a.sourceUrl(d.url));let c=new RequestContext(d,this,a,this.method.empty.includes(d.method.toUpperCase())?null:await d.blob());if("blob:"===a.meta.url.protocol&&(c.blob=!0,c.base=c.url=new URL(c.url.pathname)),d.referrer&&d.referrer.startsWith(location.origin)){let g=new URL(a.sourceUrl(d.referrer));(c.headers.origin||a.meta.url.origin!==g.origin&&"cors"===d.mode)&&(c.headers.origin=g.origin),c.headers.referer=g.href}let j=await a.cookie.getCookies(i)||[],k=a.cookie.serialize(j,a.meta,!1);"Firefox"!==this.browser||"iframe"===d.destination||"document"===d.destination||c.forward.shift(),k&&(c.headers.cookie=k),c.headers.Host=c.url.host;let h=new HookEvent(c,null,null);if(this.emit("request",h),h.intercepted)return h.returnValue;let f=await fetch(c.send);if(500===f.status)return Promise.reject("");let b=new ResponseContext(c,f,this),e=new HookEvent(b,null,null);if(this.emit("beforemod",e),e.intercepted)return e.returnValue;for(let l of this.headers.csp)b.headers[l]&&delete b.headers[l];if(b.headers.location&&(b.headers.location=a.rewriteUrl(b.headers.location)),b.headers["set-cookie"]&&(Promise.resolve(a.cookie.setCookies(b.headers["set-cookie"],i,a.meta)).then(()=>{self.clients.matchAll().then(function(b){b.forEach(function(b){b.postMessage({msg:"updateCookies",url:a.meta.url.href})})})}),delete b.headers["set-cookie"]),b.body)switch(d.destination){case"script":case"worker":b.body=`if (!self.__uv && self.importScripts) importScripts("${__uv$config.bundle}", "${__uv$config.config}", "${__uv$config.handler}");`,b.body+=a.js.rewrite(await f.text());break;case"style":b.body=a.rewriteCSS(await f.text());break;case"iframe":case"document":isHtml(a.meta.url,b.headers["content-type"]||"")&&(b.body=a.rewriteHtml(await f.text(),{document:!0,injectHead:a.createHtmlInject(this.config.handler,this.config.bundle,this.config.config,a.cookie.serialize(j,a.meta,!0),d.referrer)}))}if("text/event-stream"===c.headers.accept&&(b.headers["content-type"]="text/event-stream"),this.emit("response",e),e.intercepted)return e.returnValue;return new Response(b.body,{headers:b.headers,status:b.status,statusText:b.statusText})}catch(m){return new Response(m.toString(),{status:500})}}getBarerResponse(a){let b={},c=JSON.parse(a.headers.get("x-bare-headers"));for(let d in c)b[d.toLowerCase()]=c[d];return{headers:b,status:+a.headers.get("x-bare-status"),statusText:a.headers.get("x-bare-status-text"),body:this.statusCode.empty.includes(+a.headers.get("x-bare-status"))?null:a.body}}get address(){return this.addresses[Math.floor(Math.random()*this.addresses.length)]}static Ultraviolet=Ultraviolet}self.UVServiceWorker=UVServiceWorker;class ResponseContext{constructor(b,a,c){let{headers:d,status:e,statusText:f,body:g}=b.blob?{status:a.status,statusText:a.statusText,headers:Object.fromEntries([...a.headers.entries()]),body:a.body}:c.getBarerResponse(a);this.request=b,this.raw=a,this.ultraviolet=b.ultraviolet,this.headers=d,this.status=e,this.statusText=f,this.body=g}get url(){return this.request.url}get base(){return this.request.base}set base(a){this.request.base=a}}class RequestContext{constructor(a,b,c,d=null){this.ultraviolet=c,this.request=a,this.headers=Object.fromEntries([...a.headers.entries()]),this.method=a.method,this.forward=[...b.headers.forward],this.address=b.address,this.body=d||null,this.redirect=a.redirect,this.credentials="omit",this.mode="cors"===a.mode?a.mode:"same-origin",this.blob=!1}get send(){return new Request(this.blob?"blob:"+location.origin+this.url.pathname:this.address.href+"v1/",{method:this.method,headers:{"x-bare-protocol":this.url.protocol,"x-bare-host":this.url.hostname,"x-bare-path":this.url.pathname+this.url.search,"x-bare-port":this.url.port||("https:"===this.url.protocol?"443":"80"),"x-bare-headers":JSON.stringify(this.headers),"x-bare-forward-headers":JSON.stringify(this.forward)},redirect:this.redirect,credentials:this.credentials,mode:location.origin!==this.address.origin?"cors":this.mode,body:this.body})}get url(){return this.ultraviolet.meta.url}set url(a){this.ultraviolet.meta.url=a}get base(){return this.ultraviolet.meta.base}set base(a){this.ultraviolet.meta.base=a}}function isHtml(a,b=""){return"text/html"===(Ultraviolet.mime.contentType(b||a.pathname)||"text/html").split(";")[0]}class HookEvent{#a;#b;constructor(a={},b=null,c=null){this.#a=!1,this.#b=null,this.data=a,this.target=b,this.that=c}get intercepted(){return this.#a}get returnValue(){return this.#b}respondWith(a){this.#b=a,this.#a=!0}}var ReflectOwnKeys,R="object"==typeof Reflect?Reflect:null,ReflectApply=R&&"function"==typeof R.apply?R.apply:function(a,b,c){return Function.prototype.apply.call(a,b,c)};function ProcessEmitWarning(a){console&&console.warn&&console.warn(a)}ReflectOwnKeys=R&&"function"==typeof R.ownKeys?R.ownKeys:Object.getOwnPropertySymbols?function(a){return Object.getOwnPropertyNames(a).concat(Object.getOwnPropertySymbols(a))}:function(a){return Object.getOwnPropertyNames(a)};var NumberIsNaN=Number.isNaN||function(a){return a!=a};function EventEmitter(){EventEmitter.init.call(this)}EventEmitter.EventEmitter=EventEmitter,EventEmitter.prototype._events=void 0,EventEmitter.prototype._eventsCount=0,EventEmitter.prototype._maxListeners=void 0;var defaultMaxListeners=10;function checkListener(a){if("function"!=typeof a)throw new TypeError("The 'listener' argument must be of type Function. Received type "+typeof a)}function _getMaxListeners(a){return void 0===a._maxListeners?EventEmitter.defaultMaxListeners:a._maxListeners}function _addListener(a,c,b,e){if(checkListener(b),void 0===(h=a._events)?(h=a._events=Object.create(null),a._eventsCount=0):(void 0!==h.newListener&&(a.emit("newListener",c,b.listener?b.listener:b),h=a._events),f=h[c]),void 0===f)f=h[c]=b,++a._eventsCount;else if("function"==typeof f?f=h[c]=e?[b,f]:[f,b]:e?f.unshift(b):f.push(b),(g=_getMaxListeners(a))>0&&f.length>g&&!f.warned){f.warned=!0;var g,h,f,d=new Error("Possible EventEmitter memory leak detected. "+f.length+" "+String(c)+" listeners added. Use emitter.setMaxListeners() to increase limit");d.name="MaxListenersExceededWarning",d.emitter=a,d.type=c,d.count=f.length,ProcessEmitWarning(d)}return a}function onceWrapper(){if(!this.fired)return(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length)?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function _onceWrap(d,e,b){var c={fired:!1,wrapFn:void 0,target:d,type:e,listener:b},a=onceWrapper.bind(c);return a.listener=b,c.wrapFn=a,a}function _listeners(d,e,b){var c=d._events;if(void 0===c)return[];var a=c[e];return void 0===a?[]:"function"==typeof a?b?[a.listener||a]:[a]:b?unwrapListeners(a):arrayClone(a,a.length)}function listenerCount(c){var b=this._events;if(void 0!==b){var a=b[c];if("function"==typeof a)return 1;if(void 0!==a)return a.length}return 0}function arrayClone(d,b){for(var c=new Array(b),a=0;a<b;++a)c[a]=d[a];return c}function spliceOne(a,b){for(;b+1<a.length;b++)a[b]=a[b+1];a.pop()}function unwrapListeners(b){for(var c=new Array(b.length),a=0;a<c.length;++a)c[a]=b[a].listener||b[a];return c}function once(a,b){return new Promise(function(e,f){function c(c){a.removeListener(b,d),f(c)}function d(){"function"==typeof a.removeListener&&a.removeListener("error",c),e([].slice.call(arguments))}eventTargetAgnosticAddListener(a,b,d,{once:!0}),"error"!==b&&addErrorHandlerIfEventEmitter(a,c,{once:!0})})}function addErrorHandlerIfEventEmitter(a,b,c){"function"==typeof a.on&&eventTargetAgnosticAddListener(a,"error",b,c)}function eventTargetAgnosticAddListener(a,b,c,d){if("function"==typeof a.on)d.once?a.once(b,c):a.on(b,c);else if("function"==typeof a.addEventListener)a.addEventListener(b,function e(f){d.once&&a.removeEventListener(b,e),c(f)});else throw new TypeError("The 'emitter' argument must be of type EventEmitter. Received type "+typeof a)}Object.defineProperty(EventEmitter,"defaultMaxListeners",{enumerable:!0,get:function(){return defaultMaxListeners},set:function(a){if("number"!=typeof a||a<0||NumberIsNaN(a))throw new RangeError("The value of 'defaultMaxListeners' is out of range. It must be a non-negative number. Received "+a+".");defaultMaxListeners=a}}),EventEmitter.init=function(){(void 0===this._events||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},EventEmitter.prototype.setMaxListeners=function(a){if("number"!=typeof a||a<0||NumberIsNaN(a))throw new RangeError("The value of 'n' is out of range. It must be a non-negative number. Received "+a+".");return this._maxListeners=a,this},EventEmitter.prototype.getMaxListeners=function(){return _getMaxListeners(this)},EventEmitter.prototype.emit=function(g){for(var b=[],a=1;a<arguments.length;a++)b.push(arguments[a]);var d="error"===g,e=this._events;if(void 0!==e)d=d&& void 0===e.error;else if(!d)return!1;if(d){if(b.length>0&&(f=b[0]),f instanceof Error)throw f;var f,h=new Error("Unhandled error."+(f?" ("+f.message+")":""));throw h.context=f,h}var c=e[g];if(void 0===c)return!1;if("function"==typeof c)ReflectApply(c,this,b);else for(var i=c.length,j=arrayClone(c,i),a=0;a<i;++a)ReflectApply(j[a],this,b);return!0},EventEmitter.prototype.addListener=function(a,b){return _addListener(this,a,b,!1)},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.prependListener=function(a,b){return _addListener(this,a,b,!0)},EventEmitter.prototype.once=function(a,b){return checkListener(b),this.on(a,_onceWrap(this,a,b)),this},EventEmitter.prototype.prependOnceListener=function(a,b){return checkListener(b),this.prependListener(a,_onceWrap(this,a,b)),this},EventEmitter.prototype.removeListener=function(e,b){var a,d,f,c,g;if(checkListener(b),void 0===(d=this._events)|| void 0===(a=d[e]))return this;if(a===b||a.listener===b)0== --this._eventsCount?this._events=Object.create(null):(delete d[e],d.removeListener&&this.emit("removeListener",e,a.listener||b));else if("function"!=typeof a){for(f=-1,c=a.length-1;c>=0;c--)if(a[c]===b||a[c].listener===b){g=a[c].listener,f=c;break}if(f<0)return this;0===f?a.shift():spliceOne(a,f),1===a.length&&(d[e]=a[0]),void 0!==d.removeListener&&this.emit("removeListener",e,g||b)}return this},EventEmitter.prototype.off=EventEmitter.prototype.removeListener,EventEmitter.prototype.removeAllListeners=function(c){var d,b,a;if(void 0===(b=this._events))return this;if(void 0===b.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==b[c]&&(0== --this._eventsCount?this._events=Object.create(null):delete b[c]),this;if(0===arguments.length){var e,f=Object.keys(b);for(a=0;a<f.length;++a)"removeListener"!==(e=f[a])&&this.removeAllListeners(e);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(d=b[c]))this.removeListener(c,d);else if(void 0!==d)for(a=d.length-1;a>=0;a--)this.removeListener(c,d[a]);return this},EventEmitter.prototype.listeners=function(a){return _listeners(this,a,!0)},EventEmitter.prototype.rawListeners=function(a){return _listeners(this,a,!1)},EventEmitter.listenerCount=function(a,b){return"function"==typeof a.listenerCount?a.listenerCount(b):listenerCount.call(a,b)},EventEmitter.prototype.listenerCount=listenerCount,EventEmitter.prototype.eventNames=function(){return this._eventsCount>0?ReflectOwnKeys(this._events):[]}
