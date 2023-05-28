import { accountSlice } from './slices/account';
import { furusatoSlice } from './slices/furusato';
import { salarySlice } from './slices/salary';

const rootReducer = {
  accounts: accountSlice.reducer,
  salaries: salarySlice.reducer,
  furusato: furusatoSlice.reducer,
};

export default rootReducer;
