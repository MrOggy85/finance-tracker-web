import { Container, Table } from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import displayInYen from '../../core/displayInYen';
import format from 'date-fns/format';
import type { Account } from '../../core/redux/types';
import { useAppSelector } from '../../core/redux/useAppSelector';

const TODAY = new Date();

const average = (arr: number[]) => arr.reduce((a, b) => a + b) / arr.length;

type MonthlyBalance = Record<string, number>;
type MonthlyBalances = Record<string, number[]>;

type AccountDisplay = {
  id: Account['id'];
  name: Account['name'];
  avarageBalances: MonthlyBalance;
};

const Home = () => {
  const accounts = useAppSelector((x) => x.accounts.accounts);

  let totalBalance = 0;
  const totalBalancePerMonth: MonthlyBalance = {};

  const accountsDisplay: AccountDisplay[] = accounts.map((x) => {
    totalBalance += x.currentBalance;

    const balancePerMonth: MonthlyBalances = {};
    const avarageBalances: MonthlyBalance = {};

    x.balances.forEach((y) => {
      const month = format(new Date(y.date), 'yyyyMM');
      const balances = balancePerMonth[month] || [];
      balances.push(y.amount);
      balancePerMonth[month] = balances;
    });

    Object.keys(balancePerMonth).forEach((month) => {
      const balances = balancePerMonth[month] || [];
      const avarageBalance = average(balances);
      avarageBalances[month] = avarageBalance;
      totalBalancePerMonth[month] =
        (totalBalancePerMonth[month] || 0) + avarageBalance;
    });

    return {
      id: x.id,
      name: x.name,
      avarageBalances,
    };
  });

  return (
    <Container style={{ marginTop: 10 }}>
      <Alert color={totalBalance > 0 ? 'success' : 'danger'}>
        Total Current Balance: {displayInYen(totalBalance)}
      </Alert>

      <h2>Balances</h2>
      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: 5 }}>#</th>
            <th style={{ width: 5 }}>Account</th>
            {Array.from(Array(6)).map((_, i) => {
              const date = new Date();
              date.setMonth(TODAY.getMonth() - i);
              return (
                <th key={i} style={{ width: 100 }}>
                  {date.getFullYear()}-{date.getMonth() + 1}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {accountsDisplay.map((x) => {
            return (
              <tr key={x.name}>
                <td>{x.id}</td>
                <td>{x.name}</td>
                {Array.from(Array(6)).map((_, i) => {
                  const date = new Date();
                  date.setMonth(TODAY.getMonth() - i);
                  const month = format(date, 'yyyyMM');
                  const b = x.avarageBalances[month] || 0;
                  return (
                    <td key={i}>{b > 0 || b < 0 ? displayInYen(b) : ''}</td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <td></td>
            <td>
              <b>Total Average</b>
            </td>
            {Array.from(Array(6)).map((_, i) => {
              const date = new Date();
              date.setMonth(TODAY.getMonth() - i);
              const month = format(date, 'yyyyMM');
              const b = totalBalancePerMonth[month] || 0;
              return (
                <td key={i}>
                  <b>{b > 0 || b < 0 ? displayInYen(b) : ''}</b>
                </td>
              );
            })}
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default Home;
