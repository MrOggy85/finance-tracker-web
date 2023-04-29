import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import dbRequest from '../dbRequest';
import type { Salary } from './types';

/**
 * id integer NOT NULL, PRIMARY KEY
 * date timestamp without time zone NOT NULL
 * base_salary integer NOT NULL
 * deemed_labor integer NOT NULL
 * insufficient_deemed_labor integer NOT NULL
 * life_plan integer NOT NULL
 * life_plan_subsidy integer NOT NULL
 * commuter_allowance integer NOT NULL
 * remote_worker_pay integer NOT NULL
 * health_insurance integer NOT NULL
 * pension integer NOT NULL
 * unemployment integer NOT NULL
 * income_tax integer NOT NULL
 * resident_tax integer NOT NULL
 * stock_ownership integer NOT NULL DEFAULT 0
 * stock_ownership_subsidy integer NOT NULL DEFAULT 0
 * tax_excess integer NOT NULL DEFAULT 0
 */

export async function getAll() {
  const salaryEntities = await dbRequest(
    'SELECT id,date,base_salary,deemed_labor,insufficient_deemed_labor,life_plan,life_plan_subsidy,commuter_allowance,remote_worker_pay,health_insurance,pension,unemployment,income_tax,resident_tax,stock_ownership,stock_ownership_subsidy,tax_excess FROM salary'
  );

  const salaries: Salary[] = salaryEntities.rows.map((x) => {
    const id = Number(x[0]) || -1;
    const date = String(x[1]) || '';
    const baseSalary = Number(x[2]) || -1;
    const deemedLabor = Number(x[3]) || -1;
    const insufficientDeemedLabor = Number(x[4]) || -1;
    const lifePlan = Number(x[5]) || -1;
    const lifePlanSubsidy = Number(x[6]) || -1;
    const commuterAllowance = Number(x[7]) || -1;
    const remoteWorkerPay = Number(x[8]) || -1;
    const healthInsurance = Number(x[9]) || -1;
    const pension = Number(x[10]) || -1;
    const unemployment = Number(x[11]) || -1;
    const incomeTax = Number(x[12]) || -1;
    const residentTax = Number(x[13]) || -1;
    const stockOwnership = Number(x[14]) || -1;
    const stockOwnershipSubsidy = Number(x[15]) || -1;
    const taxExcess = Number(x[16]) || -1;

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
      stockOwnership,
      stockOwnershipSubsidy,
      taxExcess,
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
  stockOwnership,
  stockOwnershipSubsidy,
  taxExcess,
}: Add) {
  const sql =
    'INSERT INTO salary (' +
    '"date", "base_salary", "deemed_labor" ,"insufficient_deemed_labor", ' +
    '"life_plan", "life_plan_subsidy", "commuter_allowance", "remote_worker_pay", ' +
    '"health_insurance", "pension", "unemployment", "income_tax", "resident_tax", ' +
    '"stock_ownership", "stock_ownership_subsidy", "tax_excess") ' +
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
    `${residentTax},` +
    `${stockOwnership},` +
    `${stockOwnershipSubsidy},` +
    `${taxExcess}` +
    ')';

  await dbRequest(sql);
}

export async function remove(id: number) {
  const sql = 'DELETE FROM salary ' + `WHERE id = ${id};`;
  await dbRequest(sql);
}
