// Search Engines
const searchEngines = {
  google: {
    generateSuggestUrl: q => `https://www.google.com/complete/search?client=gws-wiz&q=${q}`,
    generateSearchUrl: q => `https://www.google.com/search?q=${q}`,
    parseSuggestData (data) {
      let resp = JSON.parse(data.replace(/^.+?\(/, "").replace(/\)$/, "")),values = [];
      if (resp && resp[0]) values.push(...resp[0].map((x) => {const parser = new DOMParser(),resp = parser.parseFromString(x[0], "text/html");return resp.body.textContent;}));;
      return values;
    }
  },
  brave: {
    generateSuggestUrl: q => `https://search.brave.com/api/suggest?q=${q}`,
    generateSearchUrl: q => `https://search.brave.com/search?q=${q}`,
    parseSuggestData (data) {
      let resp = JSON.parse(data),values = [];
      if (resp && resp[1]) values = resp[1];
      return values;
    }
  },
  bing: {
    generateSuggestUrl: q => `https://www.bing.com/AS/Suggestions?cvid=1&qry=${q}`,
    generateSearchUrl: q => `https://www.bing.com/search?q=${q}`,
    parseSuggestData (data) {
      let parser = new DOMParser(),resp = parser.parseFromString(data, "text/html"),queries = resp.querySelectorAll("span"),values = [];
      if (queries && queries[0]) values.push(...[...queries].map(x => x.innerText));
      return values;
    }
  },
  duckduckgo: {
    generateSuggestUrl: q => `https://duckduckgo.com/ac/?q=${q}`,
    generateSearchUrl: q => `https://duckduckgo.com/?q=${q}`,
    parseSuggestData (data) {
      let resp = JSON.parse(data),values = [];
      if (resp && resp[0]) values.push(...resp.map(x => x.phrase));
      return values;
    }
  },
  yahoo: {
    generateSuggestUrl: q => `https://search.yahoo.com/sugg/gossip/gossip-us-fastbreak/?command=${q}`,
    generateSearchUrl: q => `https://search.yahoo.com/search?p=${q}`,
    parseSuggestData (data) {
      let parser = new DOMParser(),resp = parser.parseFromString(data, "text/xml"),queries = resp.querySelectorAll("s"),values = [];
      if (queries && queries[0]) values.push(...[...queries].map(x => x.getAttribute("k")));
      return values;
    }
  }
}

// Proxies
window.proxies = {
  uv: {
    sw: "/uv~sw.js",
    scope: __uv$config.prefix,
    generateUrl (string) {
      let settings = getSettings();
      return proxies.uv.scope + __uv$config.encodeUrl(parseValue(settings.shortcuts && settings.shortcuts[string.trim()] ? settings.shortcuts[string.trim()] : string));
    },
    navigate (value) {
      if ("serviceWorker" in navigator) {
        document.getElementById("loading").classList.remove("hidden");
        navigator.serviceWorker.register(proxies.uv.sw, {
          scope: proxies.uv.scope,
          updateViaCache: "none"
        }).then(() => {
          openUrl(proxies.uv.generateUrl(value));
        }).catch((e) => {
          document.getElementById("loading").classList.add("hidden");
          document.getElementById("error").classList.remove("hidden");
          document.getElementById("error").innerText = `Error: ${e.message}`;
        });
      } else {
        alert("Service workers are not supported in this browser.");
      }
    },
    register () {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register(proxies.uv.sw, {
          scope: proxies.uv.scope,
          updateViaCache: "none"
        }).catch(alert);
      } else {
        alert("Service workers are not supported in this browser.");
      }
    }
  },
  stomp: {
    sw: `/~stomp/worker.js?config=${JSON.stringify({codec:1,bare_server:"/bare/",directory:"/~stomp/"})}`,
    scope: "/~stomp/",
    generateUrl (string) {
      let settings = getSettings();
      return `${proxies.stomp.scope}process:html:${encodeURIComponent(parseValue(settings.shortcuts && settings.shortcuts[string.trim()] ? settings.shortcuts[string.trim()] : string))}`;
    },
    async navigate (value) {
      if ("serviceWorker" in navigator) {
        const sw = await navigator.serviceWorker.register(proxies.stomp.sw, {
          scope: proxies.stomp.scope,
          updateViaCache: "none"
        }).catch(alert);
        sw.update().then(() => {
          openUrl(proxies.stomp.generateUrl(value));
        });
      } else {
        alert("Service workers are not supported in this browser.");
      }
    },
    async register () {
      if ("serviceWorker" in navigator) {
        const sw = await navigator.serviceWorker.register(proxies.stomp.sw, {
          scope: proxies.stomp.scope,
          updateViaCache: "none"
        }).catch(alert);
        sw.update();
      } else {
        alert("Service workers are not supported in this browser.");
      }
    }
  },
  osana: {
    sw: "/osana~sw.js",
    scope: __osana$config.prefix,
    generateUrl (string) {
      let settings = getSettings();
      return proxies.osana.scope + __osana$config.codec.encode(parseValue(settings.shortcuts && settings.shortcuts[string.trim()] ? settings.shortcuts[string.trim()] : string));
    },
    navigate (value) {
      if ("serviceWorker" in navigator) {
        document.getElementById("loading").classList.remove("hidden");
        navigator.serviceWorker.register(proxies.osana.sw, {
          scope: proxies.osana.scope
        }).then(() => {
          openUrl(proxies.osana.generateUrl(value));
        }).catch((e) => {
          document.getElementById("loading").classList.add("hidden");
          document.getElementById("error").classList.remove("hidden");
          document.getElementById("error").innerText = `Error: ${e.message}`;
        });
      } else {
        alert("Service workers are not supported in this browser.");
      }
    },
    register () {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register(proxies.osana.sw, {
          scope: proxies.osana.scope
        }).catch(alert);
      } else {
        alert("Service workers are not supported in this browser.");
      }
    }
  },
  dip: {
    sw: "/dip~sw.js",
    scope: "/~dip/",
    generateUrl (string) {
      const xor = {
        key: 2,
        encode(str, key) {
          if (!key) key = xor.key;
          if (!str) return str;
          var encoded = encodeURIComponent((str).split('').map((char,ind)=>ind%key?String.fromCharCode(char.charCodeAt()^key):char).join(''));
          if (!encoded.endsWith('/')) return encoded+'/';
          else return encoded
        },
        decode(str, key) {
          if (!key) key = xor.key;
          if (!str) return str;
          str = str.replace(new RegExp('\/$', 'g'), '');
          var encoded = (decodeURIComponent(str).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
          return encoded;
        }
      }
      let settings = getSettings();
      return proxies.dip.scope + xor.encode(parseValue(settings.shortcuts && settings.shortcuts[string.trim()] ? settings.shortcuts[string.trim()] : string));
    },
    navigate (value) {
      if ("serviceWorker" in navigator) {
        document.getElementById("loading").classList.remove("hidden");
        navigator.serviceWorker.register(proxies.dip.sw, {
          scope: proxies.dip.scope,
          updateViaCache: "none"
        }).then(() => {
          openUrl(proxies.dip.generateUrl(value));
        }).catch((e) => {
          document.getElementById("loading").classList.add("hidden");
          document.getElementById("error").classList.remove("hidden");
          document.getElementById("error").innerText = `Error: ${e.message}`;
        });
      } else {
        alert("Service workers are not supported in this browser.");
      }
    },
    register () {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register(proxies.dip.sw, {
          scope: proxies.dip.scope,
          updateViaCache: "none"
        }).catch(alert);
      } else {
        alert("Service workers are not supported in this browser.");
      }
    }
  },
  aero: {
    sw: "/aero~sw.js",
    scope: "/~aero/",
    generateUrl (string) {
      let settings = getSettings();
      return proxies.aero.scope + parseValue(settings.shortcuts && settings.shortcuts[string.trim()] ? settings.shortcuts[string.trim()] : string);
    },
    navigate (value) {
      if ("serviceWorker" in navigator) {
        document.getElementById("loading").classList.remove("hidden");
        navigator.serviceWorker.register(proxies.aero.sw, {
          scope: proxies.aero.scope,
          updateViaCache: "none",
          type: "module"
        }).then(() => {
          openUrl(proxies.aero.generateUrl(value));
        }).catch((e) => {
          document.getElementById("loading").classList.add("hidden");
          document.getElementById("error").classList.remove("hidden");
          document.getElementById("error").innerText = `Error: ${e.message}`;
        });
      } else {
        alert("Service workers are not supported in this browser.");
      }
    },
    register () {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register(proxies.aero.sw, {
          scope: proxies.aero.scope,
          updateViaCache: "none",
          type: "module"
        }).catch(alert);
      } else {
        alert("Service workers are not supported in this browser.");
      }
    }
  }
}

function parseValue (value) {
  if (/^https?:\/\/([^\s]+\.)+[^\s]+$/.test(value.trim())) {
    return value.trim();
  } else if (/^([^\s]+\.)+[^\s]+$/.test(value.trim())) {
    return location.protocol + "//" + value.trim();
  } else {
    return searchEngines[getSettings().searchEngine].generateSearchUrl(value)
  }
}

// Search Navigation
window.openUrl = (url) => {
  if (settings.tabCloak === "none") {
    if (settings.display === "default") {
      location.href = url;
    } else {
      window.open(url, "_blank", "left=0,top=0");
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("search").value = "";
    }
  } else {
    let win;
    if (settings.display === "default") {
      win = window.open("about:blank", "_blank");
    } else {
      win = window.open("about:blank", "_blank", "left=0,top=0");
    }
    let style = win.document.createElement("style");
    style.innerHTML = `
      body {
        margin: 0;
      }
    `;
    win.document.head.appendChild(style);
    let arc = win.document.createElement("script");
    arc.src = "https://arc.io/widget.min.js#vE8nfkNT";
    arc.async = true;
    win.document.head.appendChild(arc);
    let iframe = win.document.createElement("iframe");
    iframe.src = location.origin + url;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    win.document.body.appendChild(iframe);
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("search").value = "";
  }
}

// Settings
const defaultSettings = {
  searchEngine: "google",
  proxy: "uv",
  theme: "dark",
  display: "default",
  tabCloak: "none",
  shortcuts: {
    "discord": "https://discord.com/app",
    "google": "https://www.google.com/",
    "youtube": "https://www.youtube.com/",
    "reddit": "https://www.reddit.com/"
  }
}

window.getSettings = () => {
  try {
    var settings = Object.assign(defaultSettings, JSON.parse(localStorage.getItem("settings")));
  } catch {
    var settings = defaultSettings;
  }
  return settings;
}

window.setSettings = (settings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
}

let settings = getSettings();
if (settings.theme === "light") document.documentElement.classList.add("light");

proxies[settings.proxy].register();

// Search Suggestions
window.inputActive = window.inputActive || false;
window.suggestions = [];

window.updateSuggestions = () => {
  changeSuggestions();
}

async function changeSuggestions () {
  let query = document.getElementById("search").value;
  
  if (query.length < 1) {
    window.suggestions = [];
    document.getElementById("suggestion-container")?.classList?.add("hidden");
    return;
  } else {
    try {
      let settings = getSettings();
      let response = await createBareRequest(searchEngines[settings.searchEngine].generateSuggestUrl(query));
      let data = await response.text();
      window.suggestions = searchEngines[settings.searchEngine].parseSuggestData(data);
      document.getElementById("suggestions").innerHTML = "";
      for (var i = 0; i < 5; i++) {
        if (window.suggestions[i]) {
          let elm = createSuggestion(window.suggestions[i]);
          document.getElementById("suggestions").appendChild(elm);
        }
      }
      if (window.suggestions[0]) document.getElementById("suggestion-container")?.classList?.remove("hidden");
    } catch {}
  }
}

let abortController;
async function createBareRequest (url) {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  url = new URL(url);
  return fetch(__config.bare + "v1/", {
    signal: abortController.signal,
    method: "GET",
    headers: {
      "cookie": document.cookie,
      "x-bare-forward-headers": '["accept-encoding","connection","content-length"]',
      "x-bare-headers": JSON.stringify({
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "upgrade-insecure-requests": "1",
        "user-agent": navigator.userAgent,
        "referer": url.href,
        "Host": url.host
      }),
      "x-bare-host": url.host,
      "x-bare-path": url.pathname + url.search,
      "x-bare-protocol": url.protocol,
      "x-bare-port": url.port ? url.port : (url.protocol === "https:" ? 443 : 80),
    }
  });
}

function createSuggestion (suggestion) {
  const elm = document.createElement("div");
  elm.innerHTML = `
    <div class="py-2 px-3 hover:underline cursor-pointer text-lg">
      ${suggestion}
    </div>
  `;
  elm.children[0].addEventListener("mousedown", () => {
    let settings = getSettings();
    window.proxies[settings.proxy].navigate(suggestion);
  });
  return elm.children[0];
}
