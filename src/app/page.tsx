import PokemonRotater from "~/components/pokemon-rotater";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <PokemonRotater />
    </main>
  );
}
