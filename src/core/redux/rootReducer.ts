import { accountSlice } from './slices/account';
import { furusatoSlice } from './slices/furusato';
import { salarySlice } from './slices/salary';
import { productSlice } from './slices/product';

const rootReducer = {
  accounts: accountSlice.reducer,
  salaries: salarySlice.reducer,
  furusato: furusatoSlice.reducer,
  product: productSlice.reducer,
};

export default rootReducer;
