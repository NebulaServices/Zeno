import { useLocation } from "solid-app-router";

export default function Navbar () {
  function openSettings () {
    document.body.classList.add("overflow-hidden");
    document.getElementById("settings").classList.toggle("hidden");
  }

  const location = useLocation();

  return (
    <nav class="flex justify-center sm:justify-end p-5 w-full h-16 light:font-normal">
      <div class="mx-5 hover:underline cursor-pointer">
        <a href="//discord.gg/unblock" target="_blank">Support</a>
      </div>
      <div class="mx-5 hover:underline cursor-pointer">
        <a href="/">Home</a>
      </div>
      <div class="mx-5 hover:underline cursor-pointer">
        <a href="/games">Games</a>
      </div>
      <div class="mx-5 hover:underline cursor-pointer" onclick={openSettings}>
        Settings
      </div>
    </nav>
  );
}
