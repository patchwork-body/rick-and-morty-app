import styled from "@emotion/styled";
import { CircularProgress, LinearProgress } from "@mui/material";
import { useWheel } from "@use-gesture/react";
import {  useEffect, useRef } from "react";
import { Center } from "./components/center/center.component";
import { Deck } from "./components/deck/deck.component";
import { Sidebar } from "./components/sidebar/sidebar.component";
import { useRickAndMortyCharacters } from "./hooks/use-rick-and-morty-characters";
import { useDeck } from "./stores/use-deck";
import { useLayout } from "./stores/use-layout";

function App() {
  const { cards, addCards } = useDeck(({ cards, addCards }) => ({
    cards,
    addCards,
  }));

  const { showGrid, showStack } = useLayout(({ showGrid, showStack }) => ({
    showGrid,
    showStack,
  }));

  const { loading, loadMore } = useRickAndMortyCharacters(addCards, console.error);

  useEffect(() => {
    if (!loading && cards.size < 7) {
      loadMore();
    }
  }, [cards.size, loading]);

  const ref = useRef<HTMLDivElement>(null);

  useWheel(
    ({ velocity: [, vy], movement: [, my] }) => {
      if (vy > 1 && my > 0) {
        return showGrid();
      }

      if (ref.current?.scrollTop === 0 && vy > 1 && my < 0) {
        return showStack();
      }
    },

    { target: document.getElementById("deck")! }
  );

  return (
    (cards.size === 0)
      ? (
        <Center>
          <CircularProgress />
        </Center>
      )

      : (
        <>
          {loading && <LinearProgress /> }
          
          <Deck ref={ref} onTrigger={loadMore} loading={loading}>
            {[...cards].map(([, card], index) => (
              <Deck.Card
                key={card.id}
                zIndex={cards.size - index}
                serialNumber={index}
                onTheTop={index === 0}
                {...card}
              />
            ))}
          </Deck>

          <Sidebar />
        </>
      )
  );
}

export default styled(App)`
  position: relative;
`;

