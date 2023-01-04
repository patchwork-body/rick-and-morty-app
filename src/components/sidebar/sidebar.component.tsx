import {Backdrop, CircularProgress, ClickAwayListener, Divider, List, ListItem, ListItemText, SwipeableDrawer, Typography} from '@mui/material';
import { useSidebar } from "../../stores/use-sidebar";
import { FC, memo } from 'react';
import { useRickAndMortyCharacterById } from '../../hooks/use-rick-and-morty-character-by-id';
import { Center } from '../center/center.component';
import styled from '@emotion/styled';

const SidebarContent = styled.div`
  width: 25vw;

  @media (max-width: 600px) {
    width: 100vw;
  }
`

type SidebarListProps = {
  items: Record<string, string | number>;
}

export const SidebarList: FC<SidebarListProps> = ({items}) => {
  return <List>
    {Object.entries(items).map(([key, value]) => <ListItem key={key}>
      <ListItemText primary={key} secondary={value} />
    </ListItem>)}
  </List>
}

const SidebarComponent = () => {
  const {detailsId, showSidebar, hideSidebar} = useSidebar((state) => state);
  const open = detailsId !== null;
  const {loading, error, character} = useRickAndMortyCharacterById(detailsId);

  return <ClickAwayListener onClickAway={hideSidebar}>
    <>
      <SwipeableDrawer
        
        anchor="right"
        open={open}
        onClose={hideSidebar}
        onOpen={() => showSidebar()}
      >
        <SidebarContent>
          {loading && <Center>
            <CircularProgress />
          </Center>}

          {!loading && !error && character && <>
            <Typography variant="h4" component="h1" align="center" margin="20px 0 10px">
              {character.name}
            </Typography>

            <Divider />
            <Typography margin="20px 0 10px" variant="h6" align="center">Origin</Typography>
            <SidebarList items={character.origin} />
            <Divider />
            <Typography margin="20px 0 10px" variant="h6" align="center">Location</Typography>
            <SidebarList items={character.location} />
            <Divider />
            <Typography margin="20px 0 10px"  variant="h6" align="center">Episodes</Typography>
            {character.episode.map((episode) => <>
              <SidebarList key={episode.id} items={episode} />
              <Divider />
            </>)}
            <Divider />
          </>}
        </SidebarContent>
      </SwipeableDrawer>

      <Backdrop open={open} />
    </>
  </ClickAwayListener>;
}

export const Sidebar = memo(SidebarComponent);
