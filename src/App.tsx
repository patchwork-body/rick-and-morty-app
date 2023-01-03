import styled from "@emotion/styled";
import { useWheel } from "@use-gesture/react";
import { FC, useEffect, useRef } from "react";
import { Deck } from "./components/deck/deck.component";
import { useRickAndMortyApi } from "./hooks/use-rick-and-morty-api";
import { useDeck } from "./stores/use-deck";
import { useLayout } from "./stores/use-layout";

type LoaderTriggerProps = {
  className?: string;
  top: number;
  onTrigger: () => void;
}

const LoaderTrigger: FC<LoaderTriggerProps> = ({top, onTrigger, className}) => {
  const ref = useRef<HTMLDivElement>(null);
  const {layout} = useLayout(({ layout }) => ({layout}));

  useEffect(() => {
    if(!ref.current) return;
    if(layout === 'stack') return;

    ref.current.style.top = `${top}px`;
  }, [layout, top]);

  useEffect(() => {
    if(!ref.current) return;
    if(layout === 'stack') return;

    const element = ref.current;

    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting) {
        onTrigger();
      }
    }, {});

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [layout]);

  return <div ref={ref} className={className} onClick={onTrigger} />
}

export const StyledLoaderTrigger = styled(LoaderTrigger)`
  position: absolute;
  bottom: 0;
  left: 0;
  min-width: 100vw;
  min-height: 20vh;
  border: 1px solid black;
`

function App() {
  const {cards, addCards} = useDeck(({cards, addCards}) => ({cards, addCards}));
  const {showGrid, showStack} = useLayout(({showGrid, showStack}) => ({showGrid, showStack}));
  const {loading, next} = useRickAndMortyApi(addCards, console.error);

  useEffect(() => {
    if(!loading && cards.size < 7) {
      next();
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

    { target: document }
  );

  console.log(ref.current?.scrollHeight)

  return (
    <Deck ref={ref}>
      {[...cards].map(([, card], index) => (
        <Deck.Card key={card.id} zIndex={cards.size - index} serialNumber={index} onTheTop={index === 0} {...card} />
      ))}
    </Deck>
  );
}

export default styled(App)`
  position: relative;
`;

