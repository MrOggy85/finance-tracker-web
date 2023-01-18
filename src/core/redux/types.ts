type Balance = {
  id: number;
  amount: number;
  /**
   * Date in ISO Format
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
