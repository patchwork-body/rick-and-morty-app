import { create } from ".";

export type SidebarStore = {
  detailsId: number | null;
  showSidebar: (id?: number) => void;
  hideSidebar: VoidFunction;
}

export const useSidebar = create<SidebarStore>((set) => ({
  detailsId: null,
  showSidebar: (id) => set((prev) => ({ detailsId: id ?? prev.detailsId })),
  hideSidebar: () => set(() => ({ detailsId: null })),
}))

