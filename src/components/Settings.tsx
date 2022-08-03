import { onMount } from "solid-js";

export default function Settings () {
  onMount(async () => {
    let settings = window.getSettings();
    // search engine
    let searchEngine = document.getElementById("searchEngine") as HTMLSelectElement;
    searchEngine.value = settings.searchEngine;
    // proxy
    let proxy = document.getElementById("proxy") as HTMLInputElement;
    proxy.value = settings.proxy;
    // theme
    let theme = document.getElementById("theme") as HTMLSelectElement;
    theme.value = settings.theme;
    // display
    let display = document.getElementById("display") as HTMLSelectElement;
    display.value = settings.display;
    // tab Cloak
    let tabCloak = document.getElementById("tabCloak") as HTMLInputElement;
    tabCloak.value = settings.tabCloak;

    // Shortcuts
    Object.keys(settings.shortcuts).forEach((key) => {
      createShortcut(key, settings.shortcuts[key]);
    });
  });

  function createShortcut (input: string = "", url: string = "") {
    const elm = document.createElement("div");
    elm.innerHTML = `
      <div class="px-4 py-2 text-base grid grid-cols-[1fr_1fr_20px]">
        <input name="value" onfocus="this.oldvalue = this.value;" placeholder="Input" class="bg-transparent focus:outline-none" type="text" value="${input}" />
        <input name="url" onfocus="this.oldvalue = this.value;" placeholder="URL" class="bg-transparent focus:outline-none" type="text" value="${url}" />
        <div class="flex justify-center">
          <i class="fa-light fa-xmark relative top-1"></i>
        </div>
      </div>
    `;
    const shortcut = elm.firstElementChild as HTMLDivElement;
    shortcut.querySelector("div div i").addEventListener("click", () => {
      let settings = window.getSettings();
      delete settings.shortcuts[input];
      shortcut.remove();
      window.setSettings(settings);
    });
    shortcut.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (e) => {
        let settings = window.getSettings();
        if ((e.target as HTMLInputElement).name === "url") {
          settings.shortcuts[(shortcut.querySelector("input[name=value]") as HTMLInputElement).value] = (e.target as HTMLInputElement).value;
        } else if ((e.target as HTMLInputElement).name === "value") {
          let shortcut = settings.shortcuts[(e.target as any).oldvalue];
          delete settings.shortcuts[(e.target as any).oldvalue];
          settings.shortcuts[(e.target as HTMLInputElement).value] = shortcut;
          (e.target as any).oldvalue = (e.target as HTMLInputElement).value;
        }
        window.setSettings(settings);
      });
    });
    let settings = window.getSettings();
    settings.shortcuts[input] = url;
    document.getElementById("shortcuts").appendChild(shortcut);
    window.setSettings(settings);
  }

  function hideSettings (event) {
    if (["settings", "settings-close"].includes(event.target.id)) {
      document.body.classList.remove("overflow-hidden");
      document.getElementById("settings").classList.add("hidden");
    }
  }

  function updateSettings (event) {
    let settings = window.getSettings();
    switch (event.target.id) {
      case "searchEngine":
        settings.searchEngine = event.target.value;
        break;
      case "proxy":
        settings.proxy = event.target.value;
        window.proxies[settings.proxy].register();
        break;  
      case "theme":
        settings.theme = event.target.value;
        document.body.classList.add("transition-colors");
        document.body.classList.add("duration-200");
        if (settings.theme === "light") document.documentElement.classList.add("light");
        else document.documentElement.classList.remove("light");
        setTimeout(() => {
          document.body.classList.remove("transition-colors");
          document.body.classList.remove("duration-200");
        }, 200);
        break;
      case "display":
        settings.display = event.target.value;
        break;
      case "tabCloak":
        settings.tabCloak = event.target.value;
        break;
    }
    window.setSettings(settings);
  }

  return (
    <div id="settings" class="top-0 fixed w-full h-full bg-black bg-opacity-50 hidden z-50" onclick={hideSettings}>
      <div class="fixed right-0 top-0 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-full bg-zinc-900 light:bg-zinc-200 z-20 overflow-auto">
        <div class="flex">
        <i class="fa-light fa-arrow-left m-4 p-1 text-lg" id="settings-close" onclick={hideSettings}></i>
          <h1 class="float-right m-5 text-lg">Settings</h1>
        </div>
        <div class="flex justify-center p-4 flex-col">

          <div class="bg-zinc-800 light:bg-zinc-300 w-full rounded-lg text-lg shadow-md mb-5">
            <h2 class="p-4">Search Engine</h2>
            <hr class="border-zinc-700 light:border-zinc-400"/>
            <div class="select-wrapper">
              <i class="fa-light fa-angle-down"></i>
              <select id="searchEngine" class="py-4 px-3 bg-transparent w-full focus:outline-none text-base appearance-none" onchange={updateSettings}>
                <option class="bg-zinc-800 light:bg-zinc-300" value="google">Google</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="bing">Bing</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="duckduckgo">Duck Duck Go</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="brave">Brave</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="yahoo">Yahoo</option>
              </select>
            </div>
          </div>

          <div class="bg-zinc-800 light:bg-zinc-300 w-full rounded-lg text-lg shadow-md mb-5">
            <h2 class="p-4">Proxy</h2>
            <hr class="border-zinc-700 light:border-zinc-400"/>
            <div class="select-wrapper">
              <i class="fa-light fa-angle-down"></i>
              <select id="proxy" class="py-4 px-3 bg-transparent w-full focus:outline-none text-base appearance-none" onchange={updateSettings}>
                <option class="bg-zinc-800 light:bg-zinc-300" value="uv">Ultraviolet</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="stomp">Stomp</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="osana">Osana</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="dip">DIP</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="aero">Aero</option>
              </select>
            </div>
          </div>

          <div class="bg-zinc-800 light:bg-zinc-300 w-full rounded-lg text-lg shadow-md mb-5">
            <h2 class="p-4">Theme</h2>
            <hr class="border-zinc-700 light:border-zinc-400"/>
            <div class="select-wrapper">
              <i class="fa-light fa-angle-down"></i>
              <select id="theme" class="py-4 px-3 bg-transparent w-full focus:outline-none text-base appearance-none" onchange={updateSettings}>
                <option class="bg-zinc-800 light:bg-zinc-300" value="dark">Dark</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="light">Light</option>
              </select>
            </div>
          </div>

          <div class="bg-zinc-800 light:bg-zinc-300 w-full rounded-lg text-lg shadow-md mb-5">
            <h2 class="p-4">Display</h2>
            <hr class="border-zinc-700 light:border-zinc-400"/>
            <div class="select-wrapper">
              <i class="fa-light fa-angle-down"></i>
              <select id="display" class="py-4 px-3 bg-transparent w-full focus:outline-none text-base appearance-none" onchange={updateSettings}>
                <option class="bg-zinc-800 light:bg-zinc-300" value="default">Default</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="standalone">Standalone</option>
              </select>
            </div>
          </div>

          <div class="bg-zinc-800 light:bg-zinc-300 w-full rounded-lg text-lg shadow-md mb-5">
            <h2 class="p-4">Tab Cloak</h2>
            <hr class="border-zinc-700 light:border-zinc-400"/>
            <div class="select-wrapper">
              <i class="fa-light fa-angle-down"></i>
              <select id="tabCloak" class="py-4 px-3 bg-transparent w-full focus:outline-none text-base appearance-none" onchange={updateSettings}>
                <option class="bg-zinc-800 light:bg-zinc-300" value="none">None</option>
                <option class="bg-zinc-800 light:bg-zinc-300" value="about:blank">About Blank</option>
              </select>
            </div>
          </div>

          <div class="bg-zinc-800 light:bg-zinc-300 w-full rounded-lg text-lg shadow-md mb-5">
            <h2 class="p-4">Shortcuts</h2>
            <hr class="border-zinc-700 light:border-zinc-400"/>
            <div id="shortcuts">

            </div>
            <div class="py-4 w-full flex justify-center">
              <i class="fa-light fa-plus-large" onclick={() => createShortcut()}></i>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
