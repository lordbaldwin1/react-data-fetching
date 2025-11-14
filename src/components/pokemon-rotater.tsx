"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const URL = "https://pokeapi.co/api/v2/pokemon/";

type PokemonResponse = {
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      }
    }
  };
};

export default function PokemonRotater() {
  const [pokemonId, setPokemonId] = useState<number>(1);
  const [pokemon, setPokemon] = useState<PokemonResponse>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setPokemon(undefined);
    setIsLoading(true);
    setError("");
    async function fetchPokemon() {
      try {
        const response = await fetch(`${URL}${pokemonId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon");
        }

        const data = (await response.json()) as PokemonResponse;
        setPokemon(data);
      } catch (err) {
        console.error(`Error: ${(err as Error).message}`);
        setError((err as Error).message)
        return;
      } finally {
        setIsLoading(false);
      }
    }

    void fetchPokemon();
  }, [pokemonId]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-48 w-48 bg-gray-900 p-4 rounded-lg border-1 border-gray-600 mb-4">
        {error && <span className="text-red-500">{error}</span>}
        {isLoading && <span>Loading...</span>}
        {pokemon && !isLoading && (
          <>
            <span className="text-lg">{pokemon.name}</span>
            <Image 
              src={pokemon.sprites.other["official-artwork"].front_default} 
              alt={pokemon.name} 
              width={100} 
              height={100} 
            />
          </>
        )}
      </div>
      <button
        className="p-2 rounded-md bg-gray-100 w-full text-black border-1 border-gray-600 hover:bg-gray-300 duration-200"
        onClick={() => {
          const randomId = Math.floor(Math.random() * 1025);
          setPokemonId(randomId);
        }}>
        fetch random pokemon
      </button>
    </div>
  )
}