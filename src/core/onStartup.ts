import store from './redux/store';
import { getAll as getAllAccounts } from './redux/accountSlice';

async function onStartup() {
  await store.dispatch(getAllAccounts());
}

export default onStartup;
