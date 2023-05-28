import { useEffect, useState } from 'react';
import { Container, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { add, update } from '../../core/redux/slices/furusato';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';

const FurusatoDetails = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const furusato = useAppSelector((x) => x.furusato.models);
  const loading = useAppSelector((x) => x.furusato.loading);
  const [amount, setAmount] = useState('0');
  const [boughtAt, setBoughtAt] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [productName, setProductName] = useState('');

  const validation =
    Number(amount) > 0 && !!boughtAt && !!prefecture && !!productName;

  const id = Number(params.id);
  const currentEntity = id ? furusato.find((x) => x.id === id) : undefined;

  useEffect(() => {
    if (currentEntity) {
      setAmount(currentEntity.amount.toString());
      setBoughtAt(currentEntity.boughtAt.substring(0, 10));
      setPrefecture(currentEntity.prefecture);
      setProductName(currentEntity.productName);
    }
  }, [currentEntity]);

  const onAdd = async () => {
    const action = await dispatch(
      add({
        amount: Number(amount),
        boughtAt: new Date(boughtAt),
        prefecture,
        productName,
      })
    );

    if (action.type === add.fulfilled.type) {
      navigate('/furusato');
    } else {
      alert('Something went wrong');
    }
  };

  const onEdit = async () => {
    const id = currentEntity?.id;
    if (!id) {
      alert('No id to edit');
      return;
    }

    const action = await dispatch(
      update({
        id,
        amount: Number(amount),
        boughtAt: new Date(boughtAt),
        prefecture,
        productName,
      })
    );

    if (action.type === update.fulfilled.type) {
      navigate('/furusato');
    } else {
      alert('Something went wrong');
    }
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <Input label="Amount" value={amount} onChange={setAmount} type="number" />
      <Input
        label="Bought At"
        value={boughtAt}
        onChange={setBoughtAt}
        type="date"
      />
      <Input
        label="Prefecture"
        value={prefecture}
        onChange={setPrefecture}
        type="text"
      />
      <Input
        label="Product Name"
        value={productName}
        onChange={setProductName}
        type="text"
      />

      <InputGroup className="mb-3 mt-3">
        <Button
          disabled={loading || !validation}
          variant={id ? 'success' : 'primary'}
          type="button"
          onClick={() => {
            if (id) {
              onEdit();
            } else {
              onAdd();
            }
          }}
          content={
            loading ? (
              <Spinner animation="border" size="sm" />
            ) : id ? (
              'UPDATE'
            ) : (
              'ADD'
            )
          }
        />
        <Button
          style={{ marginLeft: 5 }}
          type="button"
          variant="light"
          content="BACK"
          onClick={() => {
            navigate('/furusato');
          }}
        />
      </InputGroup>
    </Container>
  );
};

export default FurusatoDetails;
