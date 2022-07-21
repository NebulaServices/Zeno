import loading from "../loading.svg";

import { onMount } from "solid-js";

declare global {
  interface Window {
    inputActive: boolean;
    suggestions: string[];
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
        window.openUrl(search.value);
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
          Loading<img class="h-6 px-1" src={loading} alt="Loading..." />
        </div>
        <div id="error" class="flex my-2 hidden justify-center w-11/12 sm:w-5/6 md:w-2/5 lg:w-1/3"></div>
      </div>
    </>
  );
}
