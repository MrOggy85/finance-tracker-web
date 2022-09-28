import accountSlice from './accountSlice';
import salarySlice from './salarySlice';

const rootReducer = {
  accounts: accountSlice.reducer,
  salaries: salarySlice.reducer,
};

export default rootReducer;
