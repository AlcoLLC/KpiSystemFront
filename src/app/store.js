import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import kpiReducer from '../features/kpi/kpiSlice';
import tasksReducer from '../features/tasks/tasksSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    kpi: kpiReducer,
    tasks: tasksReducer
  }
});
