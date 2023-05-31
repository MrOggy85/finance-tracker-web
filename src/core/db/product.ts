import dbRequest from '../dbRequest';
import { getByProductIds } from './productEntry';
import { Product } from './types';

/**
 * Columns
 * - id (integer, NOT NULL, Primary key)
 * - name (string)
 */
const TABLE = 'product';

export async function getAll() {
  const response = await dbRequest(`SELECT * FROM ${TABLE}`);
  const ids: number[] = [];

  const models: Product[] = response.rows.map((x) => {
    const id = Number(x[0]) || -1;
    const name = String(x[1]) || '';

    ids.push(id);

    return {
      id,
      name,
      entries: [],
    };
  });

  const entries = await getByProductIds(ids);
  entries.forEach((b) => {
    models.find((a) => a.id === b.productId)?.entries.push(b);
  });

  return models;
}

export async function get(id: number): Promise<Product> {
  const data = await dbRequest(`
  SELECT * FROM public.product
  WHERE id = ${id}
`);

  const row = data.rows[0];

  const name = String(row?.[1]) || '';
  return {
    id,
    name,
    entries: [],
  };
}

export async function add(name: string): Promise<void> {
  const sql = 'INSERT INTO public.product ("name") ' + `VALUES('${name}')`;

  await dbRequest(sql);
}

export async function remove(id: number) {
  const sql = `DELETE FROM public.product WHERE id = ${id};`;
  await dbRequest(sql);
}

export async function updateName(id: number, name: string) {
  const sql =
    'UPDATE public.product ' + `SET "name" = '${name}' ` + `WHERE id = ${id};`;

  await dbRequest(sql);
}
