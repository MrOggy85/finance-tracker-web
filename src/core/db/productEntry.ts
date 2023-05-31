import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import dbRequest from '../dbRequest';
import type { ProductEntry } from './types';

/**
 * Columns
 * - id (integer, NOT NULL, Primary key)
 * - price (integer, NOT NULL)
 * - personal_buying_value (numeric, NOT NULL)
 * - date (timestamp without timezone, NOT NULL)
 * - product_id (integer, NOT NULL, foreign key)
 */
const TABLE = 'product_entry';

function mapEntityToModel(row: (string | number)[] | undefined): ProductEntry {
  const id = Number(row?.[0]) || -1;
  const price = Number(row?.[1]) || 0;
  const personalBuyingValue = Number(row?.[2]) || 0;
  const date = parseISO(String(row?.[3]) || '');
  const productId = Number(row?.[4]);

  return {
    id,
    price,
    productId,
    date,
    personalBuyingValue,
  };
}

export async function getByProductId(id: number): Promise<ProductEntry[]> {
  const data = await dbRequest(`
  SELECT * FROM ${TABLE}
  WHERE "product_id" = ${id}
`);

  const m = data.rows.map(mapEntityToModel);
  return m;
}

export async function getByProductIds(id: number[]): Promise<ProductEntry[]> {
  const data = await dbRequest(`
  SELECT * FROM ${TABLE}
  WHERE "product_id" IN (${id.join(',')})
`);

  const m = data.rows.map(mapEntityToModel);
  return m;
}

export async function add(
  price: number,
  productId: number,
  personalBuyingValue: number,
  date: Date
) {
  const sql =
    `INSERT INTO ${TABLE} ("price", "product_id", "personal_buying_value", "date") ` +
    `VALUES(${price}, ` +
    `${productId}, ` +
    `${personalBuyingValue}, ` +
    `'${format(date, 'yyyy-MM-dd HH:MM')}')
  `;

  await dbRequest(sql);
}

export async function remove(id: number) {
  const sql = `DELETE FROM ${TABLE} WHERE id = ${id};`;

  await dbRequest(sql);
}
