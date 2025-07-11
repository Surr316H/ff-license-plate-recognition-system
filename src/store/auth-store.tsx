import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserRole } from "./constants"

interface State {
  userName: string
  isAuthenticated: boolean
  role: UserRole | null
}

interface Action {
  login: ({ userName, role, isAuthenticated }: 
    { userName: State['userName'], role: State['role'], isAuthenticated: State['isAuthenticated']} ) => void
  logout: () => void
}

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      userName: '',
      isAuthenticated: false,
      role: null,
      login: ({ userName, role, isAuthenticated }) => set(() => ({ userName, role, isAuthenticated })),
      logout: () => set(() => ({ userName: '', isAuthenticated: false, role: null }))
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        userName: state.userName, 
        role: state.role,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)