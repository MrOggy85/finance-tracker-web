import dbRequest from '../dbRequest';
import format from 'date-fns/format';

type Add = {
  date: Date;
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
};

export async function add({
  date,
  baseSalary,
  deemedLabor,
  insufficientDeemedLabor,
  lifePlan,
  lifePlanSubsidy,
  commuterAllowance,
  remoteWorkerPay,
  healthInsurance,
  pension,
  unemployment,
  incomeTax,
  residentTax,
}: Add) {
  const sql =
    'INSERT INTO salary (' +
    '"date", "base_salary", "deemed_labor" ,"insufficient_deemed_labor", ' +
    '"life_plan", "life_plan_subsidy", "commuter_allowance", "remote_worker_pay", ' +
    '"health_insurance", "pension", "unemployment", "income_tax", "resident_tax") ' +
    'VALUES(' +
    `'${format(date, 'yyyy-MM-dd HH:MM')}',` +
    `${baseSalary},` +
    `${deemedLabor},` +
    `${insufficientDeemedLabor},` +
    `${lifePlan},` +
    `${lifePlanSubsidy},` +
    `${commuterAllowance},` +
    `${remoteWorkerPay},` +
    `${healthInsurance},` +
    `${pension},` +
    `${unemployment},` +
    `${incomeTax},` +
    `${residentTax}` +
    ')';

  await dbRequest(sql);
}
