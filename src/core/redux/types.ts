type Balance = {
  id: number;
  amount: number;
  /**
   * Date in ISO Format
   * e.g: "2023-05-10T11:05:00.000Z"
   */
  date: string;
};

export type Account = {
  id: number;
  name: string;
  currentBalance: number;
  balances: Balance[];
};

export type Furusato = {
  id: number;
  amount: number;
  boughtAt: string;
  createdAt: string;
  prefecture: string;
  productName: string;
};

export type Product = {
  id: number;
  name: string;
  entries: ProductEntry[];
};

type ProductEntry = {
  id: number;
  price: number;
  personalBuyingValue: number;
  /**
   * Date in ISO Format
   * e.g: "2023-05-10T11:05:00.000Z"
   */
  date: string;
};
