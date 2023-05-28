import { Container, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiEdit, FiRepeat, FiPlusCircle } from 'react-icons/fi';
import Button from '../../components/Button';
import DateText from '../../components/DateText';
import displayInYen from '../../core/displayInYen';
import { getAll } from '../../core/redux/slices/furusato';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';

const FurusatoList = () => {
  const dispatch = useAppDispatch();
  const furusato = useAppSelector((x) => x.furusato.models);
  const loading = useAppSelector((x) => x.furusato.loading);
  const navigate = useNavigate();

  let total = 0;
  furusato.forEach((x) => {
    total += x.amount;
  });

  return (
    <Container style={{ marginTop: 10 }}>
      <div style={{ display: 'block' }}>
        <Button
          variant="primary"
          style={{ marginBottom: 15, marginRight: 5 }}
          onClick={() => {
            dispatch(getAll());
          }}
          disabled={loading}
          content={<FiRepeat />}
        />
        <Button
          variant="success"
          style={{ marginBottom: 15 }}
          onClick={() => {
            navigate('/furusato/0');
          }}
          disabled={loading}
          content={<FiPlusCircle />}
        />
      </div>

      <Table bordered>
        <thead>
          <tr style={{ background: 'lightyellow' }}>
            <th style={{ width: '6em' }}></th>
            <th style={{ width: '20%' }}>Bought At</th>
            <th style={{ width: '10%' }}>Amount</th>
            <th style={{ width: '15%' }}>Prefecture</th>
            <th style={{ display: 'flex' }}>Product</th>
          </tr>
        </thead>
        <tbody>
          {furusato.map((x) => {
            return (
              <tr key={x.id}>
                <td>
                  <Button
                    variant="success"
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      navigate(`/furusato/${x.id}`);
                    }}
                    disabled={loading}
                    content={<FiEdit />}
                  />
                  <Button
                    variant="danger"
                    onClick={() => {
                      const yes = confirm('Are You Sure?');
                      if (yes) {
                        console.log('delete', x.id);
                      }
                    }}
                    disabled={loading}
                    content={<FiTrash2 />}
                  />
                </td>
                <td>
                  <DateText date={x.boughtAt} />
                </td>
                <td>{displayInYen(x.amount)}</td>
                <td>{x.prefecture}</td>
                <td>{x.productName}</td>
              </tr>
            );
          })}
          {total > 0 && (
            <tr style={{ background: '#EEE' }}>
              <td>
                <strong>Total</strong>
              </td>
              <td></td>
              <td>{displayInYen(total)}</td>
              <td></td>
              <td></td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default FurusatoList;
