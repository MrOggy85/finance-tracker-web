import { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Input from '../../components/Input';
import { load, save } from '../../core/localStorage';

const Login = () => {
  const [user, setUser] = useState('');
  const [pw, setPw] = useState('');
  const [h, setH] = useState('');
  const [port, setPort] = useState('');
  const [db, setDb] = useState('');

  useEffect(() => {
    setUser(load('U'));
    setPw(load('PW'));
    setH(load('H'));
    setPort(load('PORT'));
    setDb(load('DB'));
    setPw(load('PW'));
  }, []);

  const onClick = () => {
    save('U', user);
    save('PW', pw);
    save('H', h);
    save('PORT', port);
    save('DB', db);

    window.location.href = '/';
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <Input label="User" value={user} onChange={setUser} />
      <Input label="Password" value={pw} onChange={setPw} />
      <Input label="Hostname" value={h} onChange={setH} />
      <Input label="Port" value={port} onChange={setPort} />
      <Input label="Database Name" value={db} onChange={setDb} />
      <Button
        disabled={!user || !pw || !h || !port || !db}
        color="primary"
        onClick={onClick}
      >
        Login
      </Button>
    </Container>
  );
};

export default Login;
