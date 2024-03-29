import styled from "@emotion/styled";
import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { animated, useSpring } from "@react-spring/web";
import { FC, ForwardedRef, forwardRef, HTMLAttributes, memo, useEffect, useMemo } from "react";
import InfoIcon from '@mui/icons-material/Info';
import { useDeck } from "../../stores/use-deck";
import { useLayout } from "../../stores/use-layout";
import { StyledLoaderTrigger } from "../trigger/trigger.component";
import { RickAndMortyCharacter } from "../../types/rick-and-morty-character";
import { useFlippedCards } from "../../stores/use-flipped-cards";
import { useSidebar } from "../../stores/use-sidebar";
import { useDrag } from "@use-gesture/react";

const CARD_WIDTH = 280;
const MIN_CARD_HEIGHT = 400;
const GAP = 60;

export const BottomMargin = styled.div<{top: number}>`
  position: absolute;
  top: ${({top}) => top}px;
  height: 100px;
  width: 100vw;
  z-index: 100;
`

type DeckComponentProps = {
  loading: boolean
  onTrigger?: () => void;
  ref?: ForwardedRef<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>

const DeckComponent: FC<DeckComponentProps> = forwardRef(({className, loading, onTrigger, children}, ref: ForwardedRef<HTMLDivElement>) => {
  const {cards, setDeck} = useDeck(({cards, setDeck}) => ({cards, setDeck}));
  const {layout} = useLayout(({layout}) => ({layout}));

  // Reset the deck when the layout changes -- Performance optimization
  useEffect(() => {
    if(layout === 'stack') {
      setDeck([...cards].slice(0, 20).map(([id, card]) => ({...card, id})));
    }
  }, [layout]);


  const topOffset = useMemo(() => {
    const columns = Math.max(
      1,
      Math.min(3, Math.floor((window.innerWidth - CARD_WIDTH) / CARD_WIDTH))
    );

    return (Math.ceil(cards.size / columns)) * (MIN_CARD_HEIGHT + GAP);
  }, [cards.size]);

  return <div id="deck" ref={ref} className={className}>
    {children}

    {layout === 'grid' && 
      <>
        <BottomMargin top={topOffset} />
        {onTrigger && <StyledLoaderTrigger loading={loading} top={topOffset} onTrigger={onTrigger} />}
      </>
    }
  </div>
})

const StyledDeckComponent = styled(DeckComponent)`
  position: relative;
  min-width: 100vw;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow-y: auto;
  background: #f5f5f5;
`;

const CardPaper = styled(Paper)`
  padding: 16px;
`;

const CardBox = styled(Box)`
  display: flex;
  flex-flow: column;
  justify-content: center;
  row-gap: 10px;
  width: ${CARD_WIDTH}px;
  min-height: ${MIN_CARD_HEIGHT}px;
`;

export type DeckCardProps = {
  onTheTop?: boolean;
  className?: string;
  serialNumber: number;
} & RickAndMortyCharacter;

const DeckCardComponent: FC<DeckCardProps> = ({
  id,
  serialNumber,
  onTheTop,
  name,
  image,
  species,
  gender,
  status,
  className,
}) => {
  const { dropCard } = useDeck(({ dropCard }) => ({ dropCard }));
  const { layout } = useLayout(({ layout }) => ({ layout }));
  const {showSidebar} = useSidebar(({ showSidebar }) => ({ showSidebar }));

  const { flippedCardsIds, flipCard } = useFlippedCards(
    ({ flippedCardsIds, flipCard }) => ({ flippedCardsIds, flipCard })
  );

  const [{ x, y, scale, opacity, rotate, rotateY }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotate: Math.random() * 10,
    rotateY: 0,
    config: { mass: 5, tension: 350, friction: 40 },

    onChange: {
      opacity: (value: number) => {
        if (value <= 0.5) {
          dropCard(id);
        }
      },
    },
  }));

  useEffect(() => {
    if (layout === "grid") {
      const columns = Math.max(
        1,
        Math.min(3, Math.floor((window.innerWidth - CARD_WIDTH) / CARD_WIDTH))
      );

      api.start({
        x:
          (serialNumber % columns) * (CARD_WIDTH + GAP) -
          (CARD_WIDTH * columns + GAP * (columns - 1)) / 2 +
          CARD_WIDTH / 2,

        y:
          (MIN_CARD_HEIGHT + GAP) * Math.floor(serialNumber / columns) -
          (window.innerHeight - MIN_CARD_HEIGHT) / 2 +
          100,

        scale: 1,
        opacity: 1,
        rotate: 0,

        config: { bounce: 0.2, mass: 1 },
      });
    }

    if (layout === "stack") {
      api.start({
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: Math.random() * 10,

        config: { bounce: 0.2, mass: 1 },
      });
    }
  }, [layout]);

  const bind = useDrag(
    ({ down, movement: [mx, my], direction: [dx], velocity: [vx] }) => {
      const trigger = vx > 0.1;
      const direction = dx < 0 ? -1 : 1;

      if (!down && trigger) {
        api.start({ x: direction * 1000, scale: 0.5, opacity: 0 });
      } else {
        api.start({
          x: down ? mx : 0,
          y: down ? my : 0,
          scale: down ? 1.1 : 1,
          rotate: mx / 100,
        });
      }
    }
  );

  const isFlipped = flippedCardsIds.has(id);

  const showDetails = () => {
    api.start({ rotateY: isFlipped ? 0 : 180 });
    flipCard(id);
  };

  const elevationLevel = layout === 'stack' ? onTheTop ? 3 : (serialNumber < 7 && 1) || 0 : 1;

  return (
    <animated.div
      {...(layout === "stack" && onTheTop ? bind() : {})}
      style={{ x, y, scale, opacity, rotateY, rotate, touchAction: "none" }}
      className={className}
    >
      <CardPaper elevation={elevationLevel}>
        <CardBox style={isFlipped ? { transform: "rotateY(-180deg)" } : {}}>
          {isFlipped ? (
            <>
              <Box display="grid" gridTemplateColumns="auto 1fr auto">
                <Avatar src={image} alt={name} />

                <Typography
                  variant="h6"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  Character Details
                </Typography>

                <Button onClick={() => showSidebar(id)}>
                  <InfoIcon />
                </Button>
              </Box>

              <Divider />

              <Typography
                variant="h6"
                display="flex"
                justifyContent="center"
                alignItems="center"
                textOverflow="ellipsis"
                overflow="auto"
                whiteSpace="nowrap"
              >
                {name}
              </Typography>

              <Divider />

              <List>
                <ListItem>
                  <ListItemText primary="Species" secondary={species} />
                </ListItem>

                <ListItem>
                  <ListItemText primary="Gender" secondary={gender} />
                </ListItem>

                <ListItem>
                  <ListItemText primary="Status" secondary={status} />
                </ListItem>
              </List>

              <Button onClick={showDetails} variant="outlined">
                Hide Details
              </Button>
            </>
          ) : (
            <>
              <img src={image} draggable="false" alt={name} />

              <Typography
                variant="h6"
                display="flex"
                justifyContent="center"
                alignItems="center"
                textOverflow="ellipsis"
                overflow="auto"
                whiteSpace="nowrap"
              >
                {name}
              </Typography>

              <Button onClick={showDetails} variant="outlined">
                Show Details
              </Button>
            </>
          )}
        </CardBox>
      </CardPaper>
    </animated.div>
  );
};

const StyledDeckCardComponent = styled(DeckCardComponent)<{ zIndex: number }>`
  text-align: center;
  position: absolute;
  background-color: white;
  z-index: ${({ zIndex }) => zIndex};
`;

export const Deck = Object.assign(memo(StyledDeckComponent), {
  Card: memo(StyledDeckCardComponent),
});

