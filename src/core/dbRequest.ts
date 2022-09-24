import { load } from './localStorage';
import request from './request';

type PostgresProxyResponse = {
  command: 'SELECT'
  query: unknown;
  rowCount: number;
  rows: (string | number)[][]
}

async function dbRequest(q: string) {
  const u = load('U');
  const pw = load('PW');
  const h = load('H');
  const port = load('PORT');
  const db = load('DB');

  const data = await request<PostgresProxyResponse>({
    path: '/',
    method: 'POST',
    data: {
      u,
      pw,
      h,
      port,
      db,
      q,
    },
  });

  return data;
}

export default dbRequest;
