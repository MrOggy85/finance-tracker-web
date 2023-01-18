import format from 'date-fns/format';
import dbRequest from '../dbRequest';
import type { Furusato as Model } from '../redux/types';

const TABLE = 'furusato';

function mapEntityToModel(row: (string | number)[] | undefined): Model {
  const id = Number(row?.[0]) || -1;
  const amount = Number(row?.[1]) || 0;
  const createdAt = String(row?.[2]) || '';
  const boughtAt = String(row?.[3]) || '';
  const prefecture = String(row?.[4]) || '';
  const productName = String(row?.[5]) || '';

  return {
    id,
    amount,
    createdAt,
    boughtAt,
    prefecture,
    productName,
  };
}

export async function getAll() {
  const entities = await dbRequest(`SELECT * FROM ${TABLE}`);
  const models = entities.rows.map(mapEntityToModel);
  return models;
}

type Add = {
  amount: number;
  boughtAt: Date;
  prefecture: string;
  productName: string;
};

export async function add({ amount, boughtAt, prefecture, productName }: Add) {
  const sql =
    `INSERT INTO ${TABLE} ("amount", "bought_at", "prefecture", "product_name") ` +
    `VALUES(${amount}, '${format(
      boughtAt,
      'yyyy-MM-dd HH:MM'
    )}', '${prefecture}', '${productName}')`;

  await dbRequest(sql);
}

type Update = Add & {
  id: number;
};

export async function update({
  id,
  amount,
  boughtAt,
  prefecture,
  productName,
}: Update) {
  const sql =
    `UPDATE ${TABLE} ` +
    'SET ' +
    `"amount" = ${amount},` +
    `"bought_at" = '${format(boughtAt, 'yyyy-MM-dd HH:MM')}',` +
    `"prefecture" = '${prefecture}',` +
    `"product_name" = '${productName}' ` +
    `WHERE id = ${id};`;

  await dbRequest(sql);
}

export async function remove(id: number) {
  const sql = `DELETE FROM ${TABLE} WHERE id = ${id};`;

  await dbRequest(sql);
}
