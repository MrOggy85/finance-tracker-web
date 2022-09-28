import format from 'date-fns/format';
import { useState } from 'react';
import { Container, Button, Alert, FormLabel } from 'react-bootstrap';
import Input from '../../components/Input';
import displayInYen from '../../core/displayInYen';
import { add } from '../../core/redux/salarySlice';
import { useAppDispatch } from '../../core/redux/useAppDispatch';

const BASE_SALARY = ['基本給'];
const DEEMED_LABOR = [
  'みなし労働給（45時間相当）',
  'Wages for imputed labor (equivalent to 45h)',
];
const INSUFFICIENT_DEEMED_LABOR = ['不足控除'];
const hej = ['在宅手当'];
const COMMUTER_ALLOWENCE = ['通勤手当'];
const LIFE_PLAN_ALLOWANCE = [
  'LP(拠出金)',
  'ライフプラン手当',
  'contribution to pension plan',
  '確定拠出年金へ拠出できる額',
];
const LIFE_PLAN_SUBSIDY = ['確拠奨励金', '（掛金×10％）', 'Premium 10%'];

const OVERTIME_PAY = ['超過勤務手当'];
const EQUALIZATION_PAY = ['調整給'];
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

const Salary = () => {
  const dispatch = useAppDispatch();

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

  const sumMonthlySalary =
    Number(baseSalary) + Number(deemedLabor) + Number(lifePlan);

  const sumSocialInsurance =
    Number(healthInsurance) + Number(pension) + Number(unemployment);

  const sumAllowance = Number(commuterAllowance) + Number(remoteWorkerPay);

  // const employmentIncomeDeduction = sumMonthlySalary * 0.1;
  const taxableIncome =
    Number(baseSalary) +
    Number(deemedLabor) +
    Number(insufficientDeemedLabor) -
    sumSocialInsurance +
    Number(lifePlanSubsidy) +
    sumAllowance;

  const totalDeductable =
    sumSocialInsurance +
    Number(incomeTax) +
    Number(residentTax) +
    Number(lifePlan);
  const grossSalary =
    sumMonthlySalary +
    Number(insufficientDeemedLabor) +
    Number(lifePlanSubsidy) +
    sumAllowance;

  const onClick = () => {
    dispatch(
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
      })
    );
  };

  return (
    <Container style={{ marginTop: 10, marginBottom: 30 }}>
      <Input
        label="Payment Date"
        type="date"
        value={format(date, 'yyyy-MM-dd')}
        setValue={(value) => {
          setDate(new Date(value));
        }}
      />

      <Container style={{ background: '#63a4e62b', paddingBottom: 5 }}>
        <h2>Income</h2>
        <Input
          label="Base Salary"
          subLabel={BASE_SALARY}
          value={baseSalary}
          setValue={setBaseSalary}
          type="number"
        />
        <Input
          label="Deemed Labor"
          subLabel={DEEMED_LABOR}
          value={deemedLabor}
          setValue={setDeemedLabor}
          type="number"
        />
        <Input
          label="Insufficient Deemed Labor"
          subLabel={INSUFFICIENT_DEEMED_LABOR}
          value={insufficientDeemedLabor}
          setValue={setInsufficientDeemedLabor}
          type="number"
        />
        <Input
          label="Life plan allowance"
          subLabel={LIFE_PLAN_ALLOWANCE}
          value={lifePlan}
          setValue={setLifePlan}
          type="number"
        />
        <Input
          label="Life plan Subsidy"
          subLabel={LIFE_PLAN_SUBSIDY}
          value={lifePlanSubsidy}
          setValue={setLifePlanSubsidy}
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
        setValue={setCommuterAllowance}
        type="number"
      />
      <Input
        label="Remote Worker Pay"
        subLabel={REMOTE_WORKER_PAY}
        value={remoteWorkerPay}
        setValue={setRemoteWorkerPay}
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
          setValue={setHealthInsurance}
          type="number"
        />
        <Input
          label="Pension"
          subLabel={PENSION}
          value={pension}
          setValue={setPension}
          type="number"
        />
        <Input
          label="Unemployment Insurance"
          subLabel={UNEMPLOYMENT}
          value={unemployment}
          setValue={setUnemployment}
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
          setValue={setIncomeTax}
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
          setValue={setResidentTax}
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
            {displayInYen(grossSalary - totalDeductable)}
          </p>
        </Alert>
      </Container>
      <Button color="primary" onClick={onClick}>
        Save
      </Button>
    </Container>
  );
};

export default Salary;
