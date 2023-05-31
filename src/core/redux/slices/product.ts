import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { EmptyObject } from '../../../types';
import * as product from '../../db/product';
import * as productEntry from '../../db/productEntry';
import type { Product } from '../types';

const NAMESPACE = 'product';

export const getAll = createAsyncThunk<Product[], void, EmptyObject>(
  `${NAMESPACE}/getAll`,
  async (_, _thunkApi) => {
    const productEntries = await product.getAll();

    const products: Product[] = productEntries.map((x) => {
      const dateSortedEntries = x.entries
        .sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        })
        .map((x) => ({
          id: x.id,
          price: x.price,
          personalBuyingValue: x.personalBuyingValue,
          date: x.date.toISOString(),
        }));

      // const currentBalance = dateSortedEntries[0]?. || 0;

      return {
        id: x.id,
        name: x.name,
        // currentBalance,
        entries: dateSortedEntries,
      };
    });

    return products;
  }
);

export const removeProduct = createAsyncThunk<void, number, EmptyObject>(
  `${NAMESPACE}/removeProduct`,
  async (id, thunkApi) => {
    await product.remove(id);
    thunkApi.dispatch(getAll());
  }
);

export const removeProductEntry = createAsyncThunk<void, number, EmptyObject>(
  `${NAMESPACE}/removeProductEntry`,
  async (id, thunkApi) => {
    await productEntry.remove(id);
    thunkApi.dispatch(getAll());
  }
);

export const addProduct = createAsyncThunk<void, string, EmptyObject>(
  `${NAMESPACE}/addProduct`,
  async (name, thunkApi) => {
    await product.add(name);
    thunkApi.dispatch(getAll());
  }
);

export const addProductEntry = createAsyncThunk<
  void,
  { price: number; personalBuyingValue: number; productId: number; date: Date },
  EmptyObject
>(
  `${NAMESPACE}/addProductEntry`,
  async ({ price, personalBuyingValue, productId, date }, thunkApi) => {
    await productEntry.add(price, productId, personalBuyingValue, date);
    thunkApi.dispatch(getAll());
  }
);

export const rename = createAsyncThunk<
  void,
  { id: number; name: string },
  EmptyObject
>(`${NAMESPACE}/rename`, async ({ id, name }, thunkApi) => {
  await product.updateName(id, name);
  thunkApi.dispatch(getAll());
});

export const productSlice = createSlice({
  name: NAMESPACE,
  initialState: {
    list: [] as Product[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAll.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeProduct.fulfilled, (state, _) => {
        state.loading = false;
      })
      .addCase(removeProduct.pending, (state, _) => {
        state.loading = true;
      })
      .addCase(removeProduct.rejected, (state, _) => {
        state.loading = false;
      })
      .addDefaultCase((state) => {
        state.loading = false;
      });
  },
});
