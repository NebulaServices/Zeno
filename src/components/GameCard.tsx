export default function GameCard (props) {
  return (
    <a class="flex justify-center" href={props.url}>
      <div class="bg-zinc-800 light:bg-zinc-300 rounded-lg p-5 w-full shadow-lg hover:shadow-2xl cursor-pointer">
        <div>
          <h1 class="text-4xl inline-block m-1">{props.name}</h1>
          <img src={props.img} alt={props.name} class="h-20 float-right" />
        </div>
        <p>{props.description.substring(0, 64) !== props.description ? (props.description.substring(0, 64) + "...") : props.description}</p>
      </div>
    </a>
  );
}
