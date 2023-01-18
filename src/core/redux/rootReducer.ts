import accountSlice from './accountSlice';
import furusatoSlice from './furusatoSlice';
import salarySlice from './salarySlice';

const rootReducer = {
  accounts: accountSlice.reducer,
  salaries: salarySlice.reducer,
  furusato: furusatoSlice.reducer,
};

export default rootReducer;
