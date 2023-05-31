import { Container, Table } from 'react-bootstrap';
import {
  FiCheck,
  FiEdit,
  FiPlusCircle,
  FiRepeat,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ComponentProps, useState } from 'react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { Button, Select } from '@otaku/otaku-ui';
// import Button from '../../components/Button';
import Input from '../../components/Input';
import displayInYen from '../../core/displayInYen';
import * as slice from '../../core/redux/slices/product';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';

const List = () => {
  const dispatch = useAppDispatch();
  const { list: products, loading } = useAppSelector((x) => x.product);
  const [chosenId, setChosenId] = useState<number | null>(null);
  const [editId, setEditId] = useState(-1);
  const [newTitle, setNewTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const [newProductEntryDate, setNewProductEntryDate] = useState(new Date());
  const [newProductEntryPrice, setNewProductEntryPrice] = useState(0);
  const [newProductEntryPower, setNewProductEntryPower] = useState(0);

  const addProductEntry = (id: number) => {
    dispatch(
      slice.addProductEntry({
        price: newProductEntryPrice,
        personalBuyingValue: newProductEntryPower,
        productId: id,
        date: newProductEntryDate,
      })
    );
    setNewProductEntryPrice(0);
    setNewProductEntryPower(0);
    setNewProductEntryDate(new Date());
  };
  const removeProductEntry = (id: number) => {
    dispatch(slice.removeProductEntry(id));
  };

  const removeProduct = (id: number) => {
    const name = products.find((x) => x.id === id)?.name;
    const yes = confirm(`remove (${id}) ${name}?`);
    if (yes) {
      dispatch(slice.removeProduct(id));
    }
  };
  const addProduct = (name: string) => {
    dispatch(slice.addProduct(name));
    setNewTitle('');
  };
  const editStart = (id: number, name: string) => {
    setEditTitle(name);
    setEditId(id);
  };
  const editFinish = () => {
    dispatch(slice.rename({ id: editId, name: editTitle }));

    setEditTitle('');
    setEditId(-1);
  };
  const editCancel = () => {
    setEditTitle('');
    setEditId(-1);
  };

  const onRefreshClick = async () => {
    await dispatch(slice.getAll());
  };

  const product = products.find((x) => x.id === chosenId);

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
          emptyOptionLabel="Select Product"
          options={products.map((x) => ({
            value: x.id.toString(),
            label: x.name,
          }))}
          value={chosenId?.toString() || ''}
          setValue={(v) => setChosenId(Number(v))}
        />
      </div>
      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: '115px' }}></th>
            <th style={{ width: '50px' }}>ID</th>
            <th style={{ width: '210px' }}>Date</th>
            <th style={{ width: '210px' }}>Price</th>
            <th style={{ width: '210px' }}>PersonalBuyingPower</th>
            <th style={{ display: 'flex' }}></th>
          </tr>
        </thead>
        <tbody>
          {product && (
            <tr>
              <td>
                <Button
                  variant="primary"
                  type="button"
                  style={{ marginRight: 5 }}
                  disabled={
                    loading ||
                    newProductEntryPower === 0 ||
                    newProductEntryPrice === 0
                  }
                  onClick={() => {
                    addProductEntry(product.id);
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
                  value={format(newProductEntryDate, 'yyyy-MM-dd')}
                  disabled={loading}
                  onChange={(value) => {
                    if (!value) {
                      return;
                    }
                    setNewProductEntryDate(new Date(value));
                  }}
                />
              </td>
              <td>
                <Input
                  label=""
                  type="number"
                  value={
                    newProductEntryPrice === 0
                      ? ''
                      : newProductEntryPrice.toString()
                  }
                  disabled={loading}
                  onChange={(v) => {
                    setNewProductEntryPrice(Number(v));
                  }}
                />
              </td>
              <td>
                <Input
                  label=""
                  type="number"
                  value={
                    newProductEntryPower === 0
                      ? ''
                      : newProductEntryPower.toString()
                  }
                  disabled={loading}
                  onChange={(v) => {
                    setNewProductEntryPower(Number(v));
                  }}
                />
              </td>
            </tr>
          )}
          {product?.entries.map((x) => (
            <tr key={x.id}>
              <td>
                <Button
                  variant="danger"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    removeProductEntry(x.id);
                  }}
                  loading={loading}
                  content={<FiTrash2 />}
                />
              </td>

              <td>{x.id}</td>
              <td>{format(parseISO(x.date), 'yyyy-MM-dd')}</td>
              <td>{displayInYen(x.price)}</td>
              <td>{displayInYen(x.personalBuyingValue)}</td>
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
          {products.map((x) => (
            <tr key={x.id}>
              {editId === x.id ? (
                <td>
                  <Button
                    variant="success"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      editFinish();
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
                      editCancel();
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
                      editStart(x.id, x.name);
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
                      removeProduct(x.id);
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
                    value={editTitle}
                    disabled={loading}
                    onChange={(value) => {
                      setEditTitle(value);
                    }}
                  />
                ) : (
                  x.name
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <Button
                variant="primary"
                type="button"
                style={{ marginRight: 5 }}
                disabled={loading || newTitle.trim().length === 0}
                onClick={() => {
                  addProduct(newTitle);
                }}
                loading={loading}
                content="ADD"
              />
            </td>
            <td />
            <td>
              <Input
                label=""
                value={newTitle}
                disabled={loading}
                onChange={(value) => {
                  setNewTitle(value);
                }}
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default List;
