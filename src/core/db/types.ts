export type Account = {
  id: number;
  name: string;
  balances: Balance[];
};

export type Balance = {
  id: number;
  amount: number;
  /**
   * example from response: "2022-03-30T20:09:39.712Z"
   * mapped using `date-fns/parseISO` into Date
   */
  date: Date;
  accountId: number;
};

export type Product = {
  id: number;
  name: string;
  entries: ProductEntry[];
};

export type ProductEntry = {
  id: number;
  price: number;
  personalBuyingValue: number;
  /**
   * example from response: "2022-03-30T20:09:39.712Z"
   * mapped using `date-fns/parseISO` into Date
   */
  date: Date;
  productId: number;
};

export type Salary = {
  id: number;
  date: string;
  baseSalary: number;
  deemedLabor: number;
  insufficientDeemedLabor: number;
  lifePlan: number;
  lifePlanSubsidy: number;
  commuterAllowance: number;
  remoteWorkerPay: number;
  healthInsurance: number;
  pension: number;
  unemployment: number;
  incomeTax: number;
  residentTax: number;
  stockOwnership: number;
  stockOwnershipSubsidy: number;
  taxExcess: number;
};

export type Furusato = {
  id: number;
  amount: number;
  boughtAt: Date;
  createdAt: Date;
  prefecture: string;
  productName: string;
};
