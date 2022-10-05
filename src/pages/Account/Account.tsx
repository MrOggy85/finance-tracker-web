import { Button, Container, Spinner, Table } from 'react-bootstrap';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useState } from 'react';
import { FiTrash2, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import type { Account } from '../../core/redux/types';
import {
  removeAccount as removeAccountAction,
  removeBalance as removeBalanceAction,
  addAccount as addAccountAction,
  addBalance as addBalanceAction,
  rename,
} from '../../core/redux/accountSlice';
import displayInYen from '../../core/displayInYen';
import { useAppSelector } from '../../core/redux/useAppSelector';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import Select from '../../components/Select';
import Input from '../../components/Input';

const AccountComp = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((x) => x.accounts.accounts);
  const loading = useAppSelector((x) => x.accounts.loading);
  const [choosenAccountId, setChoosenAccountId] = useState<
    Account['id'] | null
  >(null);

  const addBalance = (id: number) => {
    console.log('addBalance...', id);
    dispatch(
      addBalanceAction({ amount: newBalanceAmount, id, date: newBalanceDate })
    );
    setNewBalanceAmount(0);
    setNewBalanceDate(new Date());
  };
  const removeBalance = (id: number) => {
    dispatch(removeBalanceAction(id));
  };

  const removeAccount = (id: number) => {
    dispatch(removeAccountAction(id));
  };
  const addAccount = (name: string) => {
    dispatch(addAccountAction(name));
    setNewAccountTitle('');
  };
  const editAccountStart = (id: number, name: string) => {
    setEditAccountTitle(name);
    setEditId(id);
  };
  const editAccountFinish = () => {
    dispatch(rename({ id: editId, name: editAccountTitle }));

    setEditAccountTitle('');
    setEditId(-1);
  };
  const editAccountCancel = () => {
    setEditAccountTitle('');
    setEditId(-1);
  };

  const [editId, setEditId] = useState(-1);
  const [newAccountTitle, setNewAccountTitle] = useState('');
  const [editAccountTitle, setEditAccountTitle] = useState('');

  const [newBalanceDate, setNewBalanceDate] = useState(new Date());
  const [newBalanceAmount, setNewBalanceAmount] = useState(0);

  const account = accounts.find((x) => x.id === choosenAccountId);

  return (
    <Container style={{ marginTop: 10 }}>
      <div style={{ width: '300px' }}>
        <Select
          label="Account"
          emptyOptionLabel="Select Account"
          options={accounts.map((x) => ({
            value: x.id.toString(),
            label: x.name,
          }))}
          value={choosenAccountId?.toString() || ''}
          setValue={(v) => setChoosenAccountId(Number(v))}
        />
      </div>
      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: '115px' }}></th>
            <th style={{ width: '50px' }}>ID</th>
            <th style={{ width: '210px' }}>Date</th>
            <th style={{ width: '210px' }}>Amount</th>
            <th style={{ display: 'flex' }}></th>
          </tr>
        </thead>
        <tbody>
          {account && (
            <tr>
              <td>
                <Button
                  color="primary"
                  type="button"
                  style={{ marginRight: 5 }}
                  disabled={loading || newBalanceAmount === 0}
                  onClick={() => {
                    addBalance(account.id);
                  }}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm">
                      {' '}
                    </Spinner>
                  ) : (
                    'ADD'
                  )}
                </Button>
              </td>
              <td />
              <td>
                <Input
                  label=""
                  type="date"
                  value={format(newBalanceDate, 'yyyy-MM-dd')}
                  disabled={loading}
                  setValue={(value) => {
                    if (!value) {
                      return;
                    }
                    setNewBalanceDate(new Date(value));
                  }}
                />
              </td>
              <td>
                <Input
                  label=""
                  type="number"
                  value={
                    newBalanceAmount === 0 ? '' : newBalanceAmount.toString()
                  }
                  disabled={loading}
                  setValue={(v) => {
                    setNewBalanceAmount(Number(v));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      addBalance(account.id);
                    }
                  }}
                />
              </td>
            </tr>
          )}
          {account?.balances.map((x) => (
            <tr key={x.id}>
              <td>
                <Button
                  variant="danger"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    removeBalance(x.id);
                  }}
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
              <td>{format(parseISO(x.date), 'yyyy-MM-dd')}</td>
              <td>{displayInYen(x.amount)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: '115px' }}></th>
            <th style={{ width: '50px' }}>ID</th>
            <th style={{ width: '250px' }}>Name</th>
            <th style={{ width: '150px' }}>Current Balance</th>
            <th style={{ display: 'flex' }}></th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((x) => (
            <tr key={x.id}>
              {editId === x.id ? (
                <td>
                  <Button
                    variant="success"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      editAccountFinish();
                    }}
                    style={{ marginRight: 5 }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm">
                        {' '}
                      </Spinner>
                    ) : (
                      <FiCheck />
                    )}
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      editAccountCancel();
                    }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm">
                        {' '}
                      </Spinner>
                    ) : (
                      <FiX />
                    )}
                  </Button>
                </td>
              ) : (
                <td>
                  <Button
                    variant="success"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      editAccountStart(x.id, x.name);
                    }}
                    style={{ marginRight: 5 }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm">
                        {' '}
                      </Spinner>
                    ) : (
                      <FiEdit />
                    )}
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      removeAccount(x.id);
                    }}
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
              )}

              <td>{x.id}</td>
              <td>
                {editId === x.id ? (
                  <Input
                    label=""
                    value={editAccountTitle}
                    disabled={loading}
                    setValue={(value) => {
                      setEditAccountTitle(value);
                    }}
                  />
                ) : (
                  x.name
                )}
              </td>
              <td>{displayInYen(x.currentBalance)}</td>
            </tr>
          ))}
          <tr>
            <td>
              <Button
                variant="primary"
                type="button"
                style={{ marginRight: 5 }}
                disabled={loading || newAccountTitle.trim().length === 0}
                onClick={() => {
                  addAccount(newAccountTitle);
                }}
              >
                {loading ? (
                  <Spinner animation="border" size="sm">
                    {' '}
                  </Spinner>
                ) : (
                  'ADD'
                )}
              </Button>
            </td>
            <td />
            <td>
              <Input
                label=""
                value={newAccountTitle}
                disabled={loading}
                setValue={(value) => {
                  setNewAccountTitle(value);
                }}
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default AccountComp;
