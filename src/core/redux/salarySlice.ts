import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { EmptyObject } from '../../types';
import * as salary from '../db/salary';
import type { Salary } from '../db/types';

const NAMESPACE = 'salary';

export const getAll = createAsyncThunk<Salary[], void, EmptyObject>(
  `${NAMESPACE}/getAll`,
  async (_params, _thunkApi) => {
    const salaries = await salary.getAll();
    return salaries;
  }
);

type Add = Parameters<typeof salary.add>[0];

export const add = createAsyncThunk<void, Add, EmptyObject>(
  `${NAMESPACE}/add`,
  async (params, thunkApi) => {
    await salary.add(params);
    thunkApi.dispatch(getAll());
  }
);

export const remove = createAsyncThunk<void, number, EmptyObject>(
  `${NAMESPACE}/remove`,
  async (id, thunkApi) => {
    await salary.remove(id);
    thunkApi.dispatch(getAll());
  }
);

const salarySlice = createSlice({
  name: NAMESPACE,
  initialState: {
    list: [] as Salary[],
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

    builder.addCase(getAll.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAll.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });
    builder.addCase(getAll.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(remove.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(remove.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(remove.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default salarySlice;
