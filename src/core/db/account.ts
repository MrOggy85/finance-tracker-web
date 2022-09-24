import dbRequest from '../dbRequest';
import { getByAccountIds } from './balance';
import { Account } from './types';

export async function getAll() {
  const accountEntities = await dbRequest('SELECT * FROM account');
  const accountIds: number[] = [];

  const accounts: Account[] = accountEntities.rows.map((x) => {
    const id = Number(x[0]) || -1;
    accountIds.push(id);

    const name = String(x[1]) || '';
    return {
      id,
      name,
      balances: [],
    };
  });

  const balances = await getByAccountIds(accountIds);
  balances.forEach((b) => {
    accounts.find((a) => a.id === b.accountId)?.balances.push(b);
  });

  return accounts;
}

export async function get(id: number): Promise<Account> {
  const data = await dbRequest(
    'SELECT * FROM public.account' + `WHERE id = ${id}`
  );

  const row = data.rows[0];

  // const id = Number(row[0]) || -1;
  const name = String(row?.[1]) || '';
  return {
    id,
    name,
    balances: [],
  };
}

export function add(name: string) {
  // TODO
  return {} as Promise<void>;
}

export function remove(id: number) {
  // TODO
  return {} as Promise<void>;
}

export function updateName(id: number, name: string) {
  // TODO
  return {} as Promise<void>;
}
