export function getNetSalary(grossSalary: number, totalDeductible: number) {
  return grossSalary - totalDeductible;
}

export function getGrossSalary(
  sumMonthlySalary: number,
  insufficientDeemedLabor: number,
  lifePlanSubsidy: number,
  sumAllowance: number,
  stockOwnershipSubsidy: number
) {
  return (
    sumMonthlySalary +
    insufficientDeemedLabor +
    lifePlanSubsidy +
    sumAllowance +
    stockOwnershipSubsidy
  );
}

export function getTotalDeductibles(
  sumSocialInsurance: number,
  incomeTax: number,
  residentTax: number,
  lifePlan: number,
  stockOwnership: number,
  /**
   * 過不足税額
   */
  taxExcess: number
) {
  return (
    sumSocialInsurance +
    incomeTax +
    residentTax +
    lifePlan +
    stockOwnership -
    taxExcess
  );
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
