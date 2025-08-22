import { createSlice } from "@reduxjs/toolkit";
import { fetchKpis } from "./kpiThunks";

const kpiSlice = createSlice({
  name: "kpi",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpis.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKpis.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchKpis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default kpiSlice.reducer;
