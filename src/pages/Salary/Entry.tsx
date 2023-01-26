import format from 'date-fns/format';
import { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import displayInYen from '../../core/displayInYen';
import { add } from '../../core/redux/salarySlice';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import {
  getGrossSalary,
  getNetSalary,
  getSumMonthlySalary,
  getSumSocialInsurance,
  getTotalDeductable,
} from './helpers';

const BASE_SALARY = ['基本給'];
const DEEMED_LABOR = [
  'みなし労働給（45時間相当）',
  'Wages for imputed labor (equivalent to 45h)',
];
const INSUFFICIENT_DEEMED_LABOR = ['不足控除'];
const COMMUTER_ALLOWENCE = ['通勤手当, 在宅手当'];
const LIFE_PLAN_ALLOWANCE = [
  'LP(拠出金)',
  'ライフプラン手当',
  'contribution to pension plan',
  '確定拠出年金へ拠出できる額',
];
const LIFE_PLAN_SUBSIDY = ['確拠奨励金', '（掛金×10％）', 'Premium 10%'];

const _OVERTIME_PAY = ['超過勤務手当'];
const _EQUALIZATION_PAY = ['調整給'];
const REMOTE_WORKER_PAY = ['R W 手当'];

const SUM_MONTHLY_SALARY = ['月額給与'];

// DEDUCTIONS
const HEALTH_INSURANCE = ['健康保険料'];
const PENSION = ['厚生年金', '厚生年金保険料'];
const UNEMPLOYMENT = ['雇用保険', '雇用保険料'];
const SUM_SOCIAL_INSURANCE = ['社保合計額'];

// TAX
const INCOME_TAX = ['所得税'];
const RESIDENT_TAX = ['住民税'];
const TAXABLE_INCOME = ['課税対象額'];
const TAX_EXCESS = ['過不足税額', 'Usually end-of-year'];

const STOCK_PROGRAM = ['持株会積立'];
const STOCK_PROGRAM_SUBSIDY = ['持株奨励金'];

const Salary = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [baseSalary, setBaseSalary] = useState('');
  const [deemedLabor, setDeemedLabor] = useState('');
  const [insufficientDeemedLabor, setInsufficientDeemedLabor] = useState('');
  const [lifePlan, setLifePlan] = useState('');
  const [lifePlanSubsidy, setLifePlanSubsidy] = useState('');
  const [commuterAllowance, setCommuterAllowance] = useState('');
  const [remoteWorkerPay, setRemoteWorkerPay] = useState('');

  const [healthInsurance, setHealthInsurance] = useState('');
  const [pension, setPension] = useState('');
  const [unemployment, setUnemployment] = useState('');

  const [incomeTax, setIncomeTax] = useState('');
  const [residentTax, setResidentTax] = useState('');

  const [stockOwnership, setStockOwnership] = useState('');
  const [stockOwnershipSubsidy, setStockOwnershipSubsidy] = useState('');
  const [taxExcess, setTaxExcess] = useState('');

  const sumMonthlySalary = getSumMonthlySalary(
    Number(baseSalary),
    Number(deemedLabor),
    Number(lifePlan)
  );

  const sumSocialInsurance = getSumSocialInsurance(
    Number(healthInsurance),
    Number(pension),
    Number(unemployment)
  );

  const sumAllowance = Number(commuterAllowance) + Number(remoteWorkerPay);

  const taxableIncome =
    Number(baseSalary) +
    Number(deemedLabor) +
    Number(insufficientDeemedLabor) -
    sumSocialInsurance +
    Number(lifePlanSubsidy) +
    sumAllowance +
    Number(stockOwnershipSubsidy);

  const totalDeductable = getTotalDeductable(
    sumSocialInsurance,
    Number(incomeTax),
    Number(residentTax),
    Number(lifePlan),
    Number(stockOwnership),
    Number(taxExcess)
  );

  const grossSalary = getGrossSalary(
    sumMonthlySalary,
    Number(insufficientDeemedLabor),
    Number(lifePlanSubsidy),
    sumAllowance,
    Number(stockOwnershipSubsidy)
  );

  const netSalary = getNetSalary(grossSalary, totalDeductable);

  const onClick = async () => {
    const action = await dispatch(
      add({
        date,
        baseSalary: Number(baseSalary),
        deemedLabor: Number(deemedLabor),
        insufficientDeemedLabor: Number(insufficientDeemedLabor),
        lifePlan: Number(lifePlan),
        lifePlanSubsidy: Number(lifePlanSubsidy),
        commuterAllowance: Number(commuterAllowance),
        remoteWorkerPay: Number(remoteWorkerPay),
        healthInsurance: Number(healthInsurance),
        pension: Number(pension),
        unemployment: Number(unemployment),
        incomeTax: Number(incomeTax),
        residentTax: Number(residentTax),
        stockOwnership: Number(stockOwnership),
        stockOwnershipSubsidy: Number(stockOwnershipSubsidy),
        taxExcess: Number(taxExcess),
      })
    );

    if (action.type === add.fulfilled.type) {
      navigate('/salary');
    } else {
      alert('Something went wrong');
    }
  };

  return (
    <Container style={{ marginTop: 10, marginBottom: 30 }}>
      <Link to="/salary">
        <Button style={{ marginBottom: 15 }}>Back</Button>
      </Link>

      <Input
        label="Payment Date"
        type="date"
        value={format(date, 'yyyy-MM-dd')}
        onChange={(value) => {
          setDate(new Date(value));
        }}
      />

      <Container style={{ background: '#63a4e62b', paddingBottom: 5 }}>
        <h2>Income</h2>
        <Input
          label="Base Salary"
          subLabel={BASE_SALARY}
          value={baseSalary}
          onChange={setBaseSalary}
          type="number"
        />
        <Input
          label="Deemed Labor"
          subLabel={DEEMED_LABOR}
          value={deemedLabor}
          onChange={setDeemedLabor}
          type="number"
        />
        <Input
          label="Insufficient Deemed Labor (if negative, input negative number)"
          subLabel={INSUFFICIENT_DEEMED_LABOR}
          value={insufficientDeemedLabor}
          onChange={setInsufficientDeemedLabor}
          type="number"
        />
        <Input
          label="Life plan allowance"
          subLabel={LIFE_PLAN_ALLOWANCE}
          value={lifePlan}
          onChange={setLifePlan}
          type="number"
        />
        <Input
          label="Life plan Subsidy"
          subLabel={LIFE_PLAN_SUBSIDY}
          value={lifePlanSubsidy}
          onChange={setLifePlanSubsidy}
          type="number"
        />

        <Alert>
          <p>
            SUM MONTHLY_SALARY {`(${SUM_MONTHLY_SALARY.join('/n')})`}:{' '}
            {displayInYen(sumMonthlySalary)}
          </p>
          <p>({'Base Salary + Deemed Labor + Life Plan'})</p>
        </Alert>
      </Container>
      <Input
        label="Commuter allowance"
        subLabel={COMMUTER_ALLOWENCE}
        value={commuterAllowance}
        onChange={setCommuterAllowance}
        type="number"
      />
      <Input
        label="Remote Worker Pay"
        subLabel={REMOTE_WORKER_PAY}
        value={remoteWorkerPay}
        onChange={setRemoteWorkerPay}
        type="number"
      />
      <Alert>
        <p>
          SUM ALLOWANCE:
          {displayInYen(sumAllowance)}
        </p>
        <p>({'Commuter Allowance + Remote Worker Pay'})</p>
      </Alert>
      <Container style={{ background: '#c4b96121', paddingBottom: 5 }}>
        <h2>Insurance</h2>
        <Input
          label="Health Insurance"
          subLabel={HEALTH_INSURANCE}
          value={healthInsurance}
          onChange={setHealthInsurance}
          type="number"
        />
        <Input
          label="Pension"
          subLabel={PENSION}
          value={pension}
          onChange={setPension}
          type="number"
        />
        <Input
          label="Unemployment Insurance"
          subLabel={UNEMPLOYMENT}
          value={unemployment}
          onChange={setUnemployment}
          type="number"
        />
        <Alert variant="warning">
          <p>
            SUM SOCIAL_INSURANCE {`(${SUM_SOCIAL_INSURANCE.join('/n')})`}:{' '}
            {displayInYen(sumSocialInsurance)}
          </p>
          <p>({'Health Insurance + Pension + Unemployment Insurance'})</p>
        </Alert>
      </Container>

      <Container style={{ background: '#63a4e62b', paddingBottom: 5 }}>
        <h2>Employee Stock Program</h2>
        <Input
          label="Stock Ownership"
          subLabel={STOCK_PROGRAM}
          value={stockOwnership}
          onChange={setStockOwnership}
          type="number"
        />
        <Input
          label="Stock Ownership Subsidy"
          subLabel={STOCK_PROGRAM_SUBSIDY}
          value={stockOwnershipSubsidy}
          onChange={setStockOwnershipSubsidy}
          type="number"
        />
      </Container>

      <Container style={{ background: '#e663a92b', paddingBottom: 5 }}>
        <h2>Tax</h2>
        <Alert variant="danger">
          <p>
            Taxable Income {`(${TAXABLE_INCOME.join('/n')})`}:{' '}
            {displayInYen(taxableIncome)}
          </p>
        </Alert>
        <Input
          label="Income Tax"
          subLabel={INCOME_TAX}
          value={incomeTax}
          onChange={setIncomeTax}
          type="number"
        />
        <Alert variant="danger">
          <p>
            Income Tax Rate:
            {Number(incomeTax) / taxableIncome}
          </p>
        </Alert>
        <Input
          label="Resident Tax"
          subLabel={RESIDENT_TAX}
          value={residentTax}
          onChange={setResidentTax}
          type="number"
        />
        <Input
          label="Tax Excess"
          subLabel={TAX_EXCESS}
          value={taxExcess}
          onChange={setTaxExcess}
          type="number"
        />
      </Container>
      <Container style={{ background: '#a2e76d2b', paddingBottom: 5 }}>
        <h2>Summary</h2>
        <Alert variant="success">
          <p>
            Gross Salary (総支給額):
            {displayInYen(grossSalary)}
          </p>
          <p>
            Total Deductable (総控除額):
            {displayInYen(totalDeductable)}
          </p>
          <p>
            Net Salary (差引支給額):
            {displayInYen(netSalary)}
          </p>
        </Alert>
      </Container>
      <Button
        color="primary"
        onClick={onClick}
        style={{ marginBottom: 15, marginTop: 15 }}
      >
        Save
      </Button>
    </Container>
  );
};

export default Salary;
