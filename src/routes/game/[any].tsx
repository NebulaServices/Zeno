import { useLocation } from "solid-app-router";
import { onMount } from "solid-js";

import { games } from "~/games.json";

export default function Game () {
  const location = useLocation();
  const gameId = location.pathname.split("/")[2];
  const game = games.find(game => game.id === gameId);
  onMount(() => {
    const frame = document.getElementById("frame") as HTMLIFrameElement;
    const settings = window.getSettings();
    frame.src = window.proxies[settings.proxy].generateUrl(game.source);
  });

  function fullscreen () {
    const frame = document.getElementById("frame") as HTMLIFrameElement;
    frame.requestFullscreen();
  }

  return (
    <div class="absolute top-20 flex justify-center w-full pb-16">
      <div class="bg-zinc-800 light:bg-zinc-300 m-3 w-[300px] sm:w-[616px] md:w-[744px] lg:w-[1000px]">
        <iframe class="sm:w-[616px] sm:h-[347px] md:w-[744px] md:h-[419px] lg:w-[1000px] lg:h-[563px]" id="frame"></iframe>
        <div class="p-2">
          <div class="float-right text-2xl m-1">
            <i class="fa-light fa-expand-wide" onclick={fullscreen}></i>
          </div>
          <h1 class="text-2xl m-2">{game.title}</h1>
          <p class="text-base m-2">{game.description}</p>
        </div>
      </div>
    </div>
  )
}
