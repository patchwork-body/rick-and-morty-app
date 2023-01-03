import {create} from './'

type FlippedCardsStore = {
  flippedCardsIds: Set<number>
  flipCard: (id: number) => void
}

export const useFlippedCards = create<FlippedCardsStore>((set) => ({
  flippedCardsIds: new Set(),
  flipCard: (id: number) => set(prev => {
    if (prev.flippedCardsIds.has(id)) {
      const flippedCardsIds = new Set(prev.flippedCardsIds)
      flippedCardsIds.delete(id)
      return { ...prev, flippedCardsIds: flippedCardsIds }
    } 

    return { ...prev, flippedCardsIds: new Set([...prev.flippedCardsIds, id]) }
  }),
}))
