import create from 'zustand';

interface AppStore {
  // Holds the current user session data, if any
  session: any;
  setSession: (session: any) => void;
  // Holds the current theme mode for the app
  uiTheme: 'light' | 'dark';
  setUiTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  uiTheme: 'light',
  setUiTheme: (theme) => set({ uiTheme: theme })
})); 