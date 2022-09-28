import {
  Button,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
  Table,
} from 'reactstrap';
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
// import useDispatch from '../../core/redux/useDispatch';
import displayInYen from '../../core/displayInYen';
import { useAppSelector } from '../../core/redux/useAppSelector';
import { useAppDispatch } from '../../core/redux/useAppDispatch';

const AccountComp = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((x) => x.accounts.accounts);
  const loading = useAppSelector((x) => x.accounts.loading);
  const [choosenAccountId, setChoosenAccountId] = useState<
    Account['id'] | null
  >(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const toggleAccountDropDown = () =>
    setAccountDropdownOpen(!accountDropdownOpen);

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
      <InputGroup style={{ marginBottom: 5 }}>
        <InputGroupText>Account</InputGroupText>
        <ButtonDropdown
          addonType="append"
          isOpen={accountDropdownOpen}
          toggle={toggleAccountDropDown}
        >
          <DropdownToggle caret color="primary">
            {account?.name || 'Choose Account'}
          </DropdownToggle>
          <DropdownMenu>
            {accounts.map((x) => (
              <DropdownItem
                key={x.id}
                onClick={() => {
                  const acc = accounts.find((a) => a.id === x.id);
                  if (!acc) {
                    throw new Error(`No Account found... ${x.id}`);
                  }
                  setChoosenAccountId(acc.id);
                }}
              >
                {x.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </InputGroup>

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
                  {loading ? <Spinner size="sm"> </Spinner> : 'ADD'}
                </Button>
              </td>
              <td />
              <td>
                <Input
                  type="date"
                  value={format(newBalanceDate, 'yyyy-MM-dd')}
                  disabled={loading}
                  onChange={({ target: { value } }) => {
                    if (!value) {
                      return;
                    }
                    setNewBalanceDate(new Date(value));
                  }}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={newBalanceAmount === 0 ? '' : newBalanceAmount}
                  disabled={loading}
                  onChange={({ target: { value } }) => {
                    setNewBalanceAmount(Number(value));
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
                  color="danger"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    removeBalance(x.id);
                  }}
                >
                  {loading ? <Spinner size="sm"> </Spinner> : <FiTrash2 />}
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
                    color="success"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      editAccountFinish();
                    }}
                    style={{ marginRight: 5 }}
                  >
                    {loading ? <Spinner size="sm"> </Spinner> : <FiCheck />}
                  </Button>
                  <Button
                    color="danger"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      editAccountCancel();
                    }}
                  >
                    {loading ? <Spinner size="sm"> </Spinner> : <FiX />}
                  </Button>
                </td>
              ) : (
                <td>
                  <Button
                    color="success"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      editAccountStart(x.id, x.name);
                    }}
                    style={{ marginRight: 5 }}
                  >
                    {loading ? <Spinner size="sm"> </Spinner> : <FiEdit />}
                  </Button>
                  <Button
                    color="danger"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      removeAccount(x.id);
                    }}
                  >
                    {loading ? <Spinner size="sm"> </Spinner> : <FiTrash2 />}
                  </Button>
                </td>
              )}

              <td>{x.id}</td>
              <td>
                {editId === x.id ? (
                  <Input
                    value={editAccountTitle}
                    disabled={loading}
                    onChange={(e) => {
                      setEditAccountTitle(e.target.value);
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
                color="primary"
                type="button"
                style={{ marginRight: 5 }}
                disabled={loading || newAccountTitle.trim().length === 0}
                onClick={() => {
                  addAccount(newAccountTitle);
                }}
              >
                {loading ? <Spinner size="sm"> </Spinner> : 'ADD'}
              </Button>
            </td>
            <td />
            <td>
              <Input
                value={newAccountTitle}
                disabled={loading}
                onChange={(e) => {
                  setNewAccountTitle(e.target.value);
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
