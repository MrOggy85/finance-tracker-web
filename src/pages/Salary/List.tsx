import { Container, Table } from 'react-bootstrap';
import { FiPlusCircle, FiRepeat, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
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
  getTotalDeductable,
} from './helpers';

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

      <Table bordered>
        <thead>
          <tr style={{ background: 'lightyellow' }}>
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
                    onClick={() => {
                      const yes = confirm(`remove ${x.id}, ${x.date}`);
                      console.log('yes', yes);
                      if (yes) {
                        onTrashConfirmClick(x.id);
                      }
                    }}
                    loading={loading}
                    content={<FiTrash2 />}
                  />
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
