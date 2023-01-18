import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmptyObject } from '../../types';
import * as furusatoDb from '../db/furusato';
import type { Furusato as Model } from './types';

const NAMESPACE = 'furusato';

export const getAll = createAsyncThunk<Model[], void, EmptyObject>(
  `${NAMESPACE}/getAll`,
  async (_, _thunkApi) => {
    const entities = await furusatoDb.getAll();
    return entities;
  }
);

type Add = Parameters<typeof furusatoDb['add']>[0];
type Update = Parameters<typeof furusatoDb['update']>[0];

export const add = createAsyncThunk<void, Add, EmptyObject>(
  `${NAMESPACE}/add`,
  async (entity, thunkApi) => {
    await furusatoDb.add(entity);
    thunkApi.dispatch(getAll());
  }
);

export const update = createAsyncThunk<void, Update, EmptyObject>(
  `${NAMESPACE}/update`,
  async (entity, thunkApi) => {
    await furusatoDb.update(entity);
    thunkApi.dispatch(getAll());
  }
);

const furusatoSlice = createSlice({
  name: NAMESPACE,
  initialState: {
    models: [] as Model[],
    loading: false,
  },
  reducers: {
    add(state, action: PayloadAction<Model>) {
      state.models.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.models = action.payload;
        state.loading = false;
      })
      .addCase(getAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAll.rejected, (state) => {
        state.loading = false;
      })
      .addDefaultCase((state) => {
        state.loading = false;
      });
  },
});

export default furusatoSlice;
