import { gql, request } from "graphql-request";
import { useCallback, useEffect, useRef, useState } from "react";
import { RickAndMortyCharacterDetails } from "~/types/rick-and-morty-character-details";

const query = (id: number) => gql`
  query {
    character(id: ${id}) {
      id
      name

      origin {
        id
        name
        type
        dimension
        created
      }

      location {
        id
        name
        type
        dimension
        created
      }

      episode {
        id
        name
        air_date
        episode
        created
      }
    }
  }
`;

export const useRickAndMortyCharacterById = (
  id: number | null
) => {
  const abortController = useRef(new AbortController());
  const [character, setCharacter] = useState<RickAndMortyCharacterDetails>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  const apiCall = useCallback(async (id: number) => {
    try {
      setLoading(true);

      const data = await request(
        "https://rickandmortyapi.com/graphql",
        query(id),
        {
          signal: abortController.current.signal,
        }
      );

      setCharacter(data.character);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch character details on mount and abort fetch on unmount
  useEffect(() => {
    if(id) {
      apiCall(id);
      return () => abortController.current.abort();
    }
  }, [id]);

  return { loading, error, character };
};

