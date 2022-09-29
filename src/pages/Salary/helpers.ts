export function getNetSalary(grossSalary: number, totalDeductable: number) {
  return grossSalary - totalDeductable;
}

export function getGrossSalary(
  sumMonthlySalary: number,
  insufficientDeemedLabor: number,
  lifePlanSubsidy: number,
  sumAllowance: number
) {
  return (
    sumMonthlySalary + insufficientDeemedLabor + lifePlanSubsidy + sumAllowance
  );
}

export function getTotalDeductable(
  sumSocialInsurance: number,
  incomeTax: number,
  residentTax: number,
  lifePlan: number
) {
  return sumSocialInsurance + incomeTax + residentTax + lifePlan;
}

export function getSumMonthlySalary(
  baseSalary: number,
  deemedLabor: number,
  lifePlan: number
) {
  return baseSalary + deemedLabor + lifePlan;
}

export function getSumSocialInsurance(
  healthInsurance: number,
  pension: number,
  unemployment: number
) {
  return healthInsurance + pension + unemployment;
}
