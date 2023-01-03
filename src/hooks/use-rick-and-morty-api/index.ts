import { gql, request } from "graphql-request";
import { useCallback, useEffect, useRef, useState } from "react";
import { RickAndMortyCharacter } from "../../types/rick-and-morty-character";

const query = (page: number) => gql`
  query {
    characters(page: ${page}) {
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

export const useRickAndMortyApi = (
  success: (data: RickAndMortyCharacter[]) => void,
  failure: (error: unknown) => void
) => {
  const abortController = useRef(new AbortController());
  const nextPage = useRef<number>();
  const [loading, setLoading] = useState(true);

  const apiCall = useCallback(async () => {
    try {
      setLoading(true);

      const data = await request(
        "https://rickandmortyapi.com/graphql",
        query(nextPage.current ?? 1),
        {
          signal: abortController.current.signal,
        }
      );

      nextPage.current = data.characters.info.next;
      success(data.characters.results);
    } catch (error) {
      failure(error);
    } finally {
      setLoading(false);
    }
  }, [success, failure]);

  // Fetch data on mount and abort fetch on unmount
  useEffect(() => {
    apiCall();
    return () => abortController.current.abort();
  }, []);

  return { loading, loadMore: apiCall };
};
