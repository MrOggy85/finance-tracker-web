import dbRequest from '../dbRequest';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import type { Salary } from './types';

export async function getAll() {
  const salaryEntities = await dbRequest('SELECT * FROM salary');

  const salaries: Salary[] = salaryEntities.rows.map((x) => {
    const id = Number(x[13]) || -1;
    const date = String(x[0]) || '';
    const baseSalary = Number(x[1]) || -1;
    const deemedLabor = Number(x[2]) || -1;
    const insufficientDeemedLabor = Number(x[3]) || -1;
    const lifePlan = Number(x[4]) || -1;
    const lifePlanSubsidy = Number(x[5]) || -1;
    const commuterAllowance = Number(x[6]) || -1;
    const remoteWorkerPay = Number(x[7]) || -1;
    const healthInsurance = Number(x[8]) || -1;
    const pension = Number(x[9]) || -1;
    const unemployment = Number(x[10]) || -1;
    const incomeTax = Number(x[11]) || -1;
    const residentTax = Number(x[12]) || -1;

    return {
      id,
      date: format(parseISO(date), 'yyyy-MM-dd'),
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
    };
  });

  return salaries;
}

type Add = Omit<Salary, 'id' | 'date'> & {
  date: Date;
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
