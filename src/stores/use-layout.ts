import {create} from './'

type LayoutStore = {
  layout: 'grid' | 'stack'
  showGrid: () => void
  showStack: () => void
}

export const useLayout = create<LayoutStore>((set) => ({
  layout: 'stack',
  showGrid: () => set((prev) => ({ ...prev, layout: 'grid' })),
  showStack: () => set((prev) => ({ ...prev, layout: 'stack' })),
}))

