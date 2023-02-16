import { Container, Table } from 'react-bootstrap';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useState } from 'react';
import {
  FiTrash2,
  FiEdit,
  FiCheck,
  FiX,
  FiPlusCircle,
  FiRepeat,
} from 'react-icons/fi';
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
import { getAll as getAllAccounts } from '../../core/redux/accountSlice';
import Input from '../../components/Input';
import { Button, Select } from '@otaku/otaku-ui';

const AccountComp = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((x) => x.accounts.accounts);
  const loading = useAppSelector((x) => x.accounts.loading);
  const [choosenAccountId, setChoosenAccountId] = useState<
    Account['id'] | null
  >(null);

  const addBalance = (id: number) => {
    dispatch(
      addBalanceAction({ amount: newBalanceAmount, id, date: newBalanceDate })
    );
    setNewBalanceAmount(0);
    setNewBalanceDate(new Date());
  };
  const removeBalance = (id: number) => {
    dispatch(removeBalanceAction(id));
  };

  const removeAccount = (id: number, name: string) => {
    const yes = confirm(`remove (${id})  ${name}`);
    if (yes) {
      dispatch(removeAccountAction(id));
    }
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

  const onRefreshClick = async () => {
    await dispatch(getAllAccounts());
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <div style={{ display: 'block' }}>
        <Button
          variant="success"
          style={{ marginBottom: 15 }}
          onClick={onRefreshClick}
          loading={loading}
          content={<FiRepeat />}
        />
      </div>
      <div style={{ width: '300px' }}>
        <Select
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
                  variant="primary"
                  type="button"
                  style={{ marginRight: 5 }}
                  disabled={loading || newBalanceAmount === 0}
                  onClick={() => {
                    addBalance(account.id);
                  }}
                  loading={loading}
                  content={<FiPlusCircle />}
                />
              </td>
              <td />
              <td>
                <Input
                  label=""
                  type="date"
                  value={format(newBalanceDate, 'yyyy-MM-dd')}
                  disabled={loading}
                  onChange={(value) => {
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
                  onChange={(v) => {
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
                  loading={loading}
                  content={<FiTrash2 />}
                />
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
                    loading={loading}
                    content={<FiCheck />}
                  />

                  <Button
                    variant="danger"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      editAccountCancel();
                    }}
                    loading={loading}
                    content={<FiX />}
                  />
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
                    loading={loading}
                    content={<FiEdit />}
                  />

                  <Button
                    variant="danger"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      removeAccount(x.id, x.name);
                    }}
                    loading={loading}
                    content={<FiTrash2 />}
                  />
                </td>
              )}

              <td>{x.id}</td>
              <td>
                {editId === x.id ? (
                  <Input
                    label=""
                    value={editAccountTitle}
                    disabled={loading}
                    onChange={(value) => {
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
                loading={loading}
                content="ADD"
              />
            </td>
            <td />
            <td>
              <Input
                label=""
                value={newAccountTitle}
                disabled={loading}
                onChange={(value) => {
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
