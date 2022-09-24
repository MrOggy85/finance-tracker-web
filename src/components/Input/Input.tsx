import { Form } from 'react-bootstrap';

type Props = {
  label: string;
  value: string;
  setValue: (v: string) => void;
};

const Input = ({ label, value, setValue }: Props) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </Form.Group>
  );
};

export default Input;
