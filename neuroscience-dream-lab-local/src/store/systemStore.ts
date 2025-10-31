import { create } from 'zustand'
import { SystemStatus } from '../types'

interface SystemState {
  statuses: SystemStatus[]
  setStatuses: (statuses: SystemStatus[]) => void
  updateStatus: (moduleName: string, status: Partial<SystemStatus>) => void
}

export const useSystemStore = create<SystemState>((set) => ({
  statuses: [],
  setStatuses: (statuses) => set({ statuses }),
  updateStatus: (moduleName, status) =>
    set((state) => ({
      statuses: state.statuses.map((s) =>
        s.module_name === moduleName ? { ...s, ...status } : s
      ),
    })),
}))
