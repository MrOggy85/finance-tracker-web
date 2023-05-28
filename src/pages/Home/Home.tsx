import { Container, Alert } from 'react-bootstrap';
import format from 'date-fns/format';
import { Button, Table } from '@otaku/otaku-ui';
import { FiRepeat } from 'react-icons/fi';
import type { ReactNode, ComponentProps } from 'react';
import displayInYen from '../../core/displayInYen';
import type { Account } from '../../core/redux/types';
import { useAppSelector } from '../../core/redux/useAppSelector';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { getAll } from '../../core/redux/slices/account';
import styles from './Home.module.css';

const TODAY = new Date();

const average = (arr: number[]) => arr.reduce((a, b) => a + b) / arr.length;

type MonthlyBalance = Record<string, number>;
type MonthlyBalances = Record<string, number[]>;

type AccountDisplay = {
  id: Account['id'];
  name: Account['name'];
  averageBalances: MonthlyBalance;
};

type Header = ComponentProps<typeof Table>['headers'][0];
type Row = ComponentProps<typeof Table>['rows'][0];

const Home = () => {
  const dispatch = useAppDispatch();
  const { accounts, loading } = useAppSelector((x) => x.accounts);

  let totalBalance = 0;
  const totalBalancePerMonth: MonthlyBalance = {};

  const accountsDisplay: AccountDisplay[] = accounts.map((x) => {
    totalBalance += x.currentBalance;

    const balancePerMonth: MonthlyBalances = {};
    const averageBalances: MonthlyBalance = {};

    x.balances.forEach((y) => {
      const month = format(new Date(y.date), 'yyyyMM');
      const balances = balancePerMonth[month] || [];
      balances.push(y.amount);
      balancePerMonth[month] = balances;
    });

    Object.keys(balancePerMonth).forEach((month) => {
      const balances = balancePerMonth[month] || [];
      const averageBalance = average(balances);
      averageBalances[month] = averageBalance;
      totalBalancePerMonth[month] =
        (totalBalancePerMonth[month] || 0) + averageBalance;
    });

    return {
      id: x.id,
      name: x.name,
      averageBalances: averageBalances,
    };
  });

  const onRefreshClick = async () => {
    await dispatch(getAll());
  };

  const headers: Header[] = [
    {
      name: 'Account',
      style: { width: 10 },
    },
    ...Array.from(Array(6)).map((_, i) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(TODAY.getMonth() - i);
      return {
        name: `${date.getFullYear()}-${date.getMonth() + 1}`,
        style: { width: 100 },
      };
    }),
  ];

  const rows: Row[] = accountsDisplay.map((x) => {
    const cells = [x.name];
    console.log('id', x.id.toString());
    return {
      id: `${x.name}-${x.id}`,
      cells: [
        ...cells,
        ...Array.from(Array(6)).map((_, i) => {
          const date = new Date();
          date.setMonth(TODAY.getMonth() - i);
          const month = format(date, 'yyyyMM');
          const b = x.averageBalances[month] || 0;

          date.setMonth(TODAY.getMonth() - i - 1);
          const prevMonth = format(date, 'yyyyMM');
          const c = x.averageBalances[prevMonth] || 0;
          const diff = b - c;

          const diffText =
            diff >= 0 ? `+ ${displayInYen(diff)}` : `${displayInYen(diff)}`;
          const diffColor = diff >= 0 ? '#146c43' : '#842029';

          return (
            <div key={`${date.getFullYear()}-${date.getMonth()}-${i}`}>
              {b > 0 || b < 0 ? displayInYen(b) : ''}{' '}
              <span className={styles.diff} style={{ color: diffColor }}>
                {diffText}
              </span>
            </div>
          ) as ReactNode;
        }),
      ],
    };
  });
  rows.push({
    id: 'total_averages',
    cells: [
      <strong>Total Averages</strong>,
      ...Array.from(Array(6)).map((_, i) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(TODAY.getMonth() - i);
        const month = format(date, 'yyyyMM');
        const b = totalBalancePerMonth[month] || 0;

        date.setMonth(TODAY.getMonth() - i - 1);
        const prevMonth = format(date, 'yyyyMM');
        const c = totalBalancePerMonth[prevMonth] || 0;
        const diff = b - c;

        const diffText =
          diff >= 0 ? `+ ${displayInYen(diff)}` : `${displayInYen(diff)}`;
        const diffColor = diff >= 0 ? '#146c43' : '#842029';

        return (
          <div key={`${date.getMonth()}`}>
            <b>{b > 0 || b < 0 ? displayInYen(b) : ''}</b>
            <span className={styles.diff} style={{ color: diffColor }}>
              {diffText}
            </span>
          </div>
        );
      }),
    ],
    style: { borderTop: '2px solid #111' },
  });

  return (
    <Container style={{ marginTop: 10 }}>
      <Alert color={totalBalance > 0 ? 'success' : 'danger'}>
        Total Current Balance: {displayInYen(totalBalance)}
      </Alert>

      <div style={{ display: 'block' }}>
        <Button
          variant="success"
          style={{ marginBottom: 15 }}
          onClick={onRefreshClick}
          loading={loading}
          content={<FiRepeat />}
        />
      </div>

      <h2>Balances</h2>
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

export default Home;
