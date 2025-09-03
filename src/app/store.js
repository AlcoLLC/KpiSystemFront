import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import kpiReducer from '../features/kpi/kpiSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    kpi: kpiReducer
  }
});
