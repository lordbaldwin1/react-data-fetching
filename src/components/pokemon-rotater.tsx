"use client";

import Image from "next/image";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const URL = "https://pokeapi.co/api/v2/pokemon/";

type PokemonResponse = {
  id: string;
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
  const [pokemon, setPokemon] = useState<PokemonResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setPokemon(null);
    setIsLoading(true);
    setError("");
    let ignore = false;
    async function handleFetchPokemon() {
      try {
        const response = await fetch(`${URL}${pokemonId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon");
        }
        const data = (await response.json()) as PokemonResponse;
        if (!ignore) setPokemon(data);
      } catch (err) {
        console.error(`Error: ${(err as Error).message}`);
        setError((err as Error).message)
        return;
      } finally {
        setIsLoading(false);
      }
    }
    handleFetchPokemon();
    return () => {
      ignore = true;
    }
  }, [pokemonId]);

  return (
    <div>
      <PokemonCard isLoading={isLoading} error={error} data={pokemon} />
      <ButtonGroup handleSetId={setPokemonId} />
    </div>
  )
}

type PokemonCardProps = {
  isLoading: boolean;
  error: string;
  data: PokemonResponse | null;
}

function PokemonCard({ isLoading, error, data }: PokemonCardProps) {
  return (
    <div className="flex flex-col items-center justify-center h-48 w-48 bg-gray-900 p-4 rounded-lg border-1 border-gray-600 mb-4">
      {error && <span className="text-red-500">{error}</span>}
      {isLoading && <span>Loading...</span>}
      {data && !isLoading && (
        <>
          <Image
            src={data.sprites.other["official-artwork"].front_default}
            alt={data.name}
            width={100}
            height={100}
          />
          <span className="text-lg">{data.name.toUpperCase()}</span>
          <span>{`ID: ${data.id}`}</span>
        </>
      )}
    </div>
  )
}

type ButtonGroupProps = {
  handleSetId: Dispatch<SetStateAction<number>>;
}

function ButtonGroup({ handleSetId }: ButtonGroupProps) {
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          className="p-2 rounded-full bg-gray-100 text-black border-1 border-gray-600 hover:bg-gray-500 duration-200"
          onClick={() =>
            handleSetId((id) => {
              if (id === 1) {
                return 1025
              }
              return id - 1
            })
          }>
          {`<`}
        </button>
        <button
          className="p-2 rounded-full bg-gray-100 text-black border-1 border-gray-600 hover:bg-gray-500 duration-200"
          onClick={() => handleSetId((id) => {
            if (id === 1025) {
              return 1;
            }
            return id + 1;
          })}>
          {`>`}
        </button>
      </div>
    </>
  )
}