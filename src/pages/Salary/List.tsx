import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import displayInYen from '../../core/displayInYen';
import { getAll } from '../../core/redux/salarySlice';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';
import {
  getGrossSalary,
  getNetSalary,
  getSumMonthlySalary,
  getSumSocialInsurance,
  getTotalDeductable,
} from './helpers';

const SalaryList = () => {
  const dispatch = useAppDispatch();
  const { list: salaries, loading } = useAppSelector((x) => x.salaries);

  const onRefreshClick = async () => {
    await dispatch(getAll());
  };

  return (
    <Container style={{ marginTop: 10, marginBottom: 30 }}>
      <h1>Salary List</h1>
      <div style={{ display: 'block' }}>
        <Button
          variant="success"
          style={{ marginBottom: 15 }}
          onClick={onRefreshClick}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Refresh'}
        </Button>
      </div>
      <Link to="/salary/add">
        <Button style={{ marginBottom: 15 }}>Add</Button>
      </Link>
      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: '5%' }}></th>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: 5 }}>Date</th>
            <th style={{ width: 5 }}>Net Salary</th>
            <th style={{ width: 5 }}>Income Tax</th>
            <th style={{ width: 5 }}>Resident Tax</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((x) => {
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
            const totalDeductable = getTotalDeductable(
              sumSocialInsurance,
              x.incomeTax,
              x.residentTax,
              x.lifePlan,
              x.stockOwnership,
              x.taxExcess
            );

            const netSalary = getNetSalary(grossSalary, totalDeductable);
            return (
              <tr key={x.id}>
                <td>
                  <Button
                    variant="danger"
                    disabled={loading}
                    // onClick={() => {
                    //   remove(x.id);
                    // }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm">
                        {' '}
                      </Spinner>
                    ) : (
                      <FiTrash2 />
                    )}
                  </Button>
                </td>
                <td>{x.id}</td>
                <td>{x.date}</td>
                <td>{displayInYen(netSalary)}</td>
                <td>{displayInYen(x.incomeTax)}</td>
                <td>{displayInYen(x.residentTax)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default SalaryList;
