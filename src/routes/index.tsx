import { onMount } from "solid-js";

declare global {
  interface Window {
    inputActive: boolean;
    suggestions: string[];
    proxies: { [key: string]: any };
    updateSuggestions: () => void;
    getSettings: () => any;
    setSettings: (settings: any) => void;
    openUrl: (url: string) => void;
  }
}

declare var __uv$config: any;

export default function Home() {
  onMount(async () => {
    let search: HTMLInputElement = document.getElementById("search") as HTMLInputElement;
    
    search.addEventListener("focus", () => {
      window.inputActive = true;
      if (window.suggestions[0]) document.getElementById("suggestion-container")?.classList?.remove("hidden");
    });
    search.addEventListener("focusout", () => {
      window.inputActive = false;
      document.getElementById("suggestion-container")?.classList?.add("hidden");
    });
    search.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        let settings = window.getSettings();
        window.proxies[settings.proxy].navigate(search.value);
      }
    });
  });

  return (
    <>
      <div class="w-full h-[calc(100%-64px)] flex justify-center items-center flex-col">
        <h1 class="my-2 text-4xl">Zeno</h1>
        <div class="w-11/12 sm:w-5/6 md:w-2/5 lg:w-1/3 rounded-lg bg-zinc-800 light:bg-zinc-300 transition-all light:font-normal">
          <input id="search" class="py-2 px-3 text-lg bg-transparent w-full focus:outline-none" type="text" placeholder="Search the web" oninput={window.updateSuggestions} />
          <div id="suggestion-container" class="w-full hidden">
            <hr class="border-zinc-700 light:border-zinc-400"/>
            <div id="suggestions">
            </div>
          </div>
        </div>
        <div id="loading" class="flex my-2 hidden">
          Loading
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 px-1 fill-zinc-100 light:fill-zinc-900" style="margin: auto; background: none; display: block; shape-rendering: auto;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <rect x="15" y="30" width="10" height="40">
              <animate attributeName="opacity" dur="1s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" values="1;0.2;1" begin="-0.6"></animate>
            </rect>
            <rect x="35" y="30" width="10" height="40">
              <animate attributeName="opacity" dur="1s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" values="1;0.2;1" begin="-0.4"></animate>
            </rect>
            <rect x="55" y="30" width="10" height="40">
              <animate attributeName="opacity" dur="1s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" values="1;0.2;1" begin="-0.2"></animate>
            </rect>
            <rect x="75" y="30" width="10" height="40">
              <animate attributeName="opacity" dur="1s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" values="1;0.2;1" begin="-1"></animate>
            </rect>
          </svg>
        </div>
        <div id="error" class="flex my-2 hidden justify-center w-11/12 sm:w-5/6 md:w-2/5 lg:w-1/3"></div>
      </div>
    </>
  );
}
