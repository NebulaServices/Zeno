importScripts("/uv/uv.sw.js");const sw=new UVServiceWorker;self.addEventListener("fetch",e=>e.respondWith(sw.fetch(e)));
