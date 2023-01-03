import { act, renderHook } from "@testing-library/react";
import { useDeck } from "./use-deck";

describe('useDeck()', () => {
  const cardExample = {
    id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', gender: 'Male', image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg', type: ''
  }

  // reset deck after each test case
  afterEach(() => {
    const {result} = renderHook(() => useDeck(state => state));
    act(() => result.current.setDeck([]));
  });

  it('add cards into the deck', () => {
    const {result} = renderHook(() => useDeck(state => state));

    expect(result.current.cards.size).toBe(0);
    act(() => result.current.addCards([cardExample]));
    expect(result.current.cards.size).toBe(1);
    act(() => result.current.addCards([cardExample, {...cardExample, id: 2}])); // INFO should be with deffirent id
    expect(result.current.cards.size).toBe(2);
  });

  it('set the deck', () => {
    const {result} = renderHook(() => useDeck(state => state));

    expect(result.current.cards.size).toBe(0);
    act(() => result.current.setDeck([cardExample]));
    expect(result.current.cards.size).toBe(1);
    act(() => result.current.setDeck([cardExample]));
    expect(result.current.cards.size).toBe(1);
  });

  it('drop a card', () => {
    const {result} = renderHook(() => useDeck(state => state));

    expect(result.current.cards.size).toBe(0);
    act(() => result.current.addCards([cardExample]));
    expect(result.current.cards.size).toBe(1);
    act(() => result.current.dropCard(cardExample.id));
    expect(result.current.cards.size).toBe(0);
  })
});
