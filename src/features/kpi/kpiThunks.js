import { createAsyncThunk } from "@reduxjs/toolkit";
import kpiApi from "../../api/kpiApi";

export const fetchKpis = createAsyncThunk("kpi/fetchKpis", async () => {
  const res = await kpiApi.getAll();
  return res.data;
});
