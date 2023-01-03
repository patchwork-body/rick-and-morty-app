import styled from "@emotion/styled";
import {
  Autocomplete,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, FormEventHandler, HTMLAttributes, memo, useState } from "react";

export type SearchProps = {} & HTMLAttributes<HTMLFormElement>;

const SearchDetails = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 20px;

  @media (max-width: 600px) {
    grid-auto-flow: row;
  }
`;

const StyledFormControl = styled(FormControl)`
  display: grid;
  grid-gap: 10px;
`;

const StyledDialogContent = styled(DialogContent)`
  display: grid;
  grid-gap: 10px;
  overflow: visible;

  @media (min-width: 620px) {
    min-width: 530px;
  }
`;

const SearchComponent: FC<SearchProps> = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch: FormEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={open} fullScreen={fullScreen} className={props.className}>
        <StyledFormControl onSubmit={handleSearch}>
          <DialogTitle>Search</DialogTitle>

          <StyledDialogContent>
            <TextField label="Name" />

            <SearchDetails>
              <Autocomplete
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} label="Species" />
                )}
              />

              <Autocomplete
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} label="Gender" />
                )}
              />

              <Autocomplete
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} label="Status" />
                )}
              />
            </SearchDetails>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" color="primary">
                Search
              </Button>
            </DialogActions>
          </StyledDialogContent>
        </StyledFormControl>
      </Dialog>
    </ClickAwayListener>
  );
};

export const Search = memo(styled(SearchComponent)``);
