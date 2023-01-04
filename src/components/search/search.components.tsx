import styled from "@emotion/styled";
import { Search} from "@mui/icons-material";
import {
    ClickAwayListener,
    css,
  Paper, TextField,
} from "@mui/material";
import { animated, useSpring } from "@react-spring/web";
import { Dispatch, FC, HTMLAttributes, memo, useEffect, useState } from "react";

const FloatPaper = styled(Paper)<{open: boolean}>`
  width: 100%;
  background-color: ${({open}) => open ? '#fff' : '#4285f4'};
  color: ${({open}) => open ? '#4285f4' : 'white'};
  ${({open}) => open
    ? css`
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      padding: .5rem 1rem;
    `
    : css`
      display: flex;
      justify-content: center;
      align-items: center;
      padding: .5rem;
    `
  }
  gap: ${({open}) => open ? '0.5rem': 0};
  transition: background-color, color 0.3s ease-in-out;
`

export type FilterProps = {
  onFilter: Dispatch<string>;
} & HTMLAttributes<HTMLFormElement>;

const FilterComponent: FC<FilterProps> = ({onFilter, className}) => {
  const [{width, x, textFieldWidth, textFieldOpacity}, api] = useSpring(() => ({ textFieldWidth: 0, textFieldOpacity: 0, width: 60, x: 50 }));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      api.start({ width: 300, x: window.innerWidth / 2 - 150, textFieldWidth: 200, textFieldOpacity: 1 });
    } else {
      api.start({ width: 60, x: 50, textFieldWidth: 0, textFieldOpacity: 0 });
    }
  }, [open]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <animated.div style={{ width, x }} className={className}>
        <FloatPaper open={open} onClick={() => setOpen(true)} className={className} elevation={1}>
          <animated.div style={{ width: textFieldWidth, opacity: textFieldOpacity }}>
            <TextField onChange={(event) => onFilter(event.currentTarget.value)} autoFocus={open} placeholder="Search" variant="outlined" />
          </animated.div>

          <Search fontSize="large" />
        </FloatPaper>
      </animated.div>
    </ClickAwayListener>
  );
};

export const Filter = memo(styled(FilterComponent)`
  position: absolute;
  top: 85%;
  z-index: 100;
`);

