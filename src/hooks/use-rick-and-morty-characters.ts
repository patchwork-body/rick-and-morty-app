import { gql, request } from "graphql-request";
import { useCallback, useEffect, useRef, useState } from "react";
import { RickAndMortyCharacter } from "~/types/rick-and-morty-character";

const query = (page: number, nameFilter: string) => gql`
  query {
    characters(page: ${page}, filter: { name: "${nameFilter.toLowerCase()}" }) {
      info {
        next
      }

      results {
        id
        name
        image
        status
        gender
        species
      }
    }
  }
`;

export const useRickAndMortyCharacters = (
  nameFilter: string,
) => {
  const abortController = useRef(new AbortController());
  const nextPage = useRef<number>();
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<RickAndMortyCharacter[]>([]);
  const [error, setError] = useState<Error>();

  const apiCall = useCallback(async () => {
    try {
      setLoading(true);

      const data = await request(
        "https://rickandmortyapi.com/graphql",
        query(nextPage.current ?? 1, nameFilter),
        {
          signal: abortController.current.signal,
        }
      );

      nextPage.current = data.characters.info.next;
      setCharacters(data.characters.results);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [nameFilter]);

  // Fetch data on mount and abort fetch on unmount
  useEffect(() => {
    apiCall();
    return () => abortController.current.abort();
  }, [nameFilter]);

  return { loading, loadMore: apiCall, characters, error };
};
