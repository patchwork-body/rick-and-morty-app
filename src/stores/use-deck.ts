import { RickAndMortyCharacter } from "../types/rick-and-morty-character";
import { create } from "./";

type DeckStore = {
  cards: Map<number, RickAndMortyCharacter>;
  addCards: (cards: RickAndMortyCharacter[]) => void;
  dropCard: (id: number) => void;
};

export const useDeck = create<DeckStore>((set) => ({
  cards: new Map([]),

  addCards: (cards) =>
    set((prev) => ({
      ...prev,
      cards: new Map(
        [...prev.cards].concat(cards.map((card) => [card.id, card]))
      ),
    })),

  dropCard: (id) =>
    set((prev) => {
      const cards = new Map(prev.cards);
      cards.delete(id);
      return { ...prev, cards };
    }),
}));
