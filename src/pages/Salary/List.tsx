import { Container } from 'react-bootstrap';
import { FiPlusCircle, FiRepeat, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { ComponentProps } from 'react';
import { Table } from '@otaku/otaku-ui';
import Button from '../../components/Button';
import displayInYen from '../../core/displayInYen';
import { getAll, remove } from '../../core/redux/salarySlice';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';
import {
  getGrossSalary,
  getNetSalary,
  getSumMonthlySalary,
  getSumSocialInsurance,
  getTotalDeductibles,
} from './helpers';

type Header = ComponentProps<typeof Table>['headers'][0];
type Row = ComponentProps<typeof Table>['rows'][0];

const SalaryList = () => {
  const dispatch = useAppDispatch();
  const { list: salaries, loading } = useAppSelector((x) => x.salaries);

  const onRefreshClick = async () => {
    await dispatch(getAll());
  };

  const onTrashConfirmClick = async (id: number) => {
    const action = await dispatch(remove(id));
    if (action.type === remove.fulfilled.type) {
      // navigate('/salary');
    } else {
      alert('Something went wrong');
    }
  };

  const headers: Header[] = [
    {
      name: '',
      style: { width: 50 },
    },
    {
      name: 'Date',
      style: { width: 130 },
    },
    {
      name: 'Gross Salary',
      style: { width: 130 },
    },
    {
      name: 'Net Salary',
      style: { width: 130 },
    },
    {
      name: 'Income Tax',
      style: { width: 130 },
    },
    {
      name: 'Residence Tax',
      style: { width: 130 },
    },
    {
      name: 'Stock',
      style: { width: 130 },
    },
    {
      name: 'iDeco',
    },
  ];

  const rows: Row[] = [...salaries]
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map((x) => {
      const sumMonthlySalary = getSumMonthlySalary(
        x.baseSalary,
        x.deemedLabor,
        x.lifePlan
      );
      const grossSalary = getGrossSalary(
        sumMonthlySalary,
        x.insufficientDeemedLabor,
        x.lifePlanSubsidy,
        x.commuterAllowance + x.remoteWorkerPay,
        x.stockOwnershipSubsidy
      );
      const sumSocialInsurance = getSumSocialInsurance(
        x.healthInsurance,
        x.pension,
        x.unemployment
      );
      const totalDeductible = getTotalDeductibles(
        sumSocialInsurance,
        x.incomeTax,
        x.residentTax,
        x.lifePlan,
        x.stockOwnership,
        x.taxExcess
      );

      const netSalary = getNetSalary(grossSalary, totalDeductible);

      const stock =
        x.stockOwnership > 0
          ? `${displayInYen(x.stockOwnership + x.stockOwnershipSubsidy)}`
          : '-';

      const ideco = `${displayInYen(x.lifePlan + x.lifePlanSubsidy)}`;

      return {
        id: x.date + netSalary,
        cells: [
          <Button
            variant="danger"
            disabled={loading}
            onClick={() => {
              const yes = confirm(`remove ${x.id}, ${x.date}`);
              if (yes) {
                onTrashConfirmClick(x.id);
              }
            }}
            loading={loading}
            content={<FiTrash2 />}
          />,
          x.date,
          displayInYen(grossSalary),
          displayInYen(netSalary),
          displayInYen(x.incomeTax),
          displayInYen(x.residentTax),
          stock,
          ideco,
        ],
      };
    });

  return (
    <Container style={{ marginTop: 10, marginBottom: 30 }}>
      <div style={{ display: 'block' }}>
        <Button
          variant="success"
          style={{ marginBottom: 15, marginRight: 5 }}
          onClick={onRefreshClick}
          disabled={loading}
          loading={loading}
          content={<FiRepeat />}
        />
        <Link to="/salary/add">
          <Button
            variant="primary"
            style={{ marginBottom: 15 }}
            content={<FiPlusCircle />}
          />
        </Link>
      </div>

      <Table
        bordered
        headers={headers}
        rows={rows}
        color="#084298"
        textColor="#111"
        tableStyle={{ borderColor: '#dee2e6' }}
      />
    </Container>
  );
};

export default SalaryList;
