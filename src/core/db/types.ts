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
};
