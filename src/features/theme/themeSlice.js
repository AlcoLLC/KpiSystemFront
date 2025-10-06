import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;

  const storedTheme = localStorage.getItem('theme');

  if (storedTheme === 'dark') {
    return true;
  }
  if (storedTheme === 'light') {
    return false; 
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true; 
  }
  
  return false; 
};

const initialState = {
  isDark: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      
      if (state.isDark) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    },
    setTheme: (state, action) => {
        state.isDark = action.payload;
        if (action.payload) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;