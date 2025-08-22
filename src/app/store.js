import { configureStore } from "@reduxjs/toolkit";
import kpiReducer from "../features/kpi/kpiSlice";

export const store = configureStore({
  reducer: {
    kpi: kpiReducer,
  },
});
