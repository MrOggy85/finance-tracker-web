export type Account = {
  id: number;
  name: string;
  balances: Balance[];
};

export type Balance = {
  id: number;
  amount: number;
  date: Date;
  accountId: number;
};
