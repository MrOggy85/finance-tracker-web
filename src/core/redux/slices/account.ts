import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { EmptyObject } from '../../../types';
import * as account from '../../db/account';
import * as balance from '../../db/balance';
import type { Account } from '../types';

const NAMESPACE = 'account';

export const getAll = createAsyncThunk<Account[], void, EmptyObject>(
  `${NAMESPACE}/getAll`,
  async (_, _thunkApi) => {
    const accountEntities = await account.getAll();

    const accounts: Account[] = accountEntities.map((x) => {
      const dateSortedBalances = x.balances
        .sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        })
        .map((x) => ({
          id: x.id,
          amount: x.amount,
          date: x.date.toISOString(),
        }));

      const currentBalance = dateSortedBalances[0]?.amount || 0;

      return {
        id: x.id,
        name: x.name,
        currentBalance,
        balances: dateSortedBalances,
      };
    });

    return accounts;
  }
);

export const removeAccount = createAsyncThunk<void, number, EmptyObject>(
  `${NAMESPACE}/removeAccount`,
  async (id, thunkApi) => {
    await account.remove(id);
    thunkApi.dispatch(getAll());
  }
);

export const removeBalance = createAsyncThunk<void, number, EmptyObject>(
  `${NAMESPACE}/removeBalance`,
  async (id, thunkApi) => {
    await balance.remove(id);
    thunkApi.dispatch(getAll());
  }
);

export const addAccount = createAsyncThunk<void, string, EmptyObject>(
  `${NAMESPACE}/addAccount`,
  async (name, thunkApi) => {
    await account.add(name);
    thunkApi.dispatch(getAll());
  }
);

export const addBalance = createAsyncThunk<
  void,
  { amount: number; id: number; date: Date },
  EmptyObject
>(`${NAMESPACE}/addBalance`, async ({ amount, id, date }, thunkApi) => {
  await balance.add(amount, id, date);
  thunkApi.dispatch(getAll());
});

export const rename = createAsyncThunk<
  void,
  { id: number; name: string },
  EmptyObject
>(`${NAMESPACE}/rename`, async ({ id, name }, thunkApi) => {
  await account.updateName(id, name);
  thunkApi.dispatch(getAll());
});

export const accountSlice = createSlice({
  name: NAMESPACE,
  initialState: {
    accounts: [] as Account[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.accounts = action.payload;
        state.loading = false;
      })
      .addCase(getAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAll.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeAccount.fulfilled, (state, _) => {
        state.loading = false;
      })
      .addCase(removeAccount.pending, (state, _) => {
        state.loading = true;
      })
      .addCase(removeAccount.rejected, (state, _) => {
        state.loading = false;
      })
      .addDefaultCase((state) => {
        state.loading = false;
      });
  },
});
