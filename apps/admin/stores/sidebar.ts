import { create } from "zustand"

interface CalendarState {
  opened: boolean
  onChange: (opened: boolean) => void
}

const useSiderbarStore = create<CalendarState>((set) => ({
  opened: false,
  onChange: (opened) => set(() => ({ opened })),
}))

export default useSiderbarStore
