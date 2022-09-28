import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { EmptyObject } from '../../types';
import * as salary from '../db/salary';

const NAMESPACE = 'salary';

type Add = Parameters<typeof salary.add>[0];

export const add = createAsyncThunk<void, Add, EmptyObject>(
  `${NAMESPACE}/add`,
  async (params, _thunkApi) => {
    await salary.add(params);
    // thunkApi.dispatch(getAll());
  }
);

const salarySlice = createSlice({
  name: NAMESPACE,
  initialState: {
    list: [] as unknown[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(add.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(add.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(add.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default salarySlice;
