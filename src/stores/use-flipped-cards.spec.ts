import { act, renderHook } from "@testing-library/react";
import {useFlippedCards} from './use-flipped-cards'

describe('useFlippedCards', () => {
  it('initial state should be empty Set', () => {
    const { result } = renderHook(() => useFlippedCards(state => state))
    expect(result.current.flippedCardsIds).toEqual(new Set())
  })

  it('should add a card to the flipped cards and removes if already exists', () => {
    const { result } = renderHook(() => useFlippedCards(state => state))
    expect(result.current.flippedCardsIds).toEqual(new Set())
    act(() => result.current.flipCard(1));
    expect(result.current.flippedCardsIds).toEqual(new Set([1]))
    act(() => result.current.flipCard(1));
    expect(result.current.flippedCardsIds).toEqual(new Set())
  })
});

