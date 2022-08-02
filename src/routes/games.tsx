import { For, Show, createResource } from "solid-js";

import { games, categories } from "~/games.json"; 
import GameCard from "~/components/GameCard";

export default function Games () {
  return (
    <div class="w-full h-[calc(100%-64px-30px)]">
      <div class="flex flex-col justify-center items-center h-1/2">
        <h1 class="text-4xl">Games</h1>
        
      </div>

      <For each={Object.keys(categories)} fallback={<></>}>{(category: any, i) =>
        <div class="m-10">
          <h1 class="text-2xl my-2">{categories[category].title}</h1>
          <hr />
          <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">\
            <For each={games} fallback={<></>}>{(game: any, i) =>
              <Show when={game.categories.includes(category)} fallback={<></>}>
                <GameCard name={game.title} img={game.icon} description={game.description} url={`/game/${game.id}`} />
              </Show>
            }</For>
          </div>
        </div>
      }</For>
    </div>
  )
}
