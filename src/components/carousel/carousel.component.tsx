import { Button, Paper, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import {
  FC,
  memo,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type CarouselProps = {
  children: ReactNode;
};

const itemWidth = 325;

const CarouselComponent: FC<CarouselProps> = ({ children }) => {
  const [{ x, scale }, api] = useSpring(() => ({ x: 0, scale: 1 }));
  const [position, setPosition] = useState(0);

  const bind = useDrag(({ down, delta: [dx], movement: [mx] }) => {
    if (-10 > dx || dx > 10) {
      setPosition((prev) =>
        Math.min(
          0,
          dx > 10 ? prev + itemWidth : dx < -10 ? prev + -itemWidth : prev
        )
      );
    } else {
      api.start({ x: down ? position + mx : position, scale: down ? 1.1 : 1 });
    }
  });

  useEffect(() => {
    api.stop();
  }, []);

  useEffect(() => {
    api.start({ x: position, scale: 1 });
  }, [position, api.start]);

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        scale,
        touchAction: "none",
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: "10px",
        gridGap: "1rem",
      }}
    >
      {children}
    </animated.div>
  );
};

export type CarouselItemProps = {
  index: number;
  name: string;
  imageURL: string;
};

export const CarouselItem: FC<CarouselItemProps> = ({ name, imageURL }) => {
  const [{ rotateY }, api] = useSpring(() => ({ rotateY: 0 }));
  const [isFlipped, setIsFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  const showDetails: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    api.start({ rotateY: isFlipped ? 0 : 180 });
    setIsFlipped((prev) => !prev);
  };

  return (
    <animated.div style={{ rotateY }}>
      <Paper
        ref={ref}
        elevation={3}
        style={{ minWidth: 300, padding: "10px", height: "100%" }}
      >
        {isFlipped ? (
          <animated.div style={{ rotateY: "180deg" }}>
            <Typography variant="subtitle1" style={{ marginTop: "1rem" }}>
              {name}
            </Typography>
            <Button onClick={showDetails}>Details</Button>
          </animated.div>
        ) : (
          <>
            <img
              src={imageURL}
              alt={name}
              style={{ width: "100%", borderRadius: "4px" }}
              draggable="false"
            />
            <Typography variant="subtitle1">{name}</Typography>
            <Button onClick={showDetails}>Details</Button>
          </>
        )}
      </Paper>
    </animated.div>
  );
};

export const Carousel = Object.assign(memo(CarouselComponent), {
  Item: memo(CarouselItem),
});
