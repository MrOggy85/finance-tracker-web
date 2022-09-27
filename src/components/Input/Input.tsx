import { Form } from 'react-bootstrap';

type Props = {
  label: string;
  subLabel?: string[];
  type?: string;
  value: string;
  setValue: (v: string) => void;
};

const Input = ({ label, subLabel = [], value, type, setValue }: Props) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label style={{ display: 'block' }}>{label}</Form.Label>
      {subLabel.map((x) => (
        <Form.Label key={x} style={{ display: 'block' }}>
          {x}
        </Form.Label>
      ))}
      <Form.Control
        type={type || 'text'}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onWheelCapture={(e) => {
          e.currentTarget.blur();
        }}
      />
    </Form.Group>
  );
};

export default Input;
