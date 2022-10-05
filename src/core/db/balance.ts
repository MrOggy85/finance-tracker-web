import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import dbRequest from '../dbRequest';
import type { Balance } from './types';

function mapEntityToModel(row: (string | number)[] | undefined): Balance {
  const id = Number(row?.[0]) || -1;
  const amount = Number(row?.[1]) || 0;
  const accountId = Number(row?.[2]) || 0;
  const date = parseISO(String(row?.[3]) || '');

  return {
    id,
    amount,
    accountId,
    date,
  };
}

export async function getByAccountId(id: number): Promise<Balance[]> {
  const data = await dbRequest(
    'SELECT * FROM public.balance ' + `WHERE "balance.accountId" = ${id}`
  );

  const balances = data.rows.map(mapEntityToModel);
  return balances;
}

export async function getByAccountIds(id: number[]): Promise<Balance[]> {
  const data = await dbRequest(
    'SELECT * FROM balance ' + `WHERE "accountId" IN (${id.join(',')})`
  );

  const balances = data.rows.map(mapEntityToModel);
  return balances;
}

export async function add(amount: number, accountId: number, date: Date) {
  const sql =
    'INSERT INTO balance ("amount", "accountId", "date") ' +
    `VALUES(${amount}, ${accountId}, '${format(date, 'yyyy-MM-dd HH:MM')}')`;

  await dbRequest(sql);
}

export async function remove(id: number) {
  console.log('rm balance', id);
  const sql = 'DELETE FROM balance ' + `WHERE id = ${id};`;

  await dbRequest(sql);
}
